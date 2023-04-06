package com.example.myapplication

import android.content.Context
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ArrayAdapter
import android.widget.ImageButton
import android.widget.ImageView
import android.widget.TextView

class RoomAdapter(context: Context, items: List<Room>) : ArrayAdapter<Room>(
    context, android.R.layout.simple_spinner_dropdown_item, items
) {

    internal class ViewHolder {
        lateinit var name: TextView
        lateinit var computerRoom : ImageView
    }


    override fun getView(position: Int, convertView: View?, parent: ViewGroup): View {
        var row = convertView
        val viewHolder : ViewHolder

        if (row == null) {
            row = LayoutInflater.from(parent.context).inflate(R.layout.salle_room, parent, false)
            viewHolder = ViewHolder()
            viewHolder.name = row.findViewById<TextView>(R.id.salle_name)
            viewHolder.computerRoom = row.findViewById(R.id.salle_computerRoom)
            row.tag = viewHolder
        } else {
            viewHolder = row.tag as ViewHolder
        }

        val t = getItem(position)
        if (t!= null) {
            viewHolder.name.text = t.name
            viewHolder.computerRoom.setBackgroundResource(if (t.computerRoom) R.drawable.iconordi else R.drawable.devoiricon)
        }

        return row as View
    }
}