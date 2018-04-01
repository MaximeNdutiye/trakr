package me.phum.trakr

import android.animation.Animator
import android.animation.ArgbEvaluator
import android.graphics.Color
import android.support.v7.app.AppCompatActivity
import android.os.Bundle
import android.support.design.widget.BottomSheetBehavior
import android.support.design.widget.CoordinatorLayout
import android.support.v4.content.ContextCompat
import android.support.v7.widget.LinearLayoutManager
import android.view.View
import android.widget.LinearLayout

import com.google.android.gms.maps.CameraUpdateFactory
import com.google.android.gms.maps.GoogleMap
import com.google.android.gms.maps.OnMapReadyCallback
import com.google.android.gms.maps.SupportMapFragment
import com.google.android.gms.maps.model.BitmapDescriptorFactory
import com.google.android.gms.maps.model.LatLng
import com.google.android.gms.maps.model.MarkerOptions
import kotlinx.android.synthetic.main.package_list_view.*
import me.phum.trakr.schema.Loc
import me.phum.trakr.schema.Pack
import android.support.v4.app.ActivityCompat
import android.content.pm.PackageManager
import android.location.Location
import android.support.annotation.NonNull
import android.util.Log
import com.google.android.gms.location.FusedLocationProviderClient
import com.google.android.gms.location.LocationServices
import com.google.android.gms.tasks.Task
import com.google.android.gms.tasks.OnCompleteListener
import kotlinx.android.synthetic.main.activity_map.*
import kotlinx.android.synthetic.main.info_panel.*
import kotlinx.coroutines.experimental.delay
import kotlinx.coroutines.experimental.launch


class MapActivity : AppCompatActivity(), OnMapReadyCallback {

    private lateinit var mMap: GoogleMap
    private lateinit var bottomSheetBehaviour: BottomSheetBehavior<LinearLayout>
    private var lastKnownLocation : Location? = null
    var packageListAdapter : PackageAdapter? = null
    val HUES = listOf(BitmapDescriptorFactory.HUE_AZURE,
            BitmapDescriptorFactory.HUE_BLUE,
            BitmapDescriptorFactory.HUE_GREEN,
            BitmapDescriptorFactory.HUE_ORANGE,
            BitmapDescriptorFactory.HUE_VIOLET,
            BitmapDescriptorFactory.HUE_YELLOW)
    var packageList = listOf<Pack>(
            Pack("0000-0000-0001", listOf(
                    Loc("Toronto", 0, 45.4187698,-75.6917538)
            ), 1525200919949, "Canada Post", "", HUES.shuffled().first()),
            Pack("0000-0000-0001", listOf(
                    Loc("Toronto", 0, 50.733797,  -83.181364)
            ), 1525200919949, "Canada Post", "", HUES.shuffled().first()),
            Pack("0000-0000-0001", listOf(
                    Loc("Toronto", 0, 42.674930, -73.870623)
            ), 1525200919949, "Canada Post", "", HUES.shuffled().first()),
            Pack("0000-0000-0001", listOf(
                    Loc("Toronto", 0, 34.634091,  -117.726935)
            ), 1525200919949, "Canada Post", "", HUES.shuffled().first()),
            Pack("0000-0000-0001", listOf(
                    Loc("Toronto", 0, 45.117508, -117.732857)
            ), 1525200919949, "Canada Post", "", HUES.shuffled().first()),
            Pack("0000-0000-0001", listOf(
                    Loc("Toronto", 0, 27.092760, -81.510807)
            ), 1525200919949, "Canada Post", "", HUES.shuffled().first())
    )

    val PERMISSIONS_REQUEST_ACCESS_FINE_LOCATION = 5
    var haveLocationPermission = false
    private fun getLocationPermission() {
        /*
     * Request location permission, so that we can get the location of the
     * device. The result of the permission request is handled by a callback,
     * onRequestPermissionsResult.
     */
        if (ContextCompat.checkSelfPermission(this.applicationContext,
                android.Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED) {
            haveLocationPermission = true
            getDeviceLocation()
        } else {
            ActivityCompat.requestPermissions(this,
                    arrayOf(android.Manifest.permission.ACCESS_FINE_LOCATION),
                    PERMISSIONS_REQUEST_ACCESS_FINE_LOCATION)
        }
    }

    override fun onRequestPermissionsResult(requestCode: Int,
                                            permissions: Array<String>,
                                            grantResults: IntArray) {
        haveLocationPermission = false
        when (requestCode) {
            PERMISSIONS_REQUEST_ACCESS_FINE_LOCATION -> {
                // If request is cancelled, the result arrays are empty.
                if (grantResults.size > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                    haveLocationPermission = true
                    getDeviceLocation()
                }
            }
        }
    }

    lateinit var fusedLocationProviderClient : FusedLocationProviderClient

    var listTitleBackgroundColor : Int = 0
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_map)
        supportActionBar?.hide()
        listTitleBackgroundColor = ContextCompat.getColor(this, R.color.secondaryDarkColor)
        // Obtain the SupportMapFragment and get notified when the map is ready to be used.
        val mapFragment = supportFragmentManager
                .findFragmentById(R.id.map) as SupportMapFragment
        mapFragment.getMapAsync(this)
        bottomSheetBehaviour = BottomSheetBehavior.from(bottom_sheet)
        bottomSheetBehaviour.isHideable = false
        bottomSheetBehaviour.setBottomSheetCallback(object : BottomSheetBehavior.BottomSheetCallback() {
            override fun onSlide(bottomSheet: View, slideOffset: Float) {
                if (slideOffset >= 0) {
                    val defaultMargin = 120
                    val layoutParams = bottomSheet.layoutParams as CoordinatorLayout.LayoutParams
                    layoutParams.leftMargin = (defaultMargin * (1 - slideOffset)).toInt()
                    layoutParams.rightMargin = layoutParams.leftMargin
                    bottomSheet.layoutParams = layoutParams


                    package_list_title.setBackgroundColor(ArgbEvaluator().evaluate(slideOffset, listTitleBackgroundColor, Color.parseColor("#ffffff")) as Int)
                    package_list_title.setTextColor(ArgbEvaluator().evaluate(slideOffset, Color.parseColor("#ffffff"), listTitleBackgroundColor) as Int)
                }
            }

            override fun onStateChanged(bottomSheet: View, newState: Int) {
            }
        })
        package_list.layoutManager = LinearLayoutManager(this).apply {
            orientation = LinearLayoutManager.VERTICAL
        }
        packageListAdapter = PackageAdapter(packageList)
        packageListAdapter?.itemClickListener = object : PackageAdapter.ItemClickListener {
            override fun onItemSelect(pack: Pack) {
                mMap.animateCamera(CameraUpdateFactory.newLatLngZoom(pack.lastKnownLocation.getLatLng(), 10f))
                bottomSheetBehaviour.state = BottomSheetBehavior.STATE_COLLAPSED
            }
        }
        package_list.adapter = packageListAdapter
        fusedLocationProviderClient = LocationServices.getFusedLocationProviderClient(this);
        info_panel_root.visibility = View.GONE
    }

    override fun onBackPressed() {
        if (bottomSheetBehaviour.state == BottomSheetBehavior.STATE_EXPANDED) {
            bottomSheetBehaviour.state = BottomSheetBehavior.STATE_COLLAPSED
        } else {
            super.onBackPressed()
        }
    }

    /**
     * Manipulates the map once available.
     * This callback is triggered when the map is ready to be used.
     * This is where we can add markers or lines, add listeners or move the camera. In this case,
     * we just add a marker near Sydney, Australia.
     * If Google Play services is not installed on the device, the user will be prompted to install
     * it inside the SupportMapFragment. This method will only be triggered once the user has
     * installed Google Play services and returned to the app.
     */
    override fun onMapReady(googleMap: GoogleMap) {
        mMap = googleMap
        mMap.setOnMarkerClickListener {
            if (it.tag != null) {
                val pack = packageList[it.tag as Int]
                launch {
                    runOnUiThread {
                        if (info_panel_root.visibility != View.VISIBLE) {
                            info_panel_root.alpha = 0f
                        }
                        info_panel_root.visibility = View.VISIBLE
                        ip_label.text = "Shoes"
                        ip_eta.text = "Arriving: ${pack.getFormattedArrivalTime()}"
                        ip_last_location.text = "Currently In ${pack.location.last().name}"
                        ip_track_id.text = "${pack.trackingId}"

                        val infoPanelAnimation = info_panel_root.animate()
                        infoPanelAnimation.apply {
                            duration = 500
                            alpha(1f)
                        }
                        val packageListAnimation = package_list_root.animate()
                        packageListAnimation.apply {
                            duration = 500
                            alpha(0f)
                        }
                        infoPanelAnimation.start()
                        packageListAnimation.start()
                    }
                    delay(500)
                    runOnUiThread {
                        package_list_root.visibility = View.GONE
                        bottomSheetBehaviour.state = BottomSheetBehavior.STATE_EXPANDED
                    }
                }
            }
            false
        }

        mMap.setOnMapClickListener {
            launch {
                runOnUiThread {
                    bottomSheetBehaviour.state = BottomSheetBehavior.STATE_COLLAPSED

                    val infoPanelAnimation = info_panel_root.animate()
                    infoPanelAnimation.apply {
                        duration = 250
                        alpha(0f)
                    }

                    infoPanelAnimation.start()
                }
                delay(250)
                runOnUiThread {
                    info_panel_root.visibility = View.GONE
                    if (package_list_root.visibility != View.VISIBLE) {
                        package_list_root.alpha = 0f
                    }
                    package_list_root.visibility = View.VISIBLE
                    val packageListAnimation = package_list_root.animate()
                    packageListAnimation.apply {
                        duration = 250
                        alpha(1f)
                    }
                    packageListAnimation.start()
                }
            }
        }


        packageList.forEachIndexed {index, it ->
           val marker =  mMap.addMarker(
                    MarkerOptions()
                            .position(it.lastKnownLocation.getLatLng())
                            .title(it.trackingId)
                            .icon(BitmapDescriptorFactory.defaultMarker(it.hue))
                            .title(it.trackingId)
                            .snippet(it.carrierName)

            )
            marker.tag = index
        }
        getLocationPermission()
    }

    var currentLocationmarker : MarkerOptions? = null

    private fun getDeviceLocation() {
        /*
     * Get the best and most recent location of the device, which may be null in rare
     * cases when a location is not available.
     */
        try {
            if (haveLocationPermission) {
                val locationResult = fusedLocationProviderClient.getLastLocation()
                locationResult.addOnCompleteListener(this, object : OnCompleteListener<Location> {
                    override fun onComplete(task: Task<Location>) {
                        if (task.isSuccessful) {
                            // Set the map's camera position to the current location of the device.
                            lastKnownLocation = task.result
                            if (currentLocationmarker == null) {
                                currentLocationmarker = MarkerOptions()
                                        .icon(BitmapDescriptorFactory.fromResource(R.drawable.you_are_here_icon))
                                        .position(LatLng(lastKnownLocation!!.getLatitude(),
                                                lastKnownLocation!!.getLongitude()))
                                        .zIndex(1.0f)
                                mMap.addMarker(currentLocationmarker)
                            }
                            mMap.animateCamera(CameraUpdateFactory.newLatLngZoom(
                                    LatLng(lastKnownLocation!!.getLatitude(),
                                            lastKnownLocation!!.getLongitude()), 5f))
                        } else {
                            Log.d("DEVICE_LOCATION", "Current location is null. Using defaults.")
                            Log.e("DEVICE_LOCATION", "Exception: %s", task.exception)
                            mMap.moveCamera(CameraUpdateFactory.newLatLngZoom(LatLng(45.4215, -75.6972), 5f))
                            mMap.uiSettings.isMyLocationButtonEnabled = false
                        }
                    }
                })
            }
        } catch (e: SecurityException) {
            Log.e("Exception: %s", e.message)
        }

    }
}
