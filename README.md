# Google Address Markers

Welcome, this is a simple script I made one evening to put pins on a google map with some extra info. I made it because I have just moved to Auckland and I am looking for a flat.

I then decided to put it online, in the process of tidying it up I also wanted to see what the latest in best practices for JS were.

## How to use
Just download the code, then open up the [index](index.html) page in a browser.

 * You should see a map of Auckland, New Zealand
 * There should be pins on the map, each with a number on them representing the number of flats at that location.
 * If you click a pin a small window should pop up showing some details about the flats at that location.

## Customise
Currently the index page has a table of html with an id of "realestatebookingsFlatsTable" this table is used as an example for scraping addresses. The scraping is done by [parse.js](js/app/datasources/realestatebookings/parse.js), called from the the [main.js](js/app/main.js) script.

This is the bit that if this was a more long term project would really need more work. There are 3 places that you need to change:
 * The data source to scrape, currently the table embedded in [index](index.html)
 * The static dependency in [main.js](js/app/main.js) to the realestatebookings specific parse script
 ```javascript
 define(["jquery", 'app/lib/AddressLookup', 'app/lib/Markers', 'app/datasources/realestatebookings/parse', 'async!http://maps.google.com/maps/api/js?sensor=false'], function($, addressLookup, markers, parse) {
```
 * The use of the embedded table's id further down in [main.js](js/app/main.js):
 ```javascript
 var rawData = parse.parse("realestatebookingsFlatsTable");
 ```
