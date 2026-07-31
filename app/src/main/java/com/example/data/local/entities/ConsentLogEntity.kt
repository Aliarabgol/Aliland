package com.example.data.local.entities

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "consent_logs")
data class ConsentLogEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val userId: Long,
    val consentType: String, // "TERMS", "PRIVACY", "MARKETING", "THIRD_PARTY"
    val accepted: Boolean,
    val policyVersion: String = "v1.0",
    val ipHash: String = "127.0.0.1",
    val createdAt: Long = System.currentTimeMillis()
)
