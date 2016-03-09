/*
 * Keynav - jQuery Keyboard Navigation plugin
 *
 * Copyright (c) 2013 Nick Ostrovsky
 *
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Project home:
 *   http://www.firedev.com/jquery.keynav
 *
 * Version:  0.1
 *
 */

$.modal.defaults = {showClose: false, escapeClose: false};

var modal_open = false;

(function($) {
    $.fn.goTo = function() {
        $('html, body').animate({
            scrollTop: $(this).offset().top - 25 +'px'
        }, 'fast');
        return this; // for chaining...
    }
})(jQuery);

;(function($, window, document, undefined) {

	$.fn.keynav = function(checkNav) {
		var elements = this;
		var matrix;
		var x;
		var y;
		var current = this.filter('.selected');
		var keyNavigationDisabled=false;
		if (current.length == 0) current = this.first();

		current.addClass('selected');

		function isElementInViewport (el) {

		    //special bonus for those using jQuery
		    if (typeof jQuery === "function" && el instanceof jQuery) {
		        el = el[0];
		    }

		    var rect = el.getBoundingClientRect();

		    return (
		        rect.top >= 0 &&
		        rect.left >= 0 &&
		        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /*or $(window).height() */
		        rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
		    );
		}

		function update() {
			var i=0;
			var row = Array();
			var j = -1;
			var oldtop = false;
			var m=Array();

			elements.each(function(){
				if (!oldtop) oldtop = this.offsetTop;
				newtop=this.offsetTop;
				if (newtop != oldtop) {
					oldtop=newtop;
					m[i]=row;
					row = Array();
					i++;
					j=0;
					row[j]=this;
				} else {
					j++;
					row[j]=this;
				}
			});
			m[i]=row;
			matrix = m;
			coordinates=findCurrent();
			x=coordinates[0];
			y=coordinates[1];
			return matrix;
		}

		function findCurrent() {
			i=0; j=0; found = false;
			try {
				for (i=0; i<matrix.length; i++) {
					row=matrix[i];
					for (j=0; j<row.length; j++) {
						if (current[0] == row[j]) {
							throw([i,j]);
						}

					}
				}
			}
			catch (arr)
			{
				found = [i,j]
			}
			return(found);
		}

		function setCurrent(i,j) {
			current.parent().children().eq(1).css("display","none")
			if (i<0) i=(matrix.length-1);
			if (i>=matrix.length) i=1;
			if (j<0) j=(matrix[i].length-1);
			if (j>=matrix[i].length) j=0;
			current.removeClass('selected');
			current = $(matrix[i][j]);
			current.addClass('selected');
			x=i;
			y=j;
			console.log("setcurrent")
			current.parent().children().eq(1).css("display","block");
			if(!isElementInViewport(current)){
				if(x == 1){
					$("#top").goTo();
					console.log("going to top...")
				} else {
					current.goTo();
				}
			}
		}

		$(window).bind("resize", function(event) {
			update();
		});

		$(document).ready(function() {
			update();
		});


		$(document).keydown(function(e){
			if (checkNav && checkNav()) return;
			if(modal_open){
				if (e.keyCode == 13) {
					$.modal.close();
					modal_open = false;
				} else if(e.keyCode == 27){
					$.modal.close();
					modal_open = false;
				} else if (e.keyCode == 13) {
					$.modal.close();
					modal_open = false;
				} else if(e.keyCode == 90){  // z
					console.log("z");
				} else if(e.keycode == 88){  // x
					console.log("x");
				}
			} else {
				if (e.keyCode == 37) {
					// left
					setCurrent(x,y-1);
					e.preventDefault();
				} else if (e.keyCode == 38) {
					// up
					setCurrent(x-1,y);
					e.preventDefault();
				} else if (e.keyCode == 39) {
					// right
					setCurrent(x,y+1);
					e.preventDefault();
				} else if (e.keyCode == 40) {
					// down
					setCurrent(x+1,y);
					e.preventDefault();
				} else if (e.keyCode == 13 || e.keyCode == 88) { // return or x
					if(x == 0){
						window.location = current.attr('href');
					} else {
						console.log(x+", "+y)
						$('#'+x+y).modal();
						modal_open = true;
					}
					e.preventDefault();
				} else if(e.keycode == 67){  // c
					console.log("c");
				}  else if(e.keyCode == 90){  // z
					console.log("z");
				}
			}
		});


		return this;
	}

})(jQuery, window, document);