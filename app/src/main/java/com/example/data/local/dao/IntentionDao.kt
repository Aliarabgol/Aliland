package com.example.data.local.dao

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import com.example.data.local.entities.IntentionEntity

@Dao
interface IntentionDao {
    @Query("SELECT * FROM intentions WHERE id = :id LIMIT 1")
    suspend fun getIntentionById(id: Long): IntentionEntity?

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertIntention(intention: IntentionEntity): Long
}
