'use strict';

// Declare app level module which depends on filters, and services
angular.module('myApp', ['ui.router','myApp.filters', 'myApp.services', 'myApp.directives']).
  config(['$stateProvider','$urlRouterProvider', '$locationProvider', '$injector', function($stateProvider, $urlRouterProvider, $locationProvider, $injector) {
    $urlRouterProvider.otherwise('/');
    $stateProvider.
      state('index', {
        url: '/',
        views: {
          '': {
          templateUrl: 'partials/index'
          },
          'main@index': {
            templateUrl: 'partials/signin',
            controller: SigninCtrl
          }
        }
      }).
      state('index.signup', {
        url:'signup',
        views: {
          'main@index': {
            templateUrl: 'partials/signup',
            controller: SignupCtrl
          }
        }
      }).
      state('index.home', {
        url: 'home',
        views: {
          'topbar@index': {
            templateUrl: 'partials/topbar',
            controller: TopbarCtrl
          },          
          'main@index': {
            templateUrl: 'partials/home',
            controller: HomeCtrl
          }
        }
      }).
      state('index.home.own', {
        url: '/own/:username',
        views: {
          'main@index': {
            templateUrl: 'partials/own',
            controller: OwnPostCtrl
          }
        }
      }).
      state('index.addPost', {
        url: 'addPost',
        views: {
          'topbar@index': {
            templateUrl: 'partials/topbar',
            controller: TopbarCtrl
          }, 
          'main@index': {
            templateUrl: 'partials/addPost',
            controller: AddPostCtrl
          }
        }
      }).
      state('index.readPost', {
        url: 'readPost/:username/:id',
        views: {
          'topbar@index': {
            templateUrl: 'partials/topbar',
            controller: TopbarCtrl
          }, 
          'main@index': {
            templateUrl: 'partials/readPost',
            controller: ReadPostCtrl
          }
        }
      }).
      state('index.editPost', {
        url: 'editPost/:username/:id',
        views: {
          'topbar@index': {
            templateUrl: 'partials/topbar',
            controller: TopbarCtrl
          }, 
          'main@index': {
            templateUrl: 'partials/editPost',
            controller: EditPostCtrl
          }
        }
      }).
      state('index.deletePost', {
        url: 'deletePost/:username/:id',
        views: {
          'topbar@index': {
            templateUrl: 'partials/topbar',
            controller: TopbarCtrl
          }, 
          'main@index': {
            templateUrl: 'partials/deletePost',
            controller: DeletePostCtrl
          }
        }
      }).
      state('index.hidePost', {
        url: 'hidePost/:username/:id',
        views: {
          'topbar@index': {
            templateUrl: 'partials/topbar',
            controller: TopbarCtrl
          }, 
          'main@index' : {
            templateUrl: 'partials/hidePost',
            controller: HidePostCtrl
          }
        }
      }).
      state('index.cancelHidePost', {
        url: 'cancelHidePost/:username/:id',
        views: {
          'topbar@index': {
            templateUrl: 'partials/topbar',
            controller: TopbarCtrl
          }, 
          'main@index' : {
            templateUrl: 'partials/cancelHidePost',
            controller: CancelHidePostCtrl
          }
        }
      }).
      state('index.hideComment', {
        url: 'hideComment/:username/:blogId/:id',
        views: {
          'topbar@index': {
            templateUrl: 'partials/topbar',
            controller: TopbarCtrl
          }, 
          'main@index' : {
            templateUrl: 'partials/hideComment',
            controller: hideCommentCtrl
          }
        }
      });
    $locationProvider.html5Mode(true);
  }]);