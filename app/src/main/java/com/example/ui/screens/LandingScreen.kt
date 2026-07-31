package com.example.ui.screens

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
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
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AutoAwesome
import androidx.compose.material.icons.filled.CheckCircle
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
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.R
import com.example.ui.components.DisclaimerBanner
import com.example.ui.theme.BrightGold
import com.example.ui.theme.BurgundyAccent
import com.example.ui.theme.CardSurface
import com.example.ui.theme.DeepIndigo
import com.example.ui.theme.GoldGradientEnd
import com.example.ui.theme.GoldGradientStart
import com.example.ui.theme.MidnightNavy
import com.example.ui.theme.MutedLavender
import com.example.ui.theme.SoftIvory
import com.example.ui.theme.WarmGold

@Composable
fun LandingScreen(
    onStartClick: () -> Unit,
    onLearnMoreClick: () -> Unit
) {
    val scrollState = rememberScrollState()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MidnightNavy)
            .verticalScroll(scrollState)
            .padding(bottom = 32.dp)
    ) {
        // Hero Section
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(280.dp)
        ) {
            Image(
                painter = painterResource(id = R.drawable.img_astrology_hero_1785448998239),
                contentDescription = "Hero Banner",
                contentScale = ContentScale.Crop,
                modifier = Modifier.fillMaxSize()
            )

            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .background(
                        Brush.verticalGradient(
                            colors = listOf(
                                MidnightNavy.copy(alpha = 0.2f),
                                MidnightNavy.copy(alpha = 0.85f),
                                MidnightNavy
                            )
                        )
                    )
            )

            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(20.dp),
                verticalArrangement = Arrangement.Bottom,
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Surface(
                    color = DeepIndigo.copy(alpha = 0.8f),
                    shape = RoundedCornerShape(20.dp)
                ) {
                    Text(
                        text = "پلتفرم جامع طالع‌بینی و فال شخصی‌سازی‌شده",
                        style = MaterialTheme.typography.labelMedium,
                        color = BrightGold,
                        modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp)
                    )
                }

                Spacer(modifier = Modifier.height(8.dp))

                Text(
                    text = "آسترونیت | AstroNiyat",
                    style = MaterialTheme.typography.displayMedium,
                    color = SoftIvory,
                    fontWeight = FontWeight.Bold,
                    textAlign = TextAlign.Center
                )

                Spacer(modifier = Modifier.height(6.dp))

                Text(
                    text = "تحلیل دقیق چارت‌های نجومی غربی، هندی (ویدیک) و چینی (BaZi) برپایه محاسبات واقعی فلکی و هوش مصنوعی",
                    style = MaterialTheme.typography.bodyMedium,
                    color = MutedLavender,
                    textAlign = TextAlign.Center
                )
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        // Primary Action Buttons
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 20.dp),
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            Button(
                onClick = onStartClick,
                modifier = Modifier
                    .weight(1f)
                    .height(52.dp),
                colors = ButtonDefaults.buttonColors(
                    containerColor = WarmGold,
                    contentColor = MidnightNavy
                ),
                shape = RoundedCornerShape(12.dp)
            ) {
                Icon(imageVector = Icons.Default.AutoAwesome, contentDescription = null)
                Spacer(modifier = Modifier.width(6.dp))
                Text("شروع دریافت تحلیل", fontWeight = FontWeight.Bold, fontSize = 15.sp)
            }

            OutlinedButton(
                onClick = onLearnMoreClick,
                modifier = Modifier
                    .weight(1f)
                    .height(52.dp),
                shape = RoundedCornerShape(12.dp)
            ) {
                Text("شناخت سیستم‌ها", color = SoftIvory, fontSize = 15.sp)
            }
        }

        Spacer(modifier = Modifier.height(28.dp))

        // Core Features Section
        Column(modifier = Modifier.padding(horizontal = 20.dp)) {
            Text(
                text = "خدمات اصلی آسترونیت",
                style = MaterialTheme.typography.titleLarge,
                color = BrightGold,
                fontWeight = FontWeight.Bold
            )

            Spacer(modifier = Modifier.height(12.dp))

            ServiceCardItem(
                title = "چارت زادروز شخصی (Natal Chart)",
                description = "محاسبه دقیق زاویه خورشید، ماه، طالع، خانهها و عناصر غالب برپایه موقعیت جغرافیایی و زمان تولد.",
                icon = Icons.Default.Star,
                price = "۴۵,۰۰۰ تومان"
            )

            Spacer(modifier = Modifier.height(10.dp))

            ServiceCardItem(
                title = "تحلیل سازگاری و روابط (Synastry)",
                description = "تطبیق چارت دو فرد، محاسبه شاخص اشتکوت ۳۶ نمرهای هندی و سنجش هارمونی احساسی و فکری.",
                icon = Icons.Default.Favorite,
                price = "۶۵,۰۰۰ تومان"
            )

            Spacer(modifier = Modifier.height(10.dp))

            ServiceCardItem(
                title = "فال نیت اختصاصی (Intention Reading)",
                description = "پاسخ تحلیلی به پرسشهای کلیدی شغلی، مالی، عاطفی و انتخابهای مهم براساس ترکیب چارت و هوش مصنوعی.",
                icon = Icons.Default.Psychology,
                price = "۵۰,۰۰۰ تومان"
            )

            Spacer(modifier = Modifier.height(10.dp))

            ServiceCardItem(
                title = "پیش‌بینی و ترانزیت‌های زمانی (Timing)",
                description = "بررسی دوره‌های داشا (Vedic) و ستون‌های زمانی BaZi برای تشخیص فرصت‌های اقدام و رشد شخصی.",
                icon = Icons.Default.Schedule,
                price = "۵۵,۰۰۰ تومان"
            )
        }

        Spacer(modifier = Modifier.height(28.dp))

        // Comparison Table Section
        Column(modifier = Modifier.padding(horizontal = 20.dp)) {
            Text(
                text = "مقایسه سیستم‌های طالع‌بینی پشتیبانی‌شده",
                style = MaterialTheme.typography.titleLarge,
                color = BrightGold,
                fontWeight = FontWeight.Bold
            )

            Spacer(modifier = Modifier.height(12.dp))

            Card(
                colors = CardDefaults.cardColors(containerColor = CardSurface),
                shape = RoundedCornerShape(16.dp)
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    ComparisonRow("سیستم نجومی غربی (Tropical)", "تمرکز بر روانشناسی فردی، خانه‌ها و زوایای بین سیارگان")
                    Spacer(modifier = Modifier.height(8.dp))
                    ComparisonRow("سیستم هندی (Vedic - Sidereal)", "مبتنی بر آیانهامشا (Lahiri)، ناکشاتراها و دوره‌های زمان‌بندی داشا")
                    Spacer(modifier = Modifier.height(8.dp))
                    ComparisonRow("سیستم چینی (BaZi - ۴ ستون)", "سنجش تعادل ۵ عنصر اصلی (چوب، آتش، خاک، فلز، آب) و Day Master")
                }
            }
        }

        Spacer(modifier = Modifier.height(28.dp))

        // Ethical Disclaimer Banner
        Column(modifier = Modifier.padding(horizontal = 20.dp)) {
            DisclaimerBanner()
        }
    }
}

@Composable
private fun ServiceCardItem(
    title: String,
    description: String,
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    price: String
) {
    Card(
        colors = CardDefaults.cardColors(containerColor = CardSurface),
        shape = RoundedCornerShape(14.dp)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(14.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Box(
                modifier = Modifier
                    .size(44.dp)
                    .clip(CircleShape)
                    .background(DeepIndigo),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = icon,
                    contentDescription = null,
                    tint = BrightGold,
                    modifier = Modifier.size(22.dp)
                )
            }

            Spacer(modifier = Modifier.width(12.dp))

            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = title,
                    style = MaterialTheme.typography.titleMedium,
                    color = SoftIvory,
                    fontWeight = FontWeight.Bold
                )
                Spacer(modifier = Modifier.height(2.dp))
                Text(
                    text = description,
                    style = MaterialTheme.typography.bodySmall,
                    color = MutedLavender
                )
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = price,
                    style = MaterialTheme.typography.labelMedium,
                    color = WarmGold,
                    fontWeight = FontWeight.Bold
                )
            }
        }
    }
}

@Composable
private fun ComparisonRow(title: String, desc: String) {
    Row(verticalAlignment = Alignment.Top) {
        Icon(
            imageVector = Icons.Default.CheckCircle,
            contentDescription = null,
            tint = WarmGold,
            modifier = Modifier
                .size(18.dp)
                .padding(top = 2.dp)
        )
        Spacer(modifier = Modifier.width(8.dp))
        Column {
            Text(text = title, style = MaterialTheme.typography.labelLarge, color = SoftIvory, fontWeight = FontWeight.Bold)
            Text(text = desc, style = MaterialTheme.typography.bodySmall, color = MutedLavender)
        }
    }
}
