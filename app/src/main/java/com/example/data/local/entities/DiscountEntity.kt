package com.example.data.local.entities

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "discounts")
data class DiscountEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val code: String,
    val discountPercent: Int,
    val maxUsage: Int = 100,
    val currentUsage: Int = 0,
    val active: Boolean = true,
    val expiresAt: Long = System.currentTimeMillis() + (30L * 24 * 3600 * 1000)
)
