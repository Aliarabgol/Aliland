package com.example.data.local.dao

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import androidx.room.Update
import com.example.data.local.entities.BirthProfileEntity
import kotlinx.coroutines.flow.Flow

@Dao
interface BirthProfileDao {
    @Query("SELECT * FROM birth_profiles WHERE userId = :userId ORDER BY createdAt DESC")
    fun getProfilesForUser(userId: Long): Flow<List<BirthProfileEntity>>

    @Query("SELECT * FROM birth_profiles WHERE id = :id LIMIT 1")
    suspend fun getProfileById(id: Long): BirthProfileEntity?

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertProfile(profile: BirthProfileEntity): Long

    @Update
    suspend fun updateProfile(profile: BirthProfileEntity)

    @Query("DELETE FROM birth_profiles WHERE id = :id AND userId = :userId")
    suspend fun deleteProfile(id: Long, userId: Long)
}
