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

        // Si l'utilisateur appuie sur le bouton entrer sans compte, il le renvoie directement sur la page d'accueil
        binding.inviter.setOnClickListener {
            startActivity(Intent(this, Accueil::class.java))
        }

        // Quand on appuie sur le bouton se connecter, on fait un post sur la route pour se connecter
        binding.seConnecter.setOnClickListener {
            val login = binding.login.text.toString()
            queue.add(object : JsonObjectRequest(
                Method.POST,
                "${BaseURL.url}:${BaseURL.port}/user/login",
                JSONObject().put("login", login)
                    .put("password", binding.motDePasse.text.toString()),
                { response ->

                    val token: JSONObject = response as JSONObject

                    // On stocke le token que l'on récupère (permet d'être rejoué sur les routes nécessitant d'être connecté)
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


        // Quand on récupère le résultat de l'activité, on affiche une Snackbar pour indiquer à l'utilisateur de se connecter
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

        // Quand on appuie sur enregister, on lance une nouvelle activité pour permettre de s'enregistrer,
        // puis lorsque l'on récupère le résultat, on indique à l'utilisateur de se connecter
        binding.sEnregistrer.setOnClickListener {
            enregistrement.launch(Intent(this, Sign::class.java))
          }

    }
}