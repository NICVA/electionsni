
	var checkedYear = null; 
	var inputElements = document.getElementsByName("year");
	for(var i=0; inputElements[i]; ++i){
		  if(inputElements[i].checked){
			   checkedYear = inputElements[i].value;
			   break;
		  }
	}
	
	function changeyear(year) {
		checkedYear = year;
		console.log(checkedYear);
	}
	
	findcandidates(checkedYear);
	
	function findcandidates(year) {
		checkedYear = year;
		var request = new XMLHttpRequest();
		var path = './'+year+'/NI/all-candidates.json';
		console.log(path);
		request.onreadystatechange = function() {
			if (request.readyState == 4 && request.status >= 200 && request.status < 400) {
				candidatesData = JSON.parse(request.responseText);
				console.log(candidatesData);
				if (constituency_id && constituency_directory) {
					candidates.update(constituency_id,constituency_directory);
				}
			}
		};
		request.open('GET', path, true);
		request.send();
		request.onerror = function() {
		  candidates.innerHTML = 'Connection error retrieving data from the server'
		};
	}
	
	function getObjects(obj, key, val) {
		var objects = [];
		for (var i in obj) {
			if (!obj.hasOwnProperty(i)) continue;
			if (typeof obj[i] == 'object') {
				objects = objects.concat(getObjects(obj[i], key, val));    
			} else 
			//if key matches and value matches or if key matches and value is not passed (eliminating the case where key matches but passed value does not)
			if (i == key && obj[i] == val || i == key && val == '') { //
				objects.push(obj);
			} else if (obj[i] == val && key == ''){
				//only add if the object is not already in the array
				if (objects.lastIndexOf(obj) == -1){
					objects.push(obj);
				}
			}
		}
		return objects;
	}
	
	var layerStyle = {
		weight: 2,
		color: 'blue',
		fillOpacity: 0.1,
		};
		
	function highlightFeature(e) {
		var layer = e.target;
			layer.setStyle({
				weight: 4,
				color: '#cc0066',
				fillOpacity: 0.7
		});
		if (!L.Browser.ie && !L.Browser.opera) {
			layer.bringToFront();
			}
			info.update(layer.feature.properties);
		}
	
	var boundaries;
	
	function resetHighlight(e) {
		boundaries.resetStyle(e.target);
		info.update();
	}	
	
	var constituency_id = null;
	var constituency_directory = null;
	
	function zoomAndDisplay(e) {
		map.fitBounds(e.target.getBounds());
		constituency_id = e.target.feature.properties.Constituency_Number;
		constituency_directory = e.target.feature.properties.Constituency_Directory;
		candidates.update(constituency_id, constituency_directory);
	}
	
	function onEachFeature(feature, layer) {
		layer.on({
			mouseover: highlightFeature,
			mouseout: resetHighlight,
			click: zoomAndDisplay
		});
	}
		
	var boundaries = new L.GeoJSON.AJAX('./2016/NI/boundaries/OSNI_Constituencies.geojson', {
		style: layerStyle,
		onEachFeature: onEachFeature
		});
	
	console.log(boundaries);
		
    var map = L.map('map').setView([54.593346, -6.416200], 8);
        mapLink = 
            '<a href="http://openstreetmap.org">OpenStreetMap</a>';
        L.tileLayer(
            'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; ' + mapLink + ' Contributors',
            maxZoom: 18,
            }).addTo(map);
	
	boundaries.addTo(map);			
	
	var info = L.control();

	info.onAdd = function (map) {
		this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
		this.update();
		return this._div;
	};

	// method that we will use to update the control based on feature properties passed
	info.update = function (props) {
		this._div.innerHTML = '<h4>Constituency</h4>' +  (props ?
			'<b>' + props.Constituency_Name + '</b><br />'
			: 'Hover over a constituency');
	};

	info.addTo(map);
	
	var candidates = document.getElementById('candidates');
	
	candidates.update = function (constituency_id, constituency_directory) {
		var constituency = getObjects(candidatesData, 'Constituency_Number', constituency_id);
		var candidates = constituency[0].Candidates;
		console.log(candidates);
		this.innerHTML = '<h2>' + constituency[0].Constituency_Name + ' (' + checkedYear + ')<h2>';
		if (constituency_directory) {
			this.innerHTML += '<a href="./' + checkedYear + '/constituency/' + constituency_directory + '/stages.html">' + 'View Count Stages' + '</a></br>';
			}
		console.log(constituency_directory);
		for (i = 0; i < candidates.length; i++) {
			if (candidates[i].Outgoing_Member == 1) {
				var MLA_text = " MLA"} else {var MLA_text = ""}
			this.innerHTML += '<div id="candidate ' + candidates[i].Candidate_Id + '" class="tooltip ' + candidates[i].Party_Name.replace(/\s+/g,"-") + '_label">' + candidates[i].Firstname + ' ' + candidates[i].Surname + MLA_text + '<span class="tooltiptext">' + candidates[i].Party_Name + '</span></div></br>';
		}
	};
