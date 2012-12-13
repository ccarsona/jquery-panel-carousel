// TODO: Controls / Indicators
// TODO: Transition Types/Styles.
// TODO: More API / Event listeners (maybe instead of callbacks).
var console = (console) ? console : { log:function(){ return null; }};

(function initPanelCarousel( $ ) {
	$.fn.PanelCarousel = function( options ) {
		
		
		
		// Controls API
		function play() {
			
			self.element.is_playing = true;
			self.element.addClass('is-playing').removeClass('is-paused');
			$.data(self.element, 'state', 'playing');
			
			if (!self.timer) {
				self.timer = setTimeout(nextPanel, settings.panel_duration);
			}
			
			if (self.element.playPauseButton) {
				self.element.playPauseButton.toggleState();
			}
			
		}
		
		function pause() {
			
			self.element.is_playing = false;
			clearTimeout(self.timer);
			self.element.addClass('is-paused').removeClass('is-playing');
			$.data(self.element, 'state', 'paused');
			
			if (self.element.playPauseButton) {
				self.element.playPauseButton.toggleState();
			}
			
		}
		
		function nextPanel() {
			
			var next = self.element.current_panel + 1;
			if (next === self.element.panels.length) {
				next = 0;
			}
			
			gotoPanel(next);
			
		}
		
		function previousPanel() {
			
			var previous = self.element.current_panel - 1;
			if (previous < 0) {
				previous = self.element.panels.length - 1;
			}
			
			gotoPanel(previous);
			
		}
		
		function gotoPanel(panel) {
			
			clearTimeout(self.timer);
			
			// 'panel' must be between 0 and the number of panels
			// in the panels array. this is redundant for next/previous
			// and loop stuff, but if panel is an arbitrary number,
			// we still need to make sure it's within the range of the
			// panels array.
			if (panel > -1 && panel < self.element.panels.length) {
				
				// get the current panel
				var current = self.element.current_panel;
				
				// console.log(current, panel);
				
				// run the animations
				self.element.panels[current].stop(true).change('fadeout');
				self.element.panels[panel].stop(true).change('fadein');
				
				if (self.element.indicators) {
					self.element.indicators.setActiveItem(panel);
				}
				
				// reset the current panel
				self.element.current_panel = panel;
				
			}
			
			if ($.data(self.element, 'state') === 'playing') {
				
				self.timer = setTimeout(nextPanel, settings.panel_duration);
				
			}
			
		}
		
		function cancelLoop() {
			$.data(self.element, 'state', 'paused');
						
			if (self.element.playPauseButton) {
				self.element.playPauseButton.toggleState();
			}
			
			settings.loopCancelled();
		}
		
		// Defaults
		var settings = $.extend({
			
			stylesheet: "/css/panelcarousel.css",
			panel_css_selector: '.panel',
			start_loop_on_init: true,
			carousel_loops: true,
			
			// controls
			show_indicators: true,
			show_previous_next: true,
			show_play_pause: true,

			// attach_next_previous_to_indicators: false,
			// attach_play_pause_to_indicators: false,
			
			cancel_loop_on_indicator_click: true,
			cancel_loop_on_button_click: true,
			
			// animation
			transition: null,
			transition_duration: 1000,
			panel_duration: 8000,
			
			// callback functions
			// before and after each panel is shown, before the animation ends.
			beforeShow: function() {},
			afterShow: function() {},
			
			// before and after the slide animation begins
			beforeAnimation: function() {},
			afterAnimation: function() {},
			
			// before and after the panel is hidden, after the animation ends.
			beforeHide: function() {},
			afterHide: function() {},
			
			// when an indicator is clicked
			indicatorClick: function() {},
			
			// when a control is clicked
			controlClick: function() {},
			
			// when the loop is cancelled
			loopCancelled: function() {}
			
		}, options);
			
		
		// Private Methods
		// ---------------
		// create the dom objects
		var self = {
			_initDom: function() {
				
				// console.log("_initDom");
				
				self._initStyles();
				self._initPanels();
				
				if (settings.show_indicators === true) {
					self._initIndicators();
				}
				
				if (settings.show_play_pause === true) {
					self._initPlayPause();
				}
				
				if (settings.show_previous_next === true) {
					self._initPreviousNext();
				}

				
			},
		
			// initialize the style object
			_initStyles: function() {
				
				// console.log("_initStyles");
				
				var $css = $('#panel-carousel-stylesheet');
				if ($css.length === 0) {
					
					$css = $('<link rel="stylesheet" id="panel-carousel-stylesheet" href="'+ settings.stylesheet +'" type="text/css">').appendTo('head');
					
					if (document.createStyleSheet) {
						// IE doesn't reflow the dom when we inject
						// the stylesheet above. This function (IE only)
						// causes the reflow, and IE recognizes the injected styles.
						document.createStyleSheet(settings.stylesheet);
						
					}
					
				}
				
				self.css = $css;
				
			},
		
			// initialize the panels
			_initPanels: function() {
				
				// console.log("_initPanels");
				
				self.element.panels.each(function initPanelsLoop(index, panelElement) {
					
					// animation stuff.
					var panel = $(panelElement);
					panel.change = function(type) {
						
						var changes = {
							fadeout: 0,
							fadein: 1
						};
						
						if (typeof(changes[type]) === "undefined") {
							return false;
						}
						
						// Animation Start
						(function animationStart() {

							if (index !== self.element.current_panel) {
								
								if (settings.beforeShow(panel, index)) { return false; }
								
								panel.css({opacity: 0, display: 'block', zIndex: 1});
								
								if (settings.afterShow(panel, index) === false) { return false; }
								
							} else {
								
								panel.css({ zIndex: 0 });
								
							}
							
							if (settings.beforeAnimation(panel, index) === false) { return false; }
						})();
						
						// the animation
						
						panel.animate(
							{ opacity: changes[type] },
							settings.transition_duration,
							'linear',
							// Animation Complete
							function animationComplete() {

								if (index !== self.element.current_panel) {
								
									if (settings.beforeHide(panel, index) === false) { return false; }
									
									panel.css('display', 'none');
									
									if (settings.afterHide(panel, index) === false) { return false; }
									
								}
							
								if (settings.afterAnimation === false) { return false; }
							}
						); // panel.animate
						
					};
					
					if (self.element.current_panel !== index) {
						
						panel.css({ 'opacity': 0, 'display': 'none' });
						panel.is_showing = false;
							
					}
					
					// replace the panel in the array with the jquery one.
					self.element.panels[index] = panel;
					
				});
				
			},
		
			// initialize the indicators
			_initIndicators: function() {
				
				self.element.indicators = $('<ul class="panel-carousel-indicators"></ul>');
				self.element.indicators.items = [];
				// METHODS
				self.element.indicators.setActiveItem = function(index) {
					// change the active state on the navigation.
					if (index !== self.element.current_panel) {
						self.element.indicators.items[index].addClass('active');
						self.element.indicators.items[self.element.current_panel].removeClass('active');
					}
				};
				
				// Build the Navigation
				self.element.panels.each(function initInicatorsLoop(index, panel) {
					
					var text = panel.attr('title') ? panel.attr('title') : 'Panel ' +(index+1);
					var item = $('<li class="panel-carousel-indicator-item indicator-item-'+index+'"></li>');
					var link = $('<a href="#'+text+'" title="'+text+'">'+text+'</a>').on('click', function indicatorClick(evt) {
						
						if (settings.cancel_loop_on_indicator_click) {
							cancelLoop();
						}
						
						evt.preventDefault();
						settings.indicatorClick(item, index, panel);
						
						gotoPanel(index);
						
					});
					
					if (self.element.current_panel === index) {
						item.addClass('active');
					}
					
					// DOM stuff.
					item.append(link);
					self.element.indicators.append(item);
					self.element.indicators.items.push(item);
					
					
				});
				
				self.element.append(self.element.indicators);
				
			},
		
			// initialize the play/pause controls
			_initPlayPause: function() {
				
				var button_states = {
					playing: {
						text: 'Pause',
						cssClass: 'panel-carousel-pause-btn'
					},
					paused: {
						text: 'Play',
						cssClass: 'panel-carousel-play-btn'
					}
				};
				
				var text = button_states[$.data(self.element, 'state')].text;
				var cssClass = button_states[$.data(self.element, 'state')].cssClass;

				self.element.playPauseButton = $('<a href="#'+text+'" title="'+text+'" class="panel-carousel-play-pause-toggle '+cssClass+'">'+text+'</a>').on('click', function playPauseClick(evt) {
					
					evt.preventDefault();
					
					settings.controlClick(self.element.playPauseButton);
					
					if ($.data(self.element, 'state') === 'playing') {
						pause();
					} else {
						play();
					}
					
				});
				
				self.element.playPauseButton.toggleState = function(state) {
					
					var newstate = state || $.data(self.element, 'state');
					
					var toggle_text = button_states[newstate].text;
					var toggle_cssClass = button_states[newstate].cssClass;
					
					self.element.playPauseButton.attr('href', '#'+toggle_text)
												.attr('title', toggle_text)
												.attr('class', 'panel-carousel-play-pause-toggle '+ toggle_cssClass)
												.text(toggle_text);
					
				};
				
				// DOM stuff.
				if (settings.attach_play_pause_to_indicators) {
					var item = $('<li class="panel-carousel-control-item play-pause-control"></li>');
					item.append(self.element.playPauseButton);
					self.element.indicators.append(item);
				} else {
					self.element.append(self.element.playPauseButton);
				}
				
			},
			
			_initPreviousNext: function() {
				
				self.element.previousButton = $('<a href="#Previous" title="Previous" class="panel-carousel-previous-button">Previous</a>').on('click', function previousButtonClick(evt) {
					
					if (settings.cancel_loop_on_button_click) {
						cancelLoop();
					}
					
					evt.preventDefault();
					
					settings.controlClick(self.element.previousButton);
					
					previousPanel();
					
				});
				
				self.element.nextButton = $('<a href="#Next" title="Next" class="panel-carousel-next-button">Next</a>').on('click', function nextButtonClick(evt) {
					
					if (settings.cancel_loop_on_button_click) {
						cancelLoop();
					}
					
					evt.preventDefault();
					
					settings.controlClick(self.element.nextButton);
					
					nextPanel();
					
				});
				
				// DOM stuff.
				self.element.append(self.element.previousButton)
							.append(self.element.nextButton);
				
			},
		
			// initialize the api.
			_initApi: function() {
				
				// console.log("_initApi");
				
				self.element.play = function() { play(); };
				self.element.start = function() { play(); };
				
				self.element.pause = function() { pause(); };
				self.element.stop = function() { pause(); };
				
				self.element.nextPanel = function() { nextPanel(); };
				self.element.gotoNext = function() { nextPanel(); };
				
				self.element.previousPanel = function() { previousPanel(); };
				self.element.gotoPrevious = function() { previousPanel(); };
				
				self.element.gotoPanel = function(panel) { gotoPanel(panel); };
			
			}
		};
		
		
		// Initializer
		// -----------
		return this.each(function init() {
			
			self.element = $(this);
			$.data(self.element, 'state', 'paused');
			
			// default state
			self.element.addClass('panel-carousel');
			// self.element.is_playing = ;
			self.element.current_panel = 0;
			
			self.element.panels = self.element.children(settings.panel_css_selector);
			if (self.element.panels.length < 2) {
				return false;
			}
			
			self._initDom();
			self._initApi();
			
			if (settings.start_loop_on_init) {
				play();
				$.data(self.element, 'state', 'playing');
			}
			
			return self.element;
			
		});
		
	};
	
})(jQuery);