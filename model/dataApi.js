var md5 = require('md5');
var debug = require('debug')('register:user');

module.exports = function(db) {
  var users = db.collection('users');
  var posts = db.collection('posts');
  var dataApi = {
    init: function() {
      var postSet = [{
        "title": "Lorem ipsum",
        "text": "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        "hide": false,
        "username": "kinthon",
        "comments": [{
          content: "good",
          hide: false
        }, {
          content: "bad",
          hide: false
        }],
      }, {
        "title": "Kinthon Sed egestas",
        "text": "Kinthon Sed egestas, ante et vulputate volutpat, eros pede semper est, vitae luctus metus libero eu augue. Morbi purus libero, faucibus adipiscing, commodo quis, gravida id, est. Sed lectus.",
        "hide": false,
        "username": "kinthon",
        "comments": []
      }, {
        "title": "Mike Sed egestas",
        "text": "Mike Sed egestas, ante et vulputate volutpat, eros pede semper est, vitae luctus metus libero eu augue. Morbi purus libero, faucibus adipiscing, commodo quis, gravida id, est. Sed lectus.",
        "hide": false,
        "username": "mike",
        "comments": [{
          content: "bad",
          hide: false
        }]
      }];
      var password = md5("123456");
      var userSet = [{
        "username": "manager",
        "email": "manager.@qq.com",
        "password": password,
        "isManager": true
      }, {
        "username": "kinthon",
        "email": "qinkai1994@qq.com",
        "password": password,
        "isManager": false
      }];
      posts.insertMany(postSet, function(err, r) {
      	console.log(err);
      	console.log(r.insertedCount);
      });
      users.insertMany(userSet, function(err, r) {
      	console.log(err);
      	console.log(r.insertedCount);
      });
    },
    findUser: function(username, password) {

    },

    findAllPost: function() {
    	return posts.find().toArray();
    },

    findOwnPost: function(query) {
    	return posts.find(query).toArray();
    },

    findOnePost: function(query) {
    	return posts.find({username:query.username}).toArray().then(function(data) {
    		return Promise.resolve(data[query.id]);
    	});
    },

    insertPost: function(post) {
    	return posts.insert(post);
    },

    EditOnePost: function(editInfo) {
    	return this.findOnePost({username: editInfo.username, id: editInfo.id}).
    		then(function(post) {
    			var newPost = {
    				"title": editInfo.title,
    				"text": editInfo.text,
    				"hide": post.hide,
    				"username": post.username,
    				"comments": post.comments
    			};
    			return posts.findOneAndUpdate(post, newPost);
    		});
    },

    DeleteOnePost: function(deleteInfo) {
    	return this.findOnePost({username: deleteInfo.username, id: deleteInfo.id}).
    		then(function(post) {
    			return posts.deleteOne(post);
    		});    	
    },

    HideOrShowOnePost: function(Info) {
    	return this.findOnePost({username: Info.username, id: Info.id}).
    		then(function(post) {
    			var newPost = {
    				"title": post.title,
    				"text": post.text,
    				"hide": Info.hide,
    				"username": post.username,
    				"comments": post.comments
    			};
    			return posts.findOneAndUpdate(post, newPost);
    		});
    },

    HideOneComment: function(hideInfo) {
    	return this.findOnePost({username: hideInfo.username, id: hideInfo.blogId}).
    		then(function(post) {
    			var comments = post.comments.slice(0);
    			comments[hideInfo.id].hide = hideInfo.hide;
    			var newPost = {
    				"title": post.title,
    				"text": post.text,
    				"hide": post.hide,
    				"username": post.username,
    				"comments": comments
    			};
    			return posts.findOneAndUpdate({username: post.username, title:post.title, text:post.text}, newPost);    			
    		});	
    },

    addOneComment: function(addCommentInfo) {
    	return this.findOnePost({username: addCommentInfo.username, id: addCommentInfo.blogId}).
    		then(function(post) {
    			//var comments = post.comments; //引用啊
    			var comments = post.comments.slice(0);
    			comments.push({
    				"content": addCommentInfo.comment,
    				"hide": false
    			});
    			var newPost = {
    				"title": post.title,
    				"text": post.text,
    				"hide": post.hide,
    				"username": post.username,
    				"comments": comments
    			};
    			return posts.findOneAndUpdate(post, newPost);    			
    		});	    	
    },
       checkUser: function(user) {
        //唯一性检查
        var validInfo = {
            status: true,
            isUsernameUnique:  true,
            isEmailUnique: true,
            isUsernameValid: true,
            isEmailValid: true,
            isPasswordValid: true,
            isRepeatedPasswordValid: true
        }
        return users.findOne({username: user.username}).then(function(getUser) {
            if(getUser) {
                validInfo.status = false;
                validInfo.isUsernameUnique = false;
            }
            users.findOne({email: user.email}).then(function(getUser) {
                if(getUser) {
                    validInfo.status = false;
                    validInfo.isEmailUnique = false;
                };
                return validInfo.status ? Promise.resolve(validInfo) : Promise.reject(validInfo);      
            });
            return validInfo.status ? Promise.resolve(validInfo) : Promise.reject(validInfo);
        })
    },

    createUser: function(user) {
        delete user.repeatedPassword;
        user.isManager = false;
        user.password = md5(user.password);
        return users.insert(user);
    },

    findUser: function(username, password) {
        var validInfo = {
            status: true,
            isUsernameExist: true,
            isPasswordRight: true
        };
        console.log(username, password);        
        return users.findOne({username: username}).then(function(user) {
            if(user) {
                console.log(user);
                if(user.password === md5(password)) {
                    return Promise.resolve(user);
                } else {
                    validInfo.status = false;    
                    validInfo.isPasswordRight = false;
                    return Promise.reject(validInfo);
                }
            } else {
                validInfo.status = false;
                validInfo.isUsernameExist = false;
                return Promise.reject(validInfo);
            }
        })
    },

  };

  return dataApi;
};
