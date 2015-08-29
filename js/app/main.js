define(["jquery", 'async!http://maps.google.com/maps/api/js?sensor=false'], function($) {
  function createMap(latLong) {
    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 14,
      center: latLong
    });

    return map;
  }

  createMap({lng: 0, lat: 0});
});
