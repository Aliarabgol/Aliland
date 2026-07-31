package com.example.data.local.entities

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "birth_profiles")
data class BirthProfileEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val userId: Long,
    val title: String, // e.g. "خودم", "همسر", "دوست"
    val firstName: String,
    val lastName: String? = null,
    val birthDateGregorian: String, // YYYY-MM-DD
    val birthDateOriginal: String, // as entered (e.g. 1375/06/15)
    val originalCalendar: String = "SHAMSI", // "SHAMSI", "GREGORIAN", "HIJRI"
    val birthTime: String = "12:00", // HH:mm
    val timeKnown: Boolean = true,
    val birthCountry: String = "ایران",
    val birthCity: String = "تهران",
    val latitude: Double = 35.6892,
    val longitude: Double = 51.3890,
    val timezoneAtBirth: String = "Asia/Tehran",
    val genderOptional: String? = null,
    val relationshipToUser: String = "SELF", // "SELF", "SPOUSE", "FIANCE", "CHILD", "FRIEND"
    val thirdPartyConsent: Boolean = true,
    val createdAt: Long = System.currentTimeMillis(),
    val updatedAt: Long = System.currentTimeMillis()
)
