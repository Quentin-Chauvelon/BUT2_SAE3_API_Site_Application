package com.example.myapplication

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.widget.Toast
import com.android.volley.toolbox.JsonObjectRequest
import com.android.volley.toolbox.Volley
import com.example.myapplication.databinding.ActivityLoginBinding
import com.example.myapplication.databinding.ActivitySignBinding
import com.google.android.material.snackbar.Snackbar
import org.json.JSONObject

class Sign : AppCompatActivity() {
    private lateinit var binding: ActivitySignBinding
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivitySignBinding.inflate(layoutInflater)
        setContentView(binding.root)

        binding.sEnregistrer.setOnClickListener {
            if (binding.login.text.toString().isEmpty() && binding.motDePasse.text.toString().isEmpty()){
                Toast.makeText(this,"Remplissez votre login et mot de passe",Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }
            val login = binding.login.text.toString()
            Volley.newRequestQueue(this).add(object : JsonObjectRequest(
                Method.POST,
                "${BaseURL.url}:${BaseURL.port}/user/register",
                JSONObject().put("login", login)
                    .put("password", binding.motDePasse.text.toString()),
                { response ->
                    Toast.makeText(this, "Bienvenue $login", Toast.LENGTH_SHORT).show()
                    setResult(RESULT_OK, intent.putExtra("Login",login))
                    finish()
                },
                { error ->
                    println(error.networkResponse)
                    Snackbar.make(binding.root, "Erreur, il se peut qu'un compte avec les données données existent déjà", Snackbar.LENGTH_INDEFINITE)
                        .setAction("Quitter"){
                            setResult(RESULT_CANCELED)
                            finish()
                        }
                        .show()
                }
            ) {})
        }

    }
}