(function( $ ) {
    //CONSTRUCTOR
    $.fn.slidez = function(options) {
	    var settings = $.extend({
		       slidezClass:".screen"
		       ,width:1024
		       ,height:768
		       ,transitiontime:500
		    }, options);
	    if(!$(this).children(settings.slidezClass).length)
			throw 'slidez container: #'+$(this).attr('id')+' is empty !\nRemember to addClass ".screen" to your screens element holder.';
	    //STORE SCREENS ARRAY
	 	$(this).data('screens',$(this).children(settings.slidezClass));
		$(this).data('current',0);
		$(this).data('transitiontime',settings.transitiontime);
		//SETTING HOLDER
	 	this.css({
	 		width:settings.width
	 	   ,height:settings.height
	 	   ,position:'absolute'
	 	   ,overflow:'hidden'
	 	});
	 	//SETTING SCREENS
	 	$(this).children(settings.slidezClass).each(function(){ 
	 		$(this).css({
		 		width:settings.width
		 	   ,height:settings.height
		 	   ,position:'absolute'
		 	});
	 	});
	 	//DISPLAY FIRST SCREEN
	 	$(this).slidezReset();
        return this;
    }

	$.fn.slidezNext = function() {
		var screens = $(this).data('screens');
		var current = $(this).data('current');

		if(current<screens.length-1)
			$(this).slidezGoTo(current+1);
		return this;
	}

	$.fn.slidezPrev = function() {
		var current = $(this).data('current');

		if(current>0) $(this).slidezGoTo(current-1);

		return this;
	}

	$.fn.slidezGoTo = function(_index) {
		
		var screens = $(this).data('screens');
		var current = $(this).data('current');
		var transitiontime = $(this).data('transitiontime');

		if(_index<0 || _index > screens.length-1)
			throw 'slidez: _index:'+_index+' out of range <from 0 up to '+screens.length-1+'>';
		if(current!=_index)
		{
			$(screens[current]).stop().fadeOut(transitiontime);
			$(screens[_index]).stop().fadeIn(transitiontime);
			current=_index;
		}
		$(this).data('current',current);
		return this;
	}
	//RESET: SETS DISPLAY NONE TO ALL BUT ONE 
	$.fn.slidezReset = function(_index) {
		$(this).data('screens').each(function(){ $(this).hide();});
		$($(this).data('screens')[_index||0]).stop().show();
		return this;
	}

	$.fn.slidezCtrls=function (ctrlprev, ctrlnext) {
		var container = $(this);
		var next = $(this).children(ctrlnext||'#next');
		var prev = $(this).children(ctrlprev||'#prev');

		$(prev).bind("click",function(){
			$(container).slidezPrev();
		});
		$(next).bind("click",function(){ 
			$(container).slidezNext();
		});
	}

	$.fn.addTouchSwipe=function() {
		$(this).swipe({
			swipe:function (event, direction, distance, duration, fingerCount)
			{
				console.log("You swiped " + direction);
				if(direction==="left")
					$(this).slidezPrev();
				if(direction==="right")
					$(this).slidezNext();
			}
		});
	}
	//GET CURRENT SLIDEZ
    $.fn.slidez_current=function() { 
    	return $(this).data('current'); 
    }
	//GET TOTAL SLIDEZS
	$.fn.slidez_screensCount=function() { 
		return $(this).data('screens').length; 
	}
    //GET SET TRANSITIONTIME
    $.fn.slidez_transitionTime=function(time) { 
    	if(time) $(this).data('transitiontime',time); return this; 
    	return $(this).data('transitiontime'); 
    }
}( jQuery ));