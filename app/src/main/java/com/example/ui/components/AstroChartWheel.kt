package com.example.ui.components

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.drawText
import androidx.compose.ui.text.rememberTextMeasurer
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.ui.theme.BrightGold
import com.example.ui.theme.CardSurface
import com.example.ui.theme.DeepIndigo
import com.example.ui.theme.MidnightNavy
import com.example.ui.theme.MutedLavender
import com.example.ui.theme.SoftIvory
import com.example.ui.theme.WarmGold
import kotlin.math.cos
import kotlin.math.sin

@Composable
fun AstroChartWheel(
    sunSign: String,
    moonSign: String,
    ascendantSign: String,
    dominantElement: String,
    modifier: Modifier = Modifier
) {
    val textMeasurer = rememberTextMeasurer()

    val signsFa = listOf(
        "حمل", "ثور", "جوزا", "سرطان",
        "اسد", "سنبله", "میزان", "عقرب",
        "قوس", "جدی", "دلو", "حوت"
    )

    val planetSymbolsFa = listOf(
        Pair("☉ خورشید", sunSign),
        Pair("☽ ماه", moonSign),
        Pair("Asc طالع", ascendantSign)
    )

    Surface(
        modifier = modifier.fillMaxWidth(),
        color = CardSurface,
        shape = RoundedCornerShape(16.dp),
        tonalElevation = 6.dp
    ) {
        Column(
            modifier = Modifier.padding(16.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(
                text = "چارت نجومی زوایای سیارگان و خانه‌ها",
                style = MaterialTheme.typography.titleMedium,
                color = BrightGold
            )
            Text(
                text = "عنصر غالب: $dominantElement",
                style = MaterialTheme.typography.bodyMedium,
                color = MutedLavender
            )

            Spacer(modifier = Modifier.height(12.dp))

            Box(
                modifier = Modifier
                    .fillMaxWidth(0.85f)
                    .aspectRatio(1f),
                contentAlignment = Alignment.Center
            ) {
                Canvas(modifier = Modifier.fillMaxSize()) {
                    val center = Offset(size.width / 2, size.height / 2)
                    val outerRadius = size.width / 2.2f
                    val innerRadius = outerRadius * 0.65f
                    val houseRadius = innerRadius * 0.35f

                    // Outer Zodiac Wheel Circle
                    drawCircle(
                        color = WarmGold,
                        radius = outerRadius,
                        center = center,
                        style = Stroke(width = 3.dp.toPx())
                    )

                    // Inner House Wheel Circle
                    drawCircle(
                        color = BrightGold.copy(alpha = 0.6f),
                        radius = innerRadius,
                        center = center,
                        style = Stroke(width = 2.dp.toPx())
                    )

                    // Center Core Circle
                    drawCircle(
                        color = WarmGold.copy(alpha = 0.3f),
                        radius = houseRadius,
                        center = center,
                        style = Stroke(width = 1.dp.toPx())
                    )

                    // Draw 12 House Spokes and Sign Names
                    for (i in 0 until 12) {
                        val angleDeg = i * 30.0 - 90.0
                        val angleRad = Math.toRadians(angleDeg)

                        val startPoint = Offset(
                            (center.x + houseRadius * cos(angleRad)).toFloat(),
                            (center.y + houseRadius * sin(angleRad)).toFloat()
                        )
                        val endPoint = Offset(
                            (center.x + outerRadius * cos(angleRad)).toFloat(),
                            (center.y + outerRadius * sin(angleRad)).toFloat()
                        )

                        // Spoke Line
                        drawLine(
                            color = MutedLavender.copy(alpha = 0.4f),
                            start = startPoint,
                            end = endPoint,
                            strokeWidth = 1.dp.toPx()
                        )

                        // Sign Label Position
                        val midAngleRad = Math.toRadians(angleDeg + 15.0)
                        val labelRadius = (outerRadius + innerRadius) / 2f
                        val labelPos = Offset(
                            (center.x + labelRadius * cos(midAngleRad)).toFloat() - 12f,
                            (center.y + labelRadius * sin(midAngleRad)).toFloat() - 10f
                        )

                        val signName = signsFa[i]
                        drawText(
                            textMeasurer = textMeasurer,
                            text = signName,
                            topLeft = labelPos,
                            style = TextStyle(
                                color = SoftIvory,
                                fontSize = 10.sp
                            )
                        )
                    }
                }
            }
        }
    }
}
