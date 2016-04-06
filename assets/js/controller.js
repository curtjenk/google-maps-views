var mapsApp = angular.module('mapsApp', [
  'ngRoute',
  'angularjs-dropdown-multiselect',
  'ngMaterial'
]);

mapsApp.controller('mapsController', function($scope, $compile, $timeout,
    $mdSidenav, $log) {


    var originalCenter = new google.maps.LatLng(40.0000, -98.0000);
    var originalZoom = 4;
    var clickZoom = 6;
    var finalZoom = 11;
    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer;

    $scope.toggleLeft = buildDelayedToggler('left');
    $scope.toggleRight = buildToggler('right');
    $scope.isOpenRight = function() {
      return $mdSidenav('right').isOpen();
    };

    //are these two really $scope variables? (not shared/seen in the view)
    $scope.markers = [];
    $scope.placesMarkers = [];
    //------------------------------
    // $scope.cityFilter = "";
    $scope.cities = cities;

    $scope.map = new google.maps.Map(document.getElementById('map'), {
      zoom: originalZoom,
      center: originalCenter
    });

    directionsDisplay.setMap($scope.map);


    $scope.example1model = [];
    $scope.example1data = normalizedPlaces(); //[ {id: 1, label: "David"}, {id: 2, label: "Jhon"}, {id: 3, label: "Danny"}];
    $scope.example5customTexts = {
      buttonDefaultText: 'Place Types'
    };
    $scope.example10settings = {
      selectionLimit: 1
    };

    var clickedOnMarker = new google.maps.Marker({});

    $scope.getWeatherHandler = function(cityYearRank) {
      var apiKey = '7496eb8b9ef9616cf145982ce0a992fe';
      var cityNdx = Number(cityYearRank) - 1;
      var city = cities[cityNdx];
     
      weatherSearchByCity(city.city, apiKey, function(weatherData) {
        var contentString = getContentStringWeather(city, weatherData);
        infowindow.setContent(contentString[0]);
        infowindow.open($scope.map, clickedOnMarker);
      });

    };

    $scope.onChangeHandler = function(_latLonValue) {
      calculateAndDisplayRoute(directionsService, directionsDisplay,
        _latLonValue);
    };

    $scope.showInfoClick = function(cityYearRank) {
      var mNdx = Number(cityYearRank) - 1;
      var _aPlaceTypes = [];
      //NOTE: if selectionLimit is 1, example1model will be an object not an array
      //https://github.com/dotansimha/angularjs-dropdown-multiselect/issues/151
      if ($scope.example1model.length === 0 && $scope.example1model.id !==
        undefined) {
        _aPlaceTypes.push($scope.example1data[$scope.example1model.id].original);
      } else {
        for (i = 0; i < $scope.example1model.length; i++) {
          _aPlaceTypes.push($scope.example1data[$scope.example1model[i].id]
            .original);
        }
      }
      //clear checked places:
      $scope.example1model = [];

      $mdSidenav('right').close();

      if (_aPlaceTypes.length > 0) {
        // what we want to do?
        placesSearch(mNdx, _aPlaceTypes);
      } else {
        //trigger a click event on a particular marker
        $scope.markers[mNdx].setAnimation(google.maps.Animation.DROP);
        google.maps.event.trigger($scope.markers[mNdx], 'click');
      }
    };

    function placesSearch(ndxOfCityClicked, _arr) {
      //pyrmont should be the location/city selected,
      var cityLocation = {
        lat: $scope.markers[ndxOfCityClicked].position.lat(),
        lng: $scope.markers[ndxOfCityClicked].position.lng()
      };

      ///???? do we really need to create a new map?  YES!
      $scope.map = new google.maps.Map(document.getElementById('map'), {
        center: cityLocation,
        zoom: 10
      });

      var service = new google.maps.places.PlacesService($scope.map);

      //console.log(_arr);
      service.nearbySearch({
        location: cityLocation,
        radius: 50000,
        //type: _arr //use array of selected placesTypes
        type: _arr[0] //As of 2/16/2016 google only supports 1 type per search
      }, placesSearchcallback);
    }

    function placesSearchcallback(results, status) {
      //console.log(results);
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        deleteMarkers($scope.placesMarkers); //from any previous searches
        for (var i = 0; i < results.length; i++) {
          createPlacesMarker(results[i]);
        }
      }
    }

    function createPlacesMarker(place) {
      var placeLoc = place.geometry.location;
      var marker = new google.maps.Marker({
        map: $scope.map,
        position: place.geometry.location
      });

      marker.addListener('click', function() {
        infowindow.setContent(place.name); //contentString[0]);
        infowindow.open($scope.map, marker);
      });
      $scope.placesMarkers.push(marker);
    }

    var zoomAnimator = new ZoomAnimator({
      zoomInterval: 500,
      duration: 100
    });

    var easingAnimator = new EasingAnimator({
      easingInterval: 500,
      duration: 2000,
      step: 100,
      callBack: function(latLng) {
        $scope.map.setCenter(latLng);
        $scope.map.setZoom(clickZoom);
      },
      finalCallBack: function() {
        //console.log("Zooming in");
        zoomAnimator.zoomIn(
          $scope.map.getZoom(),
          11,
          function(zoom) {
          //  console.log("IN = " + zoom);
            $scope.map.setZoom(zoom);
          },
          function() {}
        );
      }
    });

    $scope.zoomClick = function(cityYearRank) {
     var mNdx = Number(cityYearRank) - 1;
      //trigger a click event on a particular marker
      // $scope.map.panTo($scope.markers[mNdx].position);

      // var point = originalCenter;
      var point = $scope.map.getCenter();
      var destinationPoint = {
        lat: $scope.markers[mNdx].position.lat(),
        lng: $scope.markers[mNdx].position.lng()
      };
      
      // console.log("Starting the zoom out at " + $scope.map.getZoom() +
      //  " End=6");
      zoomAnimator.zoomOut(
        $scope.map.getZoom(),
        6,
        function(zoom) {
         // console.log("OUT = " + zoom);
          $scope.map.setZoom(zoom);
        },
        function() {
          easingAnimator.easeProp({
            lat: point.lat(),
            lng: point.lng()
          }, destinationPoint);
        }
      );

      $mdSidenav('right').close();

    };


    function createMarker(city) {
      // console.log(city);
      var _latLon = city.latLon.split(',', 2);
      var lat = Number(_latLon[0]);
      var lon = Number(_latLon[1]);
      var contentString = getContentString(city);

      //console.log(latLon);

      var marker = new google.maps.Marker({
        position: new google.maps.LatLng(lat, lon),
        map: $scope.map,
        title: city.city + ', ' + city.state,
        animation: google.maps.Animation.DROP
      });

      marker.addListener('click', function() {
        infowindow.setContent(contentString[0]);
        infowindow.open($scope.map, marker);
        clickedOnMarker = marker;
      });

      $scope.markers.push(marker);
    }

    var infowindow = new google.maps.InfoWindow({
      // content: contentString
    });

    function getContentString(city) {

      var _content = '<div id="content">' +
        '<div id="siteNotice">' +
        '</div>' +
        '<h1 class="firstHeading">' + city.city + '</h1>' +
        '<div class="bodyContent">' +
        '<div><strong>Total Population : </strong>' + city.yearEstimate +
        '</div> ' +
        '<div><strong>2010 Census : </strong>' + city.lastCensus + '</div> ' +
        '<div><strong>Population Change : </strong>' + city.change +
        ' </div> ' +
        '<div><strong>Population Density : </strong>' + city.lastPopDensity +
        ' </div> ' +
        '<div><strong>State : </strong>' + city.state + ' </div> ' +
        '<div><strong>Land Area : </strong>' + city.landArea + '</div>' +
        '<div><a href="#" ng-click="onChangeHandler(\'' + city.latLon +
        '\')">Directons From Atlanta</a></div>' +
        '<div id="weather-info"><a href="#" ng-click="getWeatherHandler(\'' +
        city.yearRank + '\')">Weather</a></div>' +
        '</div>' +
        '</div>';
      return $compile(_content)($scope); //contentString; RETURN'd as ARRAY!!
    }

    function getContentStringWeather(city, weather) {

      var _content = '<div id="content">' +
        '<div id="siteNotice">' +
        '</div>' +
        '<h1 class="firstHeading">' + city.city + '</h1>' +
        '<div class="bodyContent">' +
        '<div><strong>Total Population : </strong>' + city.yearEstimate +
        '</div> ' +
        '<div><strong>2010 Census : </strong>' + city.lastCensus + '</div> ' +
        '<div><strong>Population Change : </strong>' + city.change +
        ' </div> ' +
        '<div><strong>Population Density : </strong>' + city.lastPopDensity +
        ' </div> ' +
        '<div><strong>State : </strong>' + city.state + ' </div> ' +
        '<div><strong>Land Area : </strong>' + city.landArea + '</div>' +
        '<div><a href="#" ng-click="onChangeHandler(\'' + city.latLon +
        '\')">Directons</a></div>' +
        '<div class="weather-info">' +
        '<div class="left-side">' +
        '<h3>Weather Conditions</h3>' +
        '<div id="left-left">&deg;' + weather.currTemp +
        '</div><div id="right-left">' + weather.weatherMain + '</div>' +
        '<div id="ico"><img ng-src="img/sun.ico"> ' + weather.sunriseLocalTime() +
        ' <img ng-src="img/moon.ico"> ' + weather.sunsetLocalTime() +
        '</div>' +
        '</div>' +
        '<div class="right-side"><img ng-src="' + weather.weatherIconURL +
        '"></div> ' +
        '</div>' +
        '</div>';
      return $compile(_content)($scope); //contentString; RETURN'd as ARRAY!!
    }


    for (var i = 0; i < cities.length; i++) {
      createMarker(cities[i]);
    }
    // -------- begin reset
    $scope.reInitMap = function() {
      $scope.map.setCenter(originalCenter);
      $scope.map.setZoom(originalZoom);
      deleteMarkers($scope.placesMarkers);
      clearMarkers($scope.markers);  
      addMarkers($scope.markers);
      infowindow.close();
      //  console.log($("#cityFilterInput").val());
      // console.log($scope.cityFilter);

      // $("#cityFilterInput").val("");
      $scope.cityFilter = undefined;
      $scope.example1model = [];
      
    };
    // Deletes all markers in the array by removing references to them.
    function deleteMarkers(markersArray) {
      clearMarkers(markersArray);
      markersArray = [];
    }

    function clearMarkers(markersArray) {
        for (var i = 0; i < markersArray.length; i++) {
            markersArray[i].setMap(null);
        }
    }
    function addMarkers(markersArray) {
        for (var i = 0; i < markersArray.length; i++) {
            markersArray[i].setMap($scope.map);
        }
    }
    //------- End of reset code

    //used to ensure filter is done only on the city name and not other properties of the City object
    $scope.cityFilterComparator = function(input, searchParam) {
      if (input && input.city) {
        var upCity = input.city.toUpperCase();
        var upSearchParam = searchParam.toUpperCase();
        //console.log("input=" + upCity + ' : searching for ' + upSearchParam);
        if (upCity.indexOf(upSearchParam) != -1) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    };
    //------ End custom filter comparator
    function calculateAndDisplayRoute(directionsService, directionsDisplay,
      _latLonValue) {
      // console.log(_latLonValue);
      var _latLon = _latLonValue.split(',', 2);

      // console.log(_latLon);
      var lat = Number(_latLon[0]);
      var lon = Number(_latLon[1]);

      var _destination = new google.maps.LatLng(lat, lon);
      var _origin = new google.maps.LatLng(33.7629, -84.4227);

      directionsService.route({
        // origin: document.getElementById('start').value,
        // destination: document.getElementById('end').value,
        origin: _origin,
        destination: _destination,
        travelMode: google.maps.TravelMode.DRIVING

      }, function(response, status) {
        if (status === google.maps.DirectionsStatus.OK) {
          directionsDisplay.setDirections(response);
        } else {
          window.alert('Directions request failed due to ' + status);
        }
      });
    }

    /**
     * Supplies a function that will continue to operate until the
     * time is up.
     */
    function debounce(func, wait, context) {
      var timer;

      return function debounced() {
        var context = $scope,
          args = Array.prototype.slice.call(arguments);
        $timeout.cancel(timer);
        timer = $timeout(function() {
          timer = undefined;
          func.apply(context, args);
        }, wait || 10);
      };
    }

    /**
     * Build handler to open/close a SideNav; when animation finishes
     * report completion in console
     */
    function buildDelayedToggler(navID) {
      return debounce(function() {
        $mdSidenav(navID)
          .toggle()
          .then(function() {
            $log.debug("toggle " + navID + " is done");
          });
      }, 200);
    }

    function buildToggler(navID) {
      return function() {
        $mdSidenav(navID)
          .toggle()
          .then(function() {
            $log.debug("toggle " + navID + " is done");
          });
      };
    }

  })
  // .controller('LeftCtrl', function($scope, $timeout, $mdSidenav, $log) {
  //   $scope.close = function() {
  //     $mdSidenav('left').close()
  //       .then(function() {
  //         $log.debug("close LEFT is done");
  //       });
  //
  //   };
  // })
  .controller('RightCtrl', function($scope, $timeout, $mdSidenav, $log) {
    $scope.close = function() {
      $mdSidenav('right').close()
        .then(function() {
          $log.debug("close RIGHT is done");
        });
    };
  });
