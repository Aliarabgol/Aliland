package com.example.ui.components

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.DropdownMenu
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.example.ui.theme.SoftIvory

data class CityInfo(
    val nameFa: String,
    val countryFa: String,
    val lat: Double,
    val lng: Double,
    val timezone: String
)

val CITIES_DATABASE = listOf(
    CityInfo("تهران", "ایران", 35.6892, 51.3890, "Asia/Tehran"),
    CityInfo("اصفهان", "ایران", 32.6546, 51.6680, "Asia/Tehran"),
    CityInfo("شیراز", "ایران", 29.5918, 52.5837, "Asia/Tehran"),
    CityInfo("مشهد", "ایران", 36.2972, 59.6067, "Asia/Tehran"),
    CityInfo("تبریز", "ایران", 38.0962, 46.2738, "Asia/Tehran"),
    CityInfo("کرج", "ایران", 35.8400, 50.9391, "Asia/Tehran"),
    CityInfo("اهواز", "ایران", 31.3183, 48.6706, "Asia/Tehran"),
    CityInfo("قم", "ایران", 34.6401, 50.8764, "Asia/Tehran"),
    CityInfo("کرمانشاه", "ایران", 34.3142, 47.0650, "Asia/Tehran"),
    CityInfo("رشت", "ایران", 37.2808, 49.5832, "Asia/Tehran"),
    CityInfo("کرمان", "ایران", 30.2839, 57.0834, "Asia/Tehran"),
    CityInfo("همدان", "ایران", 34.7989, 48.5150, "Asia/Tehran"),
    CityInfo("یزد", "ایران", 31.8974, 54.3675, "Asia/Tehran"),
    CityInfo("ارومیه", "ایران", 37.5527, 45.0761, "Asia/Tehran"),
    CityInfo("زاهدان", "ایران", 29.4963, 60.8629, "Asia/Tehran"),
    CityInfo("اردبیل", "ایران", 38.2498, 48.2933, "Asia/Tehran"),
    CityInfo("بندرعباس", "ایران", 27.1832, 56.2666, "Asia/Tehran"),
    CityInfo("ساری", "ایران", 36.5659, 53.0586, "Asia/Tehran"),
    CityInfo("گرگان", "ایران", 36.8456, 54.4393, "Asia/Tehran"),
    CityInfo("سنندج", "ایران", 35.3144, 46.9923, "Asia/Tehran"),
    CityInfo("زنجان", "ایران", 36.6736, 48.4862, "Asia/Tehran"),
    CityInfo("قزوین", "ایران", 36.2797, 50.0049, "Asia/Tehran"),
    CityInfo("خرم‌آباد", "ایران", 33.4878, 48.3558, "Asia/Tehran"),
    CityInfo("بوشهر", "ایران", 28.9234, 50.8203, "Asia/Tehran"),
    CityInfo("بجنورد", "ایران", 37.4761, 57.3317, "Asia/Tehran"),
    CityInfo("ایلام", "ایران", 33.6374, 46.4227, "Asia/Tehran"),
    CityInfo("سمنان", "ایران", 35.5729, 53.3971, "Asia/Tehran"),
    CityInfo("شهرکرد", "ایران", 32.3256, 50.8644, "Asia/Tehran"),
    CityInfo("یاسوج", "ایران", 30.6684, 51.5872, "Asia/Tehran"),
    CityInfo("کیش", "ایران", 26.5578, 54.0194, "Asia/Tehran"),
    CityInfo("استانبول", "ترکیه", 41.0082, 28.9784, "Europe/Istanbul"),
    CityInfo("دبی", "امارات", 25.2048, 55.2708, "Asia/Dubai"),
    CityInfo("لندن", "بریتانیا", 51.5074, -0.1278, "Europe/London"),
    CityInfo("تورنتو", "کانادا", 43.6532, -79.3832, "America/Toronto")
)

@Composable
fun CityAutocompleteField(
    selectedCityName: String,
    onCitySelected: (CityInfo) -> Unit,
    modifier: Modifier = Modifier
) {
    var query by remember { mutableStateOf(selectedCityName) }
    var expanded by remember { mutableStateOf(false) }

    val filteredCities = CITIES_DATABASE.filter {
        it.nameFa.contains(query, ignoreCase = true) || it.countryFa.contains(query, ignoreCase = true)
    }

    Column(modifier = modifier) {
        OutlinedTextField(
            value = query,
            onValueChange = {
                query = it
                expanded = true
            },
            label = { Text("شهر محل تولد") },
            placeholder = { Text("مثلاً: تهران، اصفهان...") },
            modifier = Modifier.fillMaxWidth(),
            singleLine = true
        )

        if (expanded && filteredCities.isNotEmpty()) {
            Surface(
                modifier = Modifier
                    .fillMaxWidth()
                    .heightIn(max = 200.dp),
                tonalElevation = 8.dp
            ) {
                LazyColumn {
                    items(filteredCities) { city ->
                        DropdownMenuItem(
                            text = { Text("${city.nameFa} (${city.countryFa})", color = SoftIvory) },
                            onClick = {
                                query = city.nameFa
                                expanded = false
                                onCitySelected(city)
                            }
                        )
                    }
                }
            }
        }
    }
}
