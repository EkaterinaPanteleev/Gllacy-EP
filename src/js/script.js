(function(){
  //map
  ymaps.ready(init);
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

})();
