Hacked around one evening to put some pins on google map while search for flats. The flats were listed but there was no map view, not knowing Auckland this made it hard to easily filter the list down to ones that I could be interested in.

Tried using the "Revealing Module Pattern", found after having a little search for some best practices with JS. Initially used this guide here https://www.thinkful.com/learn/javascript-best-practices-1/#Avoid-Globals.

However when I came to try and document the JS it seemed very hard. I couldn't get YUI or JsDoc to nicely generate docs for the functions / properties.

Now using require.js style modules and using the syntax from this stackoverflow, http://stackoverflow.com/questions/4921034/getting-jsdoc-and-crockfords-design-patterns-to-get-along.

It seems to work but I really don't like the fact that I am duplicating module/function names in the comments. If the module name changes I have to fix it all over the place or JsDoc fails to generate anything helpful.
