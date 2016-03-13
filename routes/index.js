var express = require('express');

// Routes
module.exports = function(db) {
	var router = express.Router();
	var api = require('./api')(db);
	router.get('/', function (req, res, next) {
		res.render('index');
	});

	router.get('/partials/:name', function (req, res, next) {
		var name = req.params.name;
		if(req.session.user) {
			res.render('partials/' + name, {user: req.session.user});	
		} else {
			res.render('partials/' + name, {user: {} });		
		}
	});

	// JSON API

	router.get('/api/posts', api.posts);
	router.get('/api/posts/own/:username', api.ownPosts);
	router.get('/api/post/:username/:id', api.post);
	router.post('/api/post/addPost', api.addPost);
	router.put('/api/post/:username/:id', api.editPost);
	router.delete('/api/post/:username/:id', api.deletePost);
	router.post('/api/post/hide', api.hidePost);
	router.post('/api/post/cancelHide', api.cancelHidePost);


	router.post('/api/comment/add', api.addComment);
	router.post('/api/comment/hide', api.hideComment);
	//登录与注册
	router.post('/api/post/signup', api.signup);
	router.post('/api/post/signin', api.signin);
	router.get('/api/post/signout', api.signout);
	// redirect all others to the index (HTML5 history)
	router.get('*', function (req, res, next) {
		res.render('index');
	});

	return router;
};

