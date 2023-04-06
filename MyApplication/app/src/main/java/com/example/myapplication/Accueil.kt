package com.example.myapplication

import android.app.DatePickerDialog
import android.app.DatePickerDialog.OnDateSetListener
import android.content.Intent
import android.content.res.ColorStateList
import android.content.res.Resources.Theme
import android.graphics.Color
import android.graphics.drawable.ColorDrawable
import android.os.Bundle
import android.util.Log
import android.view.View    
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import com.android.volley.Request
import com.android.volley.RequestQueue
import com.android.volley.toolbox.JsonArrayRequest
import com.android.volley.toolbox.JsonObjectRequest
import com.android.volley.toolbox.Volley
import com.example.myapplication.databinding.ActivityAccueilBinding
import org.json.JSONObject
import java.text.SimpleDateFormat
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter
import java.util.*


class Accueil : AppCompatActivity() {
    private lateinit var binding:ActivityAccueilBinding
    private lateinit var queue : RequestQueue
    private var token = ""
    private var scheduleId = 0
    private var favoriteScheduleId = -1
    private val date = Calendar.getInstance()

    private lateinit var scheduleTableLayout : TableLayout
    private lateinit var spinner : Spinner
    private lateinit var dayPicker : Button
    private lateinit var favoriteStar : ImageButton

    fun LoadSchedule() {
        val sharedPref = this.getSharedPreferences("ScheduleTrack Nantes",MODE_PRIVATE)
        with(sharedPref.edit()) {
            putString(
                "scheduleId",
                scheduleId.toString()
            )
            apply()
        }

        scheduleTableLayout.removeAllViews()

        val getDaySchedule = JsonArrayRequest(
            Request.Method.GET, "${BaseURL.url}:${BaseURL.port}/schedule/day/$scheduleId/${SimpleDateFormat("yyyyMMdd", Locale.FRANCE).format(date.time)}T000000000Z", null,
            { response ->
                println(response)

                if (scheduleId == favoriteScheduleId) {
                    favoriteStar.setBackgroundResource(R.drawable.favoris_icon_black)
                } else {
                    favoriteStar.setBackgroundResource(R.drawable.favoris_icon)
                }

                for (i in 0 until response.length()) {
                    val cours : JSONObject = response[i] as JSONObject
                    val start : String = cours["start"] as String
                    val end : String = cours["end"] as String
                    val summary : String = cours["summary"] as String
                    val location : String = cours["location"] as String

                    // On récupère l'heure et les minutes du début du cours
                    val startTime = start.split("T")
                    val startHour = startTime[1].substring(0,2).toInt()
                    val startMinute = startTime[1].substring(3,5).toInt()

                    // On récupère l'heure et les minutes de la fin du cours
                    val endTime = end.split("T")
                    val endHour = endTime[1].substring(0,2).toInt()
                    val endMinute = endTime[1].substring(3,5).toInt()

                    // On ajoute un 0 si les heures ou minutes sont inférieures à 10
                    val coursStart = "${if (startHour < 10) "0" else ""}$startHour:${if (startMinute < 10) "0" else ""}$startMinute"
                    val coursEnd = "${if (endHour < 10) "0" else ""}$endHour:${if (endMinute < 10) "0" else ""}$endMinute"

                    val tableRow = TableRow(this)

                    val scheduleItem = layoutInflater.inflate(R.layout.schedule_item, tableRow, false)

                    // Changement de la couleur du cours en fonction du type de cours
                    if (summary.contains("TP")) {
                        scheduleItem.backgroundTintList = ColorStateList.valueOf(Color.parseColor("#FF9EFF"))
                    } else if (summary.contains("DS")) {
                        scheduleItem.backgroundTintList = ColorStateList.valueOf(Color.parseColor("#BF7F7F"))
                    } else if (summary.contains("Amphi")) {
                        scheduleItem.backgroundTintList = ColorStateList.valueOf(Color.parseColor("#FF7F7F"))
                    } else if (summary.contains("Reunion")) {
                        scheduleItem.backgroundTintList = ColorStateList.valueOf(Color.parseColor("#BFFFFF"))
                    }

                    scheduleItem.findViewById<TextView>(R.id.schedule_item_time).text = "$coursStart - $coursEnd"
                    scheduleItem.findViewById<TextView>(R.id.schedule_item_summary).text = summary
                    scheduleItem.findViewById<TextView>(R.id.schedule_item_location).text = location

                    // On ajoute le cours comme ligne du tableau
                    tableRow.addView(scheduleItem)
                    scheduleTableLayout.addView(tableRow)

                    // On rajoute un text view entre chaque ligne pour créer un espace
                    val space = TableRow(this)
                    val textView = TextView(this)

                    space.addView(textView)
                    scheduleTableLayout.addView(space)
                }
            },
            { error ->
                println(error)
            }
        )

        queue.add(getDaySchedule)
    }


    // Permet de transformer une date sous la forme dd/MM/yyyy
    fun formatDateToString() : String {
        return SimpleDateFormat("dd/MM/yyyy", Locale.FRANCE).format(date.time)
    }


    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_accueil)
        binding = ActivityAccueilBinding.inflate(layoutInflater)
        setContentView(binding.root)

        queue = Volley.newRequestQueue(this)


        scheduleTableLayout = findViewById<TableLayout>(R.id.schedule_table)

        //barre du haut
        binding.logo.setOnClickListener{
            startActivity(Intent(this,Accueil::class.java))
        }
        //Barre du Bas
        binding.roomBtnAccueil.setOnClickListener{
            startActivity(Intent(this,Salles::class.java))
        }
        binding.locationBtnAccueil.setOnClickListener{
            startActivity(Intent(this,Trajet::class.java))
        }
        binding.teacherBtnAccueil.setOnClickListener{
            startActivity(Intent(this,Profs::class.java))
        }


        val groups = mutableListOf<Groupe>(Groupe(0, getString(R.string.choisir_edt)))
        spinner = findViewById<Spinner>(R.id.edt_groupe)


        // On récupère tous les groupes (de TP)
        val getDaySchedule = JsonArrayRequest(
            Request.Method.GET, "${BaseURL.url}:${BaseURL.port}/groups", null,
            { response ->

                // On ajoute chaque groupe à l'adapter pour les afficher dans le spinner
                for (i in 0 until response.length()) {
                    val group: JSONObject = response[i] as JSONObject

                    val id : Int = group["id"] as Int
                    val name : String = group["name"] as String
                    groups.add(Groupe(id, name))
                }

                val groupAdapter = GroupeAdapter(this, groups)
                spinner.adapter = groupAdapter

                // A chaque clic sur un des groupes, on affiche l'emploi du temps correspondant
                spinner.onItemSelectedListener = object : AdapterView.OnItemSelectedListener{
                    override fun onNothingSelected(parent: AdapterView<*>?) {}

                    override fun onItemSelected(parent: AdapterView<*>?, view: View?, position: Int, id: Long) {
                        val item = parent?.getItemAtPosition(position)

                        view?.findViewById<TextView>(R.id.group_item_name)?.setTextColor(Color.WHITE)

                        val itemGroupe = item as Groupe

                        if (itemGroupe.id != 0) {
                            scheduleId = itemGroupe.id
                            LoadSchedule()
                        } else {
                            scheduleTableLayout.removeAllViews()
                        }
                    }
                }
            },
            { error ->
                println(error)
            }
        )

        queue.add(getDaySchedule)


        // Quand on appuie sur la date (en haut à droite), une boîte de dialogue s'ouvre pour pouvoir choisir le jour pour lequel afficher l'edt
        dayPicker = findViewById<Button?>(R.id.day_picker)
        dayPicker.setOnClickListener {
            DatePickerDialog(
                this@Accueil,
                OnDateSetListener {_, year, month, day ->
                    date.set(Calendar.YEAR, year)
                    date.set(Calendar.MONTH, month)
                    date.set(Calendar.DAY_OF_MONTH, day)

                    dayPicker.text = formatDateToString()
                    LoadSchedule()
                },
                date.get(Calendar.YEAR), date.get(Calendar.MONTH), date.get(Calendar.DAY_OF_MONTH)).show()
        }

        // Mettre à jour la date une première fois pour afficher la date du jour actuel
        dayPicker.text = formatDateToString()


        // Quand on clique, sur l'étoile en haut à droite, on met l'emploi du temps en favori (si l'utilisateur est connecté avec un compte)
        favoriteStar = findViewById(R.id.favorite_star)
        favoriteStar.setOnClickListener {
            println("$scheduleId, $token")

            queue.add(object : JsonObjectRequest(
                Method.PUT,
                "${BaseURL.url}:${BaseURL.port}/user/favoriteSchedule",
                JSONObject()
                    .put("token", token)
                    .put("favoriteSchedule", scheduleId),
                { response ->

                    val favoriteScheduleJSON : JSONObject = response as JSONObject
                    if (favoriteScheduleJSON["favoriteSchedule"] != null) {
                        favoriteScheduleId = scheduleId
                        favoriteStar.setBackgroundResource(R.drawable.favoris_icon_black)
                    }
                },

                { error ->
                    println(error)
                    Toast.makeText(this, "ERROR", Toast.LENGTH_SHORT).show()
                }
            ) {})
        }


        // On récupère le token de la connexion, pour pouvoir afficher l'edt favori de l'utilisateur par défaut
        val sharedPref = this.getSharedPreferences("ScheduleTrack Nantes", MODE_PRIVATE)
        val tokenSharedPref = sharedPref.getString("token", "")
        if (tokenSharedPref != null && tokenSharedPref != "") {
            token = tokenSharedPref

            val getFavoriteSchedule = JsonObjectRequest(
                Request.Method.GET, "${BaseURL.url}:${BaseURL.port}/user/favoriteSchedule/$tokenSharedPref", null,
                { response ->
                    println(response)

                    val favoriteScheduleJson : JSONObject = response as JSONObject
                    if (favoriteScheduleJson["favoriteSchedule"] != 0) {
                        val favoriteSchedule = favoriteScheduleJson["favoriteSchedule"] as Int

                        scheduleId = favoriteSchedule
                        favoriteScheduleId = favoriteSchedule
                        LoadSchedule()
                    }
                },
                { error ->
                    println(error)
                }
            )

            queue.add(getFavoriteSchedule)
        }
    }
}