package com.example.myapplication

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import com.example.myapplication.databinding.ActivityAccueilBinding
import com.example.myapplication.databinding.ActivityLoginBinding
import android.graphics.Color
import android.os.Build
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.*
import androidx.annotation.RequiresApi
import androidx.constraintlayout.widget.ConstraintLayout
import androidx.constraintlayout.widget.Group
import androidx.core.view.children
import androidx.core.view.marginBottom
import com.android.volley.Request
import com.android.volley.toolbox.JsonArrayRequest
import com.android.volley.toolbox.JsonObjectRequest
import com.android.volley.toolbox.Volley
import org.json.JSONObject
import java.time.LocalDate
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter
import java.util.*

class Accueil : AppCompatActivity() {
    private lateinit var binding:ActivityAccueilBinding
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_accueil)
        binding = ActivityAccueilBinding.inflate(layoutInflater)
        setContentView(binding.root)

        //bar du haut
        binding.logo.setOnClickListener{
            startActivity(Intent(this,Accueil::class.java))
        }
        //Bar du Bas
        binding.roomBtnAccueil.setOnClickListener{
            startActivity(Intent(this,Salles::class.java))
        }
        binding.locationBtnAccueil.setOnClickListener{
            startActivity(Intent(this,Trajet::class.java))
        }
        binding.teacherBtnAccueil.setOnClickListener{
            startActivity(Intent(this,Profs::class.java))
        }
        binding.homeBtnAccueil.setOnClickListener{
            startActivity(Intent(this,Accueil::class.java))
        }


        val queue = Volley.newRequestQueue(this)
        val groupsURL = "http://172.26.82.56:443/groups"

        val getDaySchedule = JsonArrayRequest(
            Request.Method.GET, groupsURL, null,
            { response ->
                val groups = mutableListOf<Groupe>()

                for (i in 0 until response.length()) {
                    val group: JSONObject = response[i] as JSONObject
                    println(group)

                    val id : Int = group["id"] as Int
                    val name : String = group["name"] as String
                    groups.add(Groupe(id, name))
                }

                val groupAdapter = GroupeAdapter(this, groups)
                val spinner = findViewById<Spinner>(R.id.edt_groupe)
                spinner.adapter = groupAdapter
//
                spinner.onItemSelectedListener = object : AdapterView.OnItemSelectedListener{
                    override fun onNothingSelected(parent: AdapterView<*>?) {}

                    override fun onItemSelected(parent: AdapterView<*>?, view: View?, position: Int, id: Long) {
                        val item = parent?.getItemAtPosition(position)
                        val itemGroupe = item as Groupe

                        println(itemGroupe.id)
                    }
                }
            },
            { error ->
                println(error)
            }
        )

        queue.add(getDaySchedule)

//        spinner.onItemSelectedListener = object : AdapterView.OnItemSelectedListener {
//        override fun onItemSelected(p0: AdapterView<*>?, p1: View?, p2: Int, p3: Long) {
//            println("test")
//            val item = p0?.getItemAtPosition(p2)
//            val itemGroupe = item as Groupe
//
//            println(itemGroupe.id)
//        }
//
//        override fun onNothingSelected(p0: AdapterView<*>?) {
//            println("test 2")
//        }
//        }

//        spinner.setOnItemClickListener { parent, _, position, _ ->
//            val item = parent.getItemAtPosition(position)
//            val itemGroupe = item as Groupe
//
//            groupAdapter.notifyDataSetChanged()
//        }

        val scheduleTableLayout = findViewById<TableLayout>(R.id.schedule_table)

//        val queue = Volley.newRequestQueue(this)
        val loginURL = "http://172.26.82.56:443/schedule/day/3184"

        // Request a string response from the provided URL.
//        val getDaySchedule = JsonArrayRequest(
//            Request.Method.GET, loginURL, null,
//            { response ->
//                for (i in 0 until response.length()) {
//                    val cours : JSONObject = response[i] as JSONObject
//                    val start : String = cours["start"] as String
//                    val end : String = cours["end"] as String
//                    val summary : String = cours["summary"] as String
//                    val location : String = cours["location"] as String
//
//                    val startTime = start.split("T")
//                    val startHour = startTime[1].substring(0,2).toInt()
//                    val startMinute = startTime[1].substring(3,5).toInt()
////
//                    val endTime = end.split("T")
//                    val endHour = endTime[1].substring(0,2).toInt()
//                    val endMinute = endTime[1].substring(3,5).toInt()
////
//                    val coursStart = "${if (startHour < 10) "0" else ""}$startHour:${if (startMinute < 10) "0" else ""}$startMinute"
//                    val coursEnd = "${if (endHour < 10) "0" else ""}$endHour:${if (endMinute < 10) "0" else ""}$endMinute"
//
//                    val tableRow = TableRow(this)
//
////                    val params = TableRow.LayoutParams(TableRow.LayoutParams.MATCH_PARENT, TableRow.LayoutParams.WRAP_CONTENT)
////                    params.bottomMargin = 100
////                    params.marginEnd = 100
//
////                    tableRow.layoutParams = params
////                    tableRow.weightSum = i.toFloat()
//
//                    val scheduleItem = layoutInflater.inflate(R.layout.schedule_item, tableRow, false)
//
//                    scheduleItem.findViewById<TextView>(R.id.schedule_item_time).text = "$coursStart - $coursEnd"
//                    scheduleItem.findViewById<TextView>(R.id.schedule_item_summary).text = summary
//                    scheduleItem.findViewById<TextView>(R.id.schedule_item_location).text = location
//
//                    tableRow.addView(scheduleItem)
//                    scheduleTableLayout.addView(tableRow)
//
//                    val space = TableRow(this)
//                    val textView = TextView(this)
////                    space.layoutParams = TableRow.LayoutParams(TableRow.LayoutParams.MATCH_PARENT, 20)
//
//                    space.addView(textView)
//                    scheduleTableLayout.addView(space)
//                }
//            },
//            { error ->
//                println(error)
//            }
//        )
//
//        queue.add(getDaySchedule)
    }
}