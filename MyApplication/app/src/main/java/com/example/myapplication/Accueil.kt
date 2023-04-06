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
        scheduleTableLayout.removeAllViews()

        println("http://172.26.82.56:443/schedule/day/$scheduleId/${SimpleDateFormat("yyyyMMdd", Locale.FRANCE).format(date.time)}T000000000Z")
        val getDaySchedule = JsonArrayRequest(
            Request.Method.GET, "http://172.26.82.56:443/schedule/day/$scheduleId/${SimpleDateFormat("yyyyMMdd", Locale.FRANCE).format(date.time)}T000000000Z", null,
            { response ->

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

                    val startTime = start.split("T")
                    val startHour = startTime[1].substring(0,2).toInt()
                    val startMinute = startTime[1].substring(3,5).toInt()

                    val endTime = end.split("T")
                    val endHour = endTime[1].substring(0,2).toInt()
                    val endMinute = endTime[1].substring(3,5).toInt()

                    val coursStart = "${if (startHour < 10) "0" else ""}$startHour:${if (startMinute < 10) "0" else ""}$startMinute"
                    val coursEnd = "${if (endHour < 10) "0" else ""}$endHour:${if (endMinute < 10) "0" else ""}$endMinute"

                    val tableRow = TableRow(this)

                    val scheduleItem = layoutInflater.inflate(R.layout.schedule_item, tableRow, false)

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

                    tableRow.addView(scheduleItem)
                    scheduleTableLayout.addView(tableRow)

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


        val groups = mutableListOf<Groupe>(Groupe(0, "Choisissez un groupe"))
        spinner = findViewById<Spinner>(R.id.edt_groupe)

        val getDaySchedule = JsonArrayRequest(
            Request.Method.GET, "http://172.26.82.56:443/groups", null,
            { response ->

                for (i in 0 until response.length()) {
                    val group: JSONObject = response[i] as JSONObject

                    val id : Int = group["id"] as Int
                    val name : String = group["name"] as String
                    groups.add(Groupe(id, name))
                }

                val groupAdapter = GroupeAdapter(this, groups)
                spinner.adapter = groupAdapter

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


        val sharedPref = this.getPreferences(MODE_PRIVATE)
        val tokenSharedPref = sharedPref.getString("token", "")
        println("fjdksfjslqfjkldmfjlsd $token")
        if (tokenSharedPref != null && tokenSharedPref != "") {
            token = tokenSharedPref

            val getFavoriteSchedule = JsonArrayRequest(
                Request.Method.GET, "http://172.26.82.56:443/favoriteSchedule/$tokenSharedPref", null,
                { response ->
                    println(response)

                    val favoriteScheduleJson : JSONObject = response as JSONObject
                    if (favoriteScheduleJson["favoriteSchedule"] != null && favoriteScheduleJson["favoriteSchedule"] != 0) {
                        val favoriteSchedule = favoriteScheduleJson["favoriteSchedule"] as Int
                        Log.i("fjsdkmfj", favoriteScheduleJson["favoriteSchedule"] as String)

                        scheduleId = favoriteSchedule
                        LoadSchedule()
                    }
                },
                { error ->
                    println(error)
                }
            )

            queue.add(getFavoriteSchedule)
        }

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

        // Mettre à jour la date une première fois pour afficher la date du jour
        dayPicker.text = formatDateToString()


        favoriteStar = findViewById(R.id.favorite_star)
        favoriteStar.setOnClickListener {
            queue.add(object : JsonObjectRequest(
                Method.POST,
                "http://172.26.82.56:443/user/favoriteSchedule",
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

//        val queue = Volley.newRequestQueue(this)
    }
}