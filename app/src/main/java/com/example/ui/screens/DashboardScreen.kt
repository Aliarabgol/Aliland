package com.example.ui.screens

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.AutoAwesome
import androidx.compose.material.icons.filled.ChevronLeft
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.Psychology
import androidx.compose.material.icons.filled.Schedule
import androidx.compose.material.icons.filled.Star
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.PathEffect
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.local.entities.BirthProfileEntity
import com.example.data.local.entities.ReadingEntity
import com.example.data.local.entities.UserEntity
import com.example.ui.theme.BrightGold
import com.example.ui.theme.BurgundyAccent
import com.example.ui.theme.CardSurface
import com.example.ui.theme.DeepIndigo
import com.example.ui.theme.MidnightNavy
import com.example.ui.theme.MutedLavender
import com.example.ui.theme.SoftIvory
import com.example.ui.theme.WarmGold

@Composable
fun DashboardScreen(
    user: UserEntity?,
    profiles: List<BirthProfileEntity>,
    readings: List<ReadingEntity>,
    onNavigateToServices: () -> Unit,
    onNavigateToProfiles: () -> Unit,
    onNavigateToReadingDetail: (Long) -> Unit
) {
    val scrollState = rememberScrollState()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MidnightNavy)
            .verticalScroll(scrollState)
            .padding(16.dp)
    ) {
        // Sophisticated Dark Cosmic Greeting Card
        Card(
            colors = CardDefaults.cardColors(containerColor = Color.Transparent),
            shape = RoundedCornerShape(28.dp),
            border = BorderStroke(1.dp, MutedLavender.copy(alpha = 0.15f)),
            modifier = Modifier
                .fillMaxWidth()
                .background(
                    brush = Brush.linearGradient(
                        colors = listOf(DeepIndigo, MidnightNavy)
                    ),
                    shape = RoundedCornerShape(28.dp)
                )
        ) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(20.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Text(
                    text = "وضعیت امروز کیهانی",
                    style = MaterialTheme.typography.bodySmall,
                    color = MutedLavender
                )
                Spacer(modifier = Modifier.height(2.dp))
                Text(
                    text = "فرصت‌های درخشان",
                    style = MaterialTheme.typography.titleLarge,
                    color = WarmGold,
                    fontWeight = FontWeight.Bold
                )

                Spacer(modifier = Modifier.height(16.dp))

                // Orbital Moon Transit Visual
                Box(
                    modifier = Modifier.size(140.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Canvas(modifier = Modifier.fillMaxSize()) {
                        val center = Offset(size.width / 2, size.height / 2)
                        val radius = size.width / 2.2f

                        // Outer dashed orbit
                        drawCircle(
                            color = WarmGold.copy(alpha = 0.35f),
                            radius = radius,
                            center = center,
                            style = Stroke(
                                width = 1.5.dp.toPx(),
                                pathEffect = PathEffect.dashPathEffect(floatArrayOf(12f, 8f))
                            )
                        )

                        // Inner subtle ring
                        drawCircle(
                            color = MutedLavender.copy(alpha = 0.2f),
                            radius = radius * 0.75f,
                            center = center,
                            style = Stroke(width = 1.dp.toPx())
                        )

                        // Orbital Dot at top
                        drawCircle(
                            color = WarmGold,
                            radius = 5.dp.toPx(),
                            center = Offset(center.x, center.y - radius)
                        )
                    }

                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text(
                            text = "🌙",
                            fontSize = 28.sp
                        )
                        Spacer(modifier = Modifier.height(2.dp))
                        Text(
                            text = "ماه در عقرب",
                            style = MaterialTheme.typography.labelSmall,
                            color = MutedLavender,
                            fontSize = 11.sp
                        )
                    }
                }

                Spacer(modifier = Modifier.height(18.dp))

                // Cosmic Metrics Row (Love, Work, Energy)
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceEvenly,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text(
                            text = "عشق",
                            style = MaterialTheme.typography.labelSmall,
                            color = MutedLavender,
                            fontSize = 10.sp
                        )
                        Text(
                            text = "۸۵٪",
                            style = MaterialTheme.typography.titleMedium,
                            color = WarmGold,
                            fontWeight = FontWeight.Bold
                        )
                    }

                    Box(
                        modifier = Modifier
                            .width(1.dp)
                            .height(24.dp)
                            .background(MutedLavender.copy(alpha = 0.2f))
                    )

                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text(
                            text = "کار",
                            style = MaterialTheme.typography.labelSmall,
                            color = MutedLavender,
                            fontSize = 10.sp
                        )
                        Text(
                            text = "۶۲٪",
                            style = MaterialTheme.typography.titleMedium,
                            color = WarmGold,
                            fontWeight = FontWeight.Bold
                        )
                    }

                    Box(
                        modifier = Modifier
                            .width(1.dp)
                            .height(24.dp)
                            .background(MutedLavender.copy(alpha = 0.2f))
                    )

                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text(
                            text = "انرژی",
                            style = MaterialTheme.typography.labelSmall,
                            color = MutedLavender,
                            fontSize = 10.sp
                        )
                        Text(
                            text = "۹۴٪",
                            style = MaterialTheme.typography.titleMedium,
                            color = WarmGold,
                            fontWeight = FontWeight.Bold
                        )
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(20.dp))

        // Quick Actions Row
        Text(
            text = "درخواست تحلیل جدید",
            style = MaterialTheme.typography.titleMedium,
            color = BrightGold,
            fontWeight = FontWeight.Bold
        )

        Spacer(modifier = Modifier.height(10.dp))

        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            QuickServiceBox(
                title = "چارت تولد",
                system = "غربی / هندی",
                icon = Icons.Default.Star,
                modifier = Modifier.weight(1f),
                onClick = onNavigateToServices
            )

            QuickServiceBox(
                title = "سازگاری رابطه",
                system = "اشتکوت ۳۶ نمره",
                icon = Icons.Default.Favorite,
                modifier = Modifier.weight(1f),
                onClick = onNavigateToServices
            )

            QuickServiceBox(
                title = "فال نیت",
                system = "تحلیل تحلیلی AI",
                icon = Icons.Default.Psychology,
                modifier = Modifier.weight(1f),
                onClick = onNavigateToServices
            )
        }

        Spacer(modifier = Modifier.height(24.dp))

        // Birth Profiles Row
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = "پروفایل‌های ثبت‌شده (${profiles.size})",
                style = MaterialTheme.typography.titleMedium,
                color = BrightGold,
                fontWeight = FontWeight.Bold
            )
            Text(
                text = "+ افزودن پروفایل",
                style = MaterialTheme.typography.labelLarge,
                color = WarmGold,
                modifier = Modifier.clickable { onNavigateToProfiles() }
            )
        }

        Spacer(modifier = Modifier.height(10.dp))

        if (profiles.isEmpty()) {
            Card(
                colors = CardDefaults.cardColors(containerColor = CardSurface),
                shape = RoundedCornerShape(12.dp),
                modifier = Modifier
                    .fillMaxWidth()
                    .clickable { onNavigateToProfiles() }
            ) {
                Row(
                    modifier = Modifier.padding(16.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(Icons.Default.Add, contentDescription = null, tint = WarmGold)
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = "هنوز پروفایلی ثبت نکرده‌اید. برای شروع یک پروفایل تولد ثبت کنید.",
                        style = MaterialTheme.typography.bodySmall,
                        color = MutedLavender
                    )
                }
            }
        } else {
            LazyRow(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                items(profiles) { profile ->
                    ProfileMiniCard(profile = profile)
                }
            }
        }

        Spacer(modifier = Modifier.height(24.dp))

        // Recent Readings List
        Text(
            text = "آخرین گزارش‌های دریافت شده",
            style = MaterialTheme.typography.titleMedium,
            color = BrightGold,
            fontWeight = FontWeight.Bold
        )

        Spacer(modifier = Modifier.height(10.dp))

        if (readings.isEmpty()) {
            Card(
                colors = CardDefaults.cardColors(containerColor = CardSurface),
                shape = RoundedCornerShape(12.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Text(
                    text = "هنوز گزارشی ثبت نکرده‌اید. اولین فال یا چارت خود را دریافت کنید.",
                    style = MaterialTheme.typography.bodySmall,
                    color = MutedLavender,
                    modifier = Modifier.padding(16.dp)
                )
            }
        } else {
            Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                readings.take(5).forEach { reading ->
                    ReadingHistoryItem(reading = reading, onClick = { onNavigateToReadingDetail(reading.id) })
                }
            }
        }
    }
}

@Composable
private fun QuickServiceBox(
    title: String,
    system: String,
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    modifier: Modifier = Modifier,
    onClick: () -> Unit
) {
    Card(
        colors = CardDefaults.cardColors(containerColor = DeepIndigo),
        shape = RoundedCornerShape(20.dp),
        border = BorderStroke(1.dp, MutedLavender.copy(alpha = 0.12f)),
        modifier = modifier.clickable { onClick() }
    ) {
        Column(
            modifier = Modifier.padding(14.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Box(
                modifier = Modifier
                    .size(42.dp)
                    .clip(CircleShape)
                    .background(MidnightNavy),
                contentAlignment = Alignment.Center
            ) {
                Icon(imageVector = icon, contentDescription = null, tint = WarmGold, modifier = Modifier.size(22.dp))
            }

            Spacer(modifier = Modifier.height(10.dp))

            Text(text = title, style = MaterialTheme.typography.labelLarge, color = SoftIvory, fontWeight = FontWeight.Bold)
            Spacer(modifier = Modifier.height(2.dp))
            Text(text = system, style = MaterialTheme.typography.labelSmall, color = MutedLavender)
        }
    }
}

@Composable
private fun ProfileMiniCard(profile: BirthProfileEntity) {
    Card(
        colors = CardDefaults.cardColors(containerColor = DeepIndigo),
        shape = RoundedCornerShape(18.dp),
        border = BorderStroke(1.dp, MutedLavender.copy(alpha = 0.12f)),
        modifier = Modifier.width(140.dp)
    ) {
        Column(modifier = Modifier.padding(14.dp)) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(Icons.Default.Person, contentDescription = null, tint = WarmGold, modifier = Modifier.size(16.dp))
                Spacer(modifier = Modifier.width(4.dp))
                Text(text = profile.title, style = MaterialTheme.typography.labelLarge, color = SoftIvory, fontWeight = FontWeight.Bold)
            }
            Spacer(modifier = Modifier.height(4.dp))
            Text(text = profile.firstName, style = MaterialTheme.typography.bodyMedium, color = SoftIvory)
            Text(text = profile.birthDateOriginal, style = MaterialTheme.typography.labelSmall, color = MutedLavender)
            Text(text = profile.birthCity, style = MaterialTheme.typography.labelSmall, color = MutedLavender)
        }
    }
}

@Composable
fun ReadingHistoryItem(reading: ReadingEntity, onClick: () -> Unit) {
    Card(
        colors = CardDefaults.cardColors(containerColor = DeepIndigo),
        shape = RoundedCornerShape(18.dp),
        border = BorderStroke(1.dp, MutedLavender.copy(alpha = 0.12f)),
        modifier = Modifier
            .fillMaxWidth()
            .clickable { onClick() }
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(14.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column {
                Text(
                    text = "گزارش #${reading.id} - ${reading.readingType} (${reading.astrologySystem})",
                    style = MaterialTheme.typography.titleSmall,
                    color = SoftIvory,
                    fontWeight = FontWeight.Bold
                )
                Spacer(modifier = Modifier.height(2.dp))
                Text(
                    text = "وضعیت: ${if (reading.status == "COMPLETED") "تکمیل‌شده" else "در حال تحلیل"}",
                    style = MaterialTheme.typography.bodySmall,
                    color = BrightGold
                )
            }
            Icon(Icons.Default.ChevronLeft, contentDescription = "مشاهده", tint = WarmGold)
        }
    }
}
