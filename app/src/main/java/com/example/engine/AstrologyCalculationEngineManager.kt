package com.example.engine

import com.example.data.local.entities.BirthProfileEntity
import org.json.JSONArray
import org.json.JSONObject
import java.security.MessageDigest

object AstrologyCalculationEngineManager {

    data class CombinedCalculationSnapshot(
        val inputDataJson: String,
        val resultDataJson: String,
        val checksum: String,
        val isTimeKnown: Boolean,
        val summaryIndicators: List<String>
    )

    fun calculateSnapshot(
        profile1: BirthProfileEntity,
        profile2: BirthProfileEntity? = null,
        astrologySystem: String = "COMBINED",
        intentionCategory: String? = null
    ): CombinedCalculationSnapshot {
        val rootResult = JSONObject()
        val indicators = mutableListOf<String>()

        // Extract dates
        val dateParts = profile1.birthDateGregorian.split("-")
        val year = dateParts.getOrNull(0)?.toIntOrNull() ?: 1995
        val month = dateParts.getOrNull(1)?.toIntOrNull() ?: 1
        val day = dateParts.getOrNull(2)?.toIntOrNull() ?: 1

        val timeParts = profile1.birthTime.split(":")
        val hour = timeParts.getOrNull(0)?.toIntOrNull() ?: 12
        val minute = timeParts.getOrNull(1)?.toIntOrNull() ?: 0

        val timeKnown = profile1.timeKnown

        // 1. Calculate Western Chart
        val westernChart = WesternAstrologyEngine.calculateWesternChart(
            year = year,
            month = month,
            day = day,
            hour = hour,
            minute = minute,
            lat = profile1.latitude,
            lng = profile1.longitude,
            timeKnown = timeKnown
        )

        // 2. Calculate Vedic Chart
        val vedicChart = VedicAstrologyEngine.calculateVedicChart(
            westernChart = westernChart,
            timeKnown = timeKnown
        )

        // 3. Calculate BaZi Chart
        val baziChart = BaZiAstrologyEngine.calculateBaZiChart(
            year = year,
            month = month,
            day = day,
            hour = hour,
            timeKnown = timeKnown
        )

        // Build JSON representation
        val westernJson = JSONObject().apply {
            put("sun_sign", westernChart.sunSign)
            put("moon_sign", westernChart.moonSign)
            put("ascendant_sign", westernChart.ascendantSign)
            put("midheaven_sign", westernChart.midheavenSign)
            put("dominant_element", westernChart.dominantElement)
            put("dominant_modality", westernChart.dominantModality)
            put("house_system", westernChart.houseSystem)
            put("is_time_known", westernChart.isTimeKnown)

            val planetsArr = JSONArray()
            westernChart.planets.forEach { p ->
                planetsArr.put(JSONObject().apply {
                    put("name_fa", p.nameFa)
                    put("sign_fa", p.signNameFa)
                    put("degree_in_sign", String.format("%.2f", p.degreeInSign))
                    put("house", p.house)
                    put("is_retrograde", p.isRetrograde)
                })
            }
            put("planets", planetsArr)

            val aspectsArr = JSONArray()
            westernChart.aspects.take(6).forEach { a ->
                aspectsArr.put(JSONObject().apply {
                    put("planet1", a.planet1)
                    put("planet2", a.planet2)
                    put("aspect_type_fa", a.aspectTypeFa)
                    put("orb", String.format("%.1f", a.orb))
                })
            }
            put("key_aspects", aspectsArr)
        }

        val vedicJson = JSONObject().apply {
            put("ayanamsha", vedicChart.ayanamshaName)
            put("lagna_rashi", vedicChart.lagnaRashiFa)
            put("moon_rashi", vedicChart.moonRashiFa)
            put("moon_nakshatra", vedicChart.moonNakshatraFa)
            put("lagna_lord", vedicChart.lagnaLordFa)
            put("current_dasha", vedicChart.currentDasha)

            val grahasArr = JSONArray()
            vedicChart.grahas.forEach { g ->
                grahasArr.put(JSONObject().apply {
                    put("name_fa", g.nameFa)
                    put("rashi_fa", g.rashiFa)
                    put("nakshatra_fa", g.nakshatraFa)
                    put("pada", g.pada)
                    put("bhava", g.bhava)
                })
            }
            put("grahas", grahasArr)
        }

        val baziJson = JSONObject().apply {
            put("day_master", baziChart.dayMasterFa)
            put("zodiac_animal", baziChart.zodiacAnimalFa)
            put("yin_yang_ratio", baziChart.yinYangRatioFa)

            val pillarsObj = JSONObject().apply {
                put("year", "${baziChart.yearPillar.stemFa} / ${baziChart.yearPillar.branchFa} (${baziChart.yearPillar.animalFa})")
                put("month", "${baziChart.monthPillar.stemFa} / ${baziChart.monthPillar.branchFa}")
                put("day", "${baziChart.dayPillar.stemFa} / ${baziChart.dayPillar.branchFa}")
                put("hour", "${baziChart.hourPillar.stemFa} / ${baziChart.hourPillar.branchFa}")
            }
            put("four_pillars", pillarsObj)

            val balanceObj = JSONObject()
            baziChart.elementBalance.forEach { (elem, pct) ->
                balanceObj.put(elem, "$pct%")
            }
            put("element_balance", balanceObj)
        }

        rootResult.put("system_type", astrologySystem)
        rootResult.put("western_astrology", westernJson)
        rootResult.put("vedic_astrology", vedicJson)
        rootResult.put("bazi_astrology", baziJson)

        // Summary indicators
        indicators.add("خورشید: ${westernChart.sunSign}")
        indicators.add("ماه: ${westernChart.moonSign}")
        indicators.add("طالع (Ascendant): ${westernChart.ascendantSign}")
        indicators.add("ناکشاترا: ${vedicChart.moonNakshatraFa}")
        indicators.add("Day Master: ${baziChart.dayMasterElementFa}")
        indicators.add("عنصر غالب: ${westernChart.dominantElement}")

        // Relationship compatibility if profile2 exists
        if (profile2 != null) {
            val date2Parts = profile2.birthDateGregorian.split("-")
            val p2Year = date2Parts.getOrNull(0)?.toIntOrNull() ?: 1996
            val p2Month = date2Parts.getOrNull(1)?.toIntOrNull() ?: 5
            val p2Day = date2Parts.getOrNull(2)?.toIntOrNull() ?: 10

            val westernChart2 = WesternAstrologyEngine.calculateWesternChart(
                year = p2Year, month = p2Month, day = p2Day, hour = 12, minute = 0, lat = profile2.latitude, lng = profile2.longitude, timeKnown = profile2.timeKnown
            )
            val vedicChart2 = VedicAstrologyEngine.calculateVedicChart(westernChart2, profile2.timeKnown)

            val p1NakIdx = VedicAstrologyEngine.NAKSHATRAS_FA.indexOf(vedicChart.moonNakshatraFa).coerceAtLeast(0)
            val p2NakIdx = VedicAstrologyEngine.NAKSHATRAS_FA.indexOf(vedicChart2.moonNakshatraFa).coerceAtLeast(0)

            val matching = VedicAstrologyEngine.calculateAshtakootaMatching(p1NakIdx, p2NakIdx)

            val synastryObj = JSONObject().apply {
                put("ashtakoota_total_score", "${matching.totalScore} / 36")
                put("matching_assessment", matching.assessmentFa)
                put("p1_sun_sign", westernChart.sunSign)
                put("p2_sun_sign", westernChart2.sunSign)
                put("p1_moon_sign", westernChart.moonSign)
                put("p2_moon_sign", westernChart2.moonSign)
            }
            rootResult.put("relationship_synastry", synastryObj)
            indicators.add("نمره سازگاری اشتکوت (هندی): ${matching.totalScore} از ۳۶")
        }

        // Input JSON
        val inputObj = JSONObject().apply {
            put("p1_name", profile1.firstName)
            put("p1_birth_gregorian", profile1.birthDateGregorian)
            put("p1_birth_time", profile1.birthTime)
            put("p1_time_known", timeKnown)
            put("p1_city", profile1.birthCity)
            put("astrology_system", astrologySystem)
            put("intention_category", intentionCategory ?: "GENERAL")
            if (profile2 != null) {
                put("p2_name", profile2.firstName)
                put("p2_birth_gregorian", profile2.birthDateGregorian)
            }
        }

        val resultStr = rootResult.toString(2)
        val inputStr = inputObj.toString(2)
        val checksumHash = generateChecksum(resultStr)

        return CombinedCalculationSnapshot(
            inputDataJson = inputStr,
            resultDataJson = resultStr,
            checksum = checksumHash,
            isTimeKnown = timeKnown,
            summaryIndicators = indicators
        )
    }

    private fun generateChecksum(input: String): String {
        val digest = MessageDigest.getInstance("SHA-256")
        val hash = digest.digest(input.toByteArray(Charsets.UTF_8))
        return hash.joinToString("") { "%02x".format(it) }
    }
}
