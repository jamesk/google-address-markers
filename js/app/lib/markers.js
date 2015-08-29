/**
 * Address look up module, get longitude and latitude from an address.
 * @module Markers
 * @namespace
 */
define(['jquery'], (function($) {
  "use strict";

  /**
   *  @typedef {Object} Markers#marker
   *  @property {string} address The address of the marker
   *  @property {string} content A string of HTML to use as content for the marker
   */
   /**
    * @typedef {Object} Markers#markerWithLngLat
    * @property {Markers#marker} data Marker data
    * @property {AddressLookup#latLng} ll The longitude and latitude for the marker
    */

  var Clazz = function (addressLookup, config) {
    /**
     * Default config options
     * @private
     * @type {Object}
     * @name Markers#defaultConfig
     */
    var defaultConfig = {

    }

    var config = $.extend(defaultConfig, config);

    /**
     * Adds markers to the given map, with an info window of content. Each pin
     * will have a label indicating the number of markers at that pin. For
     * multiple markers their content will simply be appended together.
     * @public
     * @function Markers#addMarkers
     * @param {object} map        A Google map object
     * @param {Markers#marker[]} markerData Array of markers to add to map
     */
    function addMarkers(map, markerData) {
      addMarkersSub(markerData, 0, {}, function(markerMap) {
        //loop through markerMap object, put pin per key-value pair
        //make an info window per marker, with content for each item in the the value array
        $.each(markerMap, function(key, value) {
          addAdvancedMarker(map, value);
        });
      });
    }

    /**
     * Helper function that makes a call to the google location api for each marker to get its co-ordinates.
     * As it does so it builds up a map from the co-ordinates to all the markers at those co-ordinates.
     * Finally once all markerData is processed the provided callback is called with the map.
     * @private
     * @function Markers#addMarkersSub
     * @param {Markers#marker[]}   markerData An array of marker data
     * @param {number}   index      The index through the marker array we are on
     * @param {Object.<string, Markers#markerWithLngLat[]>}   markerMap  A map from the co-ordinates for a marker and an array of {@link Markers#markerWithLngLat} objects at those co-ordinates
     * @param {Function} callback   Final callback once co-ordinates and marker map has been made
     */
    function addMarkersSub(markerData, index, markerMap, callback) {
      if (index < markerData.length)
      {
        var data = markerData[index]

        addressLookup.getll(data.address, function(latLong) {
          var latLongKey = latLong.lat + "¦" + latLong.lng;

          if (!(latLongKey in markerMap))
          {
            markerMap[latLongKey] = [];
          }

          markerMap[latLongKey].push({data: data, ll: latLong});

          addMarkersSub(markerData, index + 1, markerMap, callback);
        });
      }
      else
        callback(markerMap);
    }

    /**
     * Adds a pin to the given google map which has a label indicating the number of markers at that location.
     * Also gives each pin an info window that containing the concatonated content of each marker there.
     * @public
     * @function Markers#addAdvancedMarker
     * @param {Object} map               The google map to add pins to
     * @param {Markers#markerWithLngLat[]} advancedDataArray An array of markers with their co-ords. NOTE: they should all share the same co-ordinates.
     */
    function addAdvancedMarker(map, advancedDataArray) {
      if (advancedDataArray.length == 0)
      {
        console.log("Tried to add an advanced marker with 0 length array")
        return;
      }

      var pinCount = advancedDataArray.length;
      var latLong = advancedDataArray[0].ll
      var combinedContent = $.map(advancedDataArray, function(data, i) {
        return data.data.content;
      }).join();

      var infowindow = new google.maps.InfoWindow({
        content: combinedContent
      });

      var marker = new google.maps.Marker({
        position: latLong,
        map: map,
        label: pinCount.toString()
      });
      marker.addListener('click', function() {
        infowindow.open(map, marker);
      });

    }

    return {addMarkers:addMarkers, addAdvancedMarker:addAdvancedMarker}
  }

  return Clazz;
}));
