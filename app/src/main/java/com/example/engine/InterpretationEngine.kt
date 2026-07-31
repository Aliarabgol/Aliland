package com.example.engine

import com.example.data.local.entities.ReadingSectionEntity
import com.example.service.ai.GeminiClient
import com.example.service.ai.GeminiContent
import com.example.service.ai.GeminiGenerateRequest
import com.example.service.ai.GeminiPart
import org.json.JSONObject
import java.util.Locale

object InterpretationEngine {

    const val SYSTEM_INSTRUCTION_TEXT = """
تو یک مفسر طالعبینی و تحلیلی روانشناسی-نمادین هستی، نه یک موتور محاسبات نجومی. فقط اطلاعاتی را تفسیر کن که در Calculation Context موجود در درخواست وجود دارند. هیچ موقعیت سیاره، خانه، جنبه، ناکشاترا، داشا، ستون، عنصر یا تاریخ نجومی جدیدی از خودت اختراع نکن.

قوانین حیاتی عدم ادعای قطعی:
۱. از ادعاهای قطعی درباره آینده، پیش‌بینی مرگ، بیماری، بارداری، خیانت، ازدواج قطعی، طلاق قطعی، بازگشت حتمی شخص سابق و ثروتمند شدن سریع کاملاً اجتناب کن.
۲. تمام مطالب را به صورت نمادین، تفسیری، احتمالی و برای تأمل شخصی و خودشناسی مطرح کن.
۳. اگر در داده‌ها اشاره‌ای به خشونت، آزار، تهدید یا خطرات رابطه عاطفی شده است، به هیچ وجه کاربر را به بازگشت به آن رابطه یا تحمل آزار تشویق نکن.
۴. در صورت عدم وجود ساعت دقیق تولد، محدودیت تحلیل خانه و طالع را تصریح کن.
۵. خروجی را دقیقاً در قالب ساختار JSON فارسی مشخص‌شده تولید کن.
"""

    private val PHRASE_BLACKLIST = listOf(
        "قطعا برمیگردد", "حتما ازدواج میکنید", "بدون شک ثروتمند میشوید",
        "در فلان روز دقیق رخ میدهد", "آینده شما پیش‌بینی شده است"
    )

    suspend fun generateInterpretationSections(
        readingId: Long,
        calculationResultJson: String,
        intentionQuestion: String? = null,
        userContext: String? = null
    ): List<ReadingSectionEntity> {

        val apiKey = GeminiClient.getApiKey()

        val promptUserText = """
اطلاعات چارت نجومی و محاسباتی (Calculation Context):
$calculationResultJson

سؤال یا نیت کاربر: ${intentionQuestion ?: "تحلیل عمومی چارت و مسیر رشد شخصی"}
توضیحات کاربر: ${userContext ?: "بدون توضیح اضافه"}

لطفاً یک گزارش جامع فارسی در قالب JSON با کلیدهای زیر تولید کن:
{
  "summary": "خلاصه مدیریتی و تحلیلی ۱ الی ۲ پاراگراف",
  "core_indicators_text": "شرح شاخص‌های اصلی نجومی و عناصر چارت",
  "interpretation": "تحلیل عمیق شخصیت، نیت یا سؤال کاربر براساس عناصر و زوایای موجود در JSON",
  "relationship_analysis": "تحلیل الگوی روابط عاطفی و ارتباطی (در صورت وجود)",
  "timing_windows": "دوره‌های زمانی احتمالی برای تأمل و اقدام (بدون قطعی ساختن آینده)",
  "opportunities": "فرصت‌های پیش‌رو برای رشد شخصی و شغلی",
  "challenges": "چالش‌های محتمل و الگوهای رفتاری نیازمند آگاهی",
  "reflection_questions": "۳ سؤال تأملی عمیق برای خودشناسی کاربر",
  "practical_guidance": "پیشنهادهای عملی، منطقی و غیرقطعی برای بهبود کیفیت زندگی",
  "disclaimer": "این تحلیل براساس سنتهای نمادین طالعبینی و برای سرگرمی، تأمل شخصی و خودشناسی تهیه شده است. نتیجه، پیشبینی قطعی آینده یا جایگزین مشاوره پزشکی، حقوقی، مالی یا روانشناختی نیست."
}
"""

        var aiTextResponse: String? = null

        if (apiKey.isNotEmpty() && apiKey != "MY_GEMINI_API_KEY") {
            try {
                val request = GeminiGenerateRequest(
                    contents = listOf(GeminiContent(parts = listOf(GeminiPart(text = promptUserText)))),
                    systemInstruction = GeminiContent(parts = listOf(GeminiPart(text = SYSTEM_INSTRUCTION_TEXT)))
                )
                val response = GeminiClient.api.generateContent(apiKey, request)
                aiTextResponse = response.candidates?.firstOrNull()?.content?.parts?.firstOrNull()?.text
            } catch (e: Exception) {
                aiTextResponse = null
            }
        }

        // Clean & Filter Blacklisted Phrases
        var cleanJsonText = aiTextResponse ?: ""
        PHRASE_BLACKLIST.forEach { blacklisted ->
            cleanJsonText = cleanJsonText.replace(blacklisted, "احتمالاً در مسیر رشد و بررسی بیشتر قرار خواهد گرفت")
        }

        return try {
            val jsonStart = cleanJsonText.indexOf("{")
            val jsonEnd = cleanJsonText.lastIndexOf("}")
            val parsedObj = if (jsonStart != -1 && jsonEnd != -1 && jsonEnd > jsonStart) {
                JSONObject(cleanJsonText.substring(jsonStart, jsonEnd + 1))
            } else {
                buildFallbackJsonObject(calculationResultJson, intentionQuestion)
            }
            buildSectionsFromJson(readingId, parsedObj)
        } catch (e: Exception) {
            val fallbackObj = buildFallbackJsonObject(calculationResultJson, intentionQuestion)
            buildSectionsFromJson(readingId, fallbackObj)
        }
    }

    private fun buildFallbackJsonObject(calcJsonStr: String, question: String?): JSONObject {
        val calcObj = try { JSONObject(calcJsonStr) } catch (e: Exception) { JSONObject() }
        val western = calcObj.optJSONObject("western_astrology")
        val vedic = calcObj.optJSONObject("vedic_astrology")
        val bazi = calcObj.optJSONObject("bazi_astrology")

        val sun = western?.optString("sun_sign", "حمل") ?: "حمل"
        val moon = western?.optString("moon_sign", "ثور") ?: "ثور"
        val asc = western?.optString("ascendant_sign", "جوزا") ?: "جوزا"
        val nakshatra = vedic?.optString("moon_nakshatra", "روهینی") ?: "روهینی"
        val dayMaster = bazi?.optString("day_master", "چوب") ?: "چوب"

        return JSONObject().apply {
            put("summary", "تحلیل شما براساس ترکیب داده‌های خورشید ($sun)، ماه ($moon)، طالع ($asc) و ناکشاترا ($nakshatra) آماده گردید. این چارت نشان‌دهنده پتانسیل‌های عمیق درون‌فردی، انگیزه بالا برای رشد و قدرت تحلیل منطقی در تصمیم‌گیری‌های کلیدی است.")
            put("core_indicators_text", "خورشید در $sun / ماه در $moon / طالع در $asc / ناکشاترا: $nakshatra / عنصر Day Master (چینی): $dayMaster")
            put("interpretation", "در پاسخ به موضوع (${question ?: "تحلیل مسیر زندگی"}): چارت شما نشان می‌دهد که با حفظ تعادل فکری و دوری از شتاب‌زدگی می‌توانید الگوهای فکری مثبتی را هدایت کنید. زوایای چارت نجومی بر اهمیت صبر و تمرکز بر نقاط قوت تاکید دارند.")
            put("relationship_analysis", "در حوزه روابط، ارتباط مؤثر و بیان شفاف نیازهای عاطفی کلید اصلی صمیمیت و پایداری است. درک متقابل تفاوت‌های فردی به تقویت پیوند کمک خواهد کرد.")
            put("timing_windows", "ماه آینده و فصل جاری زمان‌های مناسبی برای بازنگری اهداف شخصی، ارتقای مهارت‌ها و برقراری آرامش فکری محسوب می‌شوند.")
            put("opportunities", "• تقویت اعتمادبه‌نفس و تکیه بر مهارت‌های فردی\n• ایجاد تعادل میان آرمان‌های ذهنی و واقعیت‌های بیرونی\n• بهره‌گیری از فرصت‌های ارتباطی جدید")
            put("challenges", "• شتاب‌زدگی در تصمیم‌گیری‌های مالی یا عاطفی\n• تمایل به تحلیل بیش از حد مسائل خرد\n• نیاز به مراقبت از انرژی روحی در شرایط پرفشار")
            put("reflection_questions", "۱. مهم‌ترین اولویت زندگی من در این فصل چیست؟\n۲. چگونه می‌توانم تعادل بیشتری میان منطق و احساس ایجاد کنم؟\n۳. چه الگوهایی در رفتارهای گذشته‌ام نیاز به بازنگری دارند؟")
            put("practical_guidance", "• اختصاص زمان روزانه برای مراقبه و تمرکز فکری\n• ثبت اهداف هفته به صورت مکتوب و اولویت‌بندی شده\n• گفتگوی آزاد و صمیمانه با افراد مورد اعتماد در تصمیمات مهم")
            put("disclaimer", "این تحلیل براساس سنتهای نمادین طالعبینی و برای سرگرمی، تأمل شخصی و خودشناسی تهیه شده است. نتیجه، پیشبینی قطعی آینده یا جایگزین مشاوره پزشکی، حقوقی، مالی یا روانشناختی نیست.")
        }
    }

    private fun buildSectionsFromJson(readingId: Long, obj: JSONObject): List<ReadingSectionEntity> {
        val list = mutableListOf<ReadingSectionEntity>()
        var idx = 0

        list.add(
            ReadingSectionEntity(
                readingId = readingId,
                sectionType = "SUMMARY",
                title = "خلاصه مدیریتی و تحلیلی",
                content = obj.optString("summary", ""),
                orderIndex = idx++
            )
        )

        list.add(
            ReadingSectionEntity(
                readingId = readingId,
                sectionType = "ASTRONOMICAL",
                title = "شاخص‌های اصلی چارت نجومی",
                content = obj.optString("core_indicators_text", ""),
                orderIndex = idx++
            )
        )

        list.add(
            ReadingSectionEntity(
                readingId = readingId,
                sectionType = "INTERPRETATION",
                title = "تحلیل عمیق نیت و شخصیت",
                content = obj.optString("interpretation", ""),
                orderIndex = idx++
            )
        )

        if (obj.has("relationship_analysis") && obj.getString("relationship_analysis").isNotBlank()) {
            list.add(
                ReadingSectionEntity(
                    readingId = readingId,
                    sectionType = "RELATIONSHIP",
                    title = "تحلیل الگوهای ارتباطی و عاطفی",
                    content = obj.getString("relationship_analysis"),
                    orderIndex = idx++
                )
            )
        }

        list.add(
            ReadingSectionEntity(
                readingId = readingId,
                sectionType = "TIMING",
                title = "بازه و ترانزیتهای زمانی مهم",
                content = obj.optString("timing_windows", ""),
                orderIndex = idx++
            )
        )

        list.add(
            ReadingSectionEntity(
                readingId = readingId,
                sectionType = "OPPORTUNITIES",
                title = "فرصت‌های رشد و انگیزه",
                content = obj.optString("opportunities", ""),
                orderIndex = idx++
            )
        )

        list.add(
            ReadingSectionEntity(
                readingId = readingId,
                sectionType = "CHALLENGES",
                title = "چالش‌ها و نکات قابل آگاهی",
                content = obj.optString("challenges", ""),
                orderIndex = idx++
            )
        )

        list.add(
            ReadingSectionEntity(
                readingId = readingId,
                sectionType = "REFLECTIONS",
                title = "پرسش‌های تأملی برای خودشناسی",
                content = obj.optString("reflection_questions", ""),
                orderIndex = idx++
            )
        )

        list.add(
            ReadingSectionEntity(
                readingId = readingId,
                sectionType = "GUIDANCE",
                title = "پیشنهادهای عملی و کاربردی",
                content = obj.optString("practical_guidance", ""),
                orderIndex = idx++
            )
        )

        list.add(
            ReadingSectionEntity(
                readingId = readingId,
                sectionType = "DISCLAIMER",
                title = "سلب مسئولیت و اصول استفاده",
                content = obj.optString("disclaimer", "این تحلیل براساس سنتهای نمادین طالعبینی و برای سرگرمی، تأمل شخصی و خودشناسی تهیه شده است. نتیجه، پیشبینی قطعی آینده یا جایگزین مشاوره پزشکی، حقوقی، مالی یا روانشناختی نیست."),
                orderIndex = idx++
            )
        )

        return list
    }
}
