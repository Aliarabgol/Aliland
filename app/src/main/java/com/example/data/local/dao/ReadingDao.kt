package com.example.data.local.dao

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import androidx.room.Transaction
import com.example.data.local.entities.CalculationSnapshotEntity
import com.example.data.local.entities.ReadingEntity
import com.example.data.local.entities.ReadingSectionEntity
import kotlinx.coroutines.flow.Flow

@Dao
interface ReadingDao {
    @Query("SELECT * FROM readings WHERE userId = :userId ORDER BY createdAt DESC")
    fun getReadingsForUser(userId: Long): Flow<List<ReadingEntity>>

    @Query("SELECT * FROM readings WHERE id = :readingId LIMIT 1")
    suspend fun getReadingById(readingId: Long): ReadingEntity?

    @Query("SELECT * FROM readings WHERE id = :readingId LIMIT 1")
    fun observeReadingById(readingId: Long): Flow<ReadingEntity?>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertReading(reading: ReadingEntity): Long

    @Query("UPDATE readings SET status = :status, completedAt = :completedAt WHERE id = :readingId")
    suspend fun updateReadingStatus(readingId: Long, status: String, completedAt: Long? = System.currentTimeMillis())

    @Query("SELECT * FROM reading_sections WHERE readingId = :readingId ORDER BY orderIndex ASC")
    fun getSectionsForReading(readingId: Long): Flow<List<ReadingSectionEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertReadingSections(sections: List<ReadingSectionEntity>)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertCalculationSnapshot(snapshot: CalculationSnapshotEntity): Long

    @Query("SELECT * FROM calculation_snapshots WHERE readingId = :readingId LIMIT 1")
    suspend fun getSnapshotForReading(readingId: Long): CalculationSnapshotEntity?

    @Query("SELECT * FROM readings ORDER BY createdAt DESC")
    fun getAllReadings(): Flow<List<ReadingEntity>>
}
