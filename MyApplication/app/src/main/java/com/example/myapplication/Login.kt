package com.example.myapplication

import android.content.Intent
import android.os.Bundle
import android.widget.Toast
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import com.android.volley.toolbox.JsonObjectRequest
import com.android.volley.toolbox.Volley
import com.example.myapplication.databinding.ActivityLoginBinding
import com.google.android.material.snackbar.Snackbar
import org.json.JSONObject

class Login : AppCompatActivity() {
    private lateinit var binding: ActivityLoginBinding
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityLoginBinding.inflate(layoutInflater)
        setContentView(binding.root)

        val queue = Volley.newRequestQueue(this)

        binding.inviter.setOnClickListener {
            startActivity(Intent(this, Accueil::class.java))
        }
        binding.seConnecter.setOnClickListener {
            val login = binding.login.text.toString()
            queue.add(object : JsonObjectRequest(
                Method.POST,
                "http://172.26.82.56:443/user/login",
                JSONObject().put("login", login)
                    .put("password", binding.motDePasse.text.toString()),
                { response ->

                    val token: JSONObject = response as JSONObject

                    val sharedPref = this.getSharedPreferences("ScheduleTrack Nantes",MODE_PRIVATE)
                    with(sharedPref.edit()) {
                        putString(
                            "token",
                            token["token"] as String
                        )
                        apply()
                    }

                    Toast.makeText(this, "Bienvenue $login", Toast.LENGTH_SHORT).show()
                    startActivity(Intent(this, Accueil::class.java))
                },

                { error ->
                    println(error)
                    Toast.makeText(this, "ERROR", Toast.LENGTH_SHORT).show()
                }
            ) {})
        }

        val enregistrement = registerForActivityResult(ActivityResultContracts.StartActivityForResult()) {
                result ->
            if (result.resultCode == RESULT_OK) {
                Toast.makeText(this, "Merci de t'être inscrit ${result.data?.extras?.get("Login")}", Toast.LENGTH_SHORT).show()
                Snackbar.make(
                    binding.root,
                    "Connecte toi avec ton nouveau compte",
                    Snackbar.LENGTH_INDEFINITE
                ).show()
            }
        }

        binding.sEnregistrer.setOnClickListener {
            enregistrement.launch(Intent(this, Sign::class.java))
          }

    }
}