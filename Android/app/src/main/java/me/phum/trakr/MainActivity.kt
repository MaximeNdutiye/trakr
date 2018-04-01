package me.phum.trakr

import android.content.Intent
import android.location.Location
import android.support.v7.app.AppCompatActivity
import android.os.Bundle
import android.support.v7.widget.LinearLayoutManager
import kotlinx.android.synthetic.main.package_list_view.*
import kotlinx.android.synthetic.main.splash_view.*
import kotlinx.coroutines.experimental.delay
import kotlinx.coroutines.experimental.launch
import me.phum.trakr.schema.Loc
import me.phum.trakr.schema.Pack

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
