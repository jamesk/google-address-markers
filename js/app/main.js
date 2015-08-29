define(["jquery", 'app/lib/AddressLookup', 'app/lib/Markers', 'app/datasources/realestatebookings/parse', 'async!http://maps.google.com/maps/api/js?sensor=false'], function($, addressLookup, markers, parse) {
  function createMap(latLong) {
    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 14,
      center: latLong
    });

    return map;
  }

  function getContentForFlat(data) {
    return "<div>" + data.details + "</div>"
  }

  //Look up our start address, once found initialise the google map then add pins to it
  var al = addressLookup()

  al.getll("Auckland 1010", function(lngLat) {
    var map = createMap(lngLat);

    var rawData = parse.parse("realestatebookingsFlatsTable");
    var markersData = $.map(rawData, function(data, i) {
      var content = getContentForFlat(data);

      return {address: data.address, content: content};
    });

    markers(al).addMarkers(map, markersData);
  });
});
