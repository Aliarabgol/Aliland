package com.example.ui.screens

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
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.Edit
import androidx.compose.material.icons.filled.Person
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Checkbox
import androidx.compose.material3.CheckboxDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
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
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.window.Dialog
import com.example.data.local.entities.BirthProfileEntity
import com.example.engine.CalendarUtil
import com.example.ui.components.CityAutocompleteField
import com.example.ui.components.CityInfo
import com.example.ui.theme.BrightGold
import com.example.ui.theme.CardSurface
import com.example.ui.theme.DeepIndigo
import com.example.ui.theme.MidnightNavy
import com.example.ui.theme.MutedLavender
import com.example.ui.theme.SoftIvory
import com.example.ui.theme.WarmGold

@Composable
fun BirthProfilesScreen(
    profiles: List<BirthProfileEntity>,
    onSaveProfile: (
        id: Long,
        title: String,
        firstName: String,
        lastName: String?,
        birthDateGregorian: String,
        birthDateOriginal: String,
        calendar: String,
        birthTime: String,
        timeKnown: Boolean,
        birthCity: String,
        lat: Double,
        lng: Double,
        relationship: String
    ) -> Unit,
    onDeleteProfile: (Long) -> Unit
) {
    var showAddDialog by remember { mutableStateOf(false) }
    var editingProfile by remember { mutableStateOf<BirthProfileEntity?>(null) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MidnightNavy)
            .padding(16.dp)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column {
                Text(
                    text = "مدیریت پروفایل‌های تولد",
                    style = MaterialTheme.typography.titleLarge,
                    color = BrightGold,
                    fontWeight = FontWeight.Bold
                )
                Text(
                    text = "اطلاعات دقیق زمان و محل تولد افراد ثبت می‌شود",
                    style = MaterialTheme.typography.bodySmall,
                    color = MutedLavender
                )
            }

            Button(
                onClick = {
                    editingProfile = null
                    showAddDialog = true
                },
                colors = ButtonDefaults.buttonColors(containerColor = WarmGold, contentColor = MidnightNavy),
                shape = RoundedCornerShape(10.dp)
            ) {
                Icon(Icons.Default.Add, contentDescription = null)
                Spacer(modifier = Modifier.width(4.dp))
                Text("افزودن")
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        if (profiles.isEmpty()) {
            Card(
                colors = CardDefaults.cardColors(containerColor = CardSurface),
                shape = RoundedCornerShape(14.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(
                    modifier = Modifier.padding(24.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Icon(Icons.Default.Person, contentDescription = null, tint = WarmGold, modifier = Modifier.size(48.dp))
                    Spacer(modifier = Modifier.height(12.dp))
                    Text(text = "هیچ پروفایلی ثبت نشده است", style = MaterialTheme.typography.titleMedium, color = SoftIvory)
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = "برای دریافت فال و چارت دقیق، دکمه «افزودن» را لمس کرده و اطلاعات زادروز خود یا فرد موردنظر را وارد کنید.",
                        style = MaterialTheme.typography.bodySmall,
                        color = MutedLavender
                    )
                }
            }
        } else {
            LazyColumn(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                items(profiles) { profile ->
                    ProfileCardItem(
                        profile = profile,
                        onEdit = {
                            editingProfile = profile
                            showAddDialog = true
                        },
                        onDelete = { onDeleteProfile(profile.id) }
                    )
                }
            }
        }
    }

    if (showAddDialog) {
        AddEditProfileDialog(
            existingProfile = editingProfile,
            onDismiss = { showAddDialog = false },
            onConfirm = { id, title, firstName, lastName, shamsiDateStr, timeStr, timeKnown, cityInfo, relationship ->
                // Convert Shamsi date YYYY/MM/DD to Gregorian YYYY-MM-DD
                val dateParts = shamsiDateStr.split("/")
                val jY = dateParts.getOrNull(0)?.toIntOrNull() ?: 1374
                val jM = dateParts.getOrNull(1)?.toIntOrNull() ?: 3
                val jD = dateParts.getOrNull(2)?.toIntOrNull() ?: 25

                val greg = CalendarUtil.jalaliToGregorian(jY, jM, jD)
                val gregStr = String.format("%04d-%02d-%02d", greg.year, greg.month, greg.day)

                onSaveProfile(
                    id, title, firstName, lastName,
                    gregStr, shamsiDateStr, "SHAMSI",
                    timeStr, timeKnown, cityInfo.nameFa,
                    cityInfo.lat, cityInfo.lng, relationship
                )
                showAddDialog = false
            }
        )
    }
}

@Composable
private fun ProfileCardItem(
    profile: BirthProfileEntity,
    onEdit: () -> Unit,
    onDelete: () -> Unit
) {
    Card(
        colors = CardDefaults.cardColors(containerColor = CardSurface),
        shape = RoundedCornerShape(14.dp),
        modifier = Modifier.fillMaxWidth()
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(14.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column(modifier = Modifier.weight(1f)) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(
                        text = profile.title,
                        style = MaterialTheme.typography.titleMedium,
                        color = BrightGold,
                        fontWeight = FontWeight.Bold
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Surface(
                        color = DeepIndigo,
                        shape = RoundedCornerShape(6.dp)
                    ) {
                        Text(
                            text = getRelationshipFa(profile.relationshipToUser),
                            style = MaterialTheme.typography.labelSmall,
                            color = SoftIvory,
                            modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                        )
                    }
                }

                Spacer(modifier = Modifier.height(4.dp))

                Text(
                    text = "${profile.firstName} ${profile.lastName ?: ""}",
                    style = MaterialTheme.typography.bodyLarge,
                    color = SoftIvory
                )

                Text(
                    text = "تاریخ تولد: ${profile.birthDateOriginal} | ساعت: ${if (profile.timeKnown) profile.birthTime else "نامشخص"}",
                    style = MaterialTheme.typography.bodySmall,
                    color = MutedLavender
                )

                Text(
                    text = "محل تولد: ${profile.birthCity} (${profile.birthCountry})",
                    style = MaterialTheme.typography.bodySmall,
                    color = MutedLavender
                )
            }

            Row {
                IconButton(onClick = onEdit) {
                    Icon(Icons.Default.Edit, contentDescription = "ویرایش", tint = WarmGold)
                }
                IconButton(onClick = onDelete) {
                    Icon(Icons.Default.Delete, contentDescription = "حذف", tint = MaterialTheme.colorScheme.error)
                }
            }
        }
    }
}

@Composable
private fun AddEditProfileDialog(
    existingProfile: BirthProfileEntity?,
    onDismiss: () -> Unit,
    onConfirm: (
        id: Long,
        title: String,
        firstName: String,
        lastName: String?,
        shamsiDateStr: String,
        timeStr: String,
        timeKnown: Boolean,
        cityInfo: CityInfo,
        relationship: String
    ) -> Unit
) {
    var title by remember { mutableStateOf(existingProfile?.title ?: "پروفایل من") }
    var firstName by remember { mutableStateOf(existingProfile?.firstName ?: "") }
    var lastName by remember { mutableStateOf(existingProfile?.lastName ?: "") }
    var shamsiDate by remember { mutableStateOf(existingProfile?.birthDateOriginal ?: "1374/03/25") }
    var birthTime by remember { mutableStateOf(existingProfile?.birthTime ?: "08:30") }
    var timeKnown by remember { mutableStateOf(existingProfile?.timeKnown ?: true) }
    var selectedCity by remember {
        mutableStateOf(
            CityInfo(
                nameFa = existingProfile?.birthCity ?: "تهران",
                countryFa = "ایران",
                lat = existingProfile?.latitude ?: 35.6892,
                lng = existingProfile?.longitude ?: 51.3890,
                timezone = existingProfile?.timezoneAtBirth ?: "Asia/Tehran"
            )
        )
    }
    var relationship by remember { mutableStateOf(existingProfile?.relationshipToUser ?: "SELF") }

    Dialog(onDismissRequest = onDismiss) {
        Surface(
            color = CardSurface,
            shape = RoundedCornerShape(16.dp),
            modifier = Modifier.fillMaxWidth()
        ) {
            Column(
                modifier = Modifier.padding(20.dp),
                verticalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                Text(
                    text = if (existingProfile == null) "افزودن پروفایل تولد" else "ویرایش پروفایل",
                    style = MaterialTheme.typography.titleLarge,
                    color = BrightGold,
                    fontWeight = FontWeight.Bold
                )

                OutlinedTextField(
                    value = title,
                    onValueChange = { title = it },
                    label = { Text("عنوان (مثلاً: خودم، همسرم)") },
                    modifier = Modifier.fillMaxWidth()
                )

                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    OutlinedTextField(
                        value = firstName,
                        onValueChange = { firstName = it },
                        label = { Text("نام") },
                        modifier = Modifier.weight(1f)
                    )
                    OutlinedTextField(
                        value = lastName,
                        onValueChange = { lastName = it },
                        label = { Text("نام خانوادگی") },
                        modifier = Modifier.weight(1f)
                    )
                }

                OutlinedTextField(
                    value = shamsiDate,
                    onValueChange = { shamsiDate = it },
                    label = { Text("تاریخ تولد شمسی (فرمت: ۱۳۹۵/۰۶/۱۵)") },
                    modifier = Modifier.fillMaxWidth()
                )

                Row(verticalAlignment = Alignment.CenterVertically) {
                    Checkbox(
                        checked = timeKnown,
                        onCheckedChange = { timeKnown = it },
                        colors = CheckboxDefaults.colors(checkedColor = WarmGold)
                    )
                    Text("ساعت دقیق تولد را می‌دانم", color = SoftIvory)
                }

                if (timeKnown) {
                    OutlinedTextField(
                        value = birthTime,
                        onValueChange = { birthTime = it },
                        label = { Text("ساعت تولد (مثلاً: ۰۸:۳۰ یا ۱۴:۱۵)") },
                        modifier = Modifier.fillMaxWidth()
                    )
                }

                CityAutocompleteField(
                    selectedCityName = selectedCity.nameFa,
                    onCitySelected = { selectedCity = it },
                    modifier = Modifier.fillMaxWidth()
                )

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.End
                ) {
                    TextButton(onClick = onDismiss) { Text("انصراف", color = MutedLavender) }
                    Spacer(modifier = Modifier.width(8.dp))
                    Button(
                        onClick = {
                            if (firstName.isNotBlank() && shamsiDate.isNotBlank()) {
                                onConfirm(
                                    existingProfile?.id ?: 0L,
                                    title, firstName, lastName,
                                    shamsiDate, birthTime, timeKnown,
                                    selectedCity, relationship
                                )
                            }
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = WarmGold, contentColor = MidnightNavy)
                    ) {
                        Text("ذخیره پروفایل", fontWeight = FontWeight.Bold)
                    }
                }
            }
        }
    }
}

fun getRelationshipFa(rel: String): String {
    return when (rel) {
        "SELF" -> "خودم"
        "SPOUSE" -> "همسر"
        "FIANCE" -> "نامزد"
        "CHILD" -> "فرزند"
        else -> "دوست / آشنا"
    }
}
