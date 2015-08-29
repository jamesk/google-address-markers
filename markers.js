/**
 * Address look up module, get longitude and latitude from an address.
 * @module addressLookup
 * @borrows addressLookup-getll as this.getll
 */
addressLookup = function() {
  /**
   * @typedef {{lat:number,lng:number}} latLng
   */

  var $ = jQuery
  var config = {
    api : {
      baseUrl : "http://maps.google.com/maps/api/geocode/json",
      options : {
        "region" : "nz",
        "sensor" : "false"
      }
    }
  }
  /**
   * Gets the google api url for address look up.
   * @param  {string} address The address you want to search for
   * @return {string}         The URL of the google api
   */
  function llUrl(address) {
    var url = config.api.baseUrl

    var baseParams = {"address" : address};
    var queryParams = $.extend(baseParams, config.api.options)
    var queryString = $.map(queryParams, function(value, key) {
      return key + "=" + value;
    }).join("&")

    url += "?" + queryString

    return url;
  }

  /**
   * Extracts the first location from the google API json
   * @param  {object} data Google API JSON data from address lookup
   * @return {latLng}      The first (if any) longitude and latitude object
   */
  function extractll(data) {
    if (data.results.length > 0)
      return data.results[0].geometry.location;
    else {
      return null;
    }
  }

  /**
   * Get a {latLng} from an address then callback to given function
   * @function getll
   * @memberOf addressLookup
   * @param  {string}   address  The address you want to look up e.g. 10 Downing Street, London
   * @param  {Function} callback The function to call once the address has been found (or not)
   * @public
   * @return {undefined}
   */
  function getll(address, callback) {
    var url = llUrl(address);

    jQuery.getJSON(url, null, function(data) {
      var longLat = extractll(data);

      callback(longLat);
    });
  }

  return {getll: getll}
}();




function createMap(latLong) {
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 14,
    center: latLong
  });

  return map;
}

function addMarkers(map, markerData) {
  addMarkersSub(map, markerData, 0, {}, function(markerMap) {
    //loop through markerMap object, put pin per key-value pair
    //make an info window per marker, with content for each item in the the value array
    $.each(markerMap, function(key, value) {
      addAdvancedMarker(map, value);
    });
  });
}

function addMarkersSub(map, markerData, index, markerMap, callback) {
  if (index < markerData.length)
  {
    var data = markerData[index]

    getll(data.address, function(latLong) {
      var latLongKey = latLong.lat + "¦" + latLong.lng;

      if (!(latLongKey in markerMap))
      {
        markerMap[latLongKey] = [];
      }

      markerMap[latLongKey].push({data: data, ll: latLong});

      addMarkersSub(map, markerData, index + 1, markerMap, callback);
    });
  }
  else
    callback(markerMap);
}

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

function addMarker(map, address, title) {
  getll(address, function(latLong) {

    var marker = new google.maps.Marker({
      position: latLong,
      map: map,
      title: title
    });
  });
}


//http://www.rwcityapartments.realestatebookings.com/#
function extractTableDataREB() {
	var rowSelector = "#flatsFull tbody tr:gt(0)"
	var rowSelection = jQuery(rowSelector);

	var detailSelections = {
		rooms: "td:nth-child(2)",
		baths: "td:nth-child(3)",
		parking: "td:nth-child(4)",
		cost: "td:nth-child(5)",
  	address: "td:nth-child(1) a"
	}

	var rowData = rowSelection.map(function(i, row) {
		//jQuery(jQuery("#flats tbody tr:gt(0)")[0]).find("td:nth-child(1) a").text()
    row = $(row)
		var address = row.find(detailSelections.address).text()
    //console.log("Found an address, " + address);

		var details = $.map(detailSelections, function (value, key) {
      //console.log("i is " + i + ", key is " + key)
      return key + ":" + row.find(value).text();
		}).join();

    //console.log("Found some details: " + details)
    return {address: address, details: details};
	});

	return rowData;
}

function getContentForFlat(data) {
  return "<div>" + data.details + "</div>"
}

function initPage() {
  getll("1010", function(startll) {
    var map = createMap(startll);

    /*
    addMarker(map, "75 halsey street", "Current Flat");
    addMarker(map, "7C 148 Quay Street, Auckland Central", "1, 1, -, $470")
    */

    var flatData = extractTableDataREB();
    var markersData = $.map(flatData, function(data, i) {
      var content = getContentForFlat(data);

      return {address: data.address, content: content};
    });

    addMarkers(map, markersData);
    /*
    $.each(flatData, function(i, flat) {
      try {
        console.log("Calling addMarker with address: " + flat.address + ", and details: " + flat.details);
        addMarker(map, flat.address, flat.details);
      } catch (e) {
        console.log("Problem with address: " + flat.address);
        console.log(e);
      }
    });
    */
  });
}
