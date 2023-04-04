package com.example.myapplication

import android.os.Parcelable
import kotlinx.parcelize.Parcelize

@Parcelize
class Compte(val login: String, val password: String) : Parcelable