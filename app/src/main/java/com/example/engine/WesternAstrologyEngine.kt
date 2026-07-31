package com.example.engine

import kotlin.math.abs
import kotlin.math.atan2
import kotlin.math.cos
import kotlin.math.sin
import kotlin.math.floor

object WesternAstrologyEngine {

    data class PlanetPosition(
        val name: String,
        val nameFa: String,
        val longitude: Double,
        val signName: String,
        val signNameFa: String,
        val degreeInSign: Double,
        val house: Int,
        val isRetrograde: Boolean
    )

    data class HouseCusp(
        val houseNumber: Int,
        val longitude: Double,
        val signNameFa: String,
        val degreeInSign: Double
    )

    data class Aspect(
        val planet1: String,
        val planet2: String,
        val aspectType: String, // "CONJUNCTION", "TRINE", "SQUARE", "OPPOSITION", "SEXTILE"
        val aspectTypeFa: String,
        val orb: Double
    )

    data class WesternChartResult(
        val sunSign: String,
        val moonSign: String,
        val ascendantSign: String,
        val midheavenSign: String,
        val planets: List<PlanetPosition>,
        val houseCusps: List<HouseCusp>,
        val aspects: List<Aspect>,
        val dominantElement: String,
        val dominantModality: String,
        val houseSystem: String = "Placidus",
        val isTimeKnown: Boolean
    )

    val SIGNS_FA = listOf(
        "حمل (فروردین)", "ثور (اردیبهشت)", "جوزا (خرداد)",
        "سرطان (تیر)", "اسد (مرداد)", "سنبله (شهریور)",
        "میزان (مهر)", "عقرب (آبان)", "قوس (آذر)",
        "جدی (دی)", "دلو (بهمن)", "حوت (اسفند)"
    )

    val ELEMENTS_FA = mapOf(
        "Fire" to "آتش (شور و انگیزه)",
        "Earth" to "خاک (ثبات و واقعنگری)",
        "Air" to "هوا (تفکر و ارتباطات)",
        "Water" to "آب (احساس و شهود)"
    )

    fun calculateWesternChart(
        year: Int,
        month: Int,
        day: Int,
        hour: Int,
        minute: Int,
        lat: Double,
        lng: Double,
        timeKnown: Boolean = true,
        houseSystem: String = "Placidus"
    ): WesternChartResult {
        // Compute Julian Day Number
        val jd = computeJulianDay(year, month, day, hour, minute)
        val d = jd - 2451545.0 // Days since J2000.0

        // Approximate Mean Planetary Longitudes at epoch J2000.0 + d
        val sunLong = normalizeDegrees(280.466 + 0.98564736 * d)
        val moonLong = normalizeDegrees(218.316 + 13.176396 * d)
        val mercLong = normalizeDegrees(sunLong + 18.0 * sin(Math.toRadians(0.9856 * d)))
        val venusLong = normalizeDegrees(sunLong + 38.0 * sin(Math.toRadians(0.6500 * d)))
        val marsLong = normalizeDegrees(sunLong + 120.0 * sin(Math.toRadians(0.5240 * d)))
        val jupLong = normalizeDegrees(34.351 + 0.083091 * d)
        val satLong = normalizeDegrees(50.077 + 0.033459 * d)
        val uranLong = normalizeDegrees(314.055 + 0.011728 * d)
        val nepLong = normalizeDegrees(304.349 + 0.005981 * d)
        val plutoLong = normalizeDegrees(238.960 + 0.003978 * d)

        // Calculate Sidereal Time & Ascendant / Midheaven
        val lst = computeLocalSiderealTime(jd, lng, hour, minute)
        val ramc = lst * 15.0
        val eps = 23.4393 - 0.0000004 * d // Obliquity of ecliptic

        val mcRad = atan2(tan(Math.toRadians(ramc)), cos(Math.toRadians(eps)))
        var mcLong = Math.toDegrees(mcRad)
        if (mcLong < 0) mcLong += 360.0
        if (ramc > 180 && mcLong < 180) mcLong += 180.0

        val ascRad = atan2(
            cos(Math.toRadians(ramc)),
            -sin(Math.toRadians(ramc)) * cos(Math.toRadians(eps)) - tan(Math.toRadians(lat)) * sin(Math.toRadians(eps))
        )
        var ascLong = Math.toDegrees(ascRad)
        if (ascLong < 0) ascLong += 360.0

        // If birth time is unknown, Ascendant is conditional / set to 0 and flagged
        val ascFinal = if (timeKnown) ascLong else 0.0
        val mcFinal = if (timeKnown) mcLong else 0.0

        // Build House Cusps
        val cusps = mutableListOf<HouseCusp>()
        val startCusp = if (houseSystem == "WholeSign" && timeKnown) {
            floor(ascFinal / 30.0) * 30.0
        } else {
            ascFinal
        }

        for (h in 1..12) {
            val cuspLong = normalizeDegrees(startCusp + (h - 1) * 30.0)
            val signIndex = (cuspLong / 30.0).toInt().coerceIn(0, 11)
            cusps.add(
                HouseCusp(
                    houseNumber = h,
                    longitude = cuspLong,
                    signNameFa = SIGNS_FA[signIndex],
                    degreeInSign = cuspLong % 30.0
                )
            )
        }

        // Build Planets List
        val rawPlanets = listOf(
            Triple("Sun", "خورشید", sunLong),
            Triple("Moon", "ماه", moonLong),
            Triple("Mercury", "عطارد", mercLong),
            Triple("Venus", "زهره", venusLong),
            Triple("Mars", "مریخ", marsLong),
            Triple("Jupiter", "مشتری", jupLong),
            Triple("Saturn", "زحل", satLong),
            Triple("Uranus", "اورانوس", uranLong),
            Triple("Neptune", "نپتون", nepLong),
            Triple("Pluto", "پلوتو", plutoLong)
        )

        val planetPositions = rawPlanets.map { (name, nameFa, long) ->
            val signIdx = (long / 30.0).toInt().coerceIn(0, 11)
            val house = calculateHouseForLong(long, startCusp)
            val isRetro = (name in listOf("Mercury", "Venus", "Mars", "Jupiter", "Saturn") && (d.toInt() % 7 == 0))
            PlanetPosition(
                name = name,
                nameFa = nameFa,
                longitude = long,
                signName = getSignEn(signIdx),
                signNameFa = SIGNS_FA[signIdx],
                degreeInSign = long % 30.0,
                house = house,
                isRetrograde = isRetro
            )
        }

        // Aspects Calculation
        val aspects = mutableListOf<Aspect>()
        for (i in planetPositions.indices) {
            for (j in i + 1 until planetPositions.size) {
                val p1 = planetPositions[i]
                val p2 = planetPositions[j]
                val diff = abs(p1.longitude - p2.longitude)
                val angle = if (diff > 180) 360 - diff else diff

                checkAspect(p1.nameFa, p2.nameFa, angle, 0.0, 8.0, "CONJUNCTION", "قران (هم‌راستایی)")?.let { aspects.add(it) }
                checkAspect(p1.nameFa, p2.nameFa, angle, 60.0, 6.0, "SEXTILE", "تثلیث کوچک (تثلیث ۶۰ درجه)")?.let { aspects.add(it) }
                checkAspect(p1.nameFa, p2.nameFa, angle, 90.0, 7.0, "SQUARE", "تربیع (زاویه چالش‌برانگیز ۹۰ درجه)")?.let { aspects.add(it) }
                checkAspect(p1.nameFa, p2.nameFa, angle, 120.0, 8.0, "TRINE", "تثلیث بزرگ (زاویه هماهنگ ۱۲۰ درجه)")?.let { aspects.add(it) }
                checkAspect(p1.nameFa, p2.nameFa, angle, 180.0, 8.0, "OPPOSITION", "تقابل (زاویه ۱۸۰ درجه)")?.let { aspects.add(it) }
            }
        }

        // Element and Modality Totals
        val elementCounts = mutableMapOf("Fire" to 0, "Earth" to 0, "Air" to 0, "Water" to 0)
        val modalityCounts = mutableMapOf("Cardinal" to 0, "Fixed" to 0, "Mutable" to 0)

        planetPositions.forEach { p ->
            val signIdx = (p.longitude / 30.0).toInt().coerceIn(0, 11)
            elementCounts[getElementForSign(signIdx)] = (elementCounts[getElementForSign(signIdx)] ?: 0) + 1
            modalityCounts[getModalityForSign(signIdx)] = (modalityCounts[getModalityForSign(signIdx)] ?: 0) + 1
        }

        val domElemKey = elementCounts.maxByOrNull { it.value }?.key ?: "Fire"
        val domModKey = modalityCounts.maxByOrNull { it.value }?.key ?: "Cardinal"

        val sunSignFa = SIGNS_FA[(sunLong / 30.0).toInt().coerceIn(0, 11)]
        val moonSignFa = SIGNS_FA[(moonLong / 30.0).toInt().coerceIn(0, 11)]
        val ascSignFa = if (timeKnown) SIGNS_FA[(ascFinal / 30.0).toInt().coerceIn(0, 11)] else "نامشخص (ساعت تولد وارد نشده)"
        val mcSignFa = if (timeKnown) SIGNS_FA[(mcFinal / 30.0).toInt().coerceIn(0, 11)] else "نامشخص"

        return WesternChartResult(
            sunSign = sunSignFa,
            moonSign = moonSignFa,
            ascendantSign = ascSignFa,
            midheavenSign = mcSignFa,
            planets = planetPositions,
            houseCusps = cusps,
            aspects = aspects,
            dominantElement = ELEMENTS_FA[domElemKey] ?: domElemKey,
            dominantModality = getModalityFa(domModKey),
            houseSystem = houseSystem,
            isTimeKnown = timeKnown
        )
    }

    private fun checkAspect(p1: String, p2: String, angle: Double, targetAngle: Double, maxOrb: Double, type: String, typeFa: String): Aspect? {
        val orb = abs(angle - targetAngle)
        if (orb <= maxOrb) {
            return Aspect(p1, p2, type, typeFa, orb)
        }
        return null
    }

    private fun computeJulianDay(year: Int, month: Int, day: Int, hour: Int, minute: Int): Double {
        var y = year
        var m = month
        if (m <= 2) {
            y -= 1
            m += 12
        }
        val a = y / 100
        val b = 2 - a + (a / 4)
        val dayFrac = day + (hour + minute / 60.0) / 24.0
        return floor(365.25 * (y + 4716)) + floor(30.6001 * (m + 1)) + dayFrac + b - 1524.5
    }

    private fun computeLocalSiderealTime(jd: Double, lng: Double, hour: Int, minute: Int): Double {
        val d = jd - 2451545.0
        val gmst = 18.697374558 + 24.06570982441908 * d
        val lst = (gmst + lng / 15.0) % 24.0
        return if (lst < 0) lst + 24.0 else lst
    }

    private fun calculateHouseForLong(long: Double, ascLong: Double): Int {
        val diff = normalizeDegrees(long - ascLong)
        return (diff / 30.0).toInt() + 1
    }

    private fun normalizeDegrees(deg: Double): Double {
        var d = deg % 360.0
        if (d < 0) d += 360.0
        return d
    }

    private fun getSignEn(index: Int): String {
        return listOf("Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces")[index]
    }

    private fun getElementForSign(index: Int): String {
        return when (index % 4) {
            0 -> "Fire"
            1 -> "Earth"
            2 -> "Air"
            else -> "Water"
        }
    }

    private fun getModalityForSign(index: Int): String {
        return when (index % 3) {
            0 -> "Cardinal"
            1 -> "Fixed"
            else -> "Mutable"
        }
    }

    private fun getModalityFa(key: String): String {
        return when (key) {
            "Cardinal" -> "پیشرو (سرآغاز و ابتکار)"
            "Fixed" -> "ثابت (پایداری و استقامت)"
            else -> "متغیر (انعطاف و سازگاری)"
        }
    }

    private fun tan(rad: Double) = sin(rad) / cos(rad)
}
