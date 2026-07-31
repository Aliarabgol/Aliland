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
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AutoAwesome
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material.icons.filled.Phone
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
import com.example.ui.theme.WarmGold

@Composable
fun AuthScreen(
    onLoginSuccess: (phone: String, firstName: String, lastName: String) -> Unit
) {
    var step by remember { mutableStateOf(1) } // 1: Phone, 2: OTP Code
    var phone by remember { mutableStateOf("09123456789") }
    var firstName by remember { mutableStateOf("علی") }
    var lastName by remember { mutableStateOf("عرب‌گل") }
    var otpCode by remember { mutableStateOf("123456") }
    var errorMessage by remember { mutableStateOf<String?>(null) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MidnightNavy)
            .padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Icon(
            imageVector = Icons.Default.AutoAwesome,
            contentDescription = null,
            tint = BrightGold,
            modifier = Modifier.height(56.dp)
        )

        Spacer(modifier = Modifier.height(12.dp))

        Text(
            text = "ورود به آسترونیت",
            style = MaterialTheme.typography.displayMedium,
            color = SoftIvory,
            fontWeight = FontWeight.Bold
        )

        Spacer(modifier = Modifier.height(6.dp))

        Text(
            text = "برای ثبت چارت، دریافت فال نیت و مشاهده سوابق وارد شوید",
            style = MaterialTheme.typography.bodyMedium,
            color = MutedLavender,
            textAlign = TextAlign.Center
        )

        Spacer(modifier = Modifier.height(24.dp))

        Card(
            colors = CardDefaults.cardColors(containerColor = CardSurface),
            shape = RoundedCornerShape(16.dp),
            modifier = Modifier.fillMaxWidth()
        ) {
            Column(
                modifier = Modifier.padding(20.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                if (step == 1) {
                    OutlinedTextField(
                        value = phone,
                        onValueChange = { phone = it },
                        label = { Text("شماره موبایل") },
                        leadingIcon = { Icon(Icons.Default.Phone, contentDescription = null, tint = WarmGold) },
                        singleLine = true,
                        modifier = Modifier.fillMaxWidth()
                    )

                    Spacer(modifier = Modifier.height(12.dp))

                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
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

                    Spacer(modifier = Modifier.height(20.dp))

                    Button(
                        onClick = {
                            if (phone.length >= 10 && firstName.isNotBlank()) {
                                step = 2
                                errorMessage = null
                            } else {
                                errorMessage = "لطفاً شماره موبایل و نام را به درستی وارد کنید"
                            }
                        },
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(48.dp),
                        colors = ButtonDefaults.buttonColors(containerColor = WarmGold, contentColor = MidnightNavy),
                        shape = RoundedCornerShape(10.dp)
                    ) {
                        Text("ارسال کد پیامکی OTP", fontWeight = FontWeight.Bold)
                    }
                } else {
                    Surface(
                        color = DeepIndigo,
                        shape = RoundedCornerShape(10.dp),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Text(
                            text = "کد تأیید به شماره $phone ارسال شد.\n(کد تست برای بررسی: ۱۲۳۴۵۶)",
                            style = MaterialTheme.typography.bodySmall,
                            color = BrightGold,
                            textAlign = TextAlign.Center,
                            modifier = Modifier.padding(10.dp)
                        )
                    }

                    Spacer(modifier = Modifier.height(16.dp))

                    OutlinedTextField(
                        value = otpCode,
                        onValueChange = { otpCode = it },
                        label = { Text("کد ۶ رقمی OTP") },
                        leadingIcon = { Icon(Icons.Default.Lock, contentDescription = null, tint = WarmGold) },
                        singleLine = true,
                        modifier = Modifier.fillMaxWidth()
                    )

                    Spacer(modifier = Modifier.height(20.dp))

                    Button(
                        onClick = {
                            if (otpCode == "123456" || otpCode.length == 6) {
                                onLoginSuccess(phone, firstName, lastName)
                            } else {
                                errorMessage = "کد وارد شده نادرست است (از ۱۲۳۴۵۶ استفاده کنید)"
                            }
                        },
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(48.dp),
                        colors = ButtonDefaults.buttonColors(containerColor = WarmGold, contentColor = MidnightNavy),
                        shape = RoundedCornerShape(10.dp)
                    ) {
                        Text("تأیید و ورود به برنامه", fontWeight = FontWeight.Bold)
                    }

                    TextButton(onClick = { step = 1 }) {
                        Text("اصلاح شماره موبایل", color = MutedLavender)
                    }
                }

                if (errorMessage != null) {
                    Spacer(modifier = Modifier.height(10.dp))
                    Text(
                        text = errorMessage!!,
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.error
                    )
                }
            }
        }
    }
}
