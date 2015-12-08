function changeProgramInformation() {
  var buttonClass = ".more-programs";
  $(buttonClass).on("hover", function () {
    $(this).css("cursor", "pointer");
  });
  var counter = 0;
  var firstActive = 0;
  $(buttonClass).on("click", function(e) {
    e.preventDefault();
    if ($(this).parents(".programs-names").find(".programs-list").
        find("li:last-child").hasClass("show")) {
      $(this).parents(".programs-names").find(".programs-list").find("li:last-child").removeClass("show").addClass("inactive");
      $(this).parents(".programs-names").find(".programs-list").find("li").eq(firstActive).removeClass("inactive").addClass("show");
      counter = 0;
    } else {
      var index = $(this).parents(".programs-names").find(".programs-list").find("li.show:last").index();
      if (counter === 0) {
        counter += 1;
        firstActive = index;
      }
      $(this).parents(".programs-names").find(".programs-list").find("li.show:last").removeClass("show").addClass("inactive");
      $(this).parents(".programs-names").find(".programs-list").find("li").eq(index+1).removeClass("inactive").addClass("show");
    }
  });
}


function openPrograms() {
  $(".program-name").on("click", function(e) {
    e.preventDefault();
    $(".program-name").removeClass("active");
    $(this).addClass("active");
    $(this).parents("body").find(".programs-block").hide();
    $(this).parents("body").find(".program-information").hide();
    var currentSlide = $(this).attr("href");
    $(this).parents("body").find(".programs-table").addClass("active");
    $(this).parents("body").find($(currentSlide)).show();
  });
}

function switchToProgramsMenu() {
  $(document).on("click",".back-to-menu",function(e) {
    e.preventDefault();
    $(this).parents("body").find(".programs-table").removeClass("active");
    $(this).parents("body").find(".programs-block").show();
  });
}

function createMap() {
  var useragent = navigator.userAgent;
  var mapdiv = document.getElementById("map");
  mapdiv.style.width = '100%';
  mapdiv.style.height = '450px';
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 59.98700, lng: 30.24201},
    zoom: 14
  });
  var grimm = {
    url: "../assets/images/marker.png"
  };
  var marker = new google.maps.Marker({
    position: map.getCenter(),
    icon: grimm,
    map: map
  });
}

function activePaymentList() {
  $(document).on("click",".payment-list>li",function(e) {
    e.preventDefault();
    $(".payment").removeClass("active").siblings("input").attr("checked",false);
    $(this).find(".payment").addClass("active").siblings("input[type=radio]").attr("checked","checked");
  });
}

$(function() {
  if ($(".mobile").length) {
    if ($(".programs-list .program-name").length) {
      openPrograms();
      changeProgramInformation();
      switchToProgramsMenu();
    }
  }
  if ($(".owl-carousel").length) {
    var owlHeroes = $("#heroes");
    owlHeroes.owlCarousel({
      margin: 0,
      nav: false,
      loop: true,
      autoWidth: false,
      dots: true,
      items: 1,
      dotsEach: true
    });
    var owlPlaces = $("#places");
    if (!window.matchMedia("screen and (max-width: 500px").matches) {
      owlPlaces.owlCarousel({
        margin: 0,
        nav: false,
        loop: true,
        autoWidth: false,
        dots: false,
        items: 3,
        dotsEach: false
      });
    } else {
      owlPlaces.owlCarousel({
        margin: 0,
        nav: false,
        loop: true,
        autoWidth: false,
        dots: false,
        items: 1,
        dotsEach: false
      });
    }
  }
  if ($(".team-mates").length) {
    var maxListHeight = 0;
    var owlTeamMates = $(".team-mates");
    owlTeamMates.owlCarousel({
      margin: 0,
      nav: false,
      loop: true,
      autoWidth: false,
      dots: true,
      items: 1,
      dotsEach: true
    });
    $(".team-mates .owl-item").each(function() {
      if ($(this).outerHeight() > maxListHeight) {
        maxListHeight = $(this).outerHeight();
      }
    });
    $(".team-mates .owl-item").css("height", maxListHeight + "px");
  }

  if ($("#map").length) {
    createMap();
  }

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

  if ($(".payment-list").length) {
    activePaymentList();
  }
});
