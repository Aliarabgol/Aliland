package com.example.data.local.entities

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "calculation_snapshots")
data class CalculationSnapshotEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val readingId: Long,
    val engineName: String,
    val engineVersion: String = "1.0.0",
    val inputJson: String,
    val resultJson: String,
    val checksum: String,
    val createdAt: Long = System.currentTimeMillis()
)
