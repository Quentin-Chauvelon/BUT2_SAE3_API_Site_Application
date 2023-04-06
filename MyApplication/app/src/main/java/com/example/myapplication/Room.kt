package com.example.myapplication

import android.os.Parcel
import android.os.Parcelable

data class Room (
    var id: Int = 0,
    var name: String = "",
    var computerRoom : Boolean = false
) : Parcelable {

    constructor(parcel: Parcel) : this(
        parcel.readInt(),
        parcel.readString() ?: "",
        parcel.readInt() == 1
    )

    override fun toString(): String {
        return this.name
    }

    override fun describeContents(): Int {
        return 0
    }

    override fun writeToParcel(p0: Parcel?, p1: Int) {
        p0?.writeInt(id)
        p0?.writeString(name)
        p0?.writeInt(if (computerRoom) 1 else 0)
    }

    companion object CREATOR : Parcelable.Creator<Room> {
        override fun createFromParcel(parcel: Parcel): Room {
            return Room(parcel)
        }

        override fun newArray(size: Int): Array<Room?> {
            return arrayOfNulls(size)
        }
    }
}