package com.example.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.ui.platform.LocalLayoutDirection
import androidx.compose.ui.unit.LayoutDirection

private val DarkColorScheme = darkColorScheme(
    primary = WarmGold,
    onPrimary = MidnightNavy,
    primaryContainer = DeepIndigo,
    onPrimaryContainer = SoftIvory,
    secondary = BrightGold,
    onSecondary = MidnightNavy,
    secondaryContainer = BurgundyAccent,
    onSecondaryContainer = SoftIvory,
    tertiary = MutedLavender,
    onTertiary = MidnightNavy,
    background = MidnightNavy,
    onBackground = SoftIvory,
    surface = SurfaceNavy,
    onSurface = SoftIvory,
    surfaceVariant = CardSurface,
    onSurfaceVariant = MutedLavender,
    error = ErrorRed,
    onError = SoftIvory
)

private val LightColorScheme = lightColorScheme(
    primary = WarmGold,
    onPrimary = MidnightNavy,
    primaryContainer = DeepIndigo,
    onPrimaryContainer = SoftIvory,
    secondary = BrightGold,
    onSecondary = MidnightNavy,
    secondaryContainer = BurgundyAccent,
    onSecondaryContainer = SoftIvory,
    tertiary = MutedLavender,
    onTertiary = MidnightNavy,
    background = MidnightNavy,
    onBackground = SoftIvory,
    surface = SurfaceNavy,
    onSurface = SoftIvory,
    surfaceVariant = CardSurface,
    onSurfaceVariant = MutedLavender,
    error = ErrorRed,
    onError = SoftIvory
)

@Composable
fun AstroNiyatTheme(
    darkTheme: Boolean = true,
    content: @Composable () -> Unit,
) {
    val colorScheme = if (darkTheme) DarkColorScheme else LightColorScheme

    CompositionLocalProvider(LocalLayoutDirection provides LayoutDirection.Rtl) {
        MaterialTheme(
            colorScheme = colorScheme,
            typography = Typography,
            content = content
        )
    }
}

