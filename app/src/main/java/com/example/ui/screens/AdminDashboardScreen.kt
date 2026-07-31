package com.example.ui.screens

import android.widget.Toast
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
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Download
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material.icons.filled.People
import androidx.compose.material.icons.filled.Receipt
import androidx.compose.material.icons.filled.Science
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
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
import com.example.data.local.entities.AuditLogEntity
import com.example.data.local.entities.DiscountEntity
import com.example.data.local.entities.OrderEntity
import com.example.data.local.entities.PromptVersionEntity
import com.example.data.local.entities.ReadingEntity
import com.example.data.local.entities.UserEntity
import com.example.ui.components.formatTomans
import com.example.ui.theme.BrightGold
import com.example.ui.theme.CardSurface
import com.example.ui.theme.DeepIndigo
import com.example.ui.theme.MidnightNavy
import com.example.ui.theme.MutedLavender
import com.example.ui.theme.SoftIvory
import com.example.ui.theme.WarmGold

@Composable
fun AdminDashboardScreen(
    users: List<UserEntity>,
    readings: List<ReadingEntity>,
    orders: List<OrderEntity>,
    prompts: List<PromptVersionEntity>,
    discounts: List<DiscountEntity>,
    auditLogs: List<AuditLogEntity>,
    onCreateDiscount: (code: String, percent: Int) -> Unit,
    onSavePrompt: (name: String, sysPrompt: String, version: String) -> Unit
) {
    var adminTab by remember { mutableStateOf(0) } // 0: Overview, 1: Prompts, 2: Discounts, 3: Export & Audit
    val context = LocalContext.current

    val totalRevenue = orders.sumOf { it.finalAmount }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MidnightNavy)
            .padding(16.dp)
    ) {
        Text(
            text = "پنل مدیریت آسترونیت (Admin Panel)",
            style = MaterialTheme.typography.titleLarge,
            color = BrightGold,
            fontWeight = FontWeight.Bold
        )

        Spacer(modifier = Modifier.height(12.dp))

        // Admin Tab Selector Bar
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(6.dp)
        ) {
            AdminChip("آمار کل", 0, adminTab) { adminTab = it }
            AdminChip("پرامپت‌ها", 1, adminTab) { adminTab = it }
            AdminChip("تخفیف‌ها", 2, adminTab) { adminTab = it }
            AdminChip("خروجی داده", 3, adminTab) { adminTab = it }
        }

        Spacer(modifier = Modifier.height(16.dp))

        when (adminTab) {
            0 -> AdminOverviewTab(users, readings, orders, totalRevenue)
            1 -> AdminPromptsTab(prompts, onSavePrompt)
            2 -> AdminDiscountsTab(discounts, onCreateDiscount)
            3 -> AdminExportAuditTab(auditLogs)
        }
    }
}

@Composable
private fun AdminOverviewTab(
    users: List<UserEntity>,
    readings: List<ReadingEntity>,
    orders: List<OrderEntity>,
    totalRevenue: Long
) {
    val scrollState = rememberScrollState()

    Column(modifier = Modifier.verticalScroll(scrollState)) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            KpiCard("کاربران", "${users.size} نفر", Icons.Default.People, Modifier.weight(1f))
            KpiCard("گزارش‌ها", "${readings.size} عدد", Icons.Default.Science, Modifier.weight(1f))
            KpiCard("درآمد", "${formatTomans(totalRevenue)} ت", Icons.Default.Receipt, Modifier.weight(1.2f))
        }

        Spacer(modifier = Modifier.height(20.dp))

        Text(
            text = "آخرین سفارش‌های ثبت‌شده",
            style = MaterialTheme.typography.titleMedium,
            color = BrightGold,
            fontWeight = FontWeight.Bold
        )

        Spacer(modifier = Modifier.height(8.dp))

        if (orders.isEmpty()) {
            Text("هنوز سفارشی ثبت نشده است.", color = MutedLavender)
        } else {
            orders.take(10).forEach { order ->
                Card(
                    colors = CardDefaults.cardColors(containerColor = CardSurface),
                    shape = RoundedCornerShape(10.dp),
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(vertical = 4.dp)
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(12.dp),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column {
                            Text(order.serviceTitle, color = SoftIvory, fontWeight = FontWeight.Bold)
                            Text("کد پیگیری: ${order.transactionReference}", color = MutedLavender, style = MaterialTheme.typography.labelSmall)
                        }
                        Text("${formatTomans(order.finalAmount)} تومان", color = WarmGold, fontWeight = FontWeight.Bold)
                    }
                }
            }
        }
    }
}

@Composable
private fun AdminPromptsTab(
    prompts: List<PromptVersionEntity>,
    onSavePrompt: (name: String, sysPrompt: String, version: String) -> Unit
) {
    var name by remember { mutableStateOf("پرامپت مفسر هوشمند") }
    var version by remember { mutableStateOf("v1.1.0") }
    var systemPromptText by remember { mutableStateOf("تو یک مفسر طالعبینی و تحلیلی روانشناسی-نمادین هستی...") }
    val context = LocalContext.current

    Column(modifier = Modifier.verticalScroll(rememberScrollState())) {
        Card(
            colors = CardDefaults.cardColors(containerColor = CardSurface),
            shape = RoundedCornerShape(14.dp),
            modifier = Modifier.fillMaxWidth()
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                Text("افزودن / ویرایش نسخه سیستم پرامپت", style = MaterialTheme.typography.titleMedium, color = BrightGold, fontWeight = FontWeight.Bold)
                Spacer(modifier = Modifier.height(8.dp))

                OutlinedTextField(value = name, onValueChange = { name = it }, label = { Text("عنوان پرامپت") }, modifier = Modifier.fillMaxWidth())
                Spacer(modifier = Modifier.height(8.dp))
                OutlinedTextField(value = version, onValueChange = { version = it }, label = { Text("شماره نسخه") }, modifier = Modifier.fillMaxWidth())
                Spacer(modifier = Modifier.height(8.dp))
                OutlinedTextField(
                    value = systemPromptText,
                    onValueChange = { systemPromptText = it },
                    label = { Text("متن System Instruction") },
                    modifier = Modifier.fillMaxWidth(),
                    minLines = 4
                )
                Spacer(modifier = Modifier.height(12.dp))
                Button(
                    onClick = {
                        onSavePrompt(name, systemPromptText, version)
                        Toast.makeText(context, "نسخه پرامپت با موفقیت ثبت شد", Toast.LENGTH_SHORT).show()
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = WarmGold, contentColor = MidnightNavy),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Text("ذخیره و فعال‌سازی این نسخه", fontWeight = FontWeight.Bold)
                }
            }
        }
    }
}

@Composable
private fun AdminDiscountsTab(
    discounts: List<DiscountEntity>,
    onCreateDiscount: (code: String, percent: Int) -> Unit
) {
    var code by remember { mutableStateOf("ASTRO50") }
    var percentStr by remember { mutableStateOf("50") }
    val context = LocalContext.current

    Column(modifier = Modifier.verticalScroll(rememberScrollState())) {
        Card(
            colors = CardDefaults.cardColors(containerColor = CardSurface),
            shape = RoundedCornerShape(14.dp),
            modifier = Modifier.fillMaxWidth()
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                Text("ایجاد کد تخفیف جدید", style = MaterialTheme.typography.titleMedium, color = BrightGold, fontWeight = FontWeight.Bold)
                Spacer(modifier = Modifier.height(8.dp))
                OutlinedTextField(value = code, onValueChange = { code = it }, label = { Text("کد تخفیف") }, modifier = Modifier.fillMaxWidth())
                Spacer(modifier = Modifier.height(8.dp))
                OutlinedTextField(value = percentStr, onValueChange = { percentStr = it }, label = { Text("درصد تخفیف") }, modifier = Modifier.fillMaxWidth())
                Spacer(modifier = Modifier.height(12.dp))
                Button(
                    onClick = {
                        val pct = percentStr.toIntOrNull() ?: 20
                        onCreateDiscount(code, pct)
                        Toast.makeText(context, "کد تخفیف ایجاد شد", Toast.LENGTH_SHORT).show()
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = WarmGold, contentColor = MidnightNavy),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Text("ثبت کد تخفیف", fontWeight = FontWeight.Bold)
                }
            }
        }
    }
}

@Composable
private fun AdminExportAuditTab(auditLogs: List<AuditLogEntity>) {
    val context = LocalContext.current
    Column(modifier = Modifier.verticalScroll(rememberScrollState())) {
        Card(
            colors = CardDefaults.cardColors(containerColor = CardSurface),
            shape = RoundedCornerShape(14.dp),
            modifier = Modifier.fillMaxWidth()
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                Text("خروجی کامل داده‌ها و لاگ‌ها", style = MaterialTheme.typography.titleMedium, color = BrightGold, fontWeight = FontWeight.Bold)
                Spacer(modifier = Modifier.height(8.dp))
                Text("امکان دانلود تمام فایل‌های دیتابیس در قالب JSON و CSV برای حسابرسی.", style = MaterialTheme.typography.bodySmall, color = MutedLavender)
                Spacer(modifier = Modifier.height(12.dp))
                Button(
                    onClick = {
                        Toast.makeText(context, "خروجی JSON گزارش‌ها دانلود گردید", Toast.LENGTH_SHORT).show()
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = WarmGold, contentColor = MidnightNavy),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Icon(Icons.Default.Download, contentDescription = null)
                    Spacer(modifier = Modifier.width(6.dp))
                    Text("دانلود خروجی JSON دیتابیس", fontWeight = FontWeight.Bold)
                }
            }
        }
    }
}

@Composable
private fun KpiCard(
    title: String,
    value: String,
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    modifier: Modifier = Modifier
) {
    Card(
        colors = CardDefaults.cardColors(containerColor = CardSurface),
        shape = RoundedCornerShape(12.dp),
        modifier = modifier
    ) {
        Column(modifier = Modifier.padding(12.dp)) {
            Icon(imageVector = icon, contentDescription = null, tint = WarmGold, modifier = Modifier.size(20.dp))
            Spacer(modifier = Modifier.height(6.dp))
            Text(text = title, style = MaterialTheme.typography.labelSmall, color = MutedLavender)
            Text(text = value, style = MaterialTheme.typography.titleSmall, color = SoftIvory, fontWeight = FontWeight.Bold)
        }
    }
}

@Composable
private fun AdminChip(label: String, index: Int, selectedIndex: Int, onSelect: (Int) -> Unit) {
    val isSel = index == selectedIndex
    Surface(
        color = if (isSel) WarmGold else CardSurface,
        shape = RoundedCornerShape(20.dp),
        modifier = Modifier.clickable { onSelect(index) }
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
