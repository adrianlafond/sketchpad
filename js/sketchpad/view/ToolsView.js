sketchpad.view.ToolsView = Backbone.View.extend({
	
	
	$size: null,
	$color: null,
	
	indexPrev: 0,
	indexNext: 0,

	
	// PUBLIC METHODS	

	/**
	 * ToolsView is invisible (display=none) until render() is called.
	 */
	render: function() {
		$('#sketchtools').css('display', 'block');
		var self = this;
		
		//brush sizes
		$('#sketchtools .brushsize a').each(function(i, el) {
			text = $(el).text();
			var width = $(el).innerWidth();
			var size = $(el).attr('class').split(' ')[0].slice(6);
			$(el).html('<span class="inner inner-brush-'+ size +'">'+ text +'</span>');
			var $b = $('#sketchtools .brushsize a .inner-brush-' + size);
			$b.css('width', size + 'px');
			$b.css('height', size + 'px');
			$b.css('margin-left', (width - size) / 2 + 'px');
			$b.css('margin-top', (width - size) / 2 + 'px');
			$(el).on('click', function(e) {
				self.onBrushSizeSelect(e);
				return false;
			});
		});
		
		//colors
		$('#sketchtools .palette a').each(function(i, el) {
			$(el).on('click', function(e) {
				self.onPaletteSelect(e);
				return false;
			});
		});
		
		//prev
		this.$btnPrev = $('#sketchtools .padadmin a.prev');
		this.$btnPrev.on('click', function(e) {
			self.onPrevClick(e);
			return false;
		});
		this.$btnPrev.after('<span class="disabled">'+ this.$btnPrev.html() +'</span>');
		this.$spanPrev = this.$btnPrev.parent().find('span.disabled');
		
		//next
		this.$btnNext = $('#sketchtools .padadmin a.next');
		this.$btnNext.on('click', function(e) {
			self.onNextClick(e);
			return false;
		});
		this.$btnNext.after('<span class="disabled">'+ this.$btnNext.html() +'</span>');
		this.$spanNext = this.$btnNext.parent().find('span.disabled');
		
		//delete
		this.$btnDelete = $('#sketchtools .padadmin a.delete');
		this.$btnDelete.on('click', function(e) {
			self.onDeleteClick(e);
			return false;
		});
		this.$btnDelete.after('<span class="disabled">'+ this.$btnDelete.html() +'</span>');
		this.$spanDelete = this.$btnDelete.parent().find('span.disabled');
		
		//add
		this.$btnAdd = $('#sketchtools .padadmin a.add');
		this.$btnAdd.on('click', function(e) {
			self.onAddClick(e);
			return false;
		});
		this.$btnAdd.after('<span class="disabled">'+ this.$btnAdd.html() +'</span>');
		this.$spanAdd = this.$btnAdd.parent().find('span.disabled');
		
		return this;
	},
	
	
	/**
	 * Remove event handlers and deactivate the class.
	 */
	remove: function() {
		$('#sketchtools').css('display', 'none');
		$('#sketchtools .brushsize a').off('click');
		$('#sketchtools .palette a').off('click');
		$('#sketchtools .padadmin a.delete').off('click');
		return this;
	},
	
	
	setBrushSize: function(size) {
		var self = this;
		if (this.$size) {
			this.$size.removeClass('selected');
			this.$size = null;
		}
		$('#sketchtools .brushsize a').each(function(i, el) {
			if ($(el).hasClass('brush-' + size)) {
				self.$size = $(el);
				self.$size.addClass('selected');
				return;
			}
		});
		return this;
	},
	
	
	setBrushColor: function(color) {
		var self = this;
		if (this.$color) {
			this.$color.removeClass('selected');
			this.$color = null;
		}
		$('#sketchtools .palette a').each(function(i, el) {
			if ($(el).hasClass(color)) {
				self.$color = $(el);
				self.$color.addClass('selected');
				return;
			}
		});
		return this;
	},
	
	
	/**
	 * Allows prev, next, delete, add buttons to be enabled/disabled
	 * when relevant.
	 * @param activeIndex index of active sketch
	 * @param totalPages number of sketches currently in the pad
	 * @param maxPages max number of sketches allowed in the pad
	 */
	updatePageStatus: function(activeIndex, totalPages, maxPages) {
		if (activeIndex > 0) {
			indexPrev = activeIndex - 1;
			this.$btnPrev.css('display', 'block');
			this.$spanPrev.css('display', 'none');
		} else {
			this.$btnPrev.css('display', 'none');
			this.$spanPrev.css('display', 'block');
		}
		
		if (activeIndex < totalPages - 1) {
			indexNext = activeIndex + 1;
			this.$btnNext.css('display', 'block');
			this.$spanNext.css('display', 'none');
		} else {
			this.$btnNext.css('display', 'none');
			this.$spanNext.css('display', 'block');
		}
		
		if (activeIndex < maxPages - 1) {
			this.$btnAdd.css('display', 'block');
			this.$spanAdd.css('display', 'none');
		} else {
			this.$btnAdd.css('display', 'none');
			this.$spanAdd.css('display', 'block');
		}
		return this;
	},	
	
	
	
	// PRIVATE METHODS
	
	/**
	 * Brush size selected, so update model.
	 */
	onBrushSizeSelect: function(e) {
		var $a = $(e.target)
		while ($a.attr('href') === undefined) {
			$a = $a.parent();
		}
		if (!$a.hasClass('selected')) {
			var size = $a.attr('class').slice(6);
			this.setBrushSize(size);
			this.trigger('change:brushSize', size);
		}
	},
	
	
	/**
	 * Palette color selected, so update model.
	 */
	onPaletteSelect: function(e) {
		var $a = $(e.target);
		if (!$a.hasClass('selected')) {
			var color = $a.attr('class');
			this.setBrushColor(color);
			this.trigger('change:brushColor', color);
		}
	},
	
	
	/**
	 * 
	 */
	onPrevClick: function(e) {
		this.trigger('prev', indexPrev);
	},
	
	
	/**
	 * 
	 */
	onNextClick: function(e) {
		this.trigger('next', indexNext);
	},
	
	
	/**
	 * 
	 */
	onDeleteClick: function(e) {
		this.trigger('delete');
	},
	
	/**
	 * 
	 */
	onAddClick: function(e) {
		this.trigger('add');
	}
	
});