
/**
 * @requires disbranded.backbone.cookie
 * @author Adrian Lafond
 */
sketchpad.model.Sketch = Backbone.Model.extend({

	sync: disbranded.backbone.cookie,
	
	//marks is an array that stores the history of all marks made to the canvas.
	defaults: {
		marks: []
	},
	
	initialize: function() {
		if (!this.id) {
			this.id = 'sketch-' + (new Date()).valueOf() +'-'+ sketchpad.model.Sketch.uid();
		}
		
		//I don't know why I need to do this. If it's a new instance, shouldn't marks be
		//virgin and new and empty?
		var len = this.get('marks').length;
		this.get('marks').splice(0, len);
	},
	
	
	/**
	 * Adds a new mark to the marks array.
	 */
	addMark: function(mark) {
		var marks = this.get('marks');
		marks.push(mark);
		this.set('marks', marks);
		return this;
	}
	
});


/**
 * Unique ID generator. Obviously the counter is reset each time the web page is refreshed,
 * so this is concatenated on to a timestamp and ensures that multiple simultaneous instantiations
 * have unique id's.
 */
sketchpad.model.Sketch.uid = (function(){
	var uid = 0;
	return function() {
		return uid++;
	};
}());