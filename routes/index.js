var express = require('express');
var router = express.Router();
var api = require('./api');

// Routes

router.get('/', function (req, res, next) {
	res.render('index');
});

router.get('/partials/:name', function (req, res, next) {
	var name = req.params.name;
	res.render('partials/' + name);
});

// JSON API

router.get('/api/posts', api.posts);

router.get('/api/post/:id', api.post);
router.post('/api/post', api.addPost);
router.put('/api/post/:id', api.editPost);
router.delete('/api/post/:id', api.deletePost);

// redirect all others to the index (HTML5 history)
router.get('*', function (req, res, next) {
	res.render('index');
});

module.exports = router;