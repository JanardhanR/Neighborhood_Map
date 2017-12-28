var map;
var largeInfowindow;

var markers = [];

var nammaLocations = [
    // { title: 'Nagasandra', location: { lat: 13.0432, lng: 77.5003 } },
    { title: 'Baiyappanahalli', location: { lat: 12.9913, lng: 77.6521 } },
    { title: 'Swami Vivekananda Road', location: { lat: 12.9859, lng: 77.6449 } },
    { title: 'Indiranagar', location: { lat: 12.9719, lng: 77.6412 } },
    { title: 'Halasuru', location: { lat: 12.9817, lng: 77.6286 } },
    { title: 'Trinity Circle', location: { lat: 12.9728, lng: 77.6217 } },
    { title: 'Cubbon Park', location: { lat: 12.9763, lng: 77.5929 } },
    { title: 'Vidhana Souda', location: { lat: 12.9795, lng: 77.5909 } },
    { title: 'Sir M.Visveshwaraiah', location: { lat: 12.974615, lng: 77.584785 } },
    { title: 'Majestic', location: { lat: 12.975692, lng: 77.572837 } },
    //
    { title: 'Dummy 1', location: { lat: 12.9728, lng: 77.6317 } },
    { title: 'Dummy 2', location: { lat: 12.9763, lng: 77.5949 } },
    { title: 'Dummy 3', location: { lat: 12.9795, lng: 77.5809 } }
];

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

// This function will loop through the markers array and display them all.
function showListings() {
    var bounds = new google.maps.LatLngBounds();
    // Extend the boundaries of the map for each marker and display the marker
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
        bounds.extend(markers[i].position);
    }
    map.fitBounds(bounds);
}

function showMarker(location) {
    var bounds = new google.maps.LatLngBounds();
    for (var i = 0; i < markers.length; i++) {
        console.log("printing showmarker titles");
        console.log(location.toLowerCase());
        console.log(markers[i].title.toLowerCase());
        if ((markers[i].title.toLowerCase().indexOf(location.toLowerCase()) !== -1)) {
            //if ((markers[i].position.lat() == location.lat) && (markers[i].position.lng() == location.lng)) {            
            markers[i].setMap(map);
            bounds.extend(markers[i].position);
        }
    }
    map.fitBounds(bounds);
}

function hideMarkers() {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
}

// This function takes in a COLOR, and then creates a new marker
// icon of that color. The icon will be 21 px wide by 34 high, have an origin
// of 0, 0 and be anchored at 10, 34).
function makeMarkerIcon(markerColor) {
    var markerImage = new google.maps.MarkerImage(
        'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' + markerColor +
        '|40|_|%E2%80%A2',
        new google.maps.Size(21, 34),
        new google.maps.Point(0, 0),
        new google.maps.Point(10, 34),
        new google.maps.Size(21, 34));
    console.log("marker : " + markerImage);
    return markerImage;
}

var MetroLocation = function (data) {
    var self = this;
    this.title = ko.observable(data.title);
    this.location = ko.observable(data.location);
};

// This function populates the infowindow when the marker is clicked. We'll only allow
// one infowindow which will open at the marker that is clicked, and populate based
// on that markers position.
function populateInfoWindow(marker, infowindow) {
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
        infowindow.marker = marker;
        infowindow.setContent('<div>' + marker.title + '</div>');
        infowindow.open(map, marker);
        // Make sure the marker property is cleared if the infowindow is closed.
        infowindow.addListener('closeclick', function () {
            infowindow.marker = null;
        });
    }
}

function initMap() {
    var self = this;
    console.log("reached here 1");
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 13.072651, lng: 77.796172 },
        zoom: 13,
        styles: customstyles
    });
    // Style the markers a bit. This will be our listing marker icon.
    var defaultIcon = makeMarkerIcon('6a28e6');

    // Create a "highlighted location" marker color for when the user
    // mouses over the marker.
    var highlightedIcon = makeMarkerIcon('74ee0f');

    largeInfowindow = new google.maps.InfoWindow();
    // The following group uses the location array to create an array of markers on initialize.
    for (var i = 0; i < nammaLocations.length; i++) {
        // Get the position from the location array.
        var position = nammaLocations[i].location;
        var title = nammaLocations[i].title;
        // Create a marker per location, and put into markers array.
        var marker = new google.maps.Marker({
            position: position,
            title: title,
            animation: google.maps.Animation.DROP,
            icon: defaultIcon,
            id: i
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

var ViewModel = function () {
    var self = this;
    this.filterLocations = ko.observableArray([]);
    nammaLocations.forEach(function (locItem) {
        self.filterLocations.push(new MetroLocation(locItem));
    });

    this.filterText = ko.observable();

    this.doFilter = function () {
        self.filterLocations.removeAll();
        hideMarkers();
        nammaLocations.forEach(function (locItem) {
            if (locItem.title.toLowerCase().indexOf(self.filterText().toLowerCase()) != -1) {
                self.filterLocations.push(new MetroLocation(locItem));
                // console.log("Entering showmarker - lat,lng : " + locItem.location.lat + "," + locItem.location.lng);
                showMarker(locItem.title);
            }
        });
    };
    this.filterText.subscribe(function () {
        self.doFilter();
    });
    self.googlemap = map;

    this.onClick = function ($index, data, event) {
        var indexTouse = $index();
        var metLoc = (ko.observable(self.filterLocations()[indexTouse]));
        console.log(metLoc.title);
        //need to pass the marker, passign MetroLocation object wrongly
        //populateInfoWindow(metLoc, largeInfowindow);
    };
};

function loadMap() {
    initMap();
    ko.applyBindings(new ViewModel());
}