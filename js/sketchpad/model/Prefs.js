/**
 * @requires disbranded.backbone.cookie
 * @author Adrian Lafond
 */
sketchpad.model.Prefs = Backbone.Model.extend({

	defaults: {
		brushSize: 10,
		brushColor: 'black'
	},

	sync: disbranded.backbone.cookie,
	
	ready: false

});