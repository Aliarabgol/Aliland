package com.example

import androidx.compose.runtime.Composable
import androidx.compose.ui.test.junit4.createComposeRule
import androidx.compose.ui.test.onRoot
import com.example.data.local.entities.AuditLogEntity
import com.example.data.local.entities.BirthProfileEntity
import com.example.data.local.entities.CalculationSnapshotEntity
import com.example.data.local.entities.DiscountEntity
import com.example.data.local.entities.OrderEntity
import com.example.data.local.entities.PromptVersionEntity
import com.example.data.local.entities.ReadingEntity
import com.example.data.local.entities.ReadingSectionEntity
import com.example.data.local.entities.UserEntity
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
import com.github.takahirom.roborazzi.RobolectricDeviceQualifiers
import com.github.takahirom.roborazzi.captureRoboImage
import org.junit.Rule
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.RobolectricTestRunner
import org.robolectric.annotation.Config
import org.robolectric.annotation.GraphicsMode
import java.io.File

/**
 * Renders every screen of the app on the JVM (no device or emulator needed) and
 * writes the frames to PREVIEW_SCREENSHOT_DIR, where the Base44 preview serves
 * them. Screens are the real composables from app/src/main, fed with sample
 * data, so they follow the app code as it changes.
 *
 * Re-run with: docker compose -f docker-compose.base44.yml up --force-recreate screenshots
 */
@RunWith(RobolectricTestRunner::class)
@GraphicsMode(GraphicsMode.Mode.NATIVE)
@Config(qualifiers = RobolectricDeviceQualifiers.Pixel8, sdk = [36])
class AppScreensGalleryTest {

  @get:Rule val composeTestRule = createComposeRule()

  private val shotDir: File =
    File(System.getenv("PREVIEW_SCREENSHOT_DIR") ?: "../.base44/preview/screens")

  private fun capture(name: String, content: @Composable () -> Unit) {
    composeTestRule.setContent { AstroNiyatTheme { content() } }
    composeTestRule.waitForIdle()
    shotDir.mkdirs()
    composeTestRule.onRoot().captureRoboImage(filePath = File(shotDir, "$name.png").path)
  }

  @Test
  fun `01 landing`() = capture("01-landing") {
    LandingScreen(onStartClick = {}, onLearnMoreClick = {})
  }

  @Test
  fun `02 auth`() = capture("02-auth") {
    AuthScreen(onLoginSuccess = { _, _, _ -> })
  }

  @Test
  fun `03 dashboard`() = capture("03-dashboard") {
    DashboardScreen(
      user = sampleUser,
      profiles = sampleProfiles,
      readings = sampleReadings,
      onNavigateToServices = {},
      onNavigateToProfiles = {},
      onNavigateToReadingDetail = {}
    )
  }

  @Test
  fun `04 birth profiles`() = capture("04-profiles") {
    BirthProfilesScreen(
      profiles = sampleProfiles,
      onSaveProfile = { _, _, _, _, _, _, _, _, _, _, _, _, _ -> },
      onDeleteProfile = {}
    )
  }

  @Test
  fun `05 service select`() = capture("05-services") {
    ServiceSelectScreen(
      profiles = sampleProfiles,
      onProceedToIntention = { _, _, _, _, _ -> },
      onAddProfileFirst = {}
    )
  }

  @Test
  fun `06 intention form`() = capture("06-intention") {
    IntentionFormScreen(
      readingType = "NATAL",
      astrologySystem = "COMBINED",
      profile1Id = 1L,
      profile2Id = null,
      priceAmount = 45000L,
      onSubmitIntention = { _, _, _, _ -> }
    )
  }

  @Test
  fun `07 reading progress`() = capture("07-progress") {
    ReadingProgressScreen(
      readingId = 4L,
      isCompleted = true,
      onProgressComplete = {}
    )
  }

  @Test
  fun `08 reading detail`() = capture("08-reading-detail") {
    ReadingDetailScreen(
      reading = sampleReadings.first(),
      sections = sampleSections,
      snapshot = sampleSnapshot,
      onBackClick = {}
    )
  }

  @Test
  fun `09 history`() = capture("09-history") {
    HistoryScreen(readings = sampleReadings, onSelectReading = {})
  }

  @Test
  fun `10 admin`() = capture("10-admin") {
    AdminDashboardScreen(
      users = listOf(sampleUser),
      readings = sampleReadings,
      orders = sampleOrders,
      prompts = samplePrompts,
      discounts = sampleDiscounts,
      auditLogs = sampleAuditLogs,
      onCreateDiscount = { _, _ -> },
      onSavePrompt = { _, _, _ -> }
    )
  }

  // --- Sample data used only by this gallery, so the screens have something to show. ---

  private val sampleUser = UserEntity(
    id = 1,
    firstName = "نیما",
    lastName = "راد",
    phone = "09123456789",
    walletBalance = 250_000
  )

  private val sampleProfiles = listOf(
    BirthProfileEntity(
      id = 1,
      userId = 1,
      title = "خودم",
      firstName = "نیما",
      lastName = "راد",
      birthDateGregorian = "1996-08-15",
      birthDateOriginal = "1375/05/25",
      originalCalendar = "SHAMSI",
      birthTime = "06:45",
      birthCity = "تهران",
      relationshipToUser = "SELF"
    ),
    BirthProfileEntity(
      id = 2,
      userId = 1,
      title = "همسر",
      firstName = "سارا",
      lastName = "م.",
      birthDateGregorian = "1998-03-02",
      birthDateOriginal = "1377/12/11",
      originalCalendar = "SHAMSI",
      birthTime = "21:10",
      timeKnown = false,
      birthCity = "شیراز",
      latitude = 29.5918,
      longitude = 52.5837,
      relationshipToUser = "SPOUSE"
    )
  )

  private val sampleReadings = listOf(
    ReadingEntity(
      id = 4,
      userId = 1,
      birthProfileId = 1,
      astrologySystem = "COMBINED",
      readingType = "NATAL",
      status = "COMPLETED",
      similarityScore = 0.87
    ),
    ReadingEntity(
      id = 3,
      userId = 1,
      birthProfileId = 1,
      secondBirthProfileId = 2,
      astrologySystem = "WESTERN",
      readingType = "RELATIONSHIP",
      status = "COMPLETED",
      similarityScore = 0.72
    ),
    ReadingEntity(
      id = 2,
      userId = 1,
      birthProfileId = 1,
      astrologySystem = "BAZI",
      readingType = "NIYAT",
      status = "PENDING",
      paymentStatus = "UNPAID"
    )
  )

  private val sampleSections = listOf(
    ReadingSectionEntity(
      readingId = 4,
      sectionType = "SUMMARY",
      title = "خلاصه‌ی تحلیلی",
      content = "نقشه‌ی تولد شما ترکیبی از آتش و خاک است؛ اراده‌ی روشن همراه با پشتکار آرام. " +
        "خورشید در اسد به شما اعتماد‌به‌نفس می‌دهد و ماه در ثور نیاز به امنیت عاطفی را برجسته می‌کند.",
      confidenceLevel = "HIGH",
      orderIndex = 0
    ),
    ReadingSectionEntity(
      readingId = 4,
      sectionType = "ASTRONOMICAL",
      title = "داده‌های نجومی محاسبه‌شده",
      content = "خورشید: شیر (اسد) · ماه: ثور (اردیبهشت) · طالع: جوزا (خرداد) · عنصر غالب: آتش. " +
        "زمان تولد ثبت‌شده ۰۶:۴۵ به وقت تهران با عرض و طول جغرافیایی ثبت‌شده در پروفایل.",
      confidenceLevel = "HIGH",
      orderIndex = 1
    ),
    ReadingSectionEntity(
      readingId = 4,
      sectionType = "INTERPRETATION",
      title = "تفسیر نمادین",
      content = "ترکیب اسد و ثور نشان‌دهنده‌ی فردی است که هم‌زمان به دیده‌شدن و به ثبات نیاز دارد. " +
        "در کار، استقلال را ترجیح می‌دهید و در روابط به صداقت و وفاداری حساس هستید.",
      confidenceLevel = "HIGH",
      orderIndex = 2
    ),
    ReadingSectionEntity(
      readingId = 4,
      sectionType = "TIMING",
      title = "روند و زمان‌بندی",
      content = "بازه‌ی پیش‌رو برای شروع پروژه‌های مالی مساعدتر از تغییرات عاطفی است؛ " +
        "تصمیم‌های بزرگ را به هفته‌های پایانی ماه موکول کنید.",
      confidenceLevel = "MEDIUM",
      orderIndex = 3
    ),
    ReadingSectionEntity(
      readingId = 4,
      sectionType = "GUIDANCE",
      title = "راهنمای عمل",
      content = "هر روز پنج دقیقه برای نوشتن نیت‌های واقعی‌تان وقت بگذارید؛ وضوح ذهن، مسیر را کوتاه‌تر می‌کند.",
      confidenceLevel = "HIGH",
      orderIndex = 4
    ),
    ReadingSectionEntity(
      readingId = 4,
      sectionType = "DISCLAIMER",
      title = "سلب مسئولیت",
      content = "این تحلیل جنبه‌ی سرگرمی و خودشناسی دارد و جایگزین مشاوره‌ی تخصصی پزشکی، حقوقی یا مالی نیست.",
      confidenceLevel = "HIGH",
      orderIndex = 5
    )
  )

  private val sampleSnapshot = CalculationSnapshotEntity(
    id = 1,
    readingId = 4,
    engineName = "CombinedAstrologyEngine",
    inputJson = """{"birthDate":"1996-08-15","birthTime":"06:45","city":"تهران"}""",
    resultJson = """{"western_astrology":{"sun_sign":"شیر (اسد)","moon_sign":"ثور (اردیبهشت)",""" +
      """"ascendant_sign":"جوزا (خرداد)","dominant_element":"آتش"}}""",
    checksum = "a91f4c7e2b"
  )

  private val sampleOrders = listOf(
    OrderEntity(
      userId = 1,
      readingId = 4,
      serviceTitle = "تحلیل ترکیبی نیت و طالع",
      amount = 45000,
      finalAmount = 45000,
      transactionReference = "TRX-10241"
    )
  )

  private val samplePrompts = listOf(
    PromptVersionEntity(
      name = "پرامپت مفسر هوشمند",
      systemPrompt = "تو یک مفسر طالع‌بینی و تحلیل نمادین هستی...",
      userPromptTemplate = "با توجه به داده‌های نجومی زیر، تحلیل کن...",
      outputSchema = """{"sections":[]}""",
      version = "v1.1.0"
    )
  )

  private val sampleDiscounts = listOf(
    DiscountEntity(code = "ASTRO20", discountPercent = 20, currentUsage = 12)
  )

  private val sampleAuditLogs = listOf(
    AuditLogEntity(
      actorId = 1,
      action = "CREATE_READING",
      entityType = "readings",
      entityId = "4"
    )
  )
}
