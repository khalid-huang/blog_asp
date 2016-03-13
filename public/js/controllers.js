'use strict';

/* Controllers */

function SigninCtrl($scope, $http, $location, $rootScope, $state) {
  $scope.validInfo = {
    status:true, //用于后台确认是否数据完全正确
    isUsernameExist: true,
    isPasswordRight: true
  };
  $scope.user = {};
  $scope.submit = function() {
    $http.post('/api/post/signin', $scope.user).
      success(function(data, status, headers, config) {
        $scope.validInfo = data;
        if($scope.validInfo.status) {
          $rootScope.username = $scope.user.username;
/*          $state.go('index.home', {}, {reload: true});*/
          $location.path('/home');
        } else{
          $location.path('/');          
        }
      });
  }
}

function SignupCtrl($scope, $http, $location, $rootScope) {
  $scope.validator = validator; //获取验证器的对象引用
  $scope.user = {};
  //表单的唯一性
  $scope.validInfo = {
    isUsernameUnique:  true,
    isEmailUnique: true,
    isUsernameValid: true,
    isEmailValid: true,
    isPasswordValid: true,
    isRepeatedPasswordValid: true
  };
  $scope.submit = function() {
    var flag = true; //true代表格式正确
    for(var fieldname in $scope.user) {
      var attribute = 'is' + fieldname[0].toUpperCase() + fieldname.slice(1, fieldname.length) + 'Valid';
      $scope.validInfo[attribute] = $scope.validator.isFieldValid(fieldname, $scope.user[fieldname]);
      if(!$scope.validInfo[attribute]) {
        flag = false;
      }
    }
    if($scope.user.repeatedPassword === $scope.user.password) {
      $scope.validInfo.isRepeatedPasswordValid = true;
    } else {
       $scope.validInfo.isRepeatedPasswordValid = false;
        flag = false;     
    }
    //格式正确才进入后台
    if(flag) {
      $http.post('/api/post/signup', $scope.user).
      success(function(data, status, headers, config) {
        $scope.validInfo = data;
        if(data.status === false) {
          //信息有误，没有创建成功,还是在注册页面

        } else {
          $rootScope.username = $scope.user.username;
          $location.path('/home');
        }
      }).
      error(function(data, status, headers, config) {
        alert("error");
      }); 
    }
  }
}

function TopbarCtrl($scope, $http, $location,$rootScope, $injector) {
  $scope.username = $rootScope.username;
  $scope.signOut = function() {
    $http.get('/api/post/signout').
      success(function(data) {
        $injector.get('$templateCache').removeAll();
        delete $rootScope.username;
        $location.path('/');
      });
  };
}

function HomeCtrl($scope, $http) {
  $scope.comment = "";
  $http.get('/api/posts').
    success(function(data, status, headers, config) {
      $scope.posts = data.posts;
    });
  //post是blog的信息，主要是用于确定是哪个blog的comment;
  $scope.submitComment = function(post) {
    if(this.comment === "")
      return;
    var that = this; //保存this
    var postInfo = {
      content: that.comment,
      username: post.username,
      blogId: post.id
    }
    $http.post("/api/comment/add", postInfo).
      success(function(data) {
          that.comment = ""; 
      });
  }
}

function OwnPostCtrl($scope, $http, $stateParams) {
  $http.get('/api/posts/own/' + $stateParams.username).
    success(function(data) {
      $scope.posts = data.posts;
    })
}

function AddPostCtrl($scope, $http, $location, $rootScope) {
  $scope.form = {
    username: $rootScope.username
  };
  $scope.submitPost = function () {
    var that = this;
    $http.post('/api/post/addPost', that.form).
      success(function(data) {
        $location.path('/home')
      });
  };
}

function ReadPostCtrl($scope, $http, $stateParams, $rootScope, $location, $state) {
  $scope.comments = [];
  $http.get('/api/post/' + $stateParams.username + '/'+ $stateParams.id).
    success(function(data) {
      $scope.post = data;
      console.log($scope.post);
    });
  $scope.hideComment = function(id) {
    var postInfo = {
      username: $rootScope.user.username,
      blogId: $stateParams.id,
      commentId: id
    };
    $http.post('/api/comment/hide', postInfo).
      success(function(data, status, headers, config) {
        $location.path('/readPost/'+$stateParams.username+'/'+$stateParams.id);
      });
  }
  $scope.submitComment = function() {
    if(this.comment === "")
      return;
    var that = this;
    var postInfo = {
      content: $scope.comment,
      username: $stateParams.username,
      blogId: $stateParams.id
    }
    $http.post("/api/comment/add", postInfo).
      success(function(data) {
          $scope.comments.push(that.comment);
          that.comment = "";
          $state.reload();
      });
  }
  $scope.goBack = function() {
    $state.go('index.home');
  }
}

function EditPostCtrl($scope, $http, $location, $stateParams) {
  $scope.form = {};
  $http.get('/api/post/' + $stateParams.username + '/'+$stateParams.id).
    success(function(data) {
      $scope.form = data;
    });

  $scope.editPost = function () {
    if($scope.form.title === "" || $scope.form.text === "")
      return;
    $http.put('/api/post/' + $stateParams.username+'/'+$stateParams.id, $scope.form).
      success(function(data) {
        history.back();
      });
  };
}

function DeletePostCtrl($scope, $http, $location, $stateParams) {
  $http.get('/api/post/' + $stateParams.username + '/'+ $stateParams.id).
    success(function(data) {
      $scope.post = data;
    });

  $scope.deletePost = function () {
    $http.delete('/api/post/' + $stateParams.username +'/'+ $stateParams.id).
      success(function(data) {
        history.back();
      });
  };

  $scope.home = function () {
    $location.url('/home');
  };
}

function HidePostCtrl($scope, $http, $location, $stateParams, $rootScope) {
  $http.get('/api/post/' + $stateParams.username + '/'+ $stateParams.id).
    success(function(data) {
      $scope.post = data;
    });

  $scope.hidePost = function() {
    var post = {
      username: $stateParams.username,
      id: $stateParams.id
    };
    $http.post('api/post/hide', post).
      success(function(data) {
        $location.path('/home');
      });
    };

  $scope.home = function() {
    $location.path('/home');
  }
}

function CancelHidePostCtrl($scope, $http, $location, $stateParams, $rootScope) {
  $http.get('/api/post/' + $stateParams.username + '/'+ $stateParams.id).
    success(function(data) {
      $scope.post = data;
    });

  $scope.cancelHidePost = function() {
    var post = {
      username: $stateParams.username,
      id: $stateParams.id
    };
    $http.post('api/post/cancelHide', post).
      success(function(data) {
        $location.path('/home');
      });
    };

  $scope.home = function() {
    $location.path('/home');
  }
}

function hideCommentCtrl($scope, $http, $location, $stateParams) {
  $http.get('/api/post/' + $stateParams.username + '/'+ $stateParams.blogId).
    success(function(data) {
      $scope.post = data;
      $scope.comment = data.comments[$stateParams.id];
    });

  $scope.hideComment = function() {
    var post = {
      username: $stateParams.username,
      blogId: $stateParams.blogId,
      id: $stateParams.id
    };
    $http.post('api/comment/hide', post).
      success(function(data) {
        $location.path('/readPost/' + $stateParams.username + '/' + $stateParams.blogId);
      });
    };

  $scope.back = function() {
    $location.path('/readPost/' + $stateParams.username + '/' + $stateParams.blogId);
  }
}