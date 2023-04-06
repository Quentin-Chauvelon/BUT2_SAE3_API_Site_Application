package com.example.myapplication

import android.app.DatePickerDialog
import android.content.Intent
import android.content.res.ColorStateList
import android.graphics.Color
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import android.widget.*
import androidx.constraintlayout.widget.ConstraintLayout
import androidx.core.widget.addTextChangedListener
import androidx.core.widget.doOnTextChanged
import com.android.volley.Request
import com.android.volley.RequestQueue
import com.android.volley.toolbox.JsonArrayRequest
import com.android.volley.toolbox.JsonObjectRequest
import com.android.volley.toolbox.Volley
import com.example.myapplication.databinding.ActivityAccueilBinding
import com.example.myapplication.databinding.ActivityProfsBinding
import org.json.JSONObject
import java.text.SimpleDateFormat
import java.util.*

class Profs : AppCompatActivity() {
    private lateinit var binding:ActivityProfsBinding
    private lateinit var queue : RequestQueue
    private var profId = 0
    private val date = Calendar.getInstance()

    private lateinit var profEditText : EditText
    private lateinit var profListView : ListView
    private lateinit var profCours : ConstraintLayout
    private lateinit var dayPicker : Button


    fun ProfCours() {
        val getTeacherSchedule = JsonArrayRequest(
            Request.Method.GET, "${BaseURL.url}:${BaseURL.port}/teacher/${profId}", null,
            { response ->
                println(response)

                val now = SimpleDateFormat("hh:mm", Locale.FRANCE).format(Calendar.getInstance().time)
                var coursFound = false

                for (i in 0 until response.length()) {
                    val cours: JSONObject = response[i] as JSONObject
                    val start : String = cours["start"] as String
                    val end : String = cours["end"] as String
                    val summary : String = cours["summary"] as String
                    val location : String = cours["location"] as String

                    val startTime = start.split("T")
                    val startHour = startTime[1].substring(0,2).toInt()
                    val startMinute = startTime[1].substring(3,5).toInt()

                    val endTime = end.split("T")
                    val endHour = endTime[1].substring(0,2).toInt()
                    val endMinute = endTime[1].substring(3,5).toInt()

                    val coursStart = "${if (startHour < 10) "0" else ""}$startHour:${if (startMinute < 10) "0" else ""}$startMinute"
                    val coursEnd = "${if (endHour < 10) "0" else ""}$endHour:${if (endMinute < 10) "0" else ""}$endMinute"

                    if (now > coursStart && now < coursEnd) {
                        coursFound = true

                        if (summary.contains("TP")) {
                            profCours.backgroundTintList = ColorStateList.valueOf(Color.parseColor("#FF9EFF"))
                        } else if (summary.contains("DS")) {
                            profCours.backgroundTintList = ColorStateList.valueOf(Color.parseColor("#BF7F7F"))
                        } else if (summary.contains("Amphi")) {
                            profCours.backgroundTintList = ColorStateList.valueOf(Color.parseColor("#FF7F7F"))
                        } else if (summary.contains("Reunion")) {
                            profCours.backgroundTintList = ColorStateList.valueOf(Color.parseColor("#BFFFFF"))
                        } else {
                            profCours.backgroundTintList = ColorStateList.valueOf(Color.parseColor("#8FC1FD"))
                        }

                        profCours.findViewById<TextView>(R.id.schedule_item_time).text = "$coursStart - $coursEnd"
                        profCours.findViewById<TextView>(R.id.schedule_item_summary).text = summary
                        profCours.findViewById<TextView>(R.id.schedule_item_location).text = location
                    }
                }

                if (!coursFound) {
                    profCours.backgroundTintList = ColorStateList.valueOf(Color.parseColor("#FAFAFA"))
                    profCours.findViewById<TextView>(R.id.schedule_item_time).text = ""
                    profCours.findViewById<TextView>(R.id.schedule_item_summary).text = "Ce professeur n'a pas cours pour le moment"
                    profCours.findViewById<TextView>(R.id.schedule_item_location).text = ""
                }
            },
            { error ->
                println(error)
            }
        )

        queue.add(getTeacherSchedule)
    }


    fun formatDateToString() : String {
        return SimpleDateFormat("dd/MM/yyyy", Locale.FRANCE).format(date.time)
    }


    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_profs)
        binding = ActivityProfsBinding.inflate(layoutInflater)
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
        binding.homeBtnAccueil.setOnClickListener{
            startActivity(Intent(this,Accueil::class.java))
        }


        queue = Volley.newRequestQueue(this)

        profEditText = findViewById(R.id.prof_edit_text)
        profListView = findViewById(R.id.prof_list_view)
        profCours = findViewById(R.id.prof_cours)

        var teachers = mutableListOf<Prof>()
        val teacherAdapter = ProfAdapter(this, teachers)
        profListView.adapter = teacherAdapter

        val getFavoriteSchedule = JsonArrayRequest(
            Request.Method.GET, "${BaseURL.url}:${BaseURL.port}/teachers", null,
            { response ->
                println(response)

                for (i in 0 until response.length()) {
                    val prof: JSONObject = response[i] as JSONObject
                    val id : Int = prof["id"] as Int
                    val name : String = prof["name"] as String

                    teachers.add(Prof(id, name))
                }

                teacherAdapter.notifyDataSetChanged()
            },
            { error ->
                println(error)
            }
        )

        queue.add(getFavoriteSchedule)


        profEditText.doOnTextChanged { text, _, _, _ ->
            println(text)
            teacherAdapter.filter.filter(text)
            teacherAdapter.notifyDataSetChanged()
        }


        dayPicker = findViewById<Button?>(R.id.prof_day_picker)
        dayPicker.setOnClickListener {
            DatePickerDialog(
                this@Profs,
                DatePickerDialog.OnDateSetListener { _, year, month, day ->
                    date.set(Calendar.YEAR, year)
                    date.set(Calendar.MONTH, month)
                    date.set(Calendar.DAY_OF_MONTH, day)

                    dayPicker.text = formatDateToString()
                    ProfCours()
                },
                date.get(Calendar.YEAR), date.get(Calendar.MONTH), date.get(Calendar.DAY_OF_MONTH)).show()
        }

        // Mettre à jour la date une première fois pour afficher la date du jour
        dayPicker.text = formatDateToString()


        profListView.setOnItemClickListener { parent, view, position, l ->
            val item = parent?.getItemAtPosition(position)

            val itemProf = item as Prof
            profId = itemProf.id
            ProfCours()
        }

        // Cacher le cours en mettant son fond blanc
        profCours.backgroundTintList = ColorStateList.valueOf(Color.parseColor("#FAFAFA"))
    }
}