

/**
 * Pad is not a collection, because it is really just an array
 * of id's. I don't envision needing to save/load ALL sketches simultaneously.
 */
sketchpad.model.Pad = Backbone.Model.extend({

	defaults: {
		active: 0,
		pages: [],
		maxPages: 100
	},
	
	ready: false,
	length: 0,
	sketches: [],
	sync: disbranded.backbone.cookie,
	
	
	initialize: function() {
		//this.on('all', function(type) { console.log('Pad.initialize() all: ' + type); });
		this.on('change:pages', this._onPagesChange, this);
	},

	

	// PUBLIC METHODS	
	createPage: function(index) {
		var sketch;
		index = this._validateIndex(index, this.getLength());
		if (index < this.get('maxPages')) {
			sketch = new sketchpad.model.Sketch();
			this.sketches.push(sketch);
			this.get('pages').push(sketch.id);
			//this.sketches.splice(index, 0, new sketchpad.model.Sketch());
			//this.get('pages').splice(index, 0, this.sketches[index].id);
			this.length += 1;
			this.save();
		}
		return this;
	},
	
	deletePage: function(index) {
		index = this._validateIndex(index, this.getActiveIndex());
		if (this.sketches[index] !== undefined) {
			this.sketches[index].destroy();
			this.sketches.splice(index, 1);
			this.get('pages').splice(index, 1);
			this.length = Math.max(0, this.length - 1);
			if (this.getActiveIndex() >= this.length) {
				this.set('active', Math.max(0, this.length - 1));
			}
			this.save();
		}
		return this;
	},
	
	/**
	 * @returns a cached length value
	 */
	getLength: function() {
		return this.length;
	},
	
	/**
	 * @returns active index, ensuring the value is a Number
	 */
	getActiveIndex: function() {
		return parseInt(this.get('active'), 10);
	},
	
	/**
	 * @param callback A function to be called with the sketch model passed as a param.
	 */
	getActiveSketch: function(callback) {
		var self = this;
		var i = this.getActiveIndex();
		var sketch = this.sketches[i];
		if (sketch === undefined) {
			if (this.get('pages')[i] === undefined) {
				sketch = this.sketches[i] = new sketchpad.model.Sketch();
				this.get('pages')[i] = sketch.id;
				this.save();
			} else {
				sketch = this.sketches[i] = new sketchpad.model.Sketch({ id:this.get('pages')[i] });
			}
		}
		sketch.fetch({
			success: function(model, msg) {
				callback(model);
			},
			error: function(model, msg) {
				callback(model);
			}
		});
		return this;
	},
	
	
	// PRIVATE METHODS
	
	/**
	 * this.length is changed with calls to createPage() and deletePage(),
	 * but _onPagesChange() just ensures that the value is correct, since
	 * pages, sketches, and length are not very private.
	 */
	_onPagesChange: function() {
		this.length = this.get('pages').length;
	},
	
	_validateIndex: function(index, defaultVal) {
		index = (index === undefined || isNaN(index)) ? defaultVal : index;
		index = Math.floor(Math.max(0, Math.min(this.getLength(), index)));
		return index;
	}
	
});