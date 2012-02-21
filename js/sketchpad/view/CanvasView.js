
sketchpad.view.CanvasView = Backbone.View.extend({

	context: null,
	
	mousePos: { x:0, y:0 },


	initialize: function() {
		var canvas = this.$el.find('canvas');
		this.context = canvas.get(0).getContext('2d');
		
		//defaults:
		this.context.strokeStyle = 'black';
		this.context.lineWidth = 2;
	},

	
	// PUBLIC METHODS
	
	/**
	 * Add event handlers and prepare for drawing.
	 */
	render: function() {
		var self = this;
		this.$el.on('mousedown touchstart', function(e) {
			self.onPress(e);
		});
		return this;
	},
	
	/**
	 * Remove event handlers and deactivate interaction.
	 */
	remove: function() {
		this.$el.off('mousedown touchstart');
		return this;
	},
	
	
	/**
	 * @param value See http://www.whatwg.org/specs/web-apps/current-work/multipage/the-canvas-element.html#colors-and-styles
	 */
	changeBrushColor: function(value) {
		this.context.strokeStyle = value;
		return this;
	},
	
	/**
	 * @param value See http://www.whatwg.org/specs/web-apps/current-work/multipage/the-canvas-element.html#line-styles
	 */
	changeBrushSize: function(value) {
		this.context.lineWidth = value;
		return this;
	},


	clear: function() {
		this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
	},

	
	/**
	 * @param marks An array of mark objects with props:
	 *		x1: {Number},
	 *		y1: {Number},
	 *		x2: {Number},
	 *		y2: {Number},
	 *		color: {strokeStyle see http://www.whatwg.org/specs/web-apps/current-work/multipage/the-canvas-element.html#colors-and-styles},
	 *		size: {lineWidth see http://www.whatwg.org/specs/web-apps/current-work/multipage/the-canvas-element.html#line-styles},
	 */
	drawFromModel: function(marks) {
		var strokeStyle = this.context.strokeStyle;
		var lineWidth = this.context.lineWidth;
		this.clear();

		for (var i = 0, len = marks.length; i < len; i++) {
			this.context.beginPath();
			this.context.strokeStyle = marks[i].color;
			this.context.lineWidth = marks[i].size;
			this.context.moveTo(marks[i].x1, marks[i].y1);
			this.context.lineTo(marks[i].x2, marks[i].y2);
			this.context.stroke();
		}
		
		this.context.strokeStyle = this.strokeStyle;
		this.context.lineWidth = this.lineWidth;
		return this;
	},

	
	// PRIVATE METHODS
	onPress: function(e) {
		var self = this;
		this.$el.on('mousemove touchmove', function(e) {
			self.onDrag(e);
		});
		this.$el.on('mouseleave mouseup touchend touchcancel', function(e) {
			self.onRelease(e);
		});
		this.mousePos = this.getMousePos(e);
		this.onDrag(e);
	},
	
	
	onDrag: function(e) {
		this.context.beginPath();
		var newPos = this.getMousePos(e);
						
		this.context.moveTo(this.mousePos.x, this.mousePos.y);
		this.context.lineTo(newPos.x, newPos.y);
		this.context.stroke();

		this.trigger('mark', {
			x1: this.mousePos.x,
			y1: this.mousePos.y,
			x2: newPos.x,
			y2: newPos.y,
			color: this.context.strokeStyle,
			size: this.context.lineWidth,
		});
		
		this.mousePos = newPos;
	},
	
	
	onRelease: function(e) {
		this.$el.off('mousemove touchmove');
		this.$el.off('mouseleave mouseup touchend touchcancel');
	},
	
	getMousePos: function(e) {
		var elPos = this.$el.offset();
		return {
			x: e.clientX - elPos.left - this.context.lineWidth / 2,
			y: e.clientY - elPos.top - this.context.lineWidth / 2
		};
	}

});