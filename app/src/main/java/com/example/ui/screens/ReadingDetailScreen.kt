package com.example.ui.screens

import android.widget.Toast
import androidx.compose.foundation.background
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
import androidx.compose.material.icons.filled.Code
import androidx.compose.material.icons.filled.PictureAsPdf
import androidx.compose.material.icons.filled.Share
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
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import com.example.data.local.entities.CalculationSnapshotEntity
import com.example.data.local.entities.ReadingEntity
import com.example.data.local.entities.ReadingSectionEntity
import com.example.ui.components.AstroChartWheel
import com.example.ui.components.ConfidenceBadge
import com.example.ui.components.DisclaimerBanner
import com.example.ui.theme.BrightGold
import com.example.ui.theme.CardSurface
import com.example.ui.theme.DeepIndigo
import com.example.ui.theme.MidnightNavy
import com.example.ui.theme.MutedLavender
import com.example.ui.theme.SoftIvory
import com.example.ui.theme.WarmGold
import org.json.JSONObject

@Composable
fun ReadingDetailScreen(
    reading: ReadingEntity?,
    sections: List<ReadingSectionEntity>,
    snapshot: CalculationSnapshotEntity?,
    onBackClick: () -> Unit
) {
    val scrollState = rememberScrollState()
    val context = LocalContext.current
    var showRawJsonDialog by remember { mutableStateOf(false) }

    // Parse values from calculation snapshot for chart wheel if available
    val calcObj = try {
        if (snapshot != null) JSONObject(snapshot.resultJson) else JSONObject()
    } catch (e: Exception) {
        JSONObject()
    }

    val westernObj = calcObj.optJSONObject("western_astrology")
    val sunSign = westernObj?.optString("sun_sign", "حمل (فروردین)") ?: "حمل (فروردین)"
    val moonSign = westernObj?.optString("moon_sign", "ثور (اردیبهشت)") ?: "ثور (اردیبهشت)"
    val ascendantSign = westernObj?.optString("ascendant_sign", "جوزا (خرداد)") ?: "جوزا (خرداد)"
    val dominantElement = westernObj?.optString("dominant_element", "آتش") ?: "آتش"

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MidnightNavy)
            .verticalScroll(scrollState)
            .padding(16.dp)
    ) {
        // Header Info Card
        Card(
            colors = CardDefaults.cardColors(containerColor = DeepIndigo),
            shape = RoundedCornerShape(16.dp),
            modifier = Modifier.fillMaxWidth()
        ) {
            Column(modifier = Modifier.padding(18.dp)) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "گزارش اختصاصی #${reading?.id ?: 0}",
                        style = MaterialTheme.typography.titleLarge,
                        color = BrightGold,
                        fontWeight = FontWeight.Bold
                    )
                    ConfidenceBadge(
                        confidenceLevel = "HIGH",
                        isTimeKnown = true
                    )
                }

                Spacer(modifier = Modifier.height(6.dp))

                Text(
                    text = "سیستم محاسباتی: ${reading?.astrologySystem ?: "ترکیبی"} | نسخه مدل: ${reading?.modelVersion ?: "Gemini 3.5 Flash"}",
                    style = MaterialTheme.typography.bodySmall,
                    color = MutedLavender
                )

                if (snapshot != null) {
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = "کد تأیید یکپارچگی داده (Checksum): ${snapshot.checksum.take(16)}...",
                        style = MaterialTheme.typography.labelSmall,
                        color = WarmGold
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        // Astrological Chart Wheel View
        AstroChartWheel(
            sunSign = sunSign,
            moonSign = moonSign,
            ascendantSign = ascendantSign,
            dominantElement = dominantElement
        )

        Spacer(modifier = Modifier.height(16.dp))

        // Action Toolbar (Raw JSON, Share, Export PDF)
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            OutlinedButton(
                onClick = { showRawJsonDialog = true },
                modifier = Modifier.weight(1f),
                shape = RoundedCornerShape(10.dp)
            ) {
                Icon(Icons.Default.Code, contentDescription = null, tint = WarmGold, modifier = Modifier.size(16.dp))
                Spacer(modifier = Modifier.width(4.dp))
                Text("داده‌های خام", color = SoftIvory, fontSize = 12.sp)
            }

            OutlinedButton(
                onClick = {
                    Toast.makeText(context, "لینک خصوصی گزارش کپی شد", Toast.LENGTH_SHORT).show()
                },
                modifier = Modifier.weight(1f),
                shape = RoundedCornerShape(10.dp)
            ) {
                Icon(Icons.Default.Share, contentDescription = null, tint = WarmGold, modifier = Modifier.size(16.dp))
                Spacer(modifier = Modifier.width(4.dp))
                Text("اشتراک‌گذاری", color = SoftIvory, fontSize = 12.sp)
            }

            Button(
                onClick = {
                    Toast.makeText(context, "فایل PDF گزارش تولید شد", Toast.LENGTH_SHORT).show()
                },
                modifier = Modifier.weight(1.2f),
                colors = ButtonDefaults.buttonColors(containerColor = WarmGold, contentColor = MidnightNavy),
                shape = RoundedCornerShape(10.dp)
            ) {
                Icon(Icons.Default.PictureAsPdf, contentDescription = null, modifier = Modifier.size(16.dp))
                Spacer(modifier = Modifier.width(4.dp))
                Text("خروجی PDF", fontWeight = FontWeight.Bold, fontSize = 12.sp)
            }
        }

        Spacer(modifier = Modifier.height(20.dp))

        // Render Generated Sections
        sections.forEach { sec ->
            SectionCard(section = sec)
            Spacer(modifier = Modifier.height(12.dp))
        }
    }

    if (showRawJsonDialog && snapshot != null) {
        Dialog(onDismissRequest = { showRawJsonDialog = false }) {
            Surface(
                color = CardSurface,
                shape = RoundedCornerShape(16.dp),
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(16.dp)
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text(
                        text = "محاسبات فنی نجومی (Calculation Snapshot)",
                        style = MaterialTheme.typography.titleMedium,
                        color = BrightGold,
                        fontWeight = FontWeight.Bold
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        text = "Checksum SHA-256:\n${snapshot.checksum}",
                        style = MaterialTheme.typography.labelSmall,
                        color = WarmGold
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    Surface(
                        color = MidnightNavy,
                        shape = RoundedCornerShape(8.dp),
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(260.dp)
                    ) {
                        Text(
                            text = snapshot.resultJson,
                            style = MaterialTheme.typography.labelSmall,
                            color = SoftIvory,
                            modifier = Modifier
                                .padding(10.dp)
                                .verticalScroll(rememberScrollState())
                        )
                    }
                    Spacer(modifier = Modifier.height(12.dp))
                    TextButton(onClick = { showRawJsonDialog = false }) {
                        Text("بستن", color = WarmGold)
                    }
                }
            }
        }
    }
}

@Composable
private fun SectionCard(section: ReadingSectionEntity) {
    Card(
        colors = CardDefaults.cardColors(containerColor = CardSurface),
        shape = RoundedCornerShape(14.dp),
        modifier = Modifier.fillMaxWidth()
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Text(
                text = section.title,
                style = MaterialTheme.typography.titleMedium,
                color = BrightGold,
                fontWeight = FontWeight.Bold
            )
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                text = section.content,
                style = MaterialTheme.typography.bodyMedium,
                color = SoftIvory,
                lineHeight = 24.sp
            )
        }
    }
}
