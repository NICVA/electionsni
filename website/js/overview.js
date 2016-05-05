var layerStyle = {
    weight: 2,
    color: 'white',
    fillColor: 'black',
    fillOpacity: 0.15,
    opacity: 1
};

var boundaries;

var constituency_id = null;
var constituency_directory = null;

var boundaries = new L.GeoJSON.AJAX('./2016/NI/boundaries/OSNI_Constituencies.geojson', {
    style: layerStyle
});

var map = L.map('overview_map', { zoomControl:false, attributionControl: false }).setView([54.593346, -6.66200], 8);

L.tileLayer(
    'http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png', {
        maxZoom: 18
        //style: layerStyle
    })//.addTo(map);

boundaries.addTo(map);


/////////////////////////////////////////////////////////
/////////              DO PIE CHARTS      ///////////////
/////////////////////////////////////////////////////////


var locations = [
    [54.655, -5.94], // South Belfast
    [54.55, -5.93],  // North Belfast
    [54.20, -6.08],  // South Down
    [54.6, -6.08],   // West Belfast
    [54.6, -5.8],    // East Belfast
    [54.635, -5.63], // North Down
    [54.5, -5.67],   // Strangford
    [55, -6.35],     // North Antrim   
    [55.02, -6.84],  // East Londonderry
    [54.98, -7.31],  // Foyle
    [54.65, -7.29],  // West Tyrone
    [54.7, -6.72],   // Mid Ulster
    [54.7, -6.2],    // Mid Ulster
    [54.45, -6.1],   // Lagan Valley
    [54.47, -6.37],  // Upper Bann
    [54.27, -6.57],  // Newry and Armagh
    [54.33, -7.65],  // Fermanagh and South Tyrone
    [54.92, -5.97]   // East Antrim
];

$.each(locations, function(i,location){
  L.piechartMarker(
    L.latLng(location), {
        radius: 14,
        data: [
            {name: 'A',value: 1, style: { fillStyle: 'rgba(255,0,0,1)',       strokeStyle: 'rgba(0,0,0,0.5)', lineWidth: 4}}, 
            {name: 'B',value: 1, style: { fillStyle: 'rgba(255,255,0,1)',     strokeStyle: 'rgba(0,0,0,0.5)', lineWidth: 4}}, 
            {name: 'D',value: 1, style: { fillStyle: 'rgba(100,255,0,1)',     strokeStyle: 'rgba(0,0,0,0.5)', lineWidth: 4}},
            {name: 'E',value: 1, style: { fillStyle: 'rgba(100,150,0,1)',     strokeStyle: 'rgba(0,0,0,0.5)', lineWidth: 4}},  
            {name: 'F',value: 1, style: { fillStyle: 'rgba(100,25,1000,1)',   strokeStyle: 'rgba(0,0,0,0.5)', lineWidth: 4}},
            {name: 'C',value: 1, style: { fillStyle: 'rgba(0,0,0,0.5)',       strokeStyle: 'rgba(0,0,0,0.5)', lineWidth: 2}}
        ]
    })
    .on('click', function(e) {
        var popup = L.popup()
           .setContent("<b>Belfast South</b><br> \
                        Claire Hanna (SDLP)<br> \
                        Fearghal McKinney (SDLP)<br> \
                        Micchael McGimpsey (UUP)<br> \
                        Anna Lo (AP)<br> \
                        Máirtín Ó Muilleoir (SF)<br> \
                        Emma Pengelly (DUP)<br>")
           .setLatLng(e.latlng) 
           .openOn(map);
    }).addTo(map);  
})
