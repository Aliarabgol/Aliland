package com.example.ui.components

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AdminPanelSettings
import androidx.compose.material.icons.filled.History
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.Psychology
import androidx.compose.material3.Icon
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.NavigationBarItemDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import com.example.ui.theme.BrightGold
import com.example.ui.theme.CardSurface
import com.example.ui.theme.DeepIndigo
import com.example.ui.theme.MidnightNavy
import com.example.ui.theme.MutedLavender
import com.example.ui.theme.SoftIvory

enum class AstroTab(val titleFa: String, val icon: androidx.compose.ui.graphics.vector.ImageVector) {
    HOME("خانه", Icons.Default.Home),
    PROFILES("پروفایل‌ها", Icons.Default.Person),
    SERVICES("تحلیل و فال", Icons.Default.Psychology),
    HISTORY("سوابق گزارش‌ها", Icons.Default.History),
    ADMIN("مدیریت", Icons.Default.AdminPanelSettings)
}

@Composable
fun AstroBottomNav(
    selectedTab: AstroTab,
    isAdminMode: Boolean,
    onTabSelected: (AstroTab) -> Unit
) {
    NavigationBar(
        containerColor = MidnightNavy,
        contentColor = SoftIvory
    ) {
        val tabsList: List<AstroTab> = if (isAdminMode) AstroTab.entries else AstroTab.entries.filter { it != AstroTab.ADMIN }

        for (i in tabsList.indices) {
            val tab = tabsList[i]
            val isSelected = tab == selectedTab
            NavigationBarItem(
                selected = isSelected,
                onClick = { onTabSelected(tab) },
                icon = {
                    Icon(
                        imageVector = tab.icon,
                        contentDescription = tab.titleFa,
                        tint = if (isSelected) BrightGold else MutedLavender
                    )
                },
                label = {
                    Text(
                        text = tab.titleFa,
                        color = if (isSelected) BrightGold else MutedLavender
                    )
                },
                colors = NavigationBarItemDefaults.colors(
                    indicatorColor = DeepIndigo
                )
            )
        }
    }
}
