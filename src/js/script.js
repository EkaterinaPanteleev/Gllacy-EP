(function(){
  //map
  if (typeof ymaps !== 'undefined') {
    ymaps.ready(init);
  }
  var myMap,
    myPlacemark;

  function init() {
    myMap = new ymaps.Map('map', {
      center: [59.93869278, 30.32935033],
      zoom: 16
    }, {
          searchControlProvider: 'yandex#search'
        }
    );
    myMap.behaviors.disable(['scrollZoom','ruler']);

    myPlacemark = new ymaps.Placemark([59.93855909, 30.32306177], {},
      {
        iconLayout: 'default#image',
        iconImageHref: 'image/marker.png',
        iconImageSize: [218, 142],
        iconImageOffset: [-35, -145]
      }
    );

    myMap.geoObjects.add(myPlacemark);
  };

  //popups
  var contactForm = document.querySelector(".contact-form");
  var contactOpen = document.querySelector(".btn--contact-form");
  var contactClose = document.querySelector(".contact-form__close");

  contactOpen.addEventListener("tap", function(event) {
    event.preventDefault();
    contactForm.classList.add("contact-form--show");
  });

  contactClose.addEventListener("tap", function(event) {
    event.preventDefault();
    contactForm.classList.remove("contact-form--show");
  });

  window.addEventListener("keydown", function(event){
  if (event.keyCode == 27){
    if (contactForm.classList.contains("contact-form--show")) {
      contactForm.classList.remove("contact-form--show");
    }
  }
});


})();
