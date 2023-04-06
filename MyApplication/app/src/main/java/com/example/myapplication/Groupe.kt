package com.example.myapplication

import android.os.Parcel
import android.os.Parcelable
import java.nio.file.attribute.GroupPrincipal

data class Groupe (
    var id: Int = 0,
    var name: String = ""
) : Parcelable {

    constructor(parcel: Parcel) : this(
        parcel.readInt(),
        parcel.readString() ?: ""
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
    }

    companion object CREATOR : Parcelable.Creator<Groupe> {
        override fun createFromParcel(parcel: Parcel): Groupe {
            return Groupe(parcel)
        }

        override fun newArray(size: Int): Array<Groupe?> {
            return arrayOfNulls(size)
        }
    }
}