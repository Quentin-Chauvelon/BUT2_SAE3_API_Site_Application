package com.example.myapplication

import android.content.Intent
import android.content.res.ColorStateList
import android.graphics.Color
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.widget.*
import androidx.core.widget.doOnTextChanged
import com.android.volley.Request
import com.android.volley.RequestQueue
import com.android.volley.toolbox.JsonArrayRequest
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
    private var heureArrivee = ""
    private var transitMode = ""

    private lateinit var adresse : EditText
    private lateinit var arrivee : TextView
    private lateinit var transit : ImageButton
    private lateinit var bicycling : ImageButton
    private lateinit var walking : ImageButton
    private lateinit var driving : ImageButton
    private lateinit var trajetRechercher : Button


    fun RechercherTrajet() {
        println("${BaseURL.url}:${BaseURL.port}/directions/${adresse.text}/${arrivee.text}/$transitMode")
        val getTeacherSchedule = JsonArrayRequest(
            Request.Method.GET, "${BaseURL.url}:${BaseURL.port}/directions/${adresse.text}/${arrivee.text}/$transitMode", null,
            { response ->
                println(response)


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
                                arrivee.text = date.toString()
                                heureArrivee = date.time.toString()
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