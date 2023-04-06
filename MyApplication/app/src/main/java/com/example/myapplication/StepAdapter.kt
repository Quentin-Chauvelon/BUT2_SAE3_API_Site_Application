package com.example.myapplication

import android.content.ClipDescription
import android.content.Context
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ArrayAdapter
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView


class StepAdapter(private val list: MutableList<Step>) :
    RecyclerView.Adapter<StepAdapter.StepViewHolder>() {

    class StepViewHolder(val view : View) : RecyclerView.ViewHolder(view) {
        var description : TextView = view.findViewById(R.id.step_description)
        var duration_distance : TextView = view.findViewById(R.id.step_duration_distance)
    }

    override fun getItemCount(): Int {
        return list.size
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): StepViewHolder {
        val layout = LayoutInflater
            .from(parent.context)
            .inflate(R.layout.step_not_transit, parent, false)
        return StepViewHolder(layout)
    }

    override fun onBindViewHolder(holder: StepViewHolder, position: Int) {
        val item = list.get(position)

        holder.description.text = item.description
        holder.duration_distance.text = "${item.duration} (${item.distance})"
    }
}

//class StepAdapter(context: Context, items: List<Step>) : ArrayAdapter<Step>(
//    context, android.R.layout.simple_spinner_dropdown_item, items
//) {
//
//    internal class ViewHolder {
//        lateinit var description : TextView
//        lateinit var duration_distance : TextView
//    }
//
//
//    override fun getView(position: Int, convertView: View?, parent: ViewGroup): View {
//        var row = convertView
//        val viewHolder : ViewHolder
//
//        if (row == null) {
//            row = LayoutInflater.from(parent.context).inflate(R.layout.step_not_transit, parent, false)
//            viewHolder = ViewHolder()
//            viewHolder.description = row.findViewById<TextView>(R.id.step_description)
//            viewHolder.duration_distance = row.findViewById<TextView>(R.id.step_duration_distance)
//            row.tag = viewHolder
//        } else {
//            viewHolder = row.tag as ViewHolder
//        }
//
//        val t = getItem(position)
//        if (t!= null) {
//            viewHolder.description.text = t.description
//            viewHolder.duration_distance.text = "${t.duration} (${t.distance})"
//        }
//
//        return row as View
//    }
//}