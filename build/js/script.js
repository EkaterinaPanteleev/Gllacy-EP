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

(function( window ) {
    var Tap = {};

    var utils = {};

    utils.attachEvent = function(element, eventName, callback) {
        if ('addEventListener' in window) {
            return element.addEventListener(eventName, callback, false);
        }
    };

    utils.fireFakeEvent = function(e, eventName) {
        if (document.createEvent) {
            return e.target.dispatchEvent(utils.createEvent(eventName));
        }
    };

    utils.createEvent = function(name) {
        if (document.createEvent) {
            var evnt = window.document.createEvent('HTMLEvents');

            evnt.initEvent(name, true, true);
            evnt.eventName = name;

            return evnt;
        }
    };

    utils.getRealEvent = function(e) {
        if (e.originalEvent && e.originalEvent.touches && e.originalEvent.touches.length) {
            return e.originalEvent.touches[0];
        } else if (e.touches && e.touches.length) {
            return e.touches[0];
        }

        return e;
    };

    var eventMatrix = [{
        // Touchable devices
        test: ('propertyIsEnumerable' in window || 'hasOwnProperty' in document) && (window.propertyIsEnumerable('ontouchstart') || document.hasOwnProperty('ontouchstart')),
        events: {
            start: 'touchstart',
            move: 'touchmove',
            end: 'touchend'
        }
    }, {
        // IE10
        test: window.navigator.msPointerEnabled,
        events: {
            start: 'MSPointerDown',
            move: 'MSPointerMove',
            end: 'MSPointerUp'
        }
    }, {
        // Modern device agnostic web
        test: window.navigator.pointerEnabled,
        events: {
            start: 'pointerdown',
            move: 'pointermove',
            end: 'pointerup'
        }
    }];

    Tap.options = {
        eventName: 'tap',
        fingerMaxOffset: 11
    };

    var attachDeviceEvent, init, handlers, deviceEvents,
        coords = {};

    attachDeviceEvent = function(eventName) {
        return utils.attachEvent(document.documentElement, deviceEvents[eventName], handlers[eventName]);
    };

    handlers = {
        start: function(e) {
            e = utils.getRealEvent(e);

            coords.start = [e.pageX, e.pageY];
            coords.offset = [0, 0];
        },

        move: function(e) {
            if (!coords.start && !coords.move) {
                return false;
            }

            e = utils.getRealEvent(e);

            coords.move = [e.pageX, e.pageY];
            coords.offset = [
                Math.abs(coords.move[0] - coords.start[0]),
                Math.abs(coords.move[1] - coords.start[1])
            ];
        },

        end: function(e) {
            e = utils.getRealEvent(e);

            if (coords.offset[0] < Tap.options.fingerMaxOffset && coords.offset[1] < Tap.options.fingerMaxOffset && !utils.fireFakeEvent(e, Tap.options.eventName)) {
                // Windows Phone 8.0 trigger `click` after `pointerup` firing
                // #16 https://github.com/pukhalski/tap/issues/16
                if (window.navigator.msPointerEnabled || window.navigator.pointerEnabled) {
                    var preventDefault = function(clickEvent) {
                        clickEvent.preventDefault();
                        e.target.removeEventListener('click', preventDefault);
                    };

                    e.target.addEventListener('click', preventDefault, false);
                }

                e.preventDefault();
            }

            coords = {};
        },

        click: function(e) {
            if (!utils.fireFakeEvent(e, Tap.options.eventName)) {
                return e.preventDefault();
            }
        },

        emulatedTap: function( e ) {
            if ( coords.offset ) {
                utils.fireFakeEvent( e, Tap.options.eventName );
            }

            return e.preventDefault();
        }
    };

    init = function() {
        var i = 0;

        for (; i < eventMatrix.length; i++) {
            if (eventMatrix[i].test) {
                deviceEvents = eventMatrix[i].events;

                attachDeviceEvent('start');
                attachDeviceEvent('move');
                attachDeviceEvent('end');
                utils.attachEvent(document.documentElement, 'click', handlers['emulatedTap']);

                return false;
            }
        }

        return utils.attachEvent(document.documentElement, 'click', handlers.click);
    };

    utils.attachEvent(window, 'load', init);

    if (typeof define === 'function' && define.amd) {
        define(function() {
            init();

            return Tap;
        });
    } else {
        window.Tap = Tap;
    }

})( window );