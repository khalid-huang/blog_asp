/*
 * Serve JSON to our AngularJS client
 */

// For a real app, you'd make database requests here.
// For this example, "data" acts like an in-memory "database"
var validator = require("../public/js/validator");
var debug = require('debug')('register:api');

function sortFun(a, b) {
  return a.username - b.username;
}

function arrayToObject(array) {
  array.sort();
  var obj = {};
  for(var i in array) {
    if(!obj[array[i].username]) {
      obj[array[i].username] = [];
      obj[array[i].username].push(array[i]);
    } else {
      obj[array[i].username].push(array[i]);
    }
  }
  return obj;
}

module.exports = function(db) {
  var dataApi = require('../model/dataApi')(db);
  var api = {
    // For user blog information
    // GET
    posts: function(req, res) {
      dataApi.findAllPost().then(function(data) {
        data = arrayToObject(data);
        var posts = [];
        for(var username in data){
          data[username].forEach(function (post, i) {
            var comments = [];
            post.comments.forEach(function(comment, i) {
              comments.push({
                id: i,
                content: comment.content,
                hide: comment.hide
              });
            });
            posts.push({
              id: i,
              username: username,
              title: post.title,
              text: post.text.substr(0, 50) + '...',
              hide: post.hide,
              comments: comments
            });
          });
        }
        res.json({
          posts: posts
      });
      }).catch(function(error) {
        console.log(error);
      });
    },

    ownPosts: function(req, res) {
      var username = req.params.username;
      var posts = [];
      dataApi.findOwnPost({
        username: username
      }).then(function(data) {
        data.forEach(function(post, i) {
          var comments = [];
          post.comments.forEach(function(comment, i) {
            comments.push({
              id: i,
              content: comment.content,
              hide: comment.hide
            });
          });
          posts.push({
            id: i,
            username: post.username,
            title: post.title,
            text: post.text.substr(0, 50) + '...',
            comments: comments
          });
        });
        res.json({
          posts: posts
        });
      }).catch(function(error) {
        console.log(error);
      });
    },

    post: function(req, res) {
      var id = req.params.id;
      var username = req.params.username;
      dataApi.findOwnPost({
        username: username
      }).then(function(data) {
        if (id >= 0 && id < data.length) {
          var comments = [];
          data[id].comments.forEach(function(comment, i) {
            comments.push({
              id: i,
              content: comment.content,
              hide: comment.hide
            });
          });
          var post = {
            id: id,
            username: data[id].username,
            title: data[id].title,
            text: data[id].text,
            comments: comments
          };
          res.json(post);
        } else {
          res.json(false);
        }
      }).catch(function(error) {
        console.log(error);
      })
    },

    // POST

    addPost: function(req, res) {
      var username = req.body.username;
      var post = {
        "title": req.body.title,
        "text": req.body.text,
        "hide": false,
        "username": username,
        "comments": []
      };
      dataApi.insertPost(post).then(function(data) {
        res.json(req.body);
      }).catch(function(error) {
        console.log(error);
      })
    },

    // PUT

    editPost: function(req, res) {
      var editInfo = {
        "id": req.params.id,
        "username": req.params.username,
        "title": req.body.title,
        'text': req.body.text
      };
      dataApi.EditOnePost(editInfo).then(function(data) {
        res.json(true);
      }).catch(function(error) {
        res.json(false);
      });
    },

    // DELETE

    deletePost: function(req, res) {
      var deleteInfo = {
        "username": req.params.username,
        "id": req.params.id
      };
      dataApi.DeleteOnePost(deleteInfo).then(function(data) {
        res.json(true);
      }).catch(function(error) {
        res.json(false);
      });
    },

    //Post
    hidePost: function(req, res) {
      var hideInfo = {
        "username": req.body.username,
        "id": req.body.id,
        "hide": true
      };
      dataApi.HideOrShowOnePost(hideInfo).then(function(data) {
        res.json(true);
      }).catch(function(error) {
        console.log(error);
        res.json(false);
      });
    },

    cancelHidePost: function(req, res) {
      var CancelHideInfo = {
        "username": req.body.username,
        "id": req.body.id,
        "hide": false
      };
      dataApi.HideOrShowOnePost(cancelHideInfo).then(function(data) {
        res.json(true);
      }).catch(function(error) {
        console.log(error);
        res.json(false);
      });
    },

    hideComment: function(req, res) {
      var hideInfo = {
        "username": req.body.username,
        "blogId": req.body.blogId,
        "id": req.body.id,
        "hide": true
      };
      dataApi.HideOneComment(hideInfo).then(function(data) {
        res.json(true);
      }).catch(function(error) {
        console.log(error);
        res.json(false);
      });
    },

    addComment: function(req, res) {
      var addCommentInfo = {
        "username": req.body.username,
        "blogId": req.body.blogId,
        "comment": req.body.content
      };
      dataApi.addOneComment(addCommentInfo).then(function(data) {
        res.json(true);
      }).catch(function(error) {
        console.log(error);
        res.json(false);
      });
    },

    // Post
    // For signin /signup
    signup: function(req, res) {
      //检验合法性
      var user = req.body;
      dataApi.checkUser(user).then(function(validInfo) {
        dataApi.createUser(user).then(function(validInfo) {
        req.session.user = user;
        req.session.cookie.maxAge = 3600000;
        console.log("OK",validInfo);
        res.json(validInfo);
        });
      }).catch(function(validInfo) {
        console.log("false", validInfo);
        res.json(validInfo);
      })
    },

    signin: function(req, res) {
      var validInfo = {
        status: true,
        isUsernameExist: true,
        isPasswordRight: true
      };
      var username = req.body.username;
      var password = req.body.password;
      //先检查用户名，如果用户存在，才检查密码
      dataApi.findUser(username, password).then(function(user) {
        req.session.user = user;
        req.session.cookie.maxAge = 3600000;
        res.json(validInfo);
      }).catch(function(validInfo) {
        res.json(validInfo);
      })
    },

    signout: function(req, res) {
      delete req.session.user;
      res.json(true);
    }
  };
  return api;
}
