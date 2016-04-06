// //This js file reference $scope and variables in controller.js
// var reInitMap = function() {
//     $scope.map.setCenter(originalCenter);
//     $scope.map.setZoom(originalZoom);
//     //remove any routes
//     //???????????
//     //remove/delete any placesMarkers
//     deleteMarkers($scope.placesMarkers);
//     //clear any city Markers
//     clearMarkers($scope.markers);  //just in case they were not previously cleared
//     //Add city markers
//     addMarkers($scope.markers);

// };

// // Deletes all markers in the array by removing references to them.
// function deleteMarkers(markersArray) {
//     clearMarkers(markersArray);
//     markersArray = [];
// }

// function clearMarkers(markersArray) {
//     for (var i = 0; i < markersArray.length; i++) {
//         markersArray[i].setMap(null);
//     }
// }
// function addMarkers(markersArray) {
//     for (var i = 0; i < markersArray.length; i++) {
//         markersArray[i].setMap($scope.map);
//     }
// }
