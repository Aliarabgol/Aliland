package com.example.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
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
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material.icons.filled.Psychology
import androidx.compose.material.icons.filled.Schedule
import androidx.compose.material.icons.filled.Star
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.RadioButton
import androidx.compose.material3.RadioButtonDefaults
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
import com.example.data.local.entities.BirthProfileEntity
import com.example.ui.components.formatTomans
import com.example.ui.theme.BrightGold
import com.example.ui.theme.CardSurface
import com.example.ui.theme.DeepIndigo
import com.example.ui.theme.MidnightNavy
import com.example.ui.theme.MutedLavender
import com.example.ui.theme.SoftIvory
import com.example.ui.theme.WarmGold

@Composable
fun ServiceSelectScreen(
    profiles: List<BirthProfileEntity>,
    onProceedToIntention: (
        readingType: String,
        astrologySystem: String,
        profile1Id: Long,
        profile2Id: Long?,
        price: Long
    ) -> Unit,
    onAddProfileFirst: () -> Unit
) {
    val scrollState = rememberScrollState()

    var selectedReadingType by remember { mutableStateOf("NATAL") } // NATAL, RELATIONSHIP, NIYAT, TIMING
    var selectedSystem by remember { mutableStateOf("COMBINED") } // WESTERN, VEDIC, BAZI, COMBINED
    var selectedP1Id by remember { mutableStateOf(profiles.firstOrNull()?.id ?: 0L) }
    var selectedP2Id by remember { mutableStateOf<Long?>(null) }

    val currentPrice = when (selectedReadingType) {
        "RELATIONSHIP" -> 65000L
        "NIYAT" -> 50000L
        "TIMING" -> 55000L
        else -> 45000L
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MidnightNavy)
            .verticalScroll(scrollState)
            .padding(16.dp)
    ) {
        Text(
            text = "انتخاب نوع تحلیل و سیستم نجومی",
            style = MaterialTheme.typography.titleLarge,
            color = BrightGold,
            fontWeight = FontWeight.Bold
        )

        Text(
            text = "نوع گزارش مورد نظر و سیستم نجومی پایه را انتخاب کنید",
            style = MaterialTheme.typography.bodySmall,
            color = MutedLavender
        )

        Spacer(modifier = Modifier.height(16.dp))

        // 1. Select Profile(s)
        Text(
            text = "۱. انتخاب پروفایل تولد اصلی",
            style = MaterialTheme.typography.titleMedium,
            color = SoftIvory,
            fontWeight = FontWeight.Bold
        )

        Spacer(modifier = Modifier.height(8.dp))

        if (profiles.isEmpty()) {
            Card(
                colors = CardDefaults.cardColors(containerColor = CardSurface),
                shape = RoundedCornerShape(12.dp),
                modifier = Modifier
                    .fillMaxWidth()
                    .clickable { onAddProfileFirst() }
            ) {
                Text(
                    text = "پروفایلی موجود نیست. ابتدا حداقل یک پروفایل تولد ثبت کنید.",
                    color = WarmGold,
                    modifier = Modifier.padding(14.dp)
                )
            }
        } else {
            Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
                profiles.forEach { p ->
                    val isSelected = p.id == selectedP1Id
                    Surface(
                        color = if (isSelected) DeepIndigo else CardSurface,
                        shape = RoundedCornerShape(10.dp),
                        modifier = Modifier
                            .fillMaxWidth()
                            .border(
                                width = if (isSelected) 2.dp else 0.dp,
                                color = if (isSelected) WarmGold else CardSurface,
                                shape = RoundedCornerShape(10.dp)
                            )
                            .clickable { selectedP1Id = p.id }
                    ) {
                        Row(
                            modifier = Modifier.padding(12.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            RadioButton(
                                selected = isSelected,
                                onClick = { selectedP1Id = p.id },
                                colors = RadioButtonDefaults.colors(selectedColor = WarmGold)
                            )
                            Spacer(modifier = Modifier.width(8.dp))
                            Text("${p.title} (${p.firstName} - ${p.birthDateOriginal})", color = SoftIvory)
                        }
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(20.dp))

        // 2. Select Service Category
        Text(
            text = "۲. انتخاب نوع تحلیل",
            style = MaterialTheme.typography.titleMedium,
            color = SoftIvory,
            fontWeight = FontWeight.Bold
        )

        Spacer(modifier = Modifier.height(8.dp))

        ServiceOptionCard(
            title = "تحلیل جامع چارت تولد (Natal Chart)",
            desc = "بررسی کامل ویژگی‌های شخصیت، زوایای خورشید و ماه، خانه‌ها و پتانسیل‌های فردی.",
            typeKey = "NATAL",
            price = "۴۵,۰۰۰ تومان",
            isSelected = selectedReadingType == "NATAL",
            onSelect = { selectedReadingType = "NATAL" }
        )

        Spacer(modifier = Modifier.height(8.dp))

        ServiceOptionCard(
            title = "تحلیل سازگاری و روابط عاطفی (Synastry)",
            desc = "سنجش تناسب دو چارت، تطبیق اشتکوت ۳۶ نمره‌ای هندی و هارمونی فکری.",
            typeKey = "RELATIONSHIP",
            price = "۶۵,۰۰۰ تومان",
            isSelected = selectedReadingType == "RELATIONSHIP",
            onSelect = { selectedReadingType = "RELATIONSHIP" }
        )

        Spacer(modifier = Modifier.height(8.dp))

        ServiceOptionCard(
            title = "فال نیت اختصاصی (Intention Reading)",
            desc = "پاسخ تحلیلی به سوالات خاص ازدواج، بازگشت، شغل، مالی و تصمیم‌گیری‌های حساس.",
            typeKey = "NIYAT",
            price = "۵۰,۰۰۰ تومان",
            isSelected = selectedReadingType == "NIYAT",
            onSelect = { selectedReadingType = "NIYAT" }
        )

        Spacer(modifier = Modifier.height(8.dp))

        ServiceOptionCard(
            title = "پیش‌بینی و زمان‌بندی (Timing & Transits)",
            desc = "بررسی دوره‌های داشا، ستون‌های زمانی BaZi و زمان‌های مناسب برای اقدام.",
            typeKey = "TIMING",
            price = "۵۵,۰۰۰ تومان",
            isSelected = selectedReadingType == "TIMING",
            onSelect = { selectedReadingType = "TIMING" }
        )

        // If Relationship is selected, show Second Profile Picker
        if (selectedReadingType == "RELATIONSHIP") {
            Spacer(modifier = Modifier.height(20.dp))
            Text(
                text = "انتخاب پروفایل طرف مقابل",
                style = MaterialTheme.typography.titleMedium,
                color = BrightGold,
                fontWeight = FontWeight.Bold
            )
            Spacer(modifier = Modifier.height(8.dp))

            val otherProfiles = profiles.filter { it.id != selectedP1Id }
            if (otherProfiles.isEmpty()) {
                Text(
                    text = "برای تحلیل رابطه نیاز به ثبت پروفایل دوم دارید. لطفاً یک پروفایل جدید اضافه کنید.",
                    color = MaterialTheme.colorScheme.error,
                    style = MaterialTheme.typography.bodySmall
                )
            } else {
                otherProfiles.forEach { p ->
                    val isSelected2 = p.id == selectedP2Id
                    Surface(
                        color = if (isSelected2) DeepIndigo else CardSurface,
                        shape = RoundedCornerShape(10.dp),
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(vertical = 4.dp)
                            .clickable { selectedP2Id = p.id }
                    ) {
                        Row(
                            modifier = Modifier.padding(12.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            RadioButton(
                                selected = isSelected2,
                                onClick = { selectedP2Id = p.id },
                                colors = RadioButtonDefaults.colors(selectedColor = WarmGold)
                            )
                            Text("${p.title} (${p.firstName})", color = SoftIvory)
                        }
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(20.dp))

        // 3. Select Astrology System
        Text(
            text = "۳. انتخاب موتور محاسباتی نجومی",
            style = MaterialTheme.typography.titleMedium,
            color = SoftIvory,
            fontWeight = FontWeight.Bold
        )

        Spacer(modifier = Modifier.height(8.dp))

        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            SystemChip("ترکیبی (پیشنهادی)", "COMBINED", selectedSystem) { selectedSystem = it }
            SystemChip("غربی (Tropical)", "WESTERN", selectedSystem) { selectedSystem = it }
        }
        Spacer(modifier = Modifier.height(6.dp))
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            SystemChip("هندی (Vedic - Sidereal)", "VEDIC", selectedSystem) { selectedSystem = it }
            SystemChip("چینی (BaZi - ۴ ستون)", "BAZI", selectedSystem) { selectedSystem = it }
        }

        Spacer(modifier = Modifier.height(28.dp))

        // Proceed Button
        Button(
            onClick = {
                if (selectedP1Id != 0L) {
                    onProceedToIntention(
                        selectedReadingType,
                        selectedSystem,
                        selectedP1Id,
                        selectedP2Id,
                        currentPrice
                    )
                }
            },
            enabled = selectedP1Id != 0L,
            modifier = Modifier
                .fillMaxWidth()
                .height(52.dp),
            colors = ButtonDefaults.buttonColors(containerColor = WarmGold, contentColor = MidnightNavy),
            shape = RoundedCornerShape(12.dp)
        ) {
            Icon(Icons.Default.AutoAwesome, contentDescription = null)
            Spacer(modifier = Modifier.width(8.dp))
            Text(
                text = "ادامه و ثبت نیت (${formatTomans(currentPrice)} تومان)",
                fontWeight = FontWeight.Bold,
                fontSize = 16.sp
            )
        }
    }
}

@Composable
private fun ServiceOptionCard(
    title: String,
    desc: String,
    typeKey: String,
    price: String,
    isSelected: Boolean,
    onSelect: () -> Unit
) {
    Surface(
        color = if (isSelected) DeepIndigo else CardSurface,
        shape = RoundedCornerShape(12.dp),
        modifier = Modifier
            .fillMaxWidth()
            .border(
                width = if (isSelected) 2.dp else 0.dp,
                color = if (isSelected) WarmGold else CardSurface,
                shape = RoundedCornerShape(12.dp)
            )
            .clickable { onSelect() }
    ) {
        Row(
            modifier = Modifier.padding(14.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            RadioButton(
                selected = isSelected,
                onClick = onSelect,
                colors = RadioButtonDefaults.colors(selectedColor = WarmGold)
            )
            Spacer(modifier = Modifier.width(10.dp))
            Column(modifier = Modifier.weight(1f)) {
                Text(text = title, style = MaterialTheme.typography.titleSmall, color = SoftIvory, fontWeight = FontWeight.Bold)
                Text(text = desc, style = MaterialTheme.typography.bodySmall, color = MutedLavender)
            }
            Text(text = price, style = MaterialTheme.typography.labelSmall, color = BrightGold, fontWeight = FontWeight.Bold)
        }
    }
}

@Composable
private fun SystemChip(
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
            modifier = Modifier.padding(horizontal = 14.dp, vertical = 8.dp)
        )
    }
}
