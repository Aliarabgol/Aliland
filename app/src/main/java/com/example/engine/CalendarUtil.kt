package com.example.engine

import java.util.Calendar

object CalendarUtil {

    data class JalaliDate(val year: Int, val month: Int, val day: Int)
    data class GregorianDate(val year: Int, val month: Int, val day: Int)

    val PERSIAN_MONTH_NAMES = listOf(
        "فروردین", "اردیبهشت", "خرداد",
        "تیر", "مرداد", "شهریور",
        "مهر", "آبان", "آذر",
        "دی", "بهمن", "اسفند"
    )

    fun jalaliToGregorian(jYear: Int, jMonth: Int, jDay: Int): GregorianDate {
        val jY = jYear - 979
        val jM = jMonth - 1
        val jD = jDay - 1

        var jDayNo = 365 * jY + (jY / 33) * 8 + ((jY % 33) + 3) / 4
        for (i in 0 until jM) {
            jDayNo += if (i < 6) 31 else 30
        }
        jDayNo += jD

        var gDayNo = jDayNo + 79

        var gY = 1600 + 400 * (gDayNo / 146097)
        gDayNo %= 146097

        var leap = true
        if (gDayNo >= 36525) {
            gDayNo--
            gY += 100 * (gDayNo / 36524)
            gDayNo %= 36524

            if (gDayNo >= 365) {
                gDayNo++
            } else {
                leap = false
            }
        }

        gY += 4 * (gDayNo / 1461)
        gDayNo %= 1461

        if (gDayNo >= 366) {
            leap = false
            gDayNo--
            gY += gDayNo / 365
            gDayNo %= 365
        }

        var i = 0
        val gDaysInMonth = intArrayOf(
            31, if (leap) 29 else 28, 31, 30, 31, 30,
            31, 31, 30, 31, 30, 31
        )
        while (gDayNo >= gDaysInMonth[i]) {
            gDayNo -= gDaysInMonth[i]
            i++
        }

        val gM = i + 1
        val gD = gDayNo + 1

        return GregorianDate(gY, gM, gD)
    }

    fun gregorianToJalali(gYear: Int, gMonth: Int, gDay: Int): JalaliDate {
        val gDaysInMonth = intArrayOf(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31)
        val jDaysInMonth = intArrayOf(31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29)

        val gy = gYear - 1600
        val gm = gMonth - 1
        val gd = gDay - 1

        var gDayNo = 365 * gy + ((gy + 3) / 4) - ((gy + 99) / 100) + ((gy + 399) / 400)

        for (i in 0 until gm) {
            gDayNo += gDaysInMonth[i]
        }
        if (gm > 1 && ((gy % 4 == 0 && gy % 100 != 0) || (gy % 400 == 0))) {
            gDayNo++
        }
        gDayNo += gd

        var jDayNo = gDayNo - 79
        val jNp = jDayNo / 12053
        jDayNo %= 12053

        var jy = 979 + 33 * jNp + 4 * (jDayNo / 1461)
        jDayNo %= 1461

        if (jDayNo >= 366) {
            jy += (jDayNo - 1) / 365
            jDayNo = (jDayNo - 1) % 365
        }

        var jm = 0
        while (jm < 11 && jDayNo >= jDaysInMonth[jm]) {
            jDayNo -= jDaysInMonth[jm]
            jm++
        }

        val jd = jDayNo + 1
        return JalaliDate(jy, jm + 1, jd)
    }

    fun formatPersianDate(jDate: JalaliDate): String {
        val monthName = PERSIAN_MONTH_NAMES.getOrElse(jDate.month - 1) { "" }
        return "${jDate.day} $monthName ${jDate.year}"
    }
}
