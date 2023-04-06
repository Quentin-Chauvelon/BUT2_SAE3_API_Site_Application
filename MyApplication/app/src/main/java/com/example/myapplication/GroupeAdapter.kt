package com.example.myapplication

import android.content.Context
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ArrayAdapter
import android.widget.TextView

class GroupeAdapter(context: Context, items: List<Groupe>) : ArrayAdapter<Groupe>(
    context, android.R.layout.simple_spinner_dropdown_item, items
) {

    internal class ViewHolder {
        lateinit var name: TextView
    }


    override fun getView(position: Int, convertView: View?, parent: ViewGroup): View {
        var row = convertView
        val viewHolder : ViewHolder

        if (row == null) {
            row = LayoutInflater.from(parent.context).inflate(R.layout.groupe_item, parent, false)
            viewHolder = ViewHolder()
            viewHolder.name = row.findViewById<TextView>(R.id.group_item_name)
            row.tag = viewHolder
        } else {
            viewHolder = row.tag as ViewHolder
        }

        val t = getItem(position)
        if (t!= null) {
            viewHolder.name.text = t.name
        }

        return row as View
    }
}