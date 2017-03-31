var map;
var allirMarkers = [];
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 7,
    center: new google.maps.LatLng(65,-19),
    mapTypeId: 'terrain'
  });
}

//Sótt upplýsingarnar frá apis.is
$.ajax({
  'url': 'http://apis.is/petrol',
  'type': 'GET',
  'dataType': 'json',
  'success': function(data) {
    mark(data);

    //Slider
    $( function() {
          $( "#slider-range" ).slider({
            range: true,
            min: 175,
            max: 200,
            values: [ 175, 200 ],
            slide: function( event, ui ) {
              $( "#amount" ).val( ui.values[ 0 ] + " - " + ui.values[ 1 ]);
              breytaMarker(data, ui.values[0],ui.values[1]);
            }
          });
          $( "#amount" ).val( "175" + " - " + "200");
        } );
  }
});

function mark(data){
    for (var i = 0; i < data.results.length; i++) {
        var lat = data.results[i].geo.lat;
        var lon = data.results[i].geo.lon;
        var stadsetning = new google.maps.LatLng(lat, lon);
        var marker = new google.maps.Marker({
          position: stadsetning,
          map: map,
        });
        prentaUpplysingar(data.results[i].name, data.results[i].company, data.results[i].diesel, data.results[i].bensin95,
           data.results[i].diesel_discount, data.results[i].bensin95_discount, marker);
           allirMarkers.push(marker);
      }
  }

  function prentaUpplysingar(staður, company, dieselVerð, bensinVerð, dieselVerðDiscount, bensinVerðDiscount, marker){
    var upplysingar;
    if (bensinVerðDiscount === null && dieselVerðDiscount === null) {
      upplysingar = "<div><p>Staðsetning: " + staður + "</p><p>Fyrirtæki: " + company + "</p><p>Verð á diesel: " + dieselVerð + "kr<p>Verð á bensín: " + bensinVerð + "kr</p></div>";
    }
    else {
      upplysingar = "<div><p>Staðsetning: " + staður + "</p><p>Fyrirtæki: " + company + "</p><p>Verð á diesel: " + dieselVerð + "kr<p>Verð á diesel með afsláttur: " + dieselVerðDiscount +
      "kr</p><p>Verð á bensín: " + bensinVerð + "kr</p><p>Verð á bensín með afsláttur: " + bensinVerðDiscount + "kr</p></div>";
    }
    var infowindow = new google.maps.InfoWindow({
              content: upplysingar
    });
      marker.addListener('click', function() {
      infowindow.open(map, marker);
    });
  }

  function breytaMarker(data, t1, t2){
    for (var i = 0; i < allirMarkers.length; i++) {
      if (data.results[i].bensin95 < t1 || data.results[i].bensin95 > t2) {
        allirMarkers[i].setMap(null);
      }
      else {
        allirMarkers[i].setMap(map);
      }
    }
  }
