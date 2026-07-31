package com.example.data.local

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import androidx.room.TypeConverters
import com.example.data.local.dao.AdminDao
import com.example.data.local.dao.BirthProfileDao
import com.example.data.local.dao.IntentionDao
import com.example.data.local.dao.ReadingDao
import com.example.data.local.dao.UserDao
import com.example.data.local.entities.AuditLogEntity
import com.example.data.local.entities.BirthProfileEntity
import com.example.data.local.entities.CalculationSnapshotEntity
import com.example.data.local.entities.ConsentLogEntity
import com.example.data.local.entities.DiscountEntity
import com.example.data.local.entities.IntentionEntity
import com.example.data.local.entities.OrderEntity
import com.example.data.local.entities.PromptVersionEntity
import com.example.data.local.entities.ReadingEntity
import com.example.data.local.entities.ReadingSectionEntity
import com.example.data.local.entities.SupportTicketEntity
import com.example.data.local.entities.UserEntity

@Database(
    entities = [
        UserEntity::class,
        BirthProfileEntity::class,
        IntentionEntity::class,
        ReadingEntity::class,
        CalculationSnapshotEntity::class,
        ReadingSectionEntity::class,
        ConsentLogEntity::class,
        PromptVersionEntity::class,
        OrderEntity::class,
        AuditLogEntity::class,
        DiscountEntity::class,
        SupportTicketEntity::class
    ],
    version = 1,
    exportSchema = false
)
@TypeConverters(Converters::class)
abstract class AppDatabase : RoomDatabase() {
    abstract fun userDao(): UserDao
    abstract fun birthProfileDao(): BirthProfileDao
    abstract fun intentionDao(): IntentionDao
    abstract fun readingDao(): ReadingDao
    abstract fun adminDao(): AdminDao

    companion object {
        @Volatile
        private var INSTANCE: AppDatabase? = null

        fun getDatabase(context: Context): AppDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    AppDatabase::class.java,
                    "astroniyat_database"
                )
                .fallbackToDestructiveMigration()
                .build()
                INSTANCE = instance
                instance
            }
        }
    }
}
