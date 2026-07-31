package com.example.ui

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
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
import com.example.repository.AstroRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.collectLatest
import kotlinx.coroutines.launch

class AstroViewModel(application: Application) : AndroidViewModel(application) {

    private val repository = AstroRepository(application)

    private val _currentUser = MutableStateFlow<UserEntity?>(null)
    val currentUser: StateFlow<UserEntity?> = _currentUser.asStateFlow()

    private val _userProfiles = MutableStateFlow<List<BirthProfileEntity>>(emptyList())
    val userProfiles: StateFlow<List<BirthProfileEntity>> = _userProfiles.asStateFlow()

    private val _userReadings = MutableStateFlow<List<ReadingEntity>>(emptyList())
    val userReadings: StateFlow<List<ReadingEntity>> = _userReadings.asStateFlow()

    private val _currentReadingId = MutableStateFlow<Long?>(null)
    val currentReadingId: StateFlow<Long?> = _currentReadingId.asStateFlow()

    private val _currentReading = MutableStateFlow<ReadingEntity?>(null)
    val currentReading: StateFlow<ReadingEntity?> = _currentReading.asStateFlow()

    private val _currentReadingSections = MutableStateFlow<List<ReadingSectionEntity>>(emptyList())
    val currentReadingSections: StateFlow<List<ReadingSectionEntity>> = _currentReadingSections.asStateFlow()

    private val _currentCalculationSnapshot = MutableStateFlow<CalculationSnapshotEntity?>(null)
    val currentCalculationSnapshot: StateFlow<CalculationSnapshotEntity?> = _currentCalculationSnapshot.asStateFlow()

    private val _isLoading = MutableStateFlow(false)
    val isLoading: StateFlow<Boolean> = _isLoading.asStateFlow()

    private val _errorMessage = MutableStateFlow<String?>(null)
    val errorMessage: StateFlow<String?> = _errorMessage.asStateFlow()

    private val _isAdminMode = MutableStateFlow(false)
    val isAdminMode: StateFlow<Boolean> = _isAdminMode.asStateFlow()

    // Admin state flows
    private val _adminUsers = MutableStateFlow<List<UserEntity>>(emptyList())
    val adminUsers: StateFlow<List<UserEntity>> = _adminUsers.asStateFlow()

    private val _adminReadings = MutableStateFlow<List<ReadingEntity>>(emptyList())
    val adminReadings: StateFlow<List<ReadingEntity>> = _adminReadings.asStateFlow()

    private val _adminOrders = MutableStateFlow<List<OrderEntity>>(emptyList())
    val adminOrders: StateFlow<List<OrderEntity>> = _adminOrders.asStateFlow()

    private val _adminPrompts = MutableStateFlow<List<PromptVersionEntity>>(emptyList())
    val adminPrompts: StateFlow<List<PromptVersionEntity>> = _adminPrompts.asStateFlow()

    private val _adminDiscounts = MutableStateFlow<List<DiscountEntity>>(emptyList())
    val adminDiscounts: StateFlow<List<DiscountEntity>> = _adminDiscounts.asStateFlow()

    private val _adminTickets = MutableStateFlow<List<SupportTicketEntity>>(emptyList())
    val adminTickets: StateFlow<List<SupportTicketEntity>> = _adminTickets.asStateFlow()

    private val _adminAuditLogs = MutableStateFlow<List<AuditLogEntity>>(emptyList())
    val adminAuditLogs: StateFlow<List<AuditLogEntity>> = _adminAuditLogs.asStateFlow()

    init {
        // Auto initialize user for quick development test
        loginOrRegister("09123456789", "علی", "عرب‌گل")
        observeAdminData()
    }

    fun loginOrRegister(phone: String, firstName: String, lastName: String) {
        viewModelScope.launch {
            _isLoading.value = true
            try {
                val user = repository.getOrCreateUserByPhone(phone, firstName, lastName)
                _currentUser.value = user
                observeUserData(user.id)
            } catch (e: Exception) {
                _errorMessage.value = e.message
            } finally {
                _isLoading.value = false
            }
        }
    }

    private fun observeUserData(userId: Long) {
        viewModelScope.launch {
            repository.observeUser(userId).collectLatest {
                _currentUser.value = it
            }
        }
        viewModelScope.launch {
            repository.getBirthProfiles(userId).collectLatest {
                _userProfiles.value = it
            }
        }
        viewModelScope.launch {
            repository.getReadings(userId).collectLatest {
                _userReadings.value = it
            }
        }
    }

    private fun observeAdminData() {
        viewModelScope.launch {
            repository.getAllUsers().collectLatest { _adminUsers.value = it }
        }
        viewModelScope.launch {
            repository.getAllReadings().collectLatest { _adminReadings.value = it }
        }
        viewModelScope.launch {
            repository.getAllOrders().collectLatest { _adminOrders.value = it }
        }
        viewModelScope.launch {
            repository.getAllPromptVersions().collectLatest { _adminPrompts.value = it }
        }
        viewModelScope.launch {
            repository.getAllDiscounts().collectLatest { _adminDiscounts.value = it }
        }
        viewModelScope.launch {
            repository.getAllSupportTickets().collectLatest { _adminTickets.value = it }
        }
        viewModelScope.launch {
            repository.getAllAuditLogs().collectLatest { _adminAuditLogs.value = it }
        }
    }

    fun saveBirthProfile(
        id: Long = 0,
        title: String,
        firstName: String,
        lastName: String? = null,
        birthDateGregorian: String,
        birthDateOriginal: String,
        originalCalendar: String = "SHAMSI",
        birthTime: String,
        timeKnown: Boolean,
        birthCity: String,
        lat: Double,
        lng: Double,
        relationship: String
    ) {
        val user = _currentUser.value ?: return
        viewModelScope.launch {
            _isLoading.value = true
            try {
                val profile = BirthProfileEntity(
                    id = id,
                    userId = user.id,
                    title = title,
                    firstName = firstName,
                    lastName = lastName,
                    birthDateGregorian = birthDateGregorian,
                    birthDateOriginal = birthDateOriginal,
                    originalCalendar = originalCalendar,
                    birthTime = birthTime,
                    timeKnown = timeKnown,
                    birthCity = birthCity,
                    latitude = lat,
                    longitude = lng,
                    relationshipToUser = relationship
                )
                repository.saveBirthProfile(profile)
            } catch (e: Exception) {
                _errorMessage.value = e.message
            } finally {
                _isLoading.value = false
            }
        }
    }

    fun deleteBirthProfile(profileId: Long) {
        val user = _currentUser.value ?: return
        viewModelScope.launch {
            repository.deleteBirthProfile(profileId, user.id)
        }
    }

    fun createAndGenerateReading(
        profile1Id: Long,
        profile2Id: Long? = null,
        astrologySystem: String, // "WESTERN", "VEDIC", "BAZI", "COMBINED"
        readingType: String, // "NATAL", "RELATIONSHIP", "NIYAT", "TIMING"
        category: String = "GENERAL",
        primaryQuestion: String = "تحلیل مسیر زندگی و استعدادها",
        contextText: String = "",
        timeframe: String = "THIS_MONTH",
        priceAmount: Long = 45000,
        onComplete: (Long) -> Unit
    ) {
        val user = _currentUser.value ?: return
        viewModelScope.launch {
            _isLoading.value = true
            _errorMessage.value = null
            try {
                // Save intention
                val intentionId = repository.saveIntention(
                    IntentionEntity(
                        userId = user.id,
                        category = category,
                        primaryQuestion = primaryQuestion,
                        context = contextText,
                        timeframe = timeframe,
                        secondPersonInvolved = profile2Id != null,
                        secondProfileId = profile2Id
                    )
                )

                // Run Pipeline
                val readingId = repository.generateReadingPipeline(
                    userId = user.id,
                    birthProfileId = profile1Id,
                    secondProfileId = profile2Id,
                    intentionId = intentionId,
                    astrologySystem = astrologySystem,
                    readingType = readingType,
                    priceAmount = priceAmount
                )

                loadReadingDetails(readingId)
                onComplete(readingId)
            } catch (e: Exception) {
                _errorMessage.value = e.message ?: "خطا در تولید گزارش"
            } finally {
                _isLoading.value = false
            }
        }
    }

    fun loadReadingDetails(readingId: Long) {
        _currentReadingId.value = readingId
        viewModelScope.launch {
            repository.observeReading(readingId).collectLatest {
                _currentReading.value = it
            }
        }
        viewModelScope.launch {
            repository.getReadingSections(readingId).collectLatest {
                _currentReadingSections.value = it
            }
        }
        viewModelScope.launch {
            _currentCalculationSnapshot.value = repository.getCalculationSnapshot(readingId)
        }
    }

    fun toggleAdminMode(enabled: Boolean) {
        _isAdminMode.value = enabled
    }

    fun topUpWallet(amount: Long) {
        val user = _currentUser.value ?: return
        viewModelScope.launch {
            repository.addWalletTopUp(user.id, amount)
        }
    }

    fun createDiscount(code: String, percent: Int) {
        viewModelScope.launch {
            repository.createDiscount(
                DiscountEntity(
                    code = code.uppercase(),
                    discountPercent = percent
                )
            )
        }
    }

    fun savePromptVersion(name: String, sysPrompt: String, version: String) {
        viewModelScope.launch {
            repository.savePromptVersion(
                PromptVersionEntity(
                    name = name,
                    systemPrompt = sysPrompt,
                    userPromptTemplate = "...",
                    outputSchema = "{}",
                    version = version,
                    active = true
                )
            )
        }
    }

    fun submitSupportTicket(subject: String, message: String) {
        val user = _currentUser.value ?: return
        viewModelScope.launch {
            repository.saveSupportTicket(
                SupportTicketEntity(
                    userId = user.id,
                    subject = subject,
                    message = message
                )
            )
        }
    }

    fun clearError() {
        _errorMessage.value = null
    }
}
