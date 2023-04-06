package com.example.myapplication

import android.os.Parcelable
import kotlinx.parcelize.Parcelize

@Parcelize
class Cours(val time: String, val summary: String, val location : String) : Parcelable

@Parcelize
class CoursProfDay(val cours : MutableList<Cours>) : Parcelable