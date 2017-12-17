var map;
function initMap(){
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 13.072651, lng: 77.796172 },
        zoom: 13
    });
    var hoskote = { lat: 13.072651, lng: 77.796172 };
    var marker = new google.maps.Marker({
        position: hoskote,
        map: map,
        icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
        title: 'First Marker!'
    });
    var infowindow = new google.maps.InfoWindow({
        content:
            'Welcome to hoskote ' + marker.position,
    });
}

var ViewModel = function() {
   var self = this;
   self.googlemap = map;
};
function loadMap() {
  initMap();
  ko.applyBindings(new ViewModel());
}