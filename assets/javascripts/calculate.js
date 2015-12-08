function slimScrollInitialise(className) {
  var $box = $(className);
  $box.mCustomScrollbar({
    scrollbarPosition: "inside",
    theme: "minimal",
    advanced:{
      updateOnContentResize: true
    }
  });
}

function GeneralPrice() {
  this.sliderTimeCost = 0;
  this.sliderHeroesCost = 0;
  this.questCost = 0;
  this.placeCost = 0;
  this.featuresCost = 0;
  this.cost = 0;
}

GeneralPrice.prototype.setSliderTimeCost = function(value) {
  this.sliderTimeCost = value;
  this.setCost();
};

GeneralPrice.prototype.setSliderHeroesCost = function(value) {
  this.sliderHeroesCost = value;
  this.setCost();
};

GeneralPrice.prototype.setQuestCost = function(value) {
  this.questCost = value;
  this.setCost();
};

GeneralPrice.prototype.setPlaceCost = function(value) {
  this.placeCost = value;
  this.setCost();
};

GeneralPrice.prototype.addFeatureCost = function(value) {
  this.featuresCost += value;
  this.setCost();
};

GeneralPrice.prototype.removeFeatureCost = function(value) {
  this.featuresCost -= value;
  this.setCost();
};

GeneralPrice.prototype.setCost = function() {
  this.cost = this.sliderTimeCost +
    this.sliderHeroesCost + this.questCost +
    this.placeCost + this.featuresCost;
  if ($(".general-price").length) {
    $(".general-price .price").text(this.getCost());
  }
};

GeneralPrice.prototype.getCost = function() {
  return this.cost;
};

function SliderCalculate(dataInputArray) {
  this.dataInput = dataInputArray;
  this.price = dataInputArray[0].cost;
}

SliderCalculate.prototype.setCost = function(value, getFunction) {
  this.price = getFunction(value,this);
};

SliderCalculate.prototype.getCost = function() {
  return this.price;
};

function getSliderCost(value,slider) {
  value = parseInt(value,10);
  for (var i = 0; i < slider.dataInput.length; i++) {
    if (slider.dataInput[i].sliderInput === value) {
      return slider.dataInput[i].cost;
    }
  }
  return false;
}

SliderCalculate.prototype.setPrice = function(price) {
  this.price = price;
};

function Quest(dataInput) {
  this.programs = dataInput;
  this.price = dataInput[0].price;
}

Quest.prototype.setPrice = function(price) {
  this.price = price;
};

Quest.prototype.getPrice = function(price) {
  return this.price;
};

function selectQuest(generalPrice, currentQuest) {
  var currentProgram = $(".select-scenario").siblings(".options")
    .find("li.selected").attr("data-raw-value");
  var currentPrice = getQuestCost(currentProgram, currentQuest);
  currentQuest.setPrice(currentPrice);
  generalPrice.setQuestCost(currentQuest.getPrice());
}

function getQuestCost(program, quest) {
  for (var i = 0; i < quest.programs.length; i++) {
    if (quest.programs[i].program === program) {
      return quest.programs[i].price;
    }
  }
  return false;
}

function Place(dataInput) {
  this.places = dataInput;
  this.price = dataInput[0].price;
}

Place.prototype.setPrice = function(price) {
  this.price = price;
};

Place.prototype.getPrice = function(price) {
  return this.price;
};

function getPlaceCost(currentPlace, selectedPlace) {
  for (var i = 0; i < currentPlace.places.length; i++) {
    if (currentPlace.places[i].place === selectedPlace) {
      return currentPlace.places[i].price;
    }
  }
  return false;
}

function setCurrentPlaceCost(generalPrice,currentPlace) {
  $(document).on("click", ".places .owl-item", function() {
    $(this).parents(".places").find(".place").removeClass("current");
    $(this).find(".place").addClass("current");
    var selectedPlace =  $(this).find(".place").attr("data-place");
    var currentPrice = getPlaceCost(currentPlace,selectedPlace);
    currentPlace.setPrice(currentPrice);
    generalPrice.setPlaceCost(currentPlace.getPrice());
  });
}

function Features(dataInput) {
  this.features = dataInput;
}

function getFeaturePrice(currentFeature,featureList) {
  for (var i = 0; i < featureList.features.length; i++) {
    if (featureList.features[i].feature === currentFeature) {
      return featureList.features[i].price;
    }
  }
  return false;
}

function setFeatures(featureList, generalPrice) {
  $(".another-features-list").find(":checkbox").on("click", function() {
    var $this = $(this);
    var currentFeature = $this.attr("id");
    var currentFeaturePrice = getFeaturePrice(currentFeature,featureList);
    if ($this.is(":checked")) {
      generalPrice.addFeatureCost(currentFeaturePrice);
    } else {
      generalPrice.removeFeatureCost(currentFeaturePrice);
    }
  });
}

$(function() {
  var generalPrice = new GeneralPrice();
  if ($("#slider-range-time").length) {
    // slider with select time of event
    var timeSliderCalculate = new SliderCalculate([
      {sliderInput: 1, trueInput: 1, cost: 10000},
      {sliderInput: 2, trueInput: 1.5, cost: 11000},
      {sliderInput: 3, trueInput: 2, cost: 12000},
      {sliderInput: 4, trueInput: 3, cost: 13000},
      {sliderInput: 5, trueInput: 4, cost: 14000},
      {sliderInput: 6, trueInput: 5, cost: 15000},
      {sliderInput: 7, trueInput: 6, cost: 16000}
    ]);
    generalPrice.setSliderTimeCost(timeSliderCalculate.getCost());
    $("#slider-range-time").slider({
      range: "min",
      min: 1,
      max: 7,
      step: 1,
      value: 1,
      animate: true,
      slide: function(event,ui) {
        $("#slider-time" ).val(ui.value);
        timeSliderCalculate.setCost($("#slider-time").val(),
            getSliderCost);
        generalPrice.setSliderTimeCost(timeSliderCalculate.getCost());
      },
      change: function(event,ui) {
        $("#slider-time" ).val(ui.value);
        timeSliderCalculate.setCost($("#slider-time").val(),
          getSliderCost);
        generalPrice.setSliderTimeCost(timeSliderCalculate.getCost());
      }
    });
    $( "#slider-time" ).val( $( "#slider-range-time" ).slider("value") );
  }

  if ($("#slider-range-heroes").length) {
    // slider with select amount of heroes
    var heroesSliderCalculate = new SliderCalculate([
        {sliderInput: 1, trueInput: 1, cost: 10000},
        {sliderInput: 2, trueInput: 2, cost: 11000},
        {sliderInput: 3, trueInput: 3, cost: 12000},
        {sliderInput: 4, trueInput: 4, cost: 13000},
        {sliderInput: 5, trueInput: 5, cost: 14000},
        {sliderInput: 6, trueInput: 6, cost: 15000}
    ]);
    generalPrice.setSliderHeroesCost(heroesSliderCalculate.getCost());
    $("#slider-range-heroes").slider({
      range: "min",
      min: 1,
      max: 6,
      step: 1,
      value: 1,
      animate: true,
      slide: function(event,ui) {
        $("#slider-heroes").val(ui.value);
        heroesSliderCalculate.setCost($("#slider-heroes").val(),
          getSliderCost);
        generalPrice.setSliderHeroesCost(heroesSliderCalculate.getCost());
      },
      change: function(event,ui) {
        $("#slider-heroes").val(ui.value);
        heroesSliderCalculate.setCost($("#slider-heroes").val(),
          getSliderCost);
        generalPrice.setSliderHeroesCost(heroesSliderCalculate.getCost());
      }
      });
    $("#slider-range-heroes").slider({
      change: function(event,ui) {
        $("#slider-heroes" ).val(ui.value);
        heroesSliderCalculate.setCost($("#slider-heroes").val(),
          getSliderCost);
        generalPrice.setSliderHeroesCost(heroesSliderCalculate.getCost());
      }
    });
    $( "#slider-heroes" ).val( $( "#slider-range-heroes" ).slider("value") );
  }

  if ($(".select-scenario").length) {
    // select scenario of event
    var fancySelect = $(".select-scenario");
    var currentQuest = new Quest([
      {program: "harry-potter", price: 5000},
      {program: "maincraft", price: 6000},
      {program: "fort", price: 7000},
      {program: "notices", price: 8000},
      {program: "angry-birds", price: 9000},
      {program: "cookery", price: 10000},
      {program: "egypt", price: 7000}
    ]);
    generalPrice.setQuestCost(currentQuest.getPrice());
    fancySelect.fancySelect({ forceiOS: true }).on('change.fs', function() {
      selectQuest(generalPrice, currentQuest);
    });
    slimScrollInitialise(".options");
  }

  if ($(".owl-carousel").length) {
    // select place of event
    var currentPlace = new Place([
      {place: "maza", price: 5000},
      {place: "maza-2", price: 7000},
      {place: "maza-3", price: 8000},
      {place: "maza-4", price: 9000}
    ]);
    generalPrice.setPlaceCost(currentPlace.getPrice());
    var owlPlaces = $("#places");
    owlPlaces.owlCarousel({
      margin: 27,
      autoWidth: true,
      nav: true,
      loop: true,
      items: 3
    });
    setCurrentPlaceCost(generalPrice, currentPlace);
  }
  if ($(".another-features-list").length) {
    var featuresList = new Features([
      {feature: "cookery-class", price: 5000},
      {feature: "balloons", price: 3000},
      {feature: "make-up", price: 2000},
      {feature: "clothes", price: 6000},
      {feature: "lights", price: 4000}
    ]);
    setFeatures(featuresList,generalPrice);
  }
});

