package com.example.myapplication

import android.content.Intent
import android.content.res.ColorStateList
import android.graphics.Color
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.widget.*
import androidx.core.widget.doOnTextChanged
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.android.volley.Request
import com.android.volley.RequestQueue
import com.android.volley.toolbox.JsonArrayRequest
import com.android.volley.toolbox.JsonObjectRequest
import com.android.volley.toolbox.Volley
import com.example.myapplication.databinding.ActivityAccueilBinding
import com.example.myapplication.databinding.ActivitySallesBinding
import com.example.myapplication.databinding.ActivityTrajetBinding
import org.json.JSONArray
import org.json.JSONObject
import java.text.SimpleDateFormat
import java.util.*

class Trajet : AppCompatActivity() {
    private lateinit var binding:ActivityTrajetBinding
    private lateinit var queue : RequestQueue
    private lateinit var heureArrivee : Date
    private var transitMode = "transit"
    private var stepsList = mutableListOf<Step>()
    private lateinit var stepsAdapter : StepAdapter

    private lateinit var adresse : EditText
    private lateinit var arrivee : TextView
    private lateinit var transit : ImageButton
    private lateinit var bicycling : ImageButton
    private lateinit var walking : ImageButton
    private lateinit var driving : ImageButton
    private lateinit var trajetRechercher : Button
    private lateinit var heureDepart : TextView
    private lateinit var dureeTrajet : TextView
    private lateinit var stepsListView : RecyclerView


    fun RechercherTrajet() {
        println("${BaseURL.url}:${BaseURL.port}/directions/${adresse.text}/${heureArrivee.time}/$transitMode")
        val getTeacherSchedule = JsonObjectRequest(
            Request.Method.GET, "${BaseURL.url}:${BaseURL.port}/directions/${adresse.text}/${heureArrivee.time}/$transitMode", null,
            { response ->
                println(response)

                if (response["status"] != null && response["status"] == "OK") {
                    stepsList.clear()


                    val routes = response["routes"] as JSONArray?
                    if (routes != null && routes.length() > 0) {
                        val route0 = routes[0] as JSONObject

                        val legs = route0["legs"] as JSONArray?
                        if (legs != null && legs.length() > 0) {
                            val leg0 = legs[0] as JSONObject

                            val duration = leg0["duration"] as JSONObject?
                            if (duration != null) {
                                dureeTrajet.text = "Duree : ${duration["text"] as String}"

                                val timeDepart = Date(heureArrivee.time.minus(duration["value"] as Int * 1000))
                                heureDepart.text = "Départ à : ${timeDepart.hours}:${timeDepart.minutes}"
                            }

                            val steps = leg0["steps"] as JSONArray?
                            if (steps != null) {

                                if (transitMode != "transit") {
                                    for (i in 0 until steps.length()) {
                                        val step = steps[i] as JSONObject

                                        val duration = (step["duration"] as JSONObject)["text"] as String
                                        val distance = (step["distance"] as JSONObject)["text"] as String
                                        val description = (step["html_instructions"] as String)
                                            .replace("<b>", "")
                                            .replace("</b>", "")
                                            .replace("<div style=\\\"font-size:0.9em\\\">", "")
                                            .replace("</div>", "")
                                            .replace("/<wbr/>", "")

                                        stepsList.add(Step(description, duration, distance))
                                    }

                                } else {
                                    for (i in 0 until steps.length()) {
                                        val step = steps[i] as JSONObject

                                        var lineName = ""

                                        val travelMode = step["travel_mode"] as String
                                        if (travelMode == "TRANSIT") {
                                            val transitDetails = step["transit_details"] as JSONObject
                                            val line = transitDetails["line"] as JSONObject
                                            lineName = line["short_name"] as String
                                        }

                                        val duration = (step["duration"] as JSONObject)["text"] as String
                                        val distance = (step["distance"] as JSONObject)["text"] as String
                                        val description = "${(step["html_instructions"] as String)} ${if (lineName != "") "(Ligne $lineName)" else ""}"

                                        stepsList.add(Step(description, duration, distance))
                                    }
                                }

                                stepsAdapter.notifyDataSetChanged()
                            }
                        }
                    }
                }
            },
            { error ->
                println(error)
            }
        )

        queue.add(getTeacherSchedule)
    }


    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_trajet)
        binding = ActivityTrajetBinding.inflate(layoutInflater)
        setContentView(binding.root)

        //bar du haut

        binding.logo.setOnClickListener{
            startActivity(Intent(this,Accueil::class.java))
        }

        //Bar du Bas
        binding.roomBtnAccueil.setOnClickListener {
            startActivity(Intent(this, Salles::class.java))
        }
        binding.teacherBtnAccueil.setOnClickListener{
            startActivity(Intent(this,Profs::class.java))
        }
        binding.homeBtnAccueil.setOnClickListener{
            startActivity(Intent(this,Accueil::class.java))
        }

        queue = Volley.newRequestQueue(this)


        adresse = findViewById(R.id.trajet_adresse)
        arrivee = findViewById(R.id.trajet_arrivee)
        transit = findViewById(R.id.transit)
        bicycling = findViewById(R.id.bicycling)
        walking = findViewById(R.id.walking)
        driving = findViewById(R.id.driving)
        trajetRechercher = findViewById(R.id.trajet_rechercher)
        heureDepart = findViewById(R.id.heure_depart)
        dureeTrajet = findViewById(R.id.duree_trajet)
        stepsListView = findViewById(R.id.steps_list_view)

        val recyclerView = findViewById<RecyclerView>(R.id.steps_list_view)
        recyclerView.layoutManager = LinearLayoutManager(this)
        stepsAdapter = StepAdapter(stepsList)
        recyclerView.adapter = stepsAdapter
//        stepsAdapter = StepAdapter(this, stepsList)
//        stepsListView.adapter = stepsAdapter

        val sharedPref = this.getSharedPreferences("ScheduleTrack Nantes",MODE_PRIVATE)
        val coursArrivee = sharedPref.getInt("arrivee", 0)
        val scheduleId = sharedPref.getString("scheduleId", "")
        println("schedule id $scheduleId")

        if (scheduleId == "") {
            arrivee.text = "Veuillez choisir un emploi du temps"
            Toast.makeText(this, "Veuillez choisir un emploi du temps", Toast.LENGTH_LONG).show()
        }

        if (coursArrivee == 0 && scheduleId != "") {

            val getScheduleWeek = JsonArrayRequest(
                Request.Method.GET, "${BaseURL.url}:${BaseURL.port}/schedule/week/$scheduleId", null,
                { response ->
                    println(response)

                    var foundNextCours = false
//                    val now = SimpleDateFormat("hh:mm", Locale.FRANCE).format(Calendar.getInstance().time)
                    val now = Calendar.getInstance().time

                    for (i in 0 until response.length()) {
                        val coursJour: JSONArray = response[i] as JSONArray

                        for (j in 0 until coursJour.length()) {
                            val cours : JSONObject = coursJour[j] as JSONObject
                            val start = cours["start"] as String

                            val startTime = start.split("T")
                            val startHour = startTime[1].substring(0,2).toInt()
                            val startMinute = startTime[1].substring(3,5).toInt()

                            val date = SimpleDateFormat("yyyy-MM-dd", Locale.FRANCE).parse(start)
                            date.time = date.time.plus(startHour * 3600 * 1000 + startMinute * 60 * 1000)

                            if (!foundNextCours && now.time < date.time) {
                                foundNextCours = true
                                arrivee.text = "${getString(R.string.arriv_e)} : ${if (date.hours < 10) "0" else ""}${date.hours}:${if (date.minutes < 10) "0" else ""}${date.minutes}"
                                heureArrivee = date
                            }
                        }
                    }
                },
                { error ->
                    println(error)
                }
            )

            queue.add(getScheduleWeek)
        }


        transit.setOnClickListener {
            transitMode = "transit"
            driving.backgroundTintList = ColorStateList.valueOf(Color.parseColor("#FFA4A4A4"))
            walking.backgroundTintList = ColorStateList.valueOf(Color.parseColor("#FFA4A4A4"))
            bicycling.backgroundTintList = ColorStateList.valueOf(Color.parseColor("#FFA4A4A4"))
            transit.backgroundTintList = ColorStateList.valueOf(Color.BLACK)
        }
        bicycling.setOnClickListener {
            transitMode = "bicycling"
            bicycling.backgroundTintList = ColorStateList.valueOf(Color.BLACK)
            driving.backgroundTintList = ColorStateList.valueOf(Color.parseColor("#FFA4A4A4"))
            walking.backgroundTintList = ColorStateList.valueOf(Color.parseColor("#FFA4A4A4"))
            transit.backgroundTintList = ColorStateList.valueOf(Color.parseColor("#FFA4A4A4"))
        }
        walking.setOnClickListener {
            transitMode = "walking"
            walking.backgroundTintList = ColorStateList.valueOf(Color.BLACK)
            driving.backgroundTintList = ColorStateList.valueOf(Color.parseColor("#FFA4A4A4"))
            transit.backgroundTintList = ColorStateList.valueOf(Color.parseColor("#FFA4A4A4"))
            bicycling.backgroundTintList = ColorStateList.valueOf(Color.parseColor("#FFA4A4A4"))
        }
        driving.setOnClickListener {
            transitMode = "driving"
            driving.backgroundTintList = ColorStateList.valueOf(Color.BLACK)
            transit.backgroundTintList = ColorStateList.valueOf(Color.parseColor("#FFA4A4A4"))
            walking.backgroundTintList = ColorStateList.valueOf(Color.parseColor("#FFA4A4A4"))
            bicycling.backgroundTintList = ColorStateList.valueOf(Color.parseColor("#FFA4A4A4"))
        }


        trajetRechercher.setOnClickListener {
            RechercherTrajet()
        }
    }
}