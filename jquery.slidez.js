// DEV : LEANDRO SILVA SOARES
// REPO: git@github.com:LeandroSoares/slidez.git
//----------------------------------------------------------------------------
// Usage:
//		$('#myholder').slidez({slidezClass:'.myscreens', width:1280, height:720, transitiontime:1000,loopThrough:false});
//		$('#myholder').slidezCtrls({NextArr:[list of next buttons],
// 									PrevArr:[list of prev buttons],
// 									nextBtn:'#nextButton',
// 									prevBtn:'#prevButton'
// });
//----------------------------------------------------------------------------
var SlidezEvents = {
  ENTER: "slidezEnter",
  EXIT: "slidezExit",
  ENTER_COMPLETE: "slidezEnterComplete"
};
(function($) {
  //CONSTRUCTOR
  $.fn.slidez = function(options) {
    var settings = $.extend(
      {
        slidezClass: ".screen",
        width: null,
        height: null,
        transitiontime: 500,
        loopThrough: false
      },
      options
    );

    if (!$(this).children(settings.slidezClass).length) {
      throw "slidez container: #" +
        $(this).attr("id") +
        ' is empty !\nRemember to addClass "' +
        settings.slidezClass +
        '" to your screens element holder.';
    }

    //STORE SCREENS ARRAY
    $(this).data("screens", $(this).children(settings.slidezClass));
    $(this).data("current", 0);
    $(this).data("transitiontime", settings.transitiontime);
    $($(this).data("screens")).each(function(index, Element) {
      $(Element).data("index", index);
    });
    $(this).data("loopThrough", settings.loopThrough);

    //SETTING HOLDER
    this.css({
      position: "absolute",
      overflow: "hidden"
    });
    if (settings.width != null && settings.height != null) {
      this.css({
        width: settings.width,
        height: settings.height
      });
    }

    //SETTING SCREENS
    $(this).children(settings.slidezClass).each(function() {
      if (settings.width != null && settings.height != null) {
        $(this).css({ width: settings.width, height: settings.height });
      }
      $(this).css({ position: "absolute" });
    });
    //DISPLAY FIRST SCREEN
    $(this).slidezReset();
    return this;
  };

  $.fn.slidezLast = function() {
    $(this).slidezGoTo($(this).data("screens").length - 1);
    return this;
  };

  $.fn.slidezFirst = function() {
    $(this).slidezGoTo(0);
    return this;
  };

  $.fn.slidezNext = function() {
    var screens = $(this).data("screens");
    var current = $(this).data("current");
    var loop = $(this).data("loopThrough");
    if (current < screens.length - 1) $(this).slidezGoTo(current + 1);
    else if (loop) $(this).slidezFirst();

    return this;
  };

  $.fn.slidezPrev = function() {
    var current = $(this).data("current");
    var loop = $(this).data("loopThrough");
    if (current > 0) $(this).slidezGoTo(current - 1);
    else if (loop) $(this).slidezLast();

    return this;
  };

  $.fn.slidezShow = function(_id) {
    var elj = $.find(_id);
    var _index = elj.data("index");
    var screens = $(this).data("screens");
    var transitiontime = $(this).data("transitiontime");
    $(screens[_index]).stop().fadeIn(transitiontime);
  };

  $.fn.slidezHide = function(_id) {
    var elj = $.find(_id);
    var _index = elj.data("index");
    var screens = $(this).data("screens");
    var transitiontime = $(this).data("transitiontime");
    $(screens[_index]).stop().fadeOut(transitiontime);
  };
  //Usage: can either go to index or id
  // $('#MySlidezHolder').slidezGoTo(1);
  // $('#MySlidezHolder').slidezGoTo('#slideSpecial');
  $.fn.slidezGoTo = function(__index) {
    var _index;
    //Validando
    if (__index.constructor === Number) {
      _index = __index;
    } else if (__index.constructor === String) {
      var elj = $.find(__index);
      _index = elj.data("index");
    } else {
      throw "Error, __index is not a Number or a String ID";
    }

    var screens = $(this).data("screens");
    var current = $(this).data("current");
    var transitiontime = $(this).data("transitiontime");

    if (_index < 0 || _index > screens.length - 1)
      throw "slidez: _index:" +
        _index +
        " out of range <from 0 up to " +
        screens.length -
        1 +
        ">";
    if (current != _index) {
      $(screens[current]).stop().fadeOut(transitiontime);
      $(screens[_index]).stop().fadeIn(transitiontime, function() {
        //trigger>>>>>>>>>>
        $(this).trigger(SlidezEvents.ENTER_COMPLETE, $(screens[_index]));
      });

      $(this)
        .delay(transitiontime - 10)
        .trigger(SlidezEvents.EXIT, $(screens[current]));

      $(this).trigger(SlidezEvents.ENTER, $(screens[_index]));
      //trigger>>>>>>>>>>
      current = _index;
    }

    $(this).data("current", current);

    return this;
  };
  //RESET: SETS DISPLAY NONE TO ALL BUT ONE
  $.fn.slidezReset = function(_index) {
    $(this).data("screens").each(function() {
      $(this).hide();
    });
    $($(this).data("screens")[_index || 0]).stop().show();
    return this;
  };
  // options = {
  //				NextArr:[buttom1, etc..],
  //				PrevArr:[],
  //				nextBtn:'#b1',
  //				prevBtn:element
  //       }
  $.fn.slidezCtrls = function(options) {
    var container = $(this);

    if (options.NextArr && options.NextArr.length > 0)
      for (var i = options.NextArr.length - 1; i >= 0; i--)
        setNextBtn(options.NextArr[i]);
    else setNextBtn(options.nextBtn);
    if (options.PrevArr && options.PrevArr.length > 0)
      for (var i = options.PrevArr.length - 1; i >= 0; i--)
        setPrevBtn(options.PrevArr[i]);
    else setPrevBtn(options.prevBtn);

    function setNextBtn(id) {
      $(id || "#next").bind("click", function() {
        $(container).slidezNext();
      });
    }
    function setPrevBtn(id) {
      $(id || "#prev").bind("click", function() {
        $(container).slidezPrev();
      });
    }
  };

  //GET CURRENT SLIDEZ
  $.fn.slidez_current = function() {
    return $(this).data("current");
  };
  //GET TOTAL SLIDEZS
  $.fn.slidez_screensCount = function() {
    return $(this).data("screens").length;
  };
  //GET SET TRANSITIONTIME
  $.fn.slidez_transitionTime = function(time) {
    if (time) $(this).data("transitiontime", time);
    return this;
    return $(this).data("transitiontime");
  };
})(jQuery);
