# jQuery Panel Carousel

Panel Carousel "Hero Box" plugin for jQuery written by Think Shift Inc.

**Panel Carousel depends on:**
- jQuery (built with 1.8.2)
- jQuery.easing (built with 1.3)


## Usage:

	jQuery('.hero').PanelCarousel(); // panel carousel-ify

## Options:

**stylesheet:** "/css/panelcarousel.css"  
**panel\_css\_selector:** '.panel'  
**start\_loop\_on\_init:** true  
  
### controls
**show\_indicators:** true  
**show\_previous\_next:** true  
**show\_play\_pause:** true  
			  
**cancel\_loop\_on\_indicator\_click:** true  
**cancel\_loop\_on\_button\_click:** true  
			  
### animation
**transition:** null  
**transition\_duration:** 1000  
**panel\_duration:** 8000  
			  
### callback functions
*before and after each panel is shown, before the animation ends.*  
**beforeShow:** function() {}  
**afterShow:** function() {}  
			  
*before and after the slide animation begins*  
**beforeAnimation:** function() {}  
**afterAnimation:** function() {}  
			  
*before and after the panel is hidden, after the animation ends.*  
**beforeHide:** function() {}  
**afterHide:** function() {}  
			  
**when an indicator is clicked**  
**indicatorClick:** function() {}  
			  
**when a control is clicked**  
**controlClick:** function() {}  
			  
**when the loop is cancelled**  
**loopCancelled:** function() {}  