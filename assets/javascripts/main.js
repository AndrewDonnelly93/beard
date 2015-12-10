(function() {
  /**
   }
   * Убирает класс или добавляет его
   * @param {Element} element
   * @param {string} className
   * @param {boolean=} action
   */
  function toggleClass(element, className, action) {
    if (action && element.className.indexOf(className) === -1) {
      element.className = !element.className.length ? className :
      element.className + ' ' + className;
    } else if (!action && element.className.indexOf(className) !== -1) {
      var classList = element.className.split(' ');
      classList.splice(classList.indexOf(className), 1);
      element.className = classList.join(' ');
    }
  }

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

  function close() {
    toggleClass(document.querySelector('.active'), 'active');
  }

  $(function () {

    if ($(".owl-carousel").length) {
      var owl = $(".team");
      callOwl(owl);
    }

    if ($("#map").length) {
      createMap();
    }

    $('a.go-internal').click(function () {
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

    $("body").on("click", function () {
      if ($(".phone").hasClass("active")) {
        $(".phone").addClass("active");
      } else {
        $(".phone").removeClass("active");
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

    if ($(".img-link").length) {
      var offsetTop;
      document.querySelector(".works-list").addEventListener("click", function (e) {
        e.preventDefault();
        if (e.target.tagName === 'IMG') {
          offsetTop = window.pageYOffset;
          window.scrollTo(0, 0);
          var linkToPopup = e.target.parentElement.hash;
          toggleClass(document.querySelector(linkToPopup), 'active', true);
        }
      });
      $(document).on("click", function (e) {
        if (!$(e.target).parents(".works-list").length) {
          if ($(".work").hasClass("active")) {
            $(".work").removeClass("active");
            window.scrollTo(0, offsetTop);
          }
        }
      });
    }
  });
})();

