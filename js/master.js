//Creating an array of the locations
var locations = [
        {
            title: "Westend Mall",
            location: {
                lat: 30.8856,
                lng: 75.7882
            },
            show: true,
            selected: false,
            link: "https://google.co.in/search?q=westend+mall+ludhiana",
            id: "4da43e5463b5a35d20a4211a"
        },
        {
            title: "Silver Arc Mall",
            location: {
                lat: 30.9005,
                lng: 75.8292
            },
            show: true,
            selected: false,
            link: "https://google.co.in/search?q=silver+arc+mall+ludhiana",
            id: "4fddee6fe4b01dfec0041698"
        },
        {
            title: "Rose Garden",
            location: {
                lat: 30.9082,
                lng: 75.8251
            },
            show: true,
            selected: false,
            link: "https://google.co.in/search?q=rose+garden+ludhiana",
            id: "4f94553de4b04c0c9fbfab31"
        },
        {
            title: "F2 Raceway",
            location: {
                lat: 30.9071,
                lng: 75.7653
            },
            show: true,
            selected: false,
            link: "https://google.co.in/search?q=f2+raceway+ludhiana",
            id: "4f642c55e4b0bca462002324"
        },
        {
            title: "Blu-O",
            location: {
                lat: 30.9158,
                lng: 75.8411
            },
            show: true,
            selected: false,
            link: "https://google.co.in/search?q=bluo+ludhiana",
            id: "55a220cd498eef4af97ba0ad"
        }
];
//Declaring the map variable
var map;

//Initialize the map
function initMap() {
     //Dark Mode for google maps
     var styledMapType = new google.maps.StyledMapType(
            [
            {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
            {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
            {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
            {
              featureType: 'administrative.locality',
              elementType: 'labels.text.fill',
              stylers: [{color: '#d59563'}]
            },
            {
              featureType: 'poi',
              elementType: 'labels.text.fill',
              stylers: [{color: '#d59563'}]
            },
            {
              featureType: 'poi.park',
              elementType: 'geometry',
              stylers: [{color: '#263c3f'}]
            },
            {
              featureType: 'poi.park',
              elementType: 'labels.text.fill',
              stylers: [{color: '#6b9a76'}]
            },
            {
              featureType: 'road',
              elementType: 'geometry',
              stylers: [{color: '#38414e'}]
            },
            {
              featureType: 'road',
              elementType: 'geometry.stroke',
              stylers: [{color: '#212a37'}]
            },
            {
              featureType: 'road',
              elementType: 'labels.text.fill',
              stylers: [{color: '#9ca5b3'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry',
              stylers: [{color: '#746855'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry.stroke',
              stylers: [{color: '#1f2835'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'labels.text.fill',
              stylers: [{color: '#f3d19c'}]
            },
            {
              featureType: 'transit',
              elementType: 'geometry',
              stylers: [{color: '#2f3948'}]
            },
            {
              featureType: 'transit.station',
              elementType: 'labels.text.fill',
              stylers: [{color: '#d59563'}]
            },
            {
              featureType: 'water',
              elementType: 'geometry',
              stylers: [{color: '#17263c'}]
            },
            {
              featureType: 'water',
              elementType: 'labels.text.fill',
              stylers: [{color: '#515c6d'}]
            },
            {
              featureType: 'water',
              elementType: 'labels.text.stroke',
              stylers: [{color: '#17263c'}]
            }
          ],
            {name: 'Dark Mode'});

     var mapOptions = {
         center: {
             lat: 30.7565,
             lng: 76.8019
         },
         zoom: 12,
        mapTypeControlOptions: {
            mapTypeIds: ['roadmap', 'satellite', 'hybrid', 'terrain',
                    'styled_map']
          }
     };
     map = new google.maps.Map(document.getElementById('map'), mapOptions);
     map.mapTypes.set('styled_map', styledMapType);
     markerInfo = new google.maps.InfoWindow();
     ko.applyBindings(new referenceModel());
}

//Handling the errors
function Error() {
     document.querySelector("#map").innerHTML = "Unfortunately, an error occured and your request could not be fulfilled";
}

//Reference model for handling all the functions
function referenceModel() {

     var self = this;
     var bounds = new google.maps.LatLngBounds();
     self.markers = [];
     self.errorMessage = ko.observable();
     self.searchFunc = ko.observable();

     //Pushing the markers into the array
     for (var i = 0; i < locations.length; i++) {
         var marker = new google.maps.Marker({
             map: map,
             name: locations[i].title,
             position: locations[i].location,
             link1: locations[i].link,
             show: ko.observable(locations[i].show),
             animation: google.maps.Animation.DROP,
             selected: ko.observable(locations[i].selected),
             fId: locations[i].id
         });
         
         self.markers.push(marker);
         self.markers[self.markers.length - 1].setVisible(self.markers[self.markers.length - 1].show());
         bounds.extend(marker.position);
     }

     //Ajax request to get the number of likes for a location using the foursquare API
     self.markerInfo = function(marker) {
         var clientId = "GXKPRYL4WDAAWTE0IF2EOLELUJTYZX44G5GQC40HAYT5UAYO";
         var clientSecret = "LI31DUVEUEUMZIC5YSVRT1V2YCOT0H3MZ0OMCKQLV3G45RCX";
         $.ajax({
             url: "https://api.foursquare.com/v2/venues/" + marker.fId + "?client_id=" + clientId + "&client_secret=" + clientSecret + "&v=20161016",
             dataType: "json",
             success: function(data) {
                 
                var result = data.response.venue;
                 
                 if (result.hasOwnProperty("likes")) {
                     marker.likes = result.likes.summary;
                 }
             },
             error: function(obj) {
                 self.errorMessage("Unfortunately, there was an error");
             }
         });
     };

     //Adding the click function to each marker to display the infowindow
     for (var k = 0; k < self.markers.length; k++) {
         myFunc(self.markers[k]);
     }
    
    function myFunc(mark) {
        (function(marker) {
             self.markerInfo(marker);
             marker.addListener("click", function() {
                 self.setSelected(marker);
             });
         })
         (mark);
    }

     //Implementing the search function for search bar
     self.search = function() {
         markerInfo.close();
         var searchLoc = self.searchFunc();
         if (searchLoc.length === 0) {
             self.displayAll(true);
         } else {
             for (var i = 0; i < self.markers.length; i++) {
                 if (self.markers[i].name.toLowerCase().indexOf(searchLoc.toLowerCase()) >= 0) {
                     self.markers[i].show(true);
                     self.markers[i].setVisible(true);
                 } else {
                     self.markers[i].show(false);
                     self.markers[i].setVisible(false);
                 }
             }
         }
         markerInfo.close();
     };

     //Observable to display all the markers
     self.displayAll = function(bool) {
         for (var i = 0; i < self.markers.length; i++) {
             self.markers[i].setVisible(bool);
             self.markers[i].show(bool);
         }
     };

     //Observable to unselect all the markers
     self.unselectMarkers = function() {
         for (var j = 0; j < self.markers.length; j++) {
             self.markers[j].selected(false);
         }
     };

     //Observable to set the state of a marker to selected
     self.setSelected = function(marker) {
         self.unselectMarkers();
         console.log(location);
         marker.selected(true);
         self.currMarker = marker;

         //Likes
        var formatLikes = function() {
             if (self.currMarker.likes === ("" || undefined)) {
                 return "No Likes";
             } else {
                 return self.currMarker.likes;
             }
         };

         var formatMarkerInfo = "<a href='" + self.currMarker.link1 + "' target=\"_blank\"><h6>" + self.currMarker.name + "</h6></a>" + "<div>" + formatLikes() + "</div>";
         markerInfo.setContent(formatMarkerInfo);
         markerInfo.open(map, marker);

         //Animation for the marker
         self.animateMarker = function(marker) {
             marker.setAnimation(google.maps.Animation.BOUNCE);
             setTimeout(function() {
                 marker.setAnimation(null);
             }, 900);
         };
         self.animateMarker(marker);
         self.hideNav = function(){
           $('.button-collapse').sideNav('hide');
         };
     };
     map.fitBounds(bounds);
}