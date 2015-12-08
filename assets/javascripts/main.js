function slimScrollInitialise(className) {
  var $box = $(className);
  $box.mCustomScrollbar({
    scrollbarPosition: "inside",
    theme: "minimal",
    advanced: {
      updateOnContentResize: true
    }
  });
}


function createMap() {
  var useragent = navigator.userAgent;
  var mapdiv = document.getElementById("map");
  mapdiv.style.width = '50%';
  mapdiv.style.height = '100%';
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 59.944505, lng: 30.295166},
    zoom: 14
  });
  var markerImage = {
    url: "assets/images/marker.png"
  };
  var marker = new google.maps.Marker({
    position: map.getCenter(),
    icon: markerImage,
    map: map
  });
}

function callOwl(owl) {
  owl.owlCarousel({
    margin: 60,
    nav: true,
    loop: true,
    autoWidth: false,
    items: 4
  });
}

$(function () {

  if ($(".owl-carousel").length) {
    var owl = $(".team");
    callOwl(owl);
  }

  if ($("#map").length) {
    createMap();
  }

  $('a[href*=#]:not([href=#])').click(function () {
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
      if (target.length) {
        $('html,body').animate({
          scrollTop: target.offset().top
        }, 1000);
        return false;
      }
    }
  });

  if ($("#customer-phone").length) {
    $("#customer-phone").mask("x0y000z000q00q00", {
      translation: {
        "x": {
          pattern: /\+/,
          fallback: "+"
        },
        "y": {
          pattern: /\(/,
          fallback: "("
        },
        "z": {
          pattern: /\)/,
          fallback: ")"
        },
        "q": {
          pattern: /\-/,
          fallback: '-'
        },
        placeholder: "+_ (___) __-__-__"
      }
    });
  }

});

