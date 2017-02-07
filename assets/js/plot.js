var app = angular.module('MapPlotApp', ['nemLogging','ui-leaflet'],function($locationProvider){
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    })});

app.controller('PlotsController', ['$scope', '$http', '$interval', '$q', '$timeout','$location','leafletData', '$window', function ($scope, $http, $interval, $q, $timeout,$location,leafletData,$window) {
    $scope.currentMarkers = {};
    $scope.currentPath = [];
    $scope.points = [];
    $scope.mapsView = "markers";
    $scope.splitChar = '|';
    $scope.decode = false;
    
    function findItemByAttribute(arr,attribute) {
        for (var i = 0, len = arr.length;i<len;  i++) {
            if (arr[i][attribute.name] == attribute.value) {
                return {data: arr[i],index:i};
            }
        }
        return null;
    }
    
    $scope.changeMapsView = function(){
        console.log($scope.mapsView);
        if($scope.mapsView === "markers"){
            $scope.removePath();
            $scope.removeMarkers();
            $scope.addMarkers($scope.currentMarkers);
        }else{
            $scope.removePath();
            $scope.removeMarkers();
            $scope.addPath($scope.currentPath);
        }
    };
    
    $scope.onDelimiterChange = function(){
//        console.log($scope.splitChar);
    }
    
    $scope.plotPoints = function(){
        $scope.currentMarkers = {};
        $scope.currentPath = [];
        
        if($scope.pointsStr === undefined || $scope.pointsStr === null || $scope.pointsStr === ""){
            return;
        }
        
        if($scope.decode === true){
            $scope.points = $window.polyline.decode($scope.pointsStr);
            $scope.pointsStr = "";
            for(var i=0;i<$scope.points.length;i++){
                $scope.pointsStr += ''+$scope.points[i][0]+','+$scope.points[i][1]+$scope.splitChar;
            }
        }else {
            if ($scope.splitChar === '\\r\\n') {
                $scope.points = $scope.pointsStr.split(/[\n\u0085\u2028\u2029]|\r\n?/);
            }
            else {
                $scope.points = $scope.pointsStr.split($scope.splitChar);
            }
        }
        
        for (var i = 0; i < $scope.points.length; i++) {
            if($scope.decode === true)
                var pts = $scope.points[i];
            else
                var pts = $scope.points[i].split(',');
            
            if (i === 0) {
                $scope.nairobi.lat = parseFloat(pts[0]);
                $scope.nairobi.lng = parseFloat(pts[1]);
            }
            
            $scope.currentMarkers[i] = {
                lat: parseFloat(pts[0]),
                lng: parseFloat(pts[1]),
                message: 'Marker: ' + (i + 1) + ' of ' + $scope.points.length + ', LatLng: ' + pts[0] + ',' + pts[1]
            };
            $scope.currentPath.push({lat: parseFloat(pts[0]), lng: parseFloat(pts[1])});
        }
        
        if($scope.mapsView === "markers"){
            $scope.addMarkers($scope.currentMarkers);
        }else{
            $scope.addPath($scope.currentPath);
        }
    };
    
    $scope.addPath = function(path){
        $scope.paths = {
            p1: {
                color: '#008000',
                weight: 6,
                latlngs: path
            }
        }
    };
    
    $scope.removePath = function(){
        $scope.paths = {};
    };
    
    $scope.addMarkers = function(markers) {
        angular.extend($scope, {
            markers: markers
        });
    };
    
    $scope.removeMarkers = function() {
        $scope.markers = {};
    };
    
    angular.extend($scope, {
        nairobi: {
            lat: -1.2916303,lng: 36.7616691,
            zoom: 13
        },
        paths:  {},
        markers: {},
        events: {
            markers: {
                enable: ['drag', 'click', 'mouseover', 'etc'],
                logic: 'emit'
            }
        }
    });
    
    $scope.submitForm = function(){
        $scope.manageMarkers($scope.driver.id,$scope.driver.lat,$scope.driver.lng,$scope.driver.message);
    };
    
}]);
		