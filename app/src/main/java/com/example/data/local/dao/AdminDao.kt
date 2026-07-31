package com.example.data.local.dao

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import androidx.room.Update
import com.example.data.local.entities.AuditLogEntity
import com.example.data.local.entities.ConsentLogEntity
import com.example.data.local.entities.DiscountEntity
import com.example.data.local.entities.OrderEntity
import com.example.data.local.entities.PromptVersionEntity
import com.example.data.local.entities.SupportTicketEntity
import kotlinx.coroutines.flow.Flow

@Dao
interface AdminDao {
    @Query("SELECT * FROM prompt_versions ORDER BY version DESC")
    fun getAllPromptVersions(): Flow<List<PromptVersionEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertPromptVersion(promptVersion: PromptVersionEntity): Long

    @Query("UPDATE prompt_versions SET active = 0")
    suspend fun deactivateAllPrompts()

    @Query("UPDATE prompt_versions SET active = 1 WHERE id = :id")
    suspend fun activatePrompt(id: Long)

    @Query("SELECT * FROM prompt_versions WHERE active = 1 LIMIT 1")
    suspend fun getActivePrompt(): PromptVersionEntity?

    @Query("SELECT * FROM orders ORDER BY createdAt DESC")
    fun getAllOrders(): Flow<List<OrderEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertOrder(order: OrderEntity): Long

    @Query("SELECT * FROM discounts ORDER BY id DESC")
    fun getAllDiscounts(): Flow<List<DiscountEntity>>

    @Query("SELECT * FROM discounts WHERE code = :code AND active = 1 LIMIT 1")
    suspend fun getDiscountByCode(code: String): DiscountEntity?

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertDiscount(discount: DiscountEntity): Long

    @Update
    suspend fun updateDiscount(discount: DiscountEntity)

    @Query("SELECT * FROM consent_logs ORDER BY createdAt DESC")
    fun getAllConsentLogs(): Flow<List<ConsentLogEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertConsentLog(log: ConsentLogEntity): Long

    @Query("SELECT * FROM audit_logs ORDER BY createdAt DESC")
    fun getAllAuditLogs(): Flow<List<AuditLogEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAuditLog(log: AuditLogEntity): Long

    @Query("SELECT * FROM support_tickets ORDER BY createdAt DESC")
    fun getAllSupportTickets(): Flow<List<SupportTicketEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertSupportTicket(ticket: SupportTicketEntity): Long

    @Update
    suspend fun updateSupportTicket(ticket: SupportTicketEntity)
}
