	var layerStyle = {
		weight: 2,
		color: 'blue',
		fillOpacity: 0.1,
		opacity: 1
		};
		
	function highlightFeature(e) {
		var layer = e.target;
			info.update(layer.feature.properties);
		}
	
	var boundaries;
	
	function resetHighlight(e) {
		info.update();
	}	
	
	var constituency_id = null;
	var constituency_directory = null;
	
	function clickFeature(e) {
		boundaries.setStyle(layerStyle);
		constituency_id = e.target.feature.properties.Constituency_Number;
		constituency_directory = e.target.feature.properties.Constituency_Directory;
		var layer = e.target;
		layer.setStyle({
				weight: 4,
				fillOpacity: 0.7
		});
		if (!L.Browser.ie && !L.Browser.opera) {
			layer.bringToFront();
			}
			info.update(layer.feature.properties);
		candidates.update();
		constituencyinfo.update();
	}
	
	function onEachFeature(feature, layer) {
		layer.on({
			mouseover: highlightFeature,
			mouseout: resetHighlight,
			click: clickFeature
		});
	}
		
	var boundaries = new L.GeoJSON.AJAX('./2016/NI/boundaries/OSNI_Constituencies.geojson', {
		style: layerStyle,
		onEachFeature: onEachFeature
		});
	
	console.log(boundaries);
		
    var map = L.map('map', {
		tap: false,
		minZoom: 7,
		maxZoom: 16
		}).setView([54.593346, -6.716200], 8);
    
	mapLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>';
    
	L.tileLayer(
            'https://a.tiles.mapbox.com/v4/mapbox.light/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiYm9iaGFycGVyIiwiYSI6ImQwOTg1YTg2MTQzYzk3Mzc5MWVjYzFkZDQzN2M1NTUzIn0.mA2WO4WAZzh-qwoqN4QVjg', {
            attribution: '&copy; ' + mapLink + ' | <a href=\"https://www.mapbox.com/about/maps/\" target=\"_blank\">&copy; Mapbox</a> | Boundaries: <a href="https://www.opendatani.gov.uk/dataset/osni-open-data-50k-admin-boundaries-parliamentary-constituencies-2008">LPS</a>',
            maxZoom: 18,
            }).addTo(map);
	
	boundaries.addTo(map);			
	
	
	// detect if user agent is a mobile device and if so disable map zooming panning etc
	if ( /Android|webOS|iPhone|iPad|iPod|Blackberry|IEMobile|Opera Mini|Mobi/.test(navigator.userAgent)) {
		console.log('mobile device detected');
		map.dragging.disable();
	}
	
	var info = L.control();

	info.onAdd = function (map) {
		this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info" inside the map
		this.update();
		return this._div;
	};

	// method that we will use to update the map info control based on feature properties passed
	info.update = function (props) {
		this._div.innerHTML = '<h4>Constituency</h4>' +  (props ?
			'<b>' + props.Constituency_Name + '</b><br />'
			: 'Select a constituency');
	};

	info.addTo(map);