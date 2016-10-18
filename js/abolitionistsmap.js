// init abolitionists map with marker clusterer

    // define tiles 
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




// add intro box with title: Black Abolitionist Speaking Locations



    // map categories (people) to FA icon colours
    var colours = {
      "BoxBrown":'darkblue',
      "WellsBrown":'blue',
      "Roper":'lightblue',
      "Wells":'darkgreen',
      "Crummell":'green',
      "Henson":'lightgreen',
      "Martin":'purple',
      "Craft":'pink',
      "Other":'lightgray',
      "":'lightgray'
    } 


    // read data from CSV and add to map
    $.get('/abolitionists.tab.txt', function(csvContents)
    // NB attribute names always lowercase eg Title -> feature.properties.title
    {
      var i = 1;
      // create markerClusterGroup (NB add markers to subgroups)
      var markersgroup = L.markerClusterGroup({
        showCoverageOnHover: false,
        spiderfyDistanceMultiplier: 1.5
      }),
      // add subgroups too - will add markers to these
      BoxBrown = L.featureGroup.subGroup(markersgroup),
      WellsBrown = L.featureGroup.subGroup(markersgroup),
      Roper = L.featureGroup.subGroup(markersgroup),
      Wells = L.featureGroup.subGroup(markersgroup),
      Crummell = L.featureGroup.subGroup(markersgroup),
      Henson = L.featureGroup.subGroup(markersgroup),
      Martin = L.featureGroup.subGroup(markersgroup),
      Craft = L.featureGroup.subGroup(markersgroup),
      Other = L.featureGroup.subGroup(markersgroup);

      var geoLayer = L.geoCsv(csvContents, {
        firstLineTitles: true, 
        fieldSeparator: '\t',
        onEachFeature: function (feature, layer) {
          // nicer way to template this??
          var popup = '<div class="popup-content">';
          //popup += i;
          popup += "<h2>" + feature.properties.person + "</h2>";
          popup += '<div class="city">' + feature.properties.city + '</div> <div class="date">' + feature.properties.date + "</div>";
          popup += "<p>" + feature.properties.description + "</p>";
          popup += "</div>";
          layer.bindPopup(popup);
          i ++;

          // add to subgroups...
          // ***********************************************************************************

          if (feature.properties.category == "BoxBrown") {
              layer.addTo(BoxBrown);
              //console.log("    -> BoxBrown");
          } else if (feature.properties.category == "WellsBrown") {
              layer.addTo(WellsBrown);
              //console.log("    -> WellsBrown");
          } else if (feature.properties.category == "Roper") {
              layer.addTo(Roper);
              //console.log("    -> Roper");
          } else if (feature.properties.category == "Wells") {
              layer.addTo(Wells);
              //console.log("    -> Wells");
          } else if (feature.properties.category == "Crummell") {
              layer.addTo(Crummell);
              //console.log("    -> Crummell");
          } else if (feature.properties.category == "Henson") {
              layer.addTo(Henson);
              //console.log("    -> Henson");
          } else if (feature.properties.category == "Martin") {
              layer.addTo(Martin);
              //console.log("    -> Martin");
          } else if (feature.properties.category == "Craft") {
              layer.addTo(Craft);
              //console.log("    -> Craft");             
          } else {
              layer.addTo(Other);
              //console.log("    -> Other");
          } 
          // ***********************************************************************************
        },
        pointToLayer: function (feature, latlng) {
          //console.log(i + ". " + feature.properties.city + " - " + feature.properties.person);
          return L.marker(latlng, {icon: L.AwesomeMarkers.icon({icon: 'circle-o', prefix: 'fa', markerColor: colours[feature.properties.category]}) })
        }
      });

      // add to map
      map.addLayer(markersgroup);
      // add subgroups too
      // ***********************************************************************************
      map.addLayer(BoxBrown);
      map.addLayer(WellsBrown);
      map.addLayer(Roper);
      map.addLayer(Wells);
      map.addLayer(Crummell);
      map.addLayer(Henson);
      map.addLayer(Martin);
      map.addLayer(Craft);
      map.addLayer(Other);     
      // ***********************************************************************************


      // add layers control
      var baseMaps = {
          "Topographical": EsriWorldTopoMap,
          "Black and white": StamenTonerLite
      };

      // maybe colours["BoxBrown"] etc so cant get out of step??
      var overlays = {
      "<i class='fa fa-circle darkblue'></i> Henry 'Box' Brown": BoxBrown,
      "<i class='fa fa-circle blue'></i> William Wells Brown": WellsBrown,
      "<i class='fa fa-circle lightblue'></i> Moses Roper": Roper,
      "<i class='fa fa-circle darkgreen'></i> Ida B. Wells": Wells,
      "<i class='fa fa-circle green'></i> Alexander Crummell": Crummell,
      "<i class='fa fa-circle lightgreen'></i> Josiah Henson": Henson, 
      "<i class='fa fa-circle purple'></i> Rev Sella Martin": Martin,
      "<i class='fa fa-circle pink'></i> William Ellen Craft": Craft,
      "<i class='fa fa-circle lightgray'></i> Other": Other
      };
      L.control.layers(baseMaps, overlays, {collapsed: false}).addTo(map);

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

    // handle close sidebar button 
    $('#sidebarOK').click(function(){
        sidebar.hide();
    });


    });
