package com.example.data.local.entities

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "readings")
data class ReadingEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val userId: Long,
    val birthProfileId: Long,
    val secondBirthProfileId: Long? = null,
    val intentionId: Long? = null,
    val astrologySystem: String, // "WESTERN", "VEDIC", "BAZI", "COMBINED"
    val readingType: String, // "NATAL", "RELATIONSHIP", "NIYAT", "TIMING"
    val status: String = "COMPLETED", // "PENDING", "CALCULATING", "INTERPRETING", "COMPLETED", "FAILED"
    val paymentStatus: String = "PAID", // "UNPAID", "PAID", "REFUNDED"
    val calculationVersion: String = "v1.0.0",
    val promptVersion: String = "v1.0.0",
    val modelVersion: String = "gemini-3.5-flash",
    val similarityScore: Double = 0.0,
    val pdfUrl: String? = null,
    val createdAt: Long = System.currentTimeMillis(),
    val completedAt: Long? = System.currentTimeMillis()
)
