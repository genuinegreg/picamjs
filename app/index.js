var app = angular.module('picam', ['ngAria', 'ngAnimate', 'ngMaterial']);

var colors = [
    'gray', 'green', 'yellow', 'blue', 'purple', 'red'
];

var c = 0;


app.controller('mainController', function ($scope, $http) {
    $http.get('./pics/list.txt').then((res) => {
        return res.data.split('\n');
    }).then((pics) => {
        return pics.filter((pic) => {
            return pic
        }).map((pic) => {
            return {
                name: pic,
                url: '/pics/'+pic + '_1full.jpg',
                url_hd: '/pics/'+pic + '_2hd.jpg',
                url_md: '/pics/'+pic + '_3md.jpg',
                url_sd: '/pics/'+pic + '_4sd.jpg',
                color: colors[Math.floor(Math.random() * colors.length)]
            }
        });
    }).then((pics) => {
        $scope.pics = pics;
    })
});