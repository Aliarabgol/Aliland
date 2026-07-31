package com.example.ui.screens

import androidx.compose.animation.core.FastOutSlowInEasing
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.tween
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
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AutoAwesome
import androidx.compose.material.icons.filled.Check
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Icon
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.ui.theme.BrightGold
import com.example.ui.theme.CardSurface
import com.example.ui.theme.DeepIndigo
import com.example.ui.theme.MidnightNavy
import com.example.ui.theme.MutedLavender
import com.example.ui.theme.SoftIvory
import com.example.ui.theme.SuccessGreen
import com.example.ui.theme.WarmGold
import kotlinx.coroutines.delay

@Composable
fun ReadingProgressScreen(
    readingId: Long?,
    isCompleted: Boolean,
    onProgressComplete: () -> Unit
) {
    var stepIndex by remember { mutableStateOf(0) }

    val pipelineSteps = listOf(
        "تأیید اطلاعات ورودی و مختصات جغرافیایی",
        "محاسبات نجومی فلکی (غربی، هندی، BaZi)",
        "ذخیره‌سازی Snapshot و محاسبه الگوریتم Checksum",
        "تفسیر نمادین و روانشناختی با مدل Gemini AI",
        "اعمال فیلتر ایمنی، فیلتر عبارات سیاه و سلب مسئولیت",
        "گزارش نهایی با موفقیت آماده گردید!"
    )

    LaunchedEffect(isCompleted) {
        for (i in 0 until pipelineSteps.size - 1) {
            stepIndex = i
            delay(1200)
        }
        stepIndex = 5
        delay(600)
        onProgressComplete()
    }

    val progressValue by animateFloatAsState(
        targetValue = ((stepIndex + 1) / 6f),
        animationSpec = tween(durationMillis = 500, easing = FastOutSlowInEasing)
    )

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MidnightNavy)
            .padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Box(
            modifier = Modifier
                .size(80.dp)
                .clip(CircleShape)
                .background(DeepIndigo),
            contentAlignment = Alignment.Center
        ) {
            if (stepIndex == 5) {
                Icon(
                    imageVector = Icons.Default.Check,
                    contentDescription = null,
                    tint = SuccessGreen,
                    modifier = Modifier.size(44.dp)
                )
            } else {
                CircularProgressIndicator(
                    color = BrightGold,
                    strokeWidth = 3.dp,
                    modifier = Modifier.size(54.dp)
                )
            }
        }

        Spacer(modifier = Modifier.height(20.dp))

        Text(
            text = "در حال تولید گزارش اختصاصی",
            style = MaterialTheme.typography.titleLarge,
            color = SoftIvory,
            fontWeight = FontWeight.Bold
        )

        Spacer(modifier = Modifier.height(6.dp))

        Text(
            text = "گزارش #${readingId ?: "..."}",
            style = MaterialTheme.typography.bodyMedium,
            color = MutedLavender
        )

        Spacer(modifier = Modifier.height(24.dp))

        LinearProgressIndicator(
            progress = progressValue,
            modifier = Modifier
                .fillMaxWidth()
                .height(8.dp)
                .clip(RoundedCornerShape(4.dp)),
            color = WarmGold,
            trackColor = CardSurface
        )

        Spacer(modifier = Modifier.height(28.dp))

        // Step list
        Column(
            modifier = Modifier.fillMaxWidth(),
            verticalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            pipelineSteps.forEachIndexed { idx, label ->
                val isDone = idx < stepIndex || (idx == 5 && stepIndex == 5)
                val isCurrent = idx == stepIndex && stepIndex < 5

                Surface(
                    color = if (isCurrent) DeepIndigo else CardSurface,
                    shape = RoundedCornerShape(10.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Row(
                        modifier = Modifier.padding(12.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Box(
                            modifier = Modifier
                                .size(24.dp)
                                .clip(CircleShape)
                                .background(
                                    when {
                                        isDone -> SuccessGreen
                                        isCurrent -> WarmGold
                                        else -> CardSurface
                                    }
                                ),
                            contentAlignment = Alignment.Center
                        ) {
                            if (isDone) {
                                Icon(Icons.Default.Check, contentDescription = null, tint = SoftIvory, modifier = Modifier.size(16.dp))
                            } else {
                                Text("${idx + 1}", style = MaterialTheme.typography.labelSmall, color = SoftIvory)
                            }
                        }

                        Spacer(modifier = Modifier.width(12.dp))

                        Text(
                            text = label,
                            style = MaterialTheme.typography.bodyMedium,
                            color = if (isCurrent || isDone) SoftIvory else MutedLavender,
                            fontWeight = if (isCurrent) FontWeight.Bold else FontWeight.Normal
                        )
                    }
                }
            }
        }
    }
}
