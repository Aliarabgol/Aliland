package com.example.data.local.entities

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "support_tickets")
data class SupportTicketEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val userId: Long,
    val subject: String,
    val message: String,
    val status: String = "OPEN", // "OPEN", "ANSWERED", "CLOSED"
    val response: String? = null,
    val createdAt: Long = System.currentTimeMillis()
)
