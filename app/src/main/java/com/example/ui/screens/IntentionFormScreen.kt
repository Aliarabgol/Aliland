package com.example.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AutoAwesome
import androidx.compose.material.icons.filled.Warning
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.ui.components.DisclaimerBanner
import com.example.ui.theme.BrightGold
import com.example.ui.theme.BurgundyAccent
import com.example.ui.theme.CardSurface
import com.example.ui.theme.DeepIndigo
import com.example.ui.theme.MidnightNavy
import com.example.ui.theme.MutedLavender
import com.example.ui.theme.SoftIvory
import com.example.ui.theme.WarmGold

@Composable
fun IntentionFormScreen(
    readingType: String,
    astrologySystem: String,
    profile1Id: Long,
    profile2Id: Long?,
    priceAmount: Long,
    onSubmitIntention: (
        category: String,
        question: String,
        contextText: String,
        timeframe: String
    ) -> Unit
) {
    val scrollState = rememberScrollState()

    var category by remember { mutableStateOf(if (readingType == "RELATIONSHIP") "MARRIAGE" else "GENERAL") }
    var primaryQuestion by remember { mutableStateOf("") }
    var contextText by remember { mutableStateOf("") }
    var timeframe by remember { mutableStateOf("THIS_MONTH") }
    var hasAbuseHistory by remember { mutableStateOf(false) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MidnightNavy)
            .verticalScroll(scrollState)
            .padding(16.dp)
    ) {
        Text(
            text = "ثبت نیت و پرسش اختصاصی",
            style = MaterialTheme.typography.titleLarge,
            color = BrightGold,
            fontWeight = FontWeight.Bold
        )

        Text(
            text = "پرسش شفاف به تولید تحلیل دقیق‌تر توسط هوش مصنوعی و محاسبات کمک می‌کند",
            style = MaterialTheme.typography.bodySmall,
            color = MutedLavender
        )

        Spacer(modifier = Modifier.height(16.dp))

        // Category Selector Chips
        Text(
            text = "دسته‌بندی نیت شما",
            style = MaterialTheme.typography.titleMedium,
            color = SoftIvory,
            fontWeight = FontWeight.Bold
        )

        Spacer(modifier = Modifier.height(8.dp))

        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            CategoryChip("ازدواج و رابطه عاطفی", "MARRIAGE", category) { category = it }
            CategoryChip("بازگشت شخص سابق", "EX_RETURN", category) { category = it }
        }
        Spacer(modifier = Modifier.height(6.dp))
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            CategoryChip("شغلی و حرفه‌ای", "CAREER", category) { category = it }
            CategoryChip("مالی و سرمایه‌گذاری", "FINANCIAL", category) { category = it }
        }
        Spacer(modifier = Modifier.height(6.dp))
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            CategoryChip("دو‌راهی و تصمیم‌گیری", "CHOICE", category) { category = it }
            CategoryChip("تحلیل عمومی مسایل", "GENERAL", category) { category = it }
        }

        Spacer(modifier = Modifier.height(20.dp))

        // Safety Warning Banner for EX_RETURN or Abusive relationship contexts
        if (category == "EX_RETURN") {
            Card(
                colors = CardDefaults.cardColors(containerColor = BurgundyAccent.copy(alpha = 0.4f)),
                shape = RoundedCornerShape(12.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Row(
                    modifier = Modifier.padding(12.dp),
                    verticalAlignment = Alignment.Top
                ) {
                    Icon(
                        imageVector = Icons.Default.Warning,
                        contentDescription = "هشدار سلامتی رابطه",
                        tint = BrightGold,
                        modifier = Modifier.size(20.dp)
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = "توجه ایمنی: آسترونیت تحت هیچ شرایطی توصیه به بازگشت یا ماندن در روابط همراه با آزار فیزیکی، تهدید، سلب امنیت یا آسیب روحی نمی‌کند. سلامت روانی و امنیت جانی شما اولویت مطلق است.",
                        style = MaterialTheme.typography.bodySmall,
                        color = SoftIvory
                    )
                }
            }
            Spacer(modifier = Modifier.height(16.dp))
        }

        // Primary Question Text Field
        OutlinedTextField(
            value = primaryQuestion,
            onValueChange = { primaryQuestion = it },
            label = { Text("پرسش اصلی شما") },
            placeholder = {
                Text(
                    when (category) {
                        "MARRIAGE" -> "مثلاً: آیا شرایط چارت برای تعمیق رابطه و ازدواج در این فصل مساعد است؟"
                        "EX_RETURN" -> "مثلاً: پتانسیل‌های ارتباطی و درس‌های رشد در این رابطه چه بوده است؟"
                        "CAREER" -> "مثلاً: آیا تغییر شغل یا شروع پروژه جدید در این زمان همسو با توانمندی من است؟"
                        "FINANCIAL" -> "مثلاً: روند مالی و فرصت‌های سرمایه‌گذاری براساس چارت من چگونه است؟"
                        else -> "پرسش خود را شفاف و دقیق بنویسید..."
                    }
                )
            },
            modifier = Modifier.fillMaxWidth(),
            minLines = 2
        )

        Spacer(modifier = Modifier.height(14.dp))

        // Context / Details Text Field
        OutlinedTextField(
            value = contextText,
            onValueChange = { contextText = it },
            label = { Text("توضیحات تکمیلی و زمینه موضوع (اختیاری)") },
            placeholder = { Text("هرگونه سابقه یا شرایطی که مایلید در تحلیل در نظر گرفته شود...") },
            modifier = Modifier.fillMaxWidth(),
            minLines = 3
        )

        Spacer(modifier = Modifier.height(20.dp))

        // Timeframe Selector
        Text(
            text = "افق زمانی مورد نظر شما",
            style = MaterialTheme.typography.titleMedium,
            color = SoftIvory,
            fontWeight = FontWeight.Bold
        )

        Spacer(modifier = Modifier.height(8.dp))

        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            CategoryChip("همین ماه", "THIS_MONTH", timeframe) { timeframe = it }
            CategoryChip("۳ ماه آینده", "3_MONTHS", timeframe) { timeframe = it }
            CategoryChip("۶ ماه آینده", "6_MONTHS", timeframe) { timeframe = it }
            CategoryChip("یک سال آینده", "1_YEAR", timeframe) { timeframe = it }
        }

        Spacer(modifier = Modifier.height(24.dp))

        // Legal Banner
        DisclaimerBanner()

        Spacer(modifier = Modifier.height(24.dp))

        // Submit Button
        Button(
            onClick = {
                val qText = if (primaryQuestion.isNotBlank()) primaryQuestion else "تحلیل جامع نیت و چارت در موضوع $category"
                onSubmitIntention(category, qText, contextText, timeframe)
            },
            modifier = Modifier
                .fillMaxWidth()
                .height(52.dp),
            colors = ButtonDefaults.buttonColors(containerColor = WarmGold, contentColor = MidnightNavy),
            shape = RoundedCornerShape(12.dp)
        ) {
            Icon(Icons.Default.AutoAwesome, contentDescription = null)
            Spacer(modifier = Modifier.width(8.dp))
            Text(
                text = "پرداخت از کیف‌پول و استخراج تحلیل",
                fontWeight = FontWeight.Bold,
                fontSize = 16.sp
            )
        }
    }
}

@Composable
private fun CategoryChip(
    label: String,
    key: String,
    selectedKey: String,
    onSelect: (String) -> Unit
) {
    val isSel = key == selectedKey
    Surface(
        color = if (isSel) WarmGold else CardSurface,
        shape = RoundedCornerShape(20.dp),
        modifier = Modifier.clickable { onSelect(key) }
    ) {
        Text(
            text = label,
            color = if (isSel) MidnightNavy else SoftIvory,
            style = MaterialTheme.typography.labelMedium,
            fontWeight = if (isSel) FontWeight.Bold else FontWeight.Normal,
            modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp)
        )
    }
}
