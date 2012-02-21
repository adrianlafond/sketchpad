
sketchpad.controller.SketchController = Backbone.Router.extend({
	
	routes: {
		'' 					: 'setNewPage',
		'sketch/:page' 		: 'setNewPage'
	},

	initializing: false,

	page: 0,
	
	sketch: null,
	sketchErrorMessage: 'Creation of a new sketch model failed.',
	

	initialize: function(mvc) {
		this.mvc = mvc;

		this.mvc.v.tools.on('change:brushSize', this.onBrushSizeUpdate, this);
		this.mvc.v.tools.on('change:brushColor', this.onBrushColorUpdate, this);
		this.mvc.v.tools.on('prev next', this.onNavigateToIndex, this);
		this.mvc.v.tools.on('delete', this.onDeleteSketch, this);
		this.mvc.v.tools.on('add', this.onAddSketch, this);
		
		this.mvc.v.canvas.on('mark', this.onCanvasMark, this);
		
		this.initializing = false;
	},
	
	
	/**
	 * The main routing method.
	 * The pad model must have initial data (list of sketch id's) before the
	 * sketchpad will work, so if !this.ready it tells the pad to fetch().
	 * Also tells prefs to load.
	 *
	 * @private
	 */
	setNewPage: function(page) {
		var self = this;
		this.page = (page === undefined) ? 0 : parseInt(page, 10);
		this.page = (isNaN(this.page)) ? 0 : this.page;
		this.page = Math.max(0, this.page);
		
		if (this.initializing) {
			return;
			
		} else if (!this.mvc.m.pad.ready && !this.mvc.m.prefs.ready) {
			this.initializing = true;
			//console.log('SketchController.setNewPage() initializing START');
			
			this.mvc.m.pad.fetch({
				success: function() { self.onPadInitLoad(); },
				error: function() { self.onPadInitError(); }
			});

			this.mvc.m.prefs.fetch({
				success: function() { self.onPrefsReady(); },
				error: function() { self.onPrefsReady(); }
			});
			
		} else {
			this.openSketchPage();
		}
	},
	
	
	/**
	 * When all initial data has loaded, canvas and tools are configured
	 * and started.
	 *
	 * @private
	 */
	startApp: function() {
		if (this.mvc.m.pad.ready && this.mvc.m.prefs.ready) {
			var self = this;
			var canvas = this.mvc.v.canvas;
			var tools = this.mvc.v.tools;
			var prefColor = this.mvc.m.prefs.get('brushColor');
			var prefSize = this.mvc.m.prefs.get('brushSize');
			
			this.initializing = false;
			//console.log('SketchController.startApp() initializing COMPLETE');
			
			canvas.changeBrushColor(prefColor);
			canvas.changeBrushSize(prefSize);
			
			tools.setBrushSize(prefSize);
			tools.setBrushColor(prefColor);
			
			canvas.render();
			tools.render();

			this.openSketchPage();
		}
	},
	
	
	openSketchPage: function() {
		//console.log('SketchController.openSketchPage()');
		var self = this;
		
		//validate and set page
		this.page = Math.max(0, Math.min(this.mvc.m.pad.getLength() - 1, this.page));
		this.mvc.m.pad.set('active', this.page);
		this.navigate('sketch/' + this.page);
		
		//clear current sketch
		this.sketch = null;
		this.mvc.v.canvas.clear();
		
		//update tools to enable/disable appropriate buttons
		this.mvc.v.tools.updatePageStatus(this.page, this.mvc.m.pad.getLength(), this.mvc.m.pad.get('maxPages'));
		
		//load sketch model
		this.mvc.m.pad.getActiveSketch(function(sketch) {
			if (sketch) {
				self.sketch = sketch;
				self.mvc.v.canvas.drawFromModel(sketch.get('marks'));
			} else {
				throw new Error(self.sketchErrorMessage);
			}
		});
	},

	
	/**
	 * Pad data has loaded successfully, so start the app.
	 * @private
	 */
	onPadInitLoad: function() {
		this.mvc.m.pad.ready = true;
		this.startApp();
	},
	

	/**
	 * No pad data found (brand new user!), so tell the pad to create the
	 * initial sketch page and then start the app via onPadInitLoad()
	 * @private
	 */
	onPadInitError: function() {
		this.mvc.m.pad.createPage();
		this.onPadInitLoad();
	},
	
	
	/**
	 * Called both on success and error, since error merely means that no
	 * prefs were saved previously (new user) so defaults will be used.
	 * @private
	 */
	onPrefsReady: function() {
		this.mvc.m.prefs.ready = true;
		this.startApp();
	},	
	
	
	/**
	 * @private
	 */
	onBrushSizeUpdate: function(value) {
		this.mvc.v.canvas.changeBrushSize(value);
		this.mvc.m.prefs.set('brushSize', value);
		this.mvc.m.prefs.save();
	},
	
	/**
	 * @private
	 */
	onBrushColorUpdate: function(value) {
		this.mvc.v.canvas.changeBrushColor(value);
		this.mvc.m.prefs.set('brushColor', value);
		this.mvc.m.prefs.save();
	},
	
	
	/**
	 * 
	 */
	onNavigateToIndex: function(index) {
		this.page = index;
		this.navigate('sketch/' + this.page);
		this.openSketchPage();
	},
	
	
	/**
	 * 
	 */
	onDeleteSketch: function() {
		this.mvc.m.pad.deletePage();
		this.onNavigateToIndex(this.mvc.m.pad.get('active'));
	},
	
	
	onAddSketch: function() {
		this.mvc.m.pad.createPage();
		this.onNavigateToIndex(this.mvc.m.pad.getLength() - 1);
	},
	
	
	/**
	 * A mark has been made on the canvas. Write it to the active sketch model.
	 * @private
	 */
	onCanvasMark: function(mark) {
		if (this.sketch) {
			this.sketch.addMark(mark);
			this.sketch.save();
		}
	}
});