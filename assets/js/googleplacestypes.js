var PlacesTypes = [
    'accounting',
    'airport',
    'amusement_park',
    'aquarium',
    'art_gallery',
    'atm',
    'bakery',
    'bank',
    'bar',
    'beauty_salon',
    'bicycle_store',
    'book_store',
    'bowling_alley',
    'bus_station',
    'cafe',
    'campground',
    'car_dealer',
    'car_rental',
    'car_repair',
    'car_wash',
    'casino',
    'cemetery',
    'church',
    'city_hall',
    'clothing_store',
    'convenience_store',
    'courthouse',
    'dentist',
    'department_store',
    'doctor',
    'electrician',
    'electronics_store',
    'embassy',
    'establishment (deprecated)',
    'finance (deprecated)',
    'fire_station',
    'florist',
    'food (deprecated)',
    'funeral_home',
    'furniture_store',
    'gas_station',
    'general_contractor (deprecated)',
    'grocery_or_supermarket',
    'gym',
    'hair_care',
    'hardware_store',
    'health (deprecated)',
    'hindu_temple',
    'home_goods_store',
    'hospital',
    'insurance_agency',
    'jewelry_store',
    'laundry',
    'lawyer',
    'library',
    'liquor_store',
    'local_government_office',
    'locksmith',
    'lodging',
    'meal_delivery',
    'meal_takeaway',
    'mosque',
    'movie_rental',
    'movie_theater',
    'moving_company',
    'museum',
    'night_club',
    'painter',
    'park',
    'parking',
    'pet_store',
    'pharmacy',
    'physiotherapist',
    'place_of_worship (deprecated)',
    'plumber',
    'police',
    'post_office',
    'real_estate_agency',
    'restaurant',
    'roofing_contractor',
    'rv_park',
    'school',
    'shoe_store',
    'shopping_mall',
    'spa',
    'stadium',
    'storage',
    'store',
    'subway_station',
    'synagogue',
    'taxi_stand',
    'train_station',
    'transit_station',
    'travel_agency',
    'university',
    'veterinary_care',
    'zoo'
];

function normalizedPlaces() {
   var arr = [];
   var idVal = 0;
   for (var i = 0; i < PlacesTypes.length; i++) {
       var temp = replaceAll(PlacesTypes[i], '_', ' ');
       if (!(temp.indexOf('depracated') > -1 || temp.indexOf('deprecated') > -1) ) {
           arr.push( {id: idVal, label: titleCase(temp), original: PlacesTypes[i]});
           idVal++;
       }
   }
   return arr;
}

function replaceAll(str, charToReplace, charReplacement) {

    var newStr = '';
    for (var i = 0; i < str.length; i++) {
        if (str[i] === charToReplace) {
            newStr = newStr.concat(charReplacement);
        } else {
            newStr = newStr.concat(str[i]);
        }
    }

    return newStr;
}

//uppercase the first letter of each word in a string
function titleCase(str) {
    var splitStr = str.toLowerCase().split(' ');
    for (var i = 0; i < splitStr.length; i++) {
        splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    return splitStr.join(' ');
}