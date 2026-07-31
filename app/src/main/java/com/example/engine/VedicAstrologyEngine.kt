package com.example.engine

import kotlin.math.abs

object VedicAstrologyEngine {

    data class GrahaPosition(
        val name: String,
        val nameFa: String,
        val siderealLongitude: Double,
        val rashi: String,
        val rashiFa: String,
        val nakshatra: String,
        val nakshatraFa: String,
        val pada: Int,
        val bhava: Int
    )

    data class DashaPeriod(
        val planetFa: String,
        val yearsDuration: Double,
        val isCurrent: Boolean
    )

    data class AshtakootaScore(
        val totalScore: Int, // Out of 36
        val varnaScore: Int, // Max 1
        val vashyaScore: Int, // Max 2
        val taraScore: Int, // Max 3
        val yoniScore: Int, // Max 4
        val maitriScore: Int, // Max 5
        val ganaScore: Int, // Max 6
        val bhakootScore: Int, // Max 7
        val nadiScore: Int, // Max 8
        val assessmentFa: String
    )

    data class VedicChartResult(
        val ayanamshaName: String = "Lahiri (Chitra Paksha)",
        val ayanamshaValue: Double = 24.1,
        val lagnaRashiFa: String,
        val moonRashiFa: String,
        val moonNakshatraFa: String,
        val lagnaLordFa: String,
        val grahas: List<GrahaPosition>,
        val currentDasha: String,
        val dashaTimeline: List<DashaPeriod>,
        val isTimeKnown: Boolean
    )

    val RASHI_FA = listOf(
        "مِشا (حمل)", "وریشابها (ثور)", "میتونا (جوزا)",
        "کارکا (سرطان)", "سیمها (اسد)", "کانیا (سنبله)",
        "تولا (میزان)", "وریشچیکا (عقرب)", "دهانو (قوس)",
        "مکارا (جدی)", "کومبها (دلو)", "مینا (حوت)"
    )

    val NAKSHATRAS_FA = listOf(
        "اشوینی", "بهارانی", "کریتیکا", "روهینی", "مریگاشیرا", "آردرا",
        "پونارواسو", "پوشیا", "آشلشا", "ماگا", "پوروا فالگونی", "اوتارا فالگونی",
        "هاستا", "چیترا", "سواتی", "ویشاکا", "انورادها", "جیپشتا",
        "مولا", "پوروا آشادا", "اوتارا آشادا", "شراوانا", "دهانیشتا", "شاتابیشاک",
        "پوروا بهادراپادا", "اوتارا بهادراپادا", "رواتی"
    )

    val RASHI_LORDS_FA = listOf(
        "مریخ", "زهره", "عطارد",
        "ماه", "خورشید", "عطارد",
        "زهره", "مریخ", "مشتری",
        "زحل", "زحل", "مشتری"
    )

    fun calculateVedicChart(
        westernChart: WesternAstrologyEngine.WesternChartResult,
        timeKnown: Boolean = true
    ): VedicChartResult {
        val lahiriAyanamsha = 24.1

        val grahaNames = listOf(
            Triple("Sun", "سوریا (خورشید)", 0),
            Triple("Moon", "چاندرا (ماه)", 1),
            Triple("Mars", "مانگالا (مریخ)", 2),
            Triple("Mercury", "بودها (عطارد)", 3),
            Triple("Jupiter", "گورو (مشتری)", 4),
            Triple("Venus", "شوکرا (زهره)", 5),
            Triple("Saturn", "شانی (زحل)", 6)
        )

        val grahaList = mutableListOf<GrahaPosition>()

        westernChart.planets.forEach { planet ->
            val siderealLong = (planet.longitude - lahiriAyanamsha + 360.0) % 360.0
            val rashiIndex = (siderealLong / 30.0).toInt().coerceIn(0, 11)
            val nakshatraIndex = (siderealLong / (360.0 / 27.0)).toInt().coerceIn(0, 26)
            val nPart = (siderealLong % (360.0 / 27.0))
            val pada = (nPart / (360.0 / 108.0)).toInt() + 1

            val matchedName = grahaNames.find { it.first == planet.name }
            val faName = matchedName?.second ?: planet.nameFa

            grahaList.add(
                GrahaPosition(
                    name = planet.name,
                    nameFa = faName,
                    siderealLongitude = siderealLong,
                    rashi = RASHI_FA[rashiIndex],
                    rashiFa = RASHI_FA[rashiIndex],
                    nakshatra = NAKSHATRAS_FA[nakshatraIndex],
                    nakshatraFa = NAKSHATRAS_FA[nakshatraIndex],
                    pada = pada,
                    bhava = planet.house
                )
            )
        }

        // Rahu & Ketu (North and South Nodes)
        val moonPos = grahaList.find { it.name == "Moon" }?.siderealLongitude ?: 0.0
        val rahuLong = (moonPos + 180.0 - 15.0 + 360.0) % 360.0
        val ketuLong = (rahuLong + 180.0) % 360.0

        val rahuRashi = (rahuLong / 30.0).toInt().coerceIn(0, 11)
        val rahuNak = (rahuLong / (360.0 / 27.0)).toInt().coerceIn(0, 26)

        val ketuRashi = (ketuLong / 30.0).toInt().coerceIn(0, 11)
        val ketuNak = (ketuLong / (360.0 / 27.0)).toInt().coerceIn(0, 26)

        grahaList.add(
            GrahaPosition(
                name = "Rahu",
                nameFa = "راهو (گره شمالی)",
                siderealLongitude = rahuLong,
                rashi = RASHI_FA[rahuRashi],
                rashiFa = RASHI_FA[rahuRashi],
                nakshatra = NAKSHATRAS_FA[rahuNak],
                nakshatraFa = NAKSHATRAS_FA[rahuNak],
                pada = 1,
                bhava = 4
            )
        )

        grahaList.add(
            GrahaPosition(
                name = "Ketu",
                nameFa = "کتو (گره جنوبی)",
                siderealLongitude = ketuLong,
                rashi = RASHI_FA[ketuRashi],
                rashiFa = RASHI_FA[ketuRashi],
                nakshatra = NAKSHATRAS_FA[ketuNak],
                nakshatraFa = NAKSHATRAS_FA[ketuNak],
                pada = 1,
                bhava = 10
            )
        )

        val moonGraha = grahaList.find { it.name == "Moon" }
        val moonRashi = moonGraha?.rashiFa ?: RASHI_FA[0]
        val moonNakshatra = moonGraha?.nakshatraFa ?: NAKSHATRAS_FA[0]

        val lagnaRashiIndex = if (timeKnown && westernChart.houseCusps.isNotEmpty()) {
            val siderealAsc = (westernChart.houseCusps[0].longitude - lahiriAyanamsha + 360.0) % 360.0
            (siderealAsc / 30.0).toInt().coerceIn(0, 11)
        } else {
            0
        }

        val lagnaRashiFa = if (timeKnown) RASHI_FA[lagnaRashiIndex] else "نامشخص (نیاز به ساعت دقیق)"
        val lagnaLordFa = RASHI_LORDS_FA[lagnaRashiIndex]

        // Vimshottari Dasha calculation based on Moon Nakshatra
        val dashaPlanetsFa = listOf("کیتو (۷ سال)", "زهره (۲۰ سال)", "خورشید (۶ سال)", "ماه (۱۰ سال)", "مریخ (۷ سال)", "راهو (۱۸ سال)", "مشتری (۱۶ سال)", "زحل (۱۹ سال)", "عطارد (۱۷ سال)")
        val dashaIndex = (NAKSHATRAS_FA.indexOf(moonNakshatra) % 9).coerceAtLeast(0)
        val currentDashaFa = "دوره اصلی (مها داشا): ${dashaPlanetsFa[dashaIndex]}"

        val dashaList = dashaPlanetsFa.indices.map { i ->
            val idx = (dashaIndex + i) % 9
            DashaPeriod(
                planetFa = dashaPlanetsFa[idx],
                yearsDuration = 10.0 + (idx * 2),
                isCurrent = i == 0
            )
        }

        return VedicChartResult(
            ayanamshaName = "Lahiri Ayanamsha (Chitra Paksha)",
            ayanamshaValue = lahiriAyanamsha,
            lagnaRashiFa = lagnaRashiFa,
            moonRashiFa = moonRashi,
            moonNakshatraFa = moonNakshatra,
            lagnaLordFa = lagnaLordFa,
            grahas = grahaList,
            currentDasha = currentDashaFa,
            dashaTimeline = dashaList,
            isTimeKnown = timeKnown
        )
    }

    fun calculateAshtakootaMatching(p1NakshatraIdx: Int, p2NakshatraIdx: Int): AshtakootaScore {
        val diff = abs(p1NakshatraIdx - p2NakshatraIdx)

        val varna = if (diff % 4 == 0) 1 else 1
        val vashya = if (diff % 2 == 0) 2 else 1
        val tara = if (diff % 9 in listOf(1, 3, 5, 7)) 3 else 2
        val yoni = if (diff % 5 == 0) 4 else 3
        val maitri = if (diff % 3 == 0) 5 else 4
        val gana = if (diff % 6 == 0) 6 else 5
        val bhakoot = if (diff % 7 in listOf(2, 6)) 0 else 7
        val nadi = if (p1NakshatraIdx % 3 == p2NakshatraIdx % 3) 0 else 8

        val total = varna + vashya + tara + yoni + maitri + gana + bhakoot + nadi

        val assessment = when {
            total >= 28 -> "سازگاری بسیار عالی و ممتاز (بیش از ۲۸ از ۳۶). پیوند عاطفی و همسوئی فکری بالا."
            total >= 18 -> "سازگاری خوب و قابل قبول (۱۸ تا ۲۷ از ۳۶). نیازمند درک متقابل و تمرکز بر نقاط مشترک."
            else -> "سازگاری متوسط با نیازمندی به صبر و مراقبت در ارتباط (کمتر از ۱۸ از ۳۶)."
        }

        return AshtakootaScore(
            totalScore = total,
            varnaScore = varna,
            vashyaScore = vashya,
            taraScore = tara,
            yoniScore = yoni,
            maitriScore = maitri,
            ganaScore = gana,
            bhakootScore = bhakoot,
            nadiScore = nadi,
            assessmentFa = assessment
        )
    }
}
