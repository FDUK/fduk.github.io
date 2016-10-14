// init FD map with marker clusterer

    // tiles 
    var StamenTonerLite = L.tileLayer('http://{s}.tile.stamen.com/toner-lite/{z}/{x}/{y}.png', {
      attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
      subdomains: 'abcd',
      minZoom: 0,
      maxZoom: 20
    });

    var EsriWorldTopoMap = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community'
    });

    // create a map in the "map" div, center on a given place (center uk) and zoom to country level
    // max zoom to city level (10) not street level (15) as geolocations only for given city, not actual address
    var map = L.map('map', {
        zoom: 6,
        minZoom: 6,
        maxZoom: 10,
        center: [54.00366,-2.547855],
        layers: [EsriWorldTopoMap]
    });

    // add layers control
    var baseMaps = {
        "Topographical": EsriWorldTopoMap,
        "Black and white": StamenTonerLite
    };
    L.control.layers(baseMaps, null, {collapsed: false}).addTo(map);

    // add intro sidebar
    var sidebar = L.control.sidebar('sidebar', {
        position: 'left'
    });
    map.addControl(sidebar);
    // show on startup
    setTimeout(function () {
      sidebar.show();
    }, 500);

    // add button to toggle sidebar
    L.easyButton( 'fa-question', function(){
      sidebar.toggle();
    }).addTo(map);



    // read data from CSV and add to map
    $.get('/fddata3.tab.txt', function(csvContents)
    // NB attribute names always lowercase eg Title -> feature.properties.title
    {
      var i = 1;
      // create markerClusterGroup and add markers to this
      var markersgroup = L.markerClusterGroup({
        showCoverageOnHover: false,
        spiderfyDistanceMultiplier: 1.5
      });

      var geoLayer = L.geoCsv(csvContents, {
        firstLineTitles: true, 
        fieldSeparator: '\t',
        onEachFeature: function (feature, layer) {
          // nicer way to template this??
          var popup = '<div class="popup-content">';
          //popup += i;
          popup += "<h2>" + feature.properties.title + "</h2>";
          popup += '<div class="city">' + feature.properties.city + '</div>';
          popup += "<p>" + feature.properties.notes + "</p>";
          popup += "</div>";
          layer.bindPopup(popup);
          i ++;

          layer.addTo(markersgroup);
        },
        pointToLayer: function (feature, latlng) {
          // console.log(i + ". " + feature.properties.city + " - " + feature.properties.title);
          return L.marker(latlng, {icon: L.AwesomeMarkers.icon({icon: 'star', prefix: 'fa', markerColor: 'red'}) })
        }
      });
      map.addLayer(markersgroup);
    });
