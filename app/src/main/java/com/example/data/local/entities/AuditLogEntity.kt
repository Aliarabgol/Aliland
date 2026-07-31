package com.example.data.local.entities

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "audit_logs")
data class AuditLogEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val actorId: Long,
    val action: String,
    val entityType: String,
    val entityId: String,
    val metadataJson: String = "{}",
    val createdAt: Long = System.currentTimeMillis()
)
