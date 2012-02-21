------------------------------------------------------------------------------
Sketchpad is a simple app that serves as an excuse to test out Backbone.js.

No views or models are directly connected. Everything gets routed via the main
controller, SketchController, which extends Backbone.Router.

Originally I was planning on using a Collection to organize the Sketch models,
but turns out was just easier to have a Pad model that simply stored an array
of id's. This was mostly because I had no use (at least in this application)
for saving and loading all sketches simultaneously. Perhaps that would change
if the app were more complex (eg, a menu was added with thumbnails for each
sketch).

Sketches and other data are stored locally with a custom "sync" that acts as a
proxy for disbranded.Cookie (a localStorage object that uses document.cookie
as a backup). Might be interesting to update the app to store sketch data in
the cloud.
------------------------------------------------------------------------------