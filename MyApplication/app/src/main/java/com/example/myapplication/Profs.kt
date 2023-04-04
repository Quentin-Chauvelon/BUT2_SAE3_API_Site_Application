package com.example.myapplication

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import com.example.myapplication.databinding.ActivityAccueilBinding
import com.example.myapplication.databinding.ActivityProfsBinding

class Profs : AppCompatActivity() {
    private lateinit var binding:ActivityProfsBinding
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_profs)
        binding = ActivityProfsBinding.inflate(layoutInflater)
        setContentView(binding.root)
        //bar du haut
        binding.includedLayout.logoAccueil.setOnClickListener{
            startActivity(Intent(this,Accueil::class.java))
        }
        binding.includedLayout.favorisBtnAccueil.setOnClickListener{
            startActivity(Intent(this,Accueil::class.java))
        }

        //Bar du Bas
        binding.includedLayout.roomBtnAccueil.setOnClickListener{
            startActivity(Intent(this,Salles::class.java))
        }
        binding.includedLayout.locationBtnAccueil.setOnClickListener{
            startActivity(Intent(this,Trajet::class.java))
        }
        binding.includedLayout.teacherBtnAccueil.setOnClickListener{
            startActivity(Intent(this,Profs::class.java))
        }
        binding.includedLayout.homeBtnAccueil.setOnClickListener{
            startActivity(Intent(this,Accueil::class.java))
        }




    }
}