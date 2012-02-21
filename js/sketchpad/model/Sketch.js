
/**
 * @requires disbranded.backbone.cookie
 * @author Adrian Lafond
 */
sketchpad.model.Sketch = Backbone.Model.extend({

	sync: disbranded.backbone.cookie,
	
	defaults: {
		marks: []
	},
	
	initialize: function() {
		if (!this.id) {
			this.id = 'sketch-' + (new Date()).valueOf() +'-'+ sketchpad.model.Sketch.uid();
		}
		
		//I don't know why I need to do this. If it's a new instance, should marks be virgin
		//and new and empty?
		var len = this.get('marks').length;
		this.get('marks').splice(0, len);
	},
	
	addMark: function(mark) {
		var marks = this.get('marks');
		marks.push(mark);
		this.set('marks', marks);
	}
	
});

sketchpad.model.Sketch.uid = (function(){
	var uid = 0;
	return function() {
		return uid++;
	};
}());