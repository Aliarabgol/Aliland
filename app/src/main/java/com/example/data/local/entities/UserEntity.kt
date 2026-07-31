package com.example.data.local.entities

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "users")
data class UserEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val firstName: String,
    val lastName: String,
    val phone: String,
    val phoneVerifiedAt: Long? = null,
    val email: String? = null,
    val role: String = "USER", // "USER", "ADMIN", "CONTENT_MANAGER", "SUPPORT_AGENT"
    val status: String = "ACTIVE",
    val locale: String = "fa",
    val timezone: String = "Asia/Tehran",
    val walletBalance: Long = 100000, // Gift 100k Tomans initial balance for seamless demo
    val createdAt: Long = System.currentTimeMillis(),
    val updatedAt: Long = System.currentTimeMillis(),
    val deletedAt: Long? = null
)
