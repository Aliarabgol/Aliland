package com.example.repository

import android.content.Context
import com.example.data.local.AppDatabase
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
import com.example.engine.AstrologyCalculationEngineManager
import com.example.engine.InterpretationEngine
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.withContext
import java.util.UUID

class AstroRepository(context: Context) {

    private val db = AppDatabase.getDatabase(context)
    private val userDao = db.userDao()
    private val birthProfileDao = db.birthProfileDao()
    private val intentionDao = db.intentionDao()
    private val readingDao = db.readingDao()
    private val adminDao = db.adminDao()

    suspend fun getOrCreateUserByPhone(phone: String, firstName: String, lastName: String): UserEntity {
        return withContext(Dispatchers.IO) {
            val existing = userDao.getUserByPhone(phone)
            if (existing != null) {
                existing
            } else {
                val newUser = UserEntity(
                    firstName = firstName,
                    lastName = lastName,
                    phone = phone,
                    phoneVerifiedAt = System.currentTimeMillis(),
                    walletBalance = 150000 // Welcome gift 150,000 Tomans
                )
                val id = userDao.insertUser(newUser)
                val createdUser = newUser.copy(id = id)

                // Log consent
                adminDao.insertConsentLog(
                    ConsentLogEntity(
                        userId = id,
                        consentType = "TERMS_AND_PRIVACY",
                        accepted = true
                    )
                )

                // Create default self birth profile
                birthProfileDao.insertProfile(
                    BirthProfileEntity(
                        userId = id,
                        title = "پروفایل خودم",
                        firstName = firstName,
                        lastName = lastName,
                        birthDateGregorian = "1995-06-15",
                        birthDateOriginal = "۱۳۷۴/۰۳/۲۵",
                        originalCalendar = "SHAMSI",
                        birthTime = "۰۸:۳۰",
                        timeKnown = true,
                        birthCity = "تهران",
                        latitude = 35.6892,
                        longitude = 51.3890,
                        timezoneAtBirth = "Asia/Tehran",
                        relationshipToUser = "SELF"
                    )
                )

                createdUser
            }
        }
    }

    suspend fun getUserById(userId: Long): UserEntity? = withContext(Dispatchers.IO) {
        userDao.getUserById(userId)
    }

    fun observeUser(userId: Long): Flow<UserEntity?> = userDao.observeUserById(userId)

    suspend fun updateUser(user: UserEntity) = withContext(Dispatchers.IO) {
        userDao.updateUser(user)
    }

    fun getBirthProfiles(userId: Long): Flow<List<BirthProfileEntity>> = birthProfileDao.getProfilesForUser(userId)

    suspend fun saveBirthProfile(profile: BirthProfileEntity): Long = withContext(Dispatchers.IO) {
        if (profile.id == 0L) {
            birthProfileDao.insertProfile(profile)
        } else {
            birthProfileDao.updateProfile(profile)
            profile.id
        }
    }

    suspend fun deleteBirthProfile(profileId: Long, userId: Long) = withContext(Dispatchers.IO) {
        birthProfileDao.deleteProfile(profileId, userId)
    }

    suspend fun saveIntention(intention: IntentionEntity): Long = withContext(Dispatchers.IO) {
        intentionDao.insertIntention(intention)
    }

    fun getReadings(userId: Long): Flow<List<ReadingEntity>> = readingDao.getReadingsForUser(userId)

    fun observeReading(readingId: Long): Flow<ReadingEntity?> = readingDao.observeReadingById(readingId)

    fun getReadingSections(readingId: Long): Flow<List<ReadingSectionEntity>> = readingDao.getSectionsForReading(readingId)

    suspend fun getCalculationSnapshot(readingId: Long): CalculationSnapshotEntity? = withContext(Dispatchers.IO) {
        readingDao.getSnapshotForReading(readingId)
    }

    suspend fun generateReadingPipeline(
        userId: Long,
        birthProfileId: Long,
        secondProfileId: Long? = null,
        intentionId: Long? = null,
        astrologySystem: String, // "WESTERN", "VEDIC", "BAZI", "COMBINED"
        readingType: String, // "NATAL", "RELATIONSHIP", "NIYAT", "TIMING"
        priceAmount: Long = 45000
    ): Long = withContext(Dispatchers.IO) {

        val profile1 = birthProfileDao.getProfileById(birthProfileId)
            ?: throw IllegalArgumentException("پروفایل تولد پیدا نشد")
        val profile2 = secondProfileId?.let { birthProfileDao.getProfileById(it) }
        val intention = intentionId?.let { intentionDao.getIntentionById(it) }

        // Deduct wallet balance
        val user = userDao.getUserById(userId) ?: throw IllegalArgumentException("کاربر پیدا نشد")
        if (user.walletBalance < priceAmount) {
            // Top up wallet automatically for seamless demo experience
            userDao.addWalletBalance(userId, priceAmount + 100000)
        }
        userDao.deductWalletBalance(userId, priceAmount)

        // Create initial pending reading record
        val newReading = ReadingEntity(
            userId = userId,
            birthProfileId = birthProfileId,
            secondBirthProfileId = secondProfileId,
            intentionId = intentionId,
            astrologySystem = astrologySystem,
            readingType = readingType,
            status = "CALCULATING",
            paymentStatus = "PAID"
        )
        val readingId = readingDao.insertReading(newReading)

        // Create Order Record
        adminDao.insertOrder(
            OrderEntity(
                userId = userId,
                readingId = readingId,
                serviceTitle = getServiceTitle(readingType, astrologySystem),
                amount = priceAmount,
                finalAmount = priceAmount,
                status = "SUCCESS",
                transactionReference = "TXN-${UUID.randomUUID().toString().take(8).uppercase()}"
            )
        )

        // Phase 1: Astronomical Calculation
        val snapshot = AstrologyCalculationEngineManager.calculateSnapshot(
            profile1 = profile1,
            profile2 = profile2,
            astrologySystem = astrologySystem,
            intentionCategory = intention?.category
        )

        // Save Calculation Snapshot
        readingDao.insertCalculationSnapshot(
            CalculationSnapshotEntity(
                readingId = readingId,
                engineName = "AstroNiyat Multi-Engine (Western+Vedic+BaZi)",
                inputJson = snapshot.inputDataJson,
                resultJson = snapshot.resultDataJson,
                checksum = snapshot.checksum
            )
        )

        // Update status to INTERPRETING
        readingDao.updateReadingStatus(readingId, "INTERPRETING", null)

        // Phase 2: Gemini AI Interpretation Engine
        val sections = InterpretationEngine.generateInterpretationSections(
            readingId = readingId,
            calculationResultJson = snapshot.resultDataJson,
            intentionQuestion = intention?.primaryQuestion,
            userContext = intention?.context
        )

        // Save Sections
        readingDao.insertReadingSections(sections)

        // Update reading as COMPLETED
        readingDao.updateReadingStatus(readingId, "COMPLETED", System.currentTimeMillis())

        // Audit Log
        adminDao.insertAuditLog(
            AuditLogEntity(
                actorId = userId,
                action = "GENERATE_READING",
                entityType = "READING",
                entityId = readingId.toString(),
                metadataJson = "{\"system\": \"$astrologySystem\", \"type\": \"$readingType\"}"
            )
        )

        readingId
    }

    private fun getServiceTitle(type: String, system: String): String {
        return when (type) {
            "NATAL" -> "تحلیل جامع چارت تولد ($system)"
            "RELATIONSHIP" -> "تحلیل سازگاری و روابط ($system)"
            "NIYAT" -> "فال نیت اختصاصی ($system)"
            else -> "پیش‌بینی و گزارش زمانی ($system)"
        }
    }

    // --- Admin Functions ---
    fun getAllUsers(): Flow<List<UserEntity>> = userDao.getAllUsers()
    fun getAllReadings(): Flow<List<ReadingEntity>> = readingDao.getAllReadings()
    fun getAllOrders(): Flow<List<OrderEntity>> = adminDao.getAllOrders()
    fun getAllPromptVersions(): Flow<List<PromptVersionEntity>> = adminDao.getAllPromptVersions()
    fun getAllDiscounts(): Flow<List<DiscountEntity>> = adminDao.getAllDiscounts()
    fun getAllSupportTickets(): Flow<List<SupportTicketEntity>> = adminDao.getAllSupportTickets()
    fun getAllAuditLogs(): Flow<List<AuditLogEntity>> = adminDao.getAllAuditLogs()
    fun getAllConsentLogs(): Flow<List<ConsentLogEntity>> = adminDao.getAllConsentLogs()

    suspend fun savePromptVersion(prompt: PromptVersionEntity) = withContext(Dispatchers.IO) {
        if (prompt.active) {
            adminDao.deactivateAllPrompts()
        }
        adminDao.insertPromptVersion(prompt)
    }

    suspend fun createDiscount(discount: DiscountEntity) = withContext(Dispatchers.IO) {
        adminDao.insertDiscount(discount)
    }

    suspend fun saveSupportTicket(ticket: SupportTicketEntity) = withContext(Dispatchers.IO) {
        adminDao.insertSupportTicket(ticket)
    }

    suspend fun updateSupportTicket(ticket: SupportTicketEntity) = withContext(Dispatchers.IO) {
        adminDao.updateSupportTicket(ticket)
    }

    suspend fun addWalletTopUp(userId: Long, amount: Long) = withContext(Dispatchers.IO) {
        userDao.addWalletBalance(userId, amount)
    }
}
