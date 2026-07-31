package com.example.data.local.entities

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "reading_sections")
data class ReadingSectionEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val readingId: Long,
    val sectionType: String, // "SUMMARY", "ASTRONOMICAL", "INTERPRETATION", "RELATIONSHIP", "TIMING", "OPPORTUNITIES", "CHALLENGES", "REFLECTIONS", "GUIDANCE", "DISCLAIMER"
    val title: String,
    val content: String,
    val sourceSystem: String = "COMBINED",
    val confidenceLevel: String = "HIGH", // "HIGH", "MEDIUM", "CONDITIONAL"
    val orderIndex: Int = 0
)
