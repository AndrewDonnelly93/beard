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

//http://stackoverflow.com/questions/993834/adding-post-parameters-before-submit
/**
 * Общая цена, включающая в себя вид сайта,
 * количество разделов
 * @constructor
 */
function GeneralPrice() {
  // Количество разделов
  this.sliderAmountCost = 0;
  // Тип сайта
  this.siteCost = 0;
  // Кроссбраузерность
  this.crossBrowserCost = 0;
  // Адаптация под мобильные устройства
  this.mobileAdaptationCost = 0;
  // Контент
  this.contentCost = 0;
  // Продвижение
  this.seoCost = 0;
  // Дополнительные опции (прокрутка, анимация, локализация)
  this.featuresCost = 0;
  this.cost = 0;
}

GeneralPrice.prototype.setSliderAmountCost = function(value) {
  this.sliderAmountCost = value;
  this.setCost();
};

GeneralPrice.prototype.setSeoCost = function(value) {
  this.seoCost = value;
  this.setCost();
};

GeneralPrice.prototype.setMobileAdaptationCost = function(value) {
  this.mobileAdaptationCost = value;
  this.setCost();
};


GeneralPrice.prototype.setSiteCost = function(value) {
  this.siteCost = value;
  this.setCost();
};

GeneralPrice.prototype.setContentCost = function(value) {
  this.contentCost = value;
  this.setCost();
};

/**
 * Прибавление к общей стоимости цены дополнительной опции
 * @param value стоимость дополнительной опции
 * @param feature название дополнительной опции
 */
GeneralPrice.prototype.addFeatureCost = function(value, feature) {
  this[feature+'Cost'] += value;
  this.setCost();
};

GeneralPrice.prototype.removeFeatureCost = function(value, feature) {
  this[feature+'Cost'] -= value;
  this.setCost();
};

/**
 * Вычисление общей стоимости продукта
 */
GeneralPrice.prototype.setCost = function() {
  this.cost = this.sliderAmountCost + this.siteCost + this.crossBrowserCost
  + this.mobileAdaptationCost + this.contentCost + this.seoCost + this.featuresCost;
  if ($(".general-price").length) {
    $(".general-price .price").text(this.getCost());
  }
};

GeneralPrice.prototype.getCost = function() {
  return this.cost;
};

/**
 * Создание jQuery UI слайдера с количеством разделов
 * @param dataInputArray
 * @constructor
 */
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

/**
 * Получение текущего значения стоимости из массива с ценами
 * Текущее значение ищется в массиве со стоимостью
 * Вызывается при изменении слайдера jQuery UI
 * @param value
 * @param slider
 * @returns {*}
 */
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

/**
 * Тип сайта (лэндинг, сайт, магазин и т.п.)
 * @param dataInput
 * @constructor
 */
function TypeSite(dataInput) {
  this.programs = dataInput;
  this.price = dataInput[0].price;
}

TypeSite.prototype.setPrice = function(price) {
  this.price = price;
};

TypeSite.prototype.getPrice = function(price) {
  return this.price;
};

/**
 * Установка цены по типу сайта
 * Работает при изменении фэнси селекта
 * @param generalPrice
 * @param currentTypeSite
 */
function selectSite(generalPrice, currentTypeSite) {
  var currentProgram = $(".select-site-type").siblings(".options")
    .find("li.selected").attr("data-raw-value");
  var currentPrice = getSiteCost(currentProgram, currentTypeSite);
  currentTypeSite.setPrice(currentPrice);
  generalPrice.setSiteCost(currentTypeSite.getPrice());
}

function getSiteCost(program, site) {
  for (var i = 0; i < site.programs.length; i++) {
    if (site.programs[i].program === program) {
      return site.programs[i].price;
    }
  }
  return false;
}

/**
 * Конструктор перечня дополнительных опций
 * @param {Array.<Object>} dataInput
 * @constructor
 */
function Features(dataInput) {
  this.features = dataInput;
}

function getFeaturePrice(currentFeature, featureList) {
  for (var i = 0; i < featureList.features.length; i++) {
    if (featureList.features[i].feature === currentFeature) {
      return featureList.features[i].price;
    }
  }
  return false;
}

/**
 *
 * @param {Features} featureList объект со списком из названий и
 * стоимости дополнительных опций
 * @param {GeneralPrice} generalPrice
 * @param {*} featureElement элемент из DOM у списка
 */
function setFeatures(featureList, generalPrice, featureElement) {
  var feature;
  if (featureElement.indexOf('another-options-list') !== -1) {
    feature = 'features';
  } else if (featureElement.indexOf('browser') !== -1) {
    feature = 'crossBrowser';
  }
  $(featureElement).find(":checkbox").on("click", function() {
    var $this = $(this);
    var currentFeature = $this.attr("id");
    var currentFeaturePrice = getFeaturePrice(currentFeature, featureList);
    if ($this.is(":checked")) {
      generalPrice.addFeatureCost(currentFeaturePrice, feature);
    } else {
      generalPrice.removeFeatureCost(currentFeaturePrice, feature);
    }
  });
}

$(function() {
  var generalPrice = new GeneralPrice();
  if ($("#slider-range-amount").length) {
    // slider with select time of event
    var amountSliderCalculate = new SliderCalculate([
      {sliderInput: 1, trueInput: 5, cost: 4000},
      {sliderInput: 2, trueInput: 5, cost: 4000},
      {sliderInput: 3, trueInput: 5, cost: 4000},
      {sliderInput: 4, trueInput: 7, cost: 8000},
      {sliderInput: 5, trueInput: 8, cost: 12000},
      {sliderInput: 6, trueInput: 9, cost: 16000},
      {sliderInput: 7, trueInput: 10, cost: 20000},
      {sliderInput: 8, trueInput: 11, cost: 24000}
    ]);
    generalPrice.setSliderAmountCost(amountSliderCalculate.getCost());
    $("#slider-range-amount").slider({
      range: "min",
      min: 1,
      max: 8,
      step: 1,
      value: 1,
      animate: true,
      slide: function(event,ui) {
        $("#slider-amount" ).val(ui.value);
        amountSliderCalculate.setCost($("#slider-amount").val(),
            getSliderCost);
        generalPrice.setSliderAmountCost(amountSliderCalculate.getCost());
      },
      change: function(event,ui) {
        $("#slider-amount" ).val(ui.value);
        amountSliderCalculate.setCost($("#slider-amount").val(),
          getSliderCost);
        generalPrice.setSliderAmountCost(amountSliderCalculate.getCost());
      }
    });
    $( "#slider-amount" ).val( $( "#slider-range-amoun" ).slider("value") );
  }
  

  if ($(".select-site-type").length) {
    // select scenario of event
    var fancySelect = $(".select-site-type");
    var currentTypeSite = new TypeSite([
      {program: "landing", price: 45000},
      {program: "full-site", price: 65000},
      {program: "online-shop", price: 90000},
      {program: "online-service", price: 150000}
    ]);
    generalPrice.setSiteCost(currentTypeSite.getPrice());
    fancySelect.fancySelect({ forceiOS: true }).on('change.fs', function() {
      selectSite(generalPrice, currentTypeSite);
    });
    slimScrollInitialise(".options");
  }

  if ($(".browsers-list").length) {
    var browsersList = new Features([
      {feature: "all-browsers", price: 16000},
      {feature: "chrome", price: 0},
      {feature: "opera", price: 2000},
      {feature: "firefox", price: 2000},
      {feature: "yandex", price: 2000},
      {feature: "ie", price: 10000}
    ]);
    var browserElement = ".browsers-list";
    /**
     * При выборе пункта "Все" в адаптации под браузеры
     * всем остальным опциям ставится disabled
     */
    var allBrowsersPrice = getFeaturePrice('all-browsers', browsersList);
    var flag = true;
    $(browserElement).find(":checkbox").on("click", function(e) {
      var $this = $(this);
      var currentFeature = $this.attr("id");
      if (currentFeature === 'all-browsers') {
        flag = false;
        if ($this.is(":checked")) {
          generalPrice['crossBrowserCost'] = getFeaturePrice(currentFeature, browsersList);
          generalPrice.setCost();
          $this.parents(browserElement).find(":checkbox").each(function () {
            if ($(this).attr("id") !== currentFeature) {
              $(this).attr("checked", false);
            }
          });
        }  else {
          generalPrice['crossBrowserCost'] = 0;
          generalPrice.setCost();
        }
      } else {
        $this.parents(browserElement).find("#all-browsers").attr("checked", false);
        if (!flag && (generalPrice['crossBrowserCost'] === allBrowsersPrice)) {
          generalPrice['crossBrowserCost'] = 0;
        }
        ($this.is(":checked") && (currentFeature !== 'chrome')) ?
          generalPrice.addFeatureCost(getFeaturePrice(currentFeature, browsersList), 'crossBrowser')
          :  generalPrice.removeFeatureCost(getFeaturePrice(currentFeature, browsersList), 'crossBrowser');
      }
    });
  }

  if ($(".mobile-adaptation-list").length) {
    var mobileAdaptationList = new Features([
      {feature: "yes-mobile-adaptation", price: 20000},
      {feature: "no-mobile-adaptation", price: 0}
    ]);
    $(".mobile-adaptation-list").find(":checkbox").on("click", function(e) {
      var $this = $(this);
      var currentFeature = $this.attr("id");
      if (currentFeature.indexOf('yes') !== -1) {
        $this.parents(".mobile-adaptation-list").find(":checkbox").each(function () {
          if ($(this).attr("id") !== currentFeature) {
            $(this).attr("checked", false);
          }
        });
      } else if (currentFeature.indexOf('no') !== -1) {
        $this.parents(".mobile-adaptation-list").find(":checkbox").each(function () {
          if ($(this).attr("id") !== currentFeature) {
            $(this).attr("checked", false);
          }
        });
      }
      $this.is(":checked") ?
        generalPrice.setMobileAdaptationCost(getFeaturePrice(currentFeature, mobileAdaptationList))
      :  generalPrice.setMobileAdaptationCost(0);
      generalPrice.setCost();
    });
  }

  if ($(".content-options-list").length) {
    var contentOptionsList = new Features([
      {feature: "yes-content", price: 40000},
      {feature: "no-content", price: 0}
    ]);
    $(".content-options-list").find(":checkbox").on("click", function(e) {
      var $this = $(this);
      var currentFeature = $this.attr("id");
      if (currentFeature.indexOf('yes') !== -1) {
        $this.parents(".content-options-list").find(":checkbox").each(function () {
          if ($(this).attr("id") !== currentFeature) {
            $(this).attr("checked", false);
          }
        });
      } else if (currentFeature.indexOf('no') !== -1) {
        $this.parents(".content-options-list").find(":checkbox").each(function () {
          if ($(this).attr("id") !== currentFeature) {
            $(this).attr("checked", false);
          }
        });
      }
      $this.is(":checked") ?
        generalPrice.setContentCost(getFeaturePrice(currentFeature, contentOptionsList))
        :  generalPrice.setContentCost(0);
      generalPrice.setCost();
    });
  }

  if ($(".seo-options-list").length) {
    var seoOptionsList = new Features([
      {feature: "yes-seo", price: 15000},
      {feature: "no-seo", price: 0}
    ]);
    $(".seo-options-list").find(":checkbox").on("click", function(e) {
      var $this = $(this);
      var currentFeature = $this.attr("id");
      if (currentFeature.indexOf('yes') !== -1) {
        $this.parents(".seo-options-list").find(":checkbox").each(function () {
          if ($(this).attr("id") !== currentFeature) {
            $(this).attr("checked", false);
          }
        });
      } else if (currentFeature.indexOf('no') !== -1) {
        $this.parents(".seo-options-list").find(":checkbox").each(function () {
          if ($(this).attr("id") !== currentFeature) {
            $(this).attr("checked", false);
          }
        });
      }
      $this.is(":checked") ?
        generalPrice.setSeoCost(getFeaturePrice(currentFeature, seoOptionsList))
        :  generalPrice.setSeoCost(0);
      generalPrice.setCost();
    });
  }

  if ($(".another-options-list").length) {
    var featuresList = new Features([
      {feature: "localization", price: 15000},
      {feature: "animation", price: 15000},
      {feature: "scrolling", price: 15000}
    ]);
    setFeatures(featuresList, generalPrice, ".another-options-list");
  }


});

