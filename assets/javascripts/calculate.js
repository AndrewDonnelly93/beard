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
  this.cost = 0;
}

GeneralPrice.prototype.setSliderAmountCost = function(value) {
  this.sliderAmountCost = value;
  this.setCost();
};


GeneralPrice.prototype.setSiteCost = function(value) {
  this.siteCost = value;
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
  + this.mobileAdaptationCost;
  console.log(this);
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
  if (featureElement.indexOf(".browsers") !== -1) {
    feature = 'crossBrowser';
  } else if (featureElement.indexOf(".mobile-adaptation") !== -1) {
    feature = 'mobileAdaptation';
  }
  var optionsElement = $(featureElement).find(":checkbox").length ? ":checkbox" : ":radio";
  console.log($(featureElement).find(":checkbox"));
  console.log(optionsElement);
  $(featureElement).find(optionsElement).on("click", function() {
    var $this = $(this);
    var currentFeature = $this.attr("id");
    var currentFeaturePrice = getFeaturePrice(currentFeature, featureList);
    // У чекбоксов прибавляется и убавляется цена стоимости
    if (optionsElement === ":checkbox") {
      if ($this.is(":checked")) {
        console.log($this.parents(featureElement));
        // Кнопка все браузеры - не отмечена, реализуется обычное поведение
        if (!$this.parents(featureElement).find("#all-browsers").is(":checked")) {
          console.log($this.parents(featureElement).find("#all-browsers").is(":checked"));
          generalPrice.addFeatureCost(currentFeaturePrice, feature);

        } else {
          // Отмечена кнопка все браузеры, стоимость равна - все
          currentFeature = 'all-browsers';
          currentFeaturePrice = getFeaturePrice(currentFeature, featureList);
          if (generalPrice[feature+'Cost'] !== currentFeaturePrice) {
            generalPrice[feature+'Cost'] = currentFeaturePrice;
            generalPrice.setCost();
          }
          // Но нужно сохранять текущую стоимость всех опций на данный момент
          // в специальном свойстве, при убирании галочки все она станет основной ценой
          if (feature === 'crossBrowser') {
            this.tempCrossBrowserCost +=
          }
        }
      } else {
        // Если кнопка все браузеры не отмечена, то вычитаем цену дополнительной опции
        if (!$this.parents(featureElement).find("#all-browsers").is(":checked")) {
          generalPrice.removeFeatureCost(currentFeaturePrice, feature);
        } else {
          this.tempCrossBrowserCost -=
        }
      }
    } else {}
    // У радиобаттонов при отмечании сравнивается текущая цена с 0,
    // если цена равна 0, то прибавляется к общей стоимости
    //if (optionsElement === ":radio") {
    //  if ($this.is(":checked") && ($this.val().indexOf('yes') !== -1) && !generalPrice[feature+'Cost']) {
    //    console.log($this.val().indexOf('yes'));
    //    generalPrice.addFeatureCost(currentFeaturePrice, feature);
    //  } else if ($this.is(":checked") && ($this.val().indexOf('no') !== -1)) {
    //    generalPrice.removeFeatureCost(currentFeaturePrice, feature);
    //  }
    //}
    console.log(generalPrice);
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
        console.log(amountSliderCalculate);
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
      {program: "online-service", price: 15000}
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

    /**
     * При выборе пункта "Все" в адаптации под браузеры
     * всем остальным опциям ставится disabled
     */
    //$(".browsers-list").find(":checkbox").on("click", function() {
    //  var $this = $(this);
    //  var currentFeature = $this.attr("id");
    //  if (currentFeature === 'all-browsers') {
    //    if ($this.is(":checked")) {
    //      // Ставим disabled всем чекбоксам
    //      $this.parents(".browsers-list").find(":checkbox").attr("disabled", true);
    //      // Ставим класс disabled меткам
    //      $this.parents(".browsers-list").find("span").addClass("disabled");
    //      $this.parents(".browsers-list").find("#" + currentFeature).attr("disabled", false);
    //      $this.parents(".browsers-list").find("label").each(function() {
    //        if ($(this).attr("for") === currentFeature) {
    //          $(this).find("span").removeClass("disabled");
    //        }
    //      });
    //    } else {
    //      $this.parents(".browsers-list").find(":checkbox").attr("disabled", false);
    //      $this.parents(".browsers-list").find("span").removeClass("disabled");
    //    }
    //  }
    //});
    setFeatures(browsersList, generalPrice, ".browsers-list");
  }

  if ($(".mobile-adaptation-list").length) {
    var mobileAdaptationList = new Features([
      {feature: "yes-mobile-adaptation", price: 20000},
      {feature: "no-mobile-adaptation", price: 0}
    ]);
   // setFeatures(mobileAdaptationList, generalPrice, ".mobile-adaptation-list");
  }

  });

