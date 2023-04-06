package com.example.myapplication

import android.app.DatePickerDialog
import android.app.TimePickerDialog
import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import android.widget.Button
import android.widget.ListView
import android.widget.Switch
import com.android.volley.Request
import com.android.volley.RequestQueue
import com.android.volley.toolbox.JsonArrayRequest
import com.android.volley.toolbox.Volley
import com.example.myapplication.databinding.ActivityAccueilBinding
import com.example.myapplication.databinding.ActivitySallesBinding
import org.json.JSONObject
import java.text.SimpleDateFormat
import java.util.*

class Salles : AppCompatActivity() {
    private lateinit var binding:ActivitySallesBinding
    private lateinit var queue : RequestQueue
    private val date = Calendar.getInstance()
    private var computersOnly = false

    private lateinit var datePicker : Button
    private lateinit var timePicker : Button
    private lateinit var computersOnlySwitch : Switch
    private lateinit var searchButton : Button
    private lateinit var sallesListView : ListView


    // Permet de transformer une date sous la forme dd/MM/yyyy
    fun formatDateToString() : String {
        return SimpleDateFormat("dd/MM/yyyy", Locale.FRANCE).format(date.time)
    }

    // Permet de transformer une heure sous la forme hh/mm
    fun formatTimeToString() : String {
        return SimpleDateFormat("hh:mm", Locale.FRANCE).format(date.time)
    }


    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_salles)
        binding = ActivitySallesBinding.inflate(layoutInflater)
        setContentView(binding.root)

        //bar du haut

        binding.logo.setOnClickListener {
            startActivity(Intent(this, Accueil::class.java))
        }

        //Bar du Bas
        binding.locationBtnAccueil.setOnClickListener {
            startActivity(Intent(this, Trajet::class.java))
        }
        binding.teacherBtnAccueil.setOnClickListener {
            startActivity(Intent(this, Profs::class.java))
        }
        binding.homeBtnAccueil.setOnClickListener {
            startActivity(Intent(this, Accueil::class.java))
        }


        queue = Volley.newRequestQueue(this)

        datePicker = findViewById(R.id.salle_date_picker)
        timePicker = findViewById(R.id.salle_time_picker)
        computersOnlySwitch = findViewById(R.id.computersOnlySwitch)
        searchButton = findViewById(R.id.salle_search_button)
        sallesListView = findViewById(R.id.salle_list_view)

        var rooms = mutableListOf<Room>()
        val roomAdapter = RoomAdapter(this, rooms)
        sallesListView.adapter = roomAdapter

        datePicker.setOnClickListener {
            DatePickerDialog(
                this@Salles,
                DatePickerDialog.OnDateSetListener { _, year, month, day ->
                    date.set(Calendar.YEAR, year)
                    date.set(Calendar.MONTH, month)
                    date.set(Calendar.DAY_OF_MONTH, day)

                    datePicker.text = formatDateToString()
                },
                date.get(Calendar.YEAR), date.get(Calendar.MONTH), date.get(Calendar.DAY_OF_MONTH)
            ).show()
        }

        timePicker.setOnClickListener {
            TimePickerDialog(
                this@Salles,
                TimePickerDialog.OnTimeSetListener { _, hour, minute ->
                    date.set(Calendar.HOUR, hour)
                    date.set(Calendar.MINUTE, minute)

                    timePicker.text = formatTimeToString()
                },
                date.get(Calendar.HOUR), date.get(Calendar.MINUTE), true
            ).show()
        }

        // Mettre à jour la date une première fois pour afficher la date du jour
        datePicker.text = formatDateToString()
        timePicker.text = formatTimeToString()

        computersOnlySwitch.setOnCheckedChangeListener { _, isChecked ->
            computersOnly = isChecked
        }

        searchButton.setOnClickListener {
            println("${BaseURL.url}:${BaseURL.port}/rooms/${if (computersOnly) "true" else "false"}/${SimpleDateFormat("yyyyMMdd", Locale.FRANCE).format(date.time)}T${SimpleDateFormat("hhmm", Locale.FRANCE).format(date.time)}00000Z")
            val getFreeRooms = JsonArrayRequest(
                Request.Method.GET, "${BaseURL.url}:${BaseURL.port}/rooms/${if (computersOnly) "true" else "false"}/${SimpleDateFormat("yyyyMMdd", Locale.FRANCE).format(date.time)}T${SimpleDateFormat("hhmm", Locale.FRANCE).format(date.time)}00000Z", null,
                { response ->
                    println(response)
                    roomAdapter.clear()

                    for (i in 0 until response.length()) {
                        val room : JSONObject = response[i] as JSONObject
                        val name = room["name"] as String
                        val computer = room["computerRoom"] as Boolean

                        roomAdapter.add(Room(0, name, computer))
                    }
                },
                { error ->
                    println(error)
                }
            )

            queue.add(getFreeRooms)
        }
        // on search button click, fetch the route rooms/$computersOnly/$dateT$timeZ peupler l'array adapter et la list view avec (list view : nom de la salle + icon salle machine ou non)
    }
}