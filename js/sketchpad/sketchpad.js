

/**
 * @namespace
 */
var sketchpad = {
	model: {},
	controller: {},
	view: {}
};


/**
 * @returns {object} with public methods to access app
 * @author Adrian Lafond
 */
sketchpad.main = function() {
	//disbranded.Cookie.clear();
	
	var mvc = {
		m: {},
		v: {},
		c: {}
	};
	
	var prepModel = function() {
		mvc.m.prefs = new sketchpad.model.Prefs({ id:'sketchpad-prefs' });
		mvc.m.pad = new sketchpad.model.Pad({ id:'sketchpad-pad' });
	};
	
	var prepView = function() {
		mvc.v.canvas = new sketchpad.view.CanvasView({ el: '#sketchcanvas' });
		mvc.v.tools = new sketchpad.view.ToolsView({ el: '#sketchtools' });
		mvc.v.app = new sketchpad.view.AppView({ el:'#sketchpad' });
	};
	
	var prepController = function() {
		mvc.c.controller = new sketchpad.controller.SketchController(mvc);
		Backbone.history.start();
	};
	
	var startup = function() {
		prepModel();
		prepView();
		prepController();
	};
	
	startup();

	return {
		//don't know if this works; didn't need it so have not tested it
		navigate: function() {
			return mvc.c.controller.navigate.call(controller, arguments);
		}
	}
};