package com.example.myapplication

import android.content.res.ColorStateList
import android.graphics.Color
import android.os.Bundle
import android.widget.Button
import android.widget.TableLayout
import android.widget.TableRow
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity

class CoursProfs : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.cours_profs_xml)

        val tableLayout = findViewById<TableLayout>(R.id.prof_schedule_table)

        val coursParcelable : CoursProfDay = intent.getParcelableExtra("cours") ?: CoursProfDay(mutableListOf())

        for (cours in coursParcelable.cours) {
            val tableRow = TableRow(this)
            val scheduleItem = layoutInflater.inflate(R.layout.schedule_item, tableRow, false)

            if (cours.summary.contains("TP")) {
                scheduleItem.backgroundTintList =
                    ColorStateList.valueOf(Color.parseColor("#FF9EFF"))
            } else if (cours.summary.contains("DS")) {
                scheduleItem.backgroundTintList =
                    ColorStateList.valueOf(Color.parseColor("#BF7F7F"))
            } else if (cours.summary.contains("Amphi")) {
                scheduleItem.backgroundTintList =
                    ColorStateList.valueOf(Color.parseColor("#FF7F7F"))
            } else if (cours.summary.contains("Reunion")) {
                scheduleItem.backgroundTintList =
                    ColorStateList.valueOf(Color.parseColor("#BFFFFF"))
            }

            scheduleItem.findViewById<TextView>(R.id.schedule_item_time).text = cours.time
            scheduleItem.findViewById<TextView>(R.id.schedule_item_summary).text = cours.summary
            scheduleItem.findViewById<TextView>(R.id.schedule_item_location).text = cours.location

            tableRow.addView(scheduleItem)
            tableLayout.addView(tableRow)

            val space = TableRow(this)
            val textView = TextView(this)

            space.addView(textView)
            tableLayout.addView(space)
        }

        findViewById<Button>(R.id.ok).setOnClickListener {
            finish()
        }
    }
}