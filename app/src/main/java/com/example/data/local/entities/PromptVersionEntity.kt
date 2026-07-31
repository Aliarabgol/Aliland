package com.example.data.local.entities

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "prompt_versions")
data class PromptVersionEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val name: String,
    val systemPrompt: String,
    val userPromptTemplate: String,
    val outputSchema: String,
    val version: String,
    val active: Boolean = true,
    val createdBy: String = "Admin",
    val createdAt: Long = System.currentTimeMillis()
)
