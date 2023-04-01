package com.example.myapplication

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import com.android.volley.Request
import com.android.volley.toolbox.JsonObjectRequest
import com.android.volley.toolbox.Volley
import com.example.myapplication.databinding.ActivityLoginBinding

class Login : AppCompatActivity() {
    private lateinit var binding: ActivityLoginBinding
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityLoginBinding.inflate(layoutInflater)
        setContentView(binding.root)

        val queue = Volley.newRequestQueue(this)
        val loginURL = "http://172.26.82.56:443/schedules"

        /* binding.inviter.setOnClickListener {
             Intent(this,)
         }*/
        binding.seConnecter.setOnClickListener {
            // Request a string response from the provided URL.
            val jsonObjectRequest = JsonObjectRequest(Request.Method.GET, loginURL, null,
                { response ->
                    binding.info.text = "Response: %s".format(response.toString())
                },
                { error ->
                    binding.info.text = "error: %s".format(error.toString())
                }
            )

            // Add the request to the RequestQueue.
            queue.add(jsonObjectRequest)
            /*
            if (binding.Login.text.toString() == "test" && binding.motDePasse.text.toString() == "test"){
                Intent(this,).PutExtra()
            }*/
        }

    }
}