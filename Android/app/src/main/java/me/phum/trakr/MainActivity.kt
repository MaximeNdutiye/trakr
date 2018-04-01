package me.phum.trakr

import android.content.Intent
import android.support.v7.app.AppCompatActivity
import android.os.Bundle
import kotlinx.android.synthetic.main.splash_view.*
import kotlinx.coroutines.experimental.delay
import kotlinx.coroutines.experimental.launch

class MainActivity : AppCompatActivity() {

    var packageListAdapter : PackageAdapter? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        val mapIntent = Intent(this, MapActivity::class.java)

        super.onCreate(savedInstanceState)
        supportActionBar?.hide()
        setContentView(R.layout.splash_view)
        launch {
            delay(1000)
            runOnUiThread {
                val logoFadeOut = splash_logo.animate()
                logoFadeOut.apply {
                    duration = 300
                    alpha(0f)
                }
                logoFadeOut.start()
            }
            delay(300)
            runOnUiThread {
                startActivity(mapIntent)
                finish()
            }
        }

    }

}
