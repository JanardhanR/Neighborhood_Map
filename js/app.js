//globals
var map;
var largeInfowindow;
var defaultIcon;
var highlightedIcon;
var markers = [];

//Neigborhood locations
var nammaLocations = [
    { title: 'By 2 coffee', location: { lat: 12.964765741776635, lng: 77.53886512623342 }, venueid: '51d8034a498e44075a4a92fc' },
    { title: 'My Tea House', location: { lat: 12.934294700622559, lng: 77.61653137207031 }, venueid: '54a7d9ce498ec5a0b5e31642' },
    { title: 'Fluid Studio Cafe', location: { lat: 12.920480387168718, lng: 77.56933987140656 }, venueid: '521cac0011d2aa586355eb51' },
    { title: 'Courtyard Cafe', location: { lat: 12.958457196981318, lng: 77.59314702896103 }, venueid: '5380a110498eaf0c790162f0' },
    { title: 'Cafe Pascucci', location: { lat: 12.906439457874848, lng: 77.5918362242764 }, venueid: '4e8ed2b85503e288b43ee921' },
    { title: 'Cafe Mondo', location: { lat: 12.939682363892148, lng: 77.57759581928839 }, venueid: '4dfa039814959516a96389c3' },
    { title: 'Costa Coffee', location: { lat: 12.932490004726679, lng: 77.63161819196716 }, venueid: '4bf3fa52370e76b0a979bd4a' },
    { title: 'Sweet Chariot', location: { lat: 12.968301018371433, lng: 77.60079570618583 }, venueid: '4d29af728292236a473025bb' }
];

//we'll define custom styles.
var customstyles = [
    { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
    { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
    { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
    {
        featureType: 'administrative.locality',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#d59563' }]
    },
    {
        featureType: 'poi',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#d59563' }]
    },
    {
        featureType: 'poi.park',
        elementType: 'geometry',
        stylers: [{ color: '#263c3f' }]
    },
    {
        featureType: 'poi.park',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#6b9a76' }]
    },
    {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [{ color: '#38414e' }]
    },
    {
        featureType: 'road',
        elementType: 'geometry.stroke',
        stylers: [{ color: '#212a37' }]
    },
    {
        featureType: 'road',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#9ca5b3' }]
    },
    {
        featureType: 'road.highway',
        elementType: 'geometry',
        stylers: [{ color: '#746855' }]
    },
    {
        featureType: 'road.highway',
        elementType: 'geometry.stroke',
        stylers: [{ color: '#1f2835' }]
    },
    {
        featureType: 'road.highway',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#f3d19c' }]
    },
    {
        featureType: 'transit',
        elementType: 'geometry',
        stylers: [{ color: '#2f3948' }]
    },
    {
        featureType: 'transit.station',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#d59563' }]
    },
    {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [{ color: '#17263c' }]
    },
    {
        featureType: 'water',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#515c6d' }]
    },
    {
        featureType: 'water',
        elementType: 'labels.text.stroke',
        stylers: [{ color: '#17263c' }]
    }
];

/**
* @description This function will loop through the markers array and display them all.
* @param {None}
* @returns {None} 
*/
function showListings() {
    var bounds = new google.maps.LatLngBounds();
    // Extend the boundaries of the map for each marker and display the marker
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
        bounds.extend(markers[i].position);
    }
    map.fitBounds(bounds);
}

/**
* @description This function will loop through the markers array and display the specific marker that matches the filter
* @param {Location} location
* @returns {None} 
*/
function showMarker(location) {
    for (var i = 0; i < markers.length; i++) {
        if ((markers[i].title.toLowerCase().indexOf(location.toLowerCase()) !== -1)) {
            markers[i].setMap(map);
            break;
        }
    }
}

/**
* @description hides all the markers.
* @param {None}
* @returns {None} 
*/
function hideMarkers() {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
}

/**
* @description This function takes in a COLOR, and then creates a new marker
* icon of that color. The icon will be 21 px wide by 34 high, have an origin
* of 0, 0 and be anchored at 10, 34).
* @param {number} markerColor
* @returns {MarkerImage} markerImage
*/
function makeMarkerIcon(markerColor) {
    var markerImage = new google.maps.MarkerImage(
        'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' + markerColor +
        '|40|_|%E2%80%A2',
        new google.maps.Size(21, 34),
        new google.maps.Point(0, 0),
        new google.maps.Point(10, 34),
        new google.maps.Size(21, 34));
    return markerImage;
}


/**
* @description Represents a location model, only title is required to be visible.
* @constructor
* @param {object} data - location object
*/
var LocalLoc = function (data) {
    var self = this;
    this.title = ko.observable(data.title);
    this.location = ko.observable(data.location);
    this.venueid = ko.observable(data.venueid);
};


/**
* @description This function populates the infowindow when the marker is clicked. We'll only allow
* one infowindow which will open on the marker that is clicked, and populate based
* on its position.
* @param {google.maps.Marker} marker
* @returns {google.maps.InfoWindow} infowindow
*/
function populateInfoWindow(marker, infowindow) {
    //setup the Foursquare API call 
    const CLIENT_ID = 'N4WJ13M41G4NGILETXMBRMIGGHNGBLNEVCC0G11VF0G4J2AZ';
    const CLIENT_SECRET = 'PWUOUGXS1QUYMH51QA4YNGSRARGP1OXJSRAX0BYJGWI2BMX0';
    var API_ENDPOINT = 'https://api.foursquare.com/v2/venues/VENUE_ID/photos' +
        '?client_id=CLIENT_ID' +
        '&client_secret=CLIENT_SECRET' +
        '&v=20171231' +
        '&callback=?';

    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
        infowindow.marker = marker;
        // Make sure the marker property is cleared if the infowindow is closed.
        infowindow.addListener('closeclick', function () {
            infowindow.marker = null;
        });
    }

    //re-center the map to where marker is selected..
    map.setCenter(marker.getPosition());
    //show loading till we get a response from foursqare..
    infowindow.setContent('<div>' + "Loading photo from foursquare.." + '</div>');
    //now try get the photo for the location..
    var jqxhr = $.getJSON(API_ENDPOINT
        .replace('VENUE_ID', marker.venueid)
        .replace('CLIENT_ID', CLIENT_ID)
        .replace('CLIENT_SECRET', CLIENT_SECRET));

    //show the infowindow if we got the result..
    jqxhr.done(function (result, status) {
        if (status !== 'success') {
            alert("Failed to get data from Foursquare.com ");
            return;
        }
        var url_Photo = result.response.photos.items[0].prefix + '200x200' +
            result.response.photos.items[0].suffix;
        infowindow.setContent('<div>'
            + '<div>' + 'photo from foursquare.com' + '</div>'
            + '<img src=' + url_Photo + '></img>' + '</div>');
    });

    //show an alert if failed to get location photo.
    jqxhr.fail(function () {
        alert("Failed to get location photo from Foursquare.com ");
    });
    //show the info window
    infowindow.open(map, marker);

    //set animiation on the marker to bounce
    //we'll show animation irrespective of infowindow is open or closed..
    marker.setAnimation(google.maps.Animation.BOUNCE);
    _.delay(function () {
        marker.setAnimation(google.maps.Animation.DROP);
    }, 1400);
}

/**
* @description This function creates and shows the map..
* all other functionality are handled in ViewModel..
* @param {None}
* @returns {None}
*/
function initMap() {
    var self = this;
    console.log("reached here 1");
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 12.958457196981318, lng: 77.59314702896103 },
        zoom: 13,
        styles: customstyles
    });
    // Style the markers a bit. This will be our listing marker icon.
    defaultIcon = makeMarkerIcon('6a28e6');

    // Create a "highlighted location" marker color for when the user
    // mouses over the marker.
    highlightedIcon = makeMarkerIcon('74ee0f');

    largeInfowindow = new google.maps.InfoWindow();
    // The following group uses the location array to create an array of markers on initialize.
    for (var i = 0; i < nammaLocations.length; i++) {
        // Get the position from the location array.
        var position = nammaLocations[i].location;
        var title = nammaLocations[i].title;
        var venueid = nammaLocations[i].venueid;
        // Create a marker per location, and put into markers array.
        var marker = new google.maps.Marker({
            position: position,
            title: title,
            animation: google.maps.Animation.DROP,
            icon: defaultIcon,
            id: i,
            venueid: venueid
        });
        // Push the marker to our array of markers.
        markers.push(marker);
        // Create an onclick event to open the large infowindow at each marker.
        marker.addListener('click', function () {
            populateInfoWindow(this, largeInfowindow);
        });
        // Two event listeners - one for mouseover, one for mouseout,
        // to change the colors back and forth.
        marker.addListener('mouseover', function () {
            this.setIcon(highlightedIcon);
        });
        marker.addListener('mouseout', function () {
            this.setIcon(defaultIcon);
        });
    }
    showListings();
}

/**
* @description Knockout viewmodel
* @param {None}
* @returns {None}
*/
var ViewModel = function () {
    var self = this;
    this.filterLocations = ko.observableArray([]);
    nammaLocations.forEach(function (locItem) {
        self.filterLocations.push(new LocalLoc(locItem));
    });

    this.filterText = ko.observable();

    //filter function that shows the markers based on the filter
    this.doFilter = function ()  {
        self.filterLocations.removeAll();
        hideMarkers();
        nammaLocations.forEach(function (locItem) {
            if (locItem.title.toLowerCase().indexOf(self.filterText().toLowerCase()) != -1) {
                self.filterLocations.push(new LocalLoc(locItem));
                showMarker(locItem.title);
            }
        });
        //close the current infowindow and remove the marker reference..
        largeInfowindow.close();
        largeInfowindow.marker = null;
    };
    this.filterText.subscribe(function () {
        self.doFilter();
    });
    self.googlemap = map;

    //show the info window with the location photo from foursquare
    this.onClick = function ($index, filterText, data, event) {
        var indexTouse = $index();
        for (var i = 0; i < markers.length; i++) {
            if ((markers[i].title.toLowerCase().indexOf(filterText().toLowerCase()) !== -1)) {
                var marker = markers[i];
                populateInfoWindow(marker, largeInfowindow);
            }
        };
    };    
}

/**
* @description Sidebar location click handler that shows infowindow on click
* @param {String} title
* @returns {None}
*/
onLocClick = (title) => {
    console.log("called fcuker : " + title());
    for (var i = 0; i < markers.length; i++) {
        if ((markers[i].title.toLowerCase().indexOf(title().toLowerCase()) !== -1)) {
            var marker = markers[i];
            populateInfoWindow(marker, largeInfowindow);
        }
    };
};

/**
* @description Error callback for GMap API request
* @param {None}
* @returns {None}
*/
mapError = () => {
    alert("Error loading googleapis");
};

/**
* @description main function
* @param {None}
* @returns {None}
*/
function loadMap() {
    initMap();
    ko.applyBindings(new ViewModel());
}