package com.example.data.local.entities

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "intentions")
data class IntentionEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val userId: Long,
    val category: String, // "MARRIAGE", "EX_RETURN", "RELATIONSHIP", "CAREER", "FINANCIAL", "CHOICE", "GENERAL"
    val primaryQuestion: String,
    val context: String,
    val timeframe: String, // "TODAY", "THIS_WEEK", "THIS_MONTH", "3_MONTHS", "6_MONTHS", "1_YEAR"
    val importanceLevel: String = "HIGH", // "LOW", "MEDIUM", "HIGH"
    val secondPersonInvolved: Boolean = false,
    val secondProfileId: Long? = null,
    val structuredAnswersJson: String = "{}",
    val createdAt: Long = System.currentTimeMillis()
)
