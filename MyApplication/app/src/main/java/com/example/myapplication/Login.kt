package com.example.myapplication

import android.content.Intent
import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.android.volley.toolbox.JsonObjectRequest
import com.android.volley.toolbox.Volley
import com.example.myapplication.databinding.ActivityLoginBinding
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
            queue.add(object : JsonObjectRequest(
                Method.POST,
                "http://172.26.82.56:443/user/login",
                JSONObject().put("login", binding.login.text.toString())
                    .put("password", binding.motDePasse.text.toString()),
                { response ->
                    val login: JSONObject = response as JSONObject
                    login.getString("token")
                    val sharedPref = this.getPreferences(MODE_PRIVATE)
                    with(sharedPref.edit()) {
                        putString(
                            getString(com.example.myapplication.R.string.app_name),
                            login.getString("token")
                        )
                        apply()
                    }
                    println(login)
                    startActivity(Intent(this, Accueil::class.java))
                },
                { error ->
                    println(error)
                    Toast.makeText(this, "ERROR", Toast.LENGTH_SHORT).show()
                }
            ) {})
        }

        startActivity(Intent(this@Login, Accueil::class.java))
    }
}