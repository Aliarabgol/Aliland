package com.example.data.local.entities

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "orders")
data class OrderEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val userId: Long,
    val readingId: Long? = null,
    val serviceTitle: String,
    val amount: Long,
    val discountAmount: Long = 0,
    val finalAmount: Long,
    val currency: String = "IRT", // Tomans
    val status: String = "SUCCESS", // "PENDING", "SUCCESS", "FAILED", "REFUNDED"
    val provider: String = "WALLET", // "WALLET", "ZARINPAL", "IDPAY"
    val transactionReference: String,
    val createdAt: Long = System.currentTimeMillis()
)
