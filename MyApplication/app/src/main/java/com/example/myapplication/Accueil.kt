package com.example.myapplication

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import com.example.myapplication.databinding.ActivityAccueilBinding
import com.example.myapplication.databinding.ActivityLoginBinding

class Accueil : AppCompatActivity() {
    private lateinit var binding:ActivityAccueilBinding
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_accueil)
        binding = ActivityAccueilBinding.inflate(layoutInflater)
        setContentView(binding.root)

        //bar du haut
        binding.logoAccueil.setOnClickListener{
            startActivity(Intent(this,Accueil::class.java))
        }
        binding.favorisBtnAccueil.setOnClickListener{
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
        binding.homeBtnAccueil.setOnClickListener{
            startActivity(Intent(this,Accueil::class.java))
        }

    }
}