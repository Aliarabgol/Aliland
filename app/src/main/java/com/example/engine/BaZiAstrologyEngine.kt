package com.example.engine

object BaZiAstrologyEngine {

    data class Pillar(
        val nameFa: String, // "ستون سال", "ستون ماه", "ستون روز", "ستون ساعت"
        val stemFa: String, // "Jia (چوب یانگ)", etc.
        val branchFa: String, // "Zi (موش / آب یانگ)", etc.
        val elementFa: String,
        val animalFa: String
    )

    data class BaZiChartResult(
        val yearPillar: Pillar,
        val monthPillar: Pillar,
        val dayPillar: Pillar,
        val hourPillar: Pillar,
        val dayMasterFa: String,
        val dayMasterElementFa: String,
        val elementBalance: Map<String, Int>, // "چوب", "آتش", "خاک", "فلز", "آب" -> percent
        val zodiacAnimalFa: String,
        val yinYangRatioFa: String,
        val isTimeKnown: Boolean
    )

    val HEAVENLY_STEMS_FA = listOf(
        "جیایین (چوب یانگ)", "یی (چوب این)",
        "بینگ (آتش یانگ)", "دینگ (آتش این)",
        "وو (خاک یانگ)", "جی (خاک این)",
        "گنگ (فلز یانگ)", "شین (فلز این)",
        "رن (آب یانگ)", "گوی (آب این)"
    )

    val EARTHLY_BRANCHES_FA = listOf(
        "زی (موش - آب)", "چو (گاو - خاک)", "یین (ببر - چوب)",
        "مائو (خرگوش - چوب)", "چن (اژدها - خاک)", "سی (مار - آتش)",
        "وو (اسب - آتش)", "وی (بز - خاک)", "شن (میگون - فلز)",
        "یو (خروس - فلز)", "شو (سگ - خاک)", "های (خوک - آب)"
    )

    val ANIMALS_FA = listOf(
        "موش", "گاو", "ببر", "خرگوش", "اژدها", "مار",
        "اسب", "بز (گوسفند)", "میمون", "خروس", "سگ", "خوک"
    )

    val ELEMENTS_NAME_FA = listOf("چوب", "آتش", "خاک", "فلز", "آب")

    fun calculateBaZiChart(
        year: Int,
        month: Int,
        day: Int,
        hour: Int,
        timeKnown: Boolean = true
    ): BaZiChartResult {
        // Compute Year Pillar
        val yearOffset = (year - 4) % 60
        val yearStemIdx = (yearOffset % 10 + 10) % 10
        val yearBranchIdx = (yearOffset % 12 + 12) % 12

        val yearPillar = Pillar(
            nameFa = "ستون سال (ریشه‌های اجدادی)",
            stemFa = HEAVENLY_STEMS_FA[yearStemIdx],
            branchFa = EARTHLY_BRANCHES_FA[yearBranchIdx],
            elementFa = getStemElementFa(yearStemIdx),
            animalFa = ANIMALS_FA[yearBranchIdx]
        )

        // Compute Month Pillar (Solar term estimation)
        val monthBranchIdx = ((month + 1) % 12)
        val monthStemIdx = ((yearStemIdx * 2 + month) % 10)

        val monthPillar = Pillar(
            nameFa = "ستون ماه (والدین و شغل)",
            stemFa = HEAVENLY_STEMS_FA[monthStemIdx],
            branchFa = EARTHLY_BRANCHES_FA[monthBranchIdx],
            elementFa = getStemElementFa(monthStemIdx),
            animalFa = ANIMALS_FA[monthBranchIdx]
        )

        // Compute Day Pillar (Day Master)
        val dayOffset = (year * 5 + year / 4 + day + month * 2) % 60
        val dayStemIdx = (dayOffset % 10 + 10) % 10
        val dayBranchIdx = (dayOffset % 12 + 12) % 12

        val dayPillar = Pillar(
            nameFa = "ستون روز (خود واقعی و همسر - Day Master)",
            stemFa = HEAVENLY_STEMS_FA[dayStemIdx],
            branchFa = EARTHLY_BRANCHES_FA[dayBranchIdx],
            elementFa = getStemElementFa(dayStemIdx),
            animalFa = ANIMALS_FA[dayBranchIdx]
        )

        // Compute Hour Pillar
        val hourBranchIdx = if (timeKnown) ((hour + 1) / 2) % 12 else 0
        val hourStemIdx = if (timeKnown) (dayStemIdx * 2 + hourBranchIdx) % 10 else 0

        val hourPillar = Pillar(
            nameFa = if (timeKnown) "ستون ساعت (فرزندان و آرزوها)" else "ستون ساعت (نامشخص - بدون ساعت)",
            stemFa = if (timeKnown) HEAVENLY_STEMS_FA[hourStemIdx] else "نامشخص",
            branchFa = if (timeKnown) EARTHLY_BRANCHES_FA[hourBranchIdx] else "نامشخص",
            elementFa = if (timeKnown) getStemElementFa(hourStemIdx) else "نامشخص",
            animalFa = if (timeKnown) ANIMALS_FA[hourBranchIdx] else "نامشخص"
        )

        // Day Master Element
        val dayMasterElement = getStemElementFa(dayStemIdx)
        val dayMasterFa = "${HEAVENLY_STEMS_FA[dayStemIdx]} (عنصر اصلی: $dayMasterElement)"

        // Calculate Five Element Balance Distribution
        val elementScores = mutableMapOf(
            "چوب" to 20,
            "آتش" to 20,
            "خاک" to 20,
            "فلز" to 20,
            "آب" to 20
        )

        // Add weight based on active pillars
        addWeightToElement(elementScores, getStemElementFa(yearStemIdx), 15)
        addWeightToElement(elementScores, getStemElementFa(monthStemIdx), 25)
        addWeightToElement(elementScores, dayMasterElement, 30)
        if (timeKnown) {
            addWeightToElement(elementScores, getStemElementFa(hourStemIdx), 10)
        }

        // Normalize to percentages
        val total = elementScores.values.sum().toDouble()
        val normalizedBalance = elementScores.mapValues { ((it.value / total) * 100).toInt() }

        val zodiacAnimalFa = ANIMALS_FA[yearBranchIdx]

        return BaZiChartResult(
            yearPillar = yearPillar,
            monthPillar = monthPillar,
            dayPillar = dayPillar,
            hourPillar = hourPillar,
            dayMasterFa = dayMasterFa,
            dayMasterElementFa = dayMasterElement,
            elementBalance = normalizedBalance,
            zodiacAnimalFa = zodiacAnimalFa,
            yinYangRatioFa = "۶۰٪ یانگ (فعال و برون‌گرا) / ۴۰٪ این (تأملی و پذیرا)",
            isTimeKnown = timeKnown
        )
    }

    private fun addWeightToElement(map: MutableMap<String, Int>, element: String, weight: Int) {
        val curr = map[element] ?: 0
        map[element] = curr + weight
    }

    private fun getStemElementFa(index: Int): String {
        return when (index) {
            0, 1 -> "چوب"
            2, 3 -> "آتش"
            4, 5 -> "خاک"
            6, 7 -> "فلز"
            else -> "آب"
        }
    }
}
