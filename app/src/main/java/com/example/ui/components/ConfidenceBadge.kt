package com.example.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Info
import androidx.compose.material.icons.filled.Verified
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.example.ui.theme.BurgundyAccent
import com.example.ui.theme.CardSurface
import com.example.ui.theme.SoftIvory
import com.example.ui.theme.SuccessGreen
import com.example.ui.theme.WarningAmber

@Composable
fun ConfidenceBadge(
    confidenceLevel: String, // "HIGH", "MEDIUM", "CONDITIONAL"
    isTimeKnown: Boolean,
    modifier: Modifier = Modifier
) {
    val (label, bgColor, icon) = when {
        !isTimeKnown -> Triple("تحلیل مشروط (بدون ساعت دقیق تولد)", WarningAmber, Icons.Default.Info)
        confidenceLevel == "HIGH" -> Triple("اعتبار بالایی محاسباتی", SuccessGreen, Icons.Default.Verified)
        else -> Triple("تحلیل عمومی و احتمالی", WarningAmber, Icons.Default.Info)
    }

    Surface(
        color = bgColor.copy(alpha = 0.2f),
        shape = RoundedCornerShape(12.dp),
        modifier = modifier
    ) {
        Row(
            modifier = Modifier.padding(horizontal = 10.dp, vertical = 4.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Icon(
                imageVector = icon,
                contentDescription = label,
                tint = bgColor,
                modifier = Modifier.size(16.dp)
            )
            Spacer(modifier = Modifier.width(6.dp))
            Text(
                text = label,
                style = MaterialTheme.typography.labelMedium,
                color = SoftIvory,
                fontWeight = FontWeight.Medium
            )
        }
    }
}

@Composable
fun DisclaimerBanner(
    text: String = "این تحلیل براساس سنتهای نمادین طالعبینی و برای سرگرمی، تأمل شخصی و خودشناسی تهیه شده است. نتیجه، پیشبینی قطعی آینده یا جایگزین مشاوره پزشکی، حقوقی، مالی یا روانشناختی نیست.",
    modifier: Modifier = Modifier
) {
    Surface(
        color = BurgundyAccent.copy(alpha = 0.3f),
        shape = RoundedCornerShape(12.dp),
        modifier = modifier.fillMaxWidth()
    ) {
        Row(
            modifier = Modifier.padding(12.dp),
            verticalAlignment = Alignment.Top
        ) {
            Icon(
                imageVector = Icons.Default.Info,
                contentDescription = "سلب مسئولیت",
                tint = SoftIvory,
                modifier = Modifier
                    .size(20.dp)
                    .padding(top = 2.dp)
            )
            Spacer(modifier = Modifier.width(8.dp))
            Text(
                text = text,
                style = MaterialTheme.typography.bodySmall,
                color = SoftIvory.copy(alpha = 0.9f)
            )
        }
    }
}
