package com.example.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.example.data.local.entities.ReadingEntity
import com.example.ui.theme.BrightGold
import com.example.ui.theme.CardSurface
import com.example.ui.theme.MidnightNavy
import com.example.ui.theme.MutedLavender
import com.example.ui.theme.SoftIvory

@Composable
fun HistoryScreen(
    readings: List<ReadingEntity>,
    onSelectReading: (Long) -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MidnightNavy)
            .padding(16.dp)
    ) {
        Text(
            text = "سوابق گزارش‌های تحلیلی",
            style = MaterialTheme.typography.titleLarge,
            color = BrightGold,
            fontWeight = FontWeight.Bold
        )
        Text(
            text = "فهرست تمام فال‌ها، چارت‌ها و تحلیل‌های صادرشده برای شما",
            style = MaterialTheme.typography.bodySmall,
            color = MutedLavender
        )

        Spacer(modifier = Modifier.height(16.dp))

        if (readings.isEmpty()) {
            Card(
                colors = CardDefaults.cardColors(containerColor = CardSurface),
                shape = RoundedCornerShape(14.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Text(
                    text = "هنوز هیچ گزارشی ثبت نشده است.",
                    color = SoftIvory,
                    modifier = Modifier.padding(20.dp)
                )
            }
        } else {
            LazyColumn(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                items(readings) { reading ->
                    ReadingHistoryItem(
                        reading = reading,
                        onClick = { onSelectReading(reading.id) }
                    )
                }
            }
        }
    }
}
