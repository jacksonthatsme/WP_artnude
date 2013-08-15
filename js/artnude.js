jQuery(document).ready(function($){
/*=============*/
/* FLEX SLIDER*/ 

$(window).load(function() {
	
  $('.flexslider').flexslider({
    animation: "slide",
    controlNav: false,
    prevText: "",
    nextText: "",
    slideshow: false,
  });
});

/* TICKET LEAP INITIALIZER */
$(function(){
		$('#upcoming-events').upcomingEvents({ 
		  pageSize: 5,
		  orgSlug: 'jamesolivergallery',
		  apiUrl: 'http://public-api.ticketleap.com/',
		  apiKey: '5165671287300193'
		});
					 
});
/* STICKY HEADER */
$(window).scroll(function(){
		var wh = $(window).height();
		var head = $('header')
		var headHeight = $('header').height();
		var s  = $(window).scrollTop();
		
		if (s > (wh - headHeight)){
			head.addClass('is-fix');
		} else{
			head.removeClass('is-fix');
		}
		
});
/* READ MORE CALL TO ACTION SLIDETOGGLE */
$(document).ready(function(){
  $(".cta").click(function(){
    $("div.more").slideToggle(700);
    $("div.cta h2").toggle();   
  });
});
/* SMOOTH SCROLL */



$(document).ready(function() {
  function filterPath(string) {
  return string
    .replace(/^\//,'')
    .replace(/(index|default).[a-zA-Z]{3,4}$/,'')
    .replace(/\/$/,'');
  }
  var locationPath = filterPath(location.pathname);
  var scrollElem = scrollableElement('html', 'body');
 
  $('a[href*=#]').each(function() {
    var thisPath = filterPath(this.pathname) || locationPath;
    if (  locationPath == thisPath
    && (location.hostname == this.hostname || !this.hostname)
    && this.hash.replace(/#/,'') ) {
      var $target = $(this.hash), target = this.hash;
      if (target) {
        var targetOffset = $target.offset().top;
        $(this).click(function(event) {
          event.preventDefault();
          $(scrollElem).animate({scrollTop: targetOffset}, 800, function() {
            location.hash = target;
          });
        });
      }
    }
  });
 
  // use the first element that is "scrollable"
  function scrollableElement(els) {
    for (var i = 0, argLength = arguments.length; i <argLength; i++) {
      var el = arguments[i],
          $scrollElement = $(el);
      if ($scrollElement.scrollTop()> 0) {
        return el;
      } else {
        $scrollElement.scrollTop(1);
        var isScrollable = $scrollElement.scrollTop()> 0;
        $scrollElement.scrollTop(0);
        if (isScrollable) {
          return el;
        }
      }
    }
    return [];
  }
 
});

/*=============*/
})
