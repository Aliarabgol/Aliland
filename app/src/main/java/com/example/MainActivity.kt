package com.example

import android.os.Bundle
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.activity.viewModels
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Scaffold
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.example.ui.AstroViewModel
import com.example.ui.components.AstroBottomNav
import com.example.ui.components.AstroHeader
import com.example.ui.components.AstroTab
import com.example.ui.screens.AdminDashboardScreen
import com.example.ui.screens.AuthScreen
import com.example.ui.screens.BirthProfilesScreen
import com.example.ui.screens.DashboardScreen
import com.example.ui.screens.HistoryScreen
import com.example.ui.screens.IntentionFormScreen
import com.example.ui.screens.LandingScreen
import com.example.ui.screens.ReadingDetailScreen
import com.example.ui.screens.ReadingProgressScreen
import com.example.ui.screens.ServiceSelectScreen
import com.example.ui.theme.AstroNiyatTheme
import com.example.ui.theme.MidnightNavy

class MainActivity : ComponentActivity() {

    private val viewModel: AstroViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        setContent {
            AstroNiyatTheme {
                AstroAppContent(viewModel = viewModel)
            }
        }
    }
}

enum class Screen {
    LANDING,
    AUTH,
    DASHBOARD,
    PROFILES,
    SERVICE_SELECT,
    INTENTION_FORM,
    READING_PROGRESS,
    READING_DETAIL,
    HISTORY,
    ADMIN
}

@Composable
fun AstroAppContent(viewModel: AstroViewModel) {
    val currentUser by viewModel.currentUser.collectAsState()
    val profiles by viewModel.userProfiles.collectAsState()
    val readings by viewModel.userReadings.collectAsState()
    val currentReading by viewModel.currentReading.collectAsState()
    val currentSections by viewModel.currentReadingSections.collectAsState()
    val currentSnapshot by viewModel.currentCalculationSnapshot.collectAsState()
    val isLoading by viewModel.isLoading.collectAsState()
    val isAdminMode by viewModel.isAdminMode.collectAsState()

    // Admin state
    val adminUsers by viewModel.adminUsers.collectAsState()
    val adminReadings by viewModel.adminReadings.collectAsState()
    val adminOrders by viewModel.adminOrders.collectAsState()
    val adminPrompts by viewModel.adminPrompts.collectAsState()
    val adminDiscounts by viewModel.adminDiscounts.collectAsState()
    val adminAuditLogs by viewModel.adminAuditLogs.collectAsState()

    var currentScreen by remember { mutableStateOf(Screen.LANDING) }
    var selectedTab by remember { mutableStateOf(AstroTab.HOME) }

    // Temporary intent setup state
    var selectedReadingType by remember { mutableStateOf("NATAL") }
    var selectedAstrologySystem by remember { mutableStateOf("COMBINED") }
    var selectedProfile1Id by remember { mutableStateOf(0L) }
    var selectedProfile2Id by remember { mutableStateOf<Long?>(null) }
    var selectedPrice by remember { mutableStateOf(45000L) }

    Scaffold(
        topBar = {
            if (currentScreen != Screen.LANDING && currentScreen != Screen.AUTH) {
                AstroHeader(
                    user = currentUser,
                    isAdminMode = isAdminMode,
                    onToggleAdminMode = { enabled ->
                        viewModel.toggleAdminMode(enabled)
                        currentScreen = if (enabled) Screen.ADMIN else Screen.DASHBOARD
                        if (enabled) selectedTab = AstroTab.ADMIN
                    },
                    onTopUpWallet = { viewModel.topUpWallet(100000) },
                    onOpenProfile = {
                        currentScreen = Screen.PROFILES
                        selectedTab = AstroTab.PROFILES
                    }
                )
            }
        },
        bottomBar = {
            if (currentScreen != Screen.LANDING && currentScreen != Screen.AUTH && currentScreen != Screen.READING_PROGRESS) {
                AstroBottomNav(
                    selectedTab = selectedTab,
                    isAdminMode = isAdminMode,
                    onTabSelected = { tab ->
                        selectedTab = tab
                        currentScreen = when (tab) {
                            AstroTab.HOME -> Screen.DASHBOARD
                            AstroTab.PROFILES -> Screen.PROFILES
                            AstroTab.SERVICES -> Screen.SERVICE_SELECT
                            AstroTab.HISTORY -> Screen.HISTORY
                            AstroTab.ADMIN -> Screen.ADMIN
                        }
                    }
                )
            }
        },
        containerColor = MidnightNavy
    ) { innerPadding ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
                .background(MidnightNavy)
        ) {
            when (currentScreen) {
                Screen.LANDING -> LandingScreen(
                    onStartClick = {
                        currentScreen = if (currentUser != null) Screen.DASHBOARD else Screen.AUTH
                    },
                    onLearnMoreClick = {
                        currentScreen = if (currentUser != null) Screen.SERVICE_SELECT else Screen.AUTH
                    }
                )

                Screen.AUTH -> AuthScreen(
                    onLoginSuccess = { phone, firstName, lastName ->
                        viewModel.loginOrRegister(phone, firstName, lastName)
                        currentScreen = Screen.DASHBOARD
                        selectedTab = AstroTab.HOME
                    }
                )

                Screen.DASHBOARD -> DashboardScreen(
                    user = currentUser,
                    profiles = profiles,
                    readings = readings,
                    onNavigateToServices = {
                        currentScreen = Screen.SERVICE_SELECT
                        selectedTab = AstroTab.SERVICES
                    },
                    onNavigateToProfiles = {
                        currentScreen = Screen.PROFILES
                        selectedTab = AstroTab.PROFILES
                    },
                    onNavigateToReadingDetail = { id ->
                        viewModel.loadReadingDetails(id)
                        currentScreen = Screen.READING_DETAIL
                    }
                )

                Screen.PROFILES -> BirthProfilesScreen(
                    profiles = profiles,
                    onSaveProfile = { id, title, fn, ln, greg, orig, cal, time, timeKnown, city, lat, lng, rel ->
                        viewModel.saveBirthProfile(id, title, fn, ln, greg, orig, cal, time, timeKnown, city, lat, lng, rel)
                    },
                    onDeleteProfile = { viewModel.deleteBirthProfile(it) }
                )

                Screen.SERVICE_SELECT -> ServiceSelectScreen(
                    profiles = profiles,
                    onProceedToIntention = { rType, aSys, p1Id, p2Id, price ->
                        selectedReadingType = rType
                        selectedAstrologySystem = aSys
                        selectedProfile1Id = p1Id
                        selectedProfile2Id = p2Id
                        selectedPrice = price
                        currentScreen = Screen.INTENTION_FORM
                    },
                    onAddProfileFirst = {
                        currentScreen = Screen.PROFILES
                        selectedTab = AstroTab.PROFILES
                    }
                )

                Screen.INTENTION_FORM -> IntentionFormScreen(
                    readingType = selectedReadingType,
                    astrologySystem = selectedAstrologySystem,
                    profile1Id = selectedProfile1Id,
                    profile2Id = selectedProfile2Id,
                    priceAmount = selectedPrice,
                    onSubmitIntention = { category, question, contextText, timeframe ->
                        currentScreen = Screen.READING_PROGRESS
                        viewModel.createAndGenerateReading(
                            profile1Id = selectedProfile1Id,
                            profile2Id = selectedProfile2Id,
                            astrologySystem = selectedAstrologySystem,
                            readingType = selectedReadingType,
                            category = category,
                            primaryQuestion = question,
                            contextText = contextText,
                            timeframe = timeframe,
                            priceAmount = selectedPrice,
                            onComplete = { readingId ->
                                // Triggered when pipeline finishes
                            }
                        )
                    }
                )

                Screen.READING_PROGRESS -> ReadingProgressScreen(
                    readingId = currentReading?.id,
                    isCompleted = currentReading?.status == "COMPLETED",
                    onProgressComplete = {
                        currentScreen = Screen.READING_DETAIL
                    }
                )

                Screen.READING_DETAIL -> ReadingDetailScreen(
                    reading = currentReading,
                    sections = currentSections,
                    snapshot = currentSnapshot,
                    onBackClick = {
                        currentScreen = Screen.HISTORY
                        selectedTab = AstroTab.HISTORY
                    }
                )

                Screen.HISTORY -> HistoryScreen(
                    readings = readings,
                    onSelectReading = { id ->
                        viewModel.loadReadingDetails(id)
                        currentScreen = Screen.READING_DETAIL
                    }
                )

                Screen.ADMIN -> AdminDashboardScreen(
                    users = adminUsers,
                    readings = adminReadings,
                    orders = adminOrders,
                    prompts = adminPrompts,
                    discounts = adminDiscounts,
                    auditLogs = adminAuditLogs,
                    onCreateDiscount = { code, pct -> viewModel.createDiscount(code, pct) },
                    onSavePrompt = { name, sys, ver -> viewModel.savePromptVersion(name, sys, ver) }
                )
            }
        }
    }
}

