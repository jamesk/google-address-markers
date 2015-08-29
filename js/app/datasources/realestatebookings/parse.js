define(['jquery'], (function($) {
  "use strict";


  var Clazz = {
    //using html structure from the table of flat for http://www.rwcityapartments.realestatebookings.com/#
    parse: function(rootElementId) {
      if ($("#" + rootElementId).length == 0) {
        alert("Can't find root element with id " + rootElementId);
        return [];
      }

    	var rowSelector = "#" + rootElementId + " tbody tr:gt(0)"
    	var rowSelection = $(rowSelector);

    	var detailSelections = {
    		rooms: "td:nth-child(2)",
    		baths: "td:nth-child(3)",
    		parking: "td:nth-child(4)",
    		cost: "td:nth-child(5)",
      	address: "td:nth-child(1) a"
    	}

    	var rowData = rowSelection.map(function(i, row) {
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
  };

  return Clazz;
}));
