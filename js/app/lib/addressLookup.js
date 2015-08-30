/**
 * Address look up module, get longitude and latitude from an address.
 * @module AddressLookup
 * @namespace
 */
define(['jquery'], (function($) {
  "use strict";

  /**
   *  @typedef {Object} AddressLookup#latLng
   *  @property {number} lat The latitude
   *  @property {number} lng The longitude
   */

  var Clazz = function (config) {
    /**
     * Default config options
     * @private
     * @type {Object}
     * @name AddressLookup#defaultConfig
     */
    var defaultConfig = {
      api : {
        baseUrl : "http://maps.google.com/maps/api/geocode/json",
        options : {
          "region" : "nz",
          "sensor" : "false"
        }
      }
    }

    config = $.extend(defaultConfig, config);

    /**
     * Gets the google api url for address look up.
     * @private
     * @function AddressLookup#llUrl
     * @param  {string} address The address you want to search for
     * @return {string}         The URL of the google api
     */
    function llUrl(address) {
      var url = config.api.baseUrl;

      var baseParams = {"address" : address};
      var queryParams = $.extend(baseParams, config.api.options);
      var queryString = $.map(queryParams, function(value, key) {
        return key + "=" + value;
      }).join("&");

      url += "?" + queryString;

      return url;
    }

    /**
     * Extracts the first location from the google API json
     * @private
     * @function AddressLookup#extractll
     * @param  {object} data Google API JSON data from address lookup
     * @return {AddressLookup#latLng}      The first (if any) longitude and latitude object
     */
    function extractll(data) {
      if (data.results.length > 0) {
        return data.results[0].geometry.location;
      } else {
        return null;
      }
    }

    /**
     * Get a {@link AddressLookup#latLng} from an address then callback to given function
     * @public
     * @function AddressLookup#getll
     * @param  {string}   address  The address you want to look up e.g. 10 Downing Street, London
     * @param  {Function} callback The function to call once the address has been found (or not)
     * @return {undefined}
     */
    function getll(address, callback) {
      var url = llUrl(address);

      $.getJSON(url, null, function(data) {
        var longLat = extractll(data);

        callback(longLat);
      });
    }

    return {getll: getll};
  }

  return Clazz;
}));
