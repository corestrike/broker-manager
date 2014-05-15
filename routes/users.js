var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {
	var client = module.parent.exports.set('redis');
	client.keys('*', function(err, keys){
		if(err) res.send(err);

		var count = 1;
		var resultList = [];
		if(keys.length==0) res.send(resultList);

		// for文とかかなりあれ
		for(var i in keys) {
			client.hgetall(keys[i],function(err, val){
				if(err) res.send(err);

				resultList.push(val);
				if(keys.length == count){
					res.send(resultList);
				}
				count++;
			})
		}
	});
});

/* GET a user */
router.get('/:id', function(req,res) {
	var client = module.parent.exports.set('redis');
	client.hgetall(req.param('id'), function(err, val){
		if(err) res.send(err);
		res.send(val);
	});
});

/* UPDATE broker id */
router.put('/:id', function(req,res){
	var client = module.parent.exports.set('redis');
	var userId = req.param('id');
	var brokerId = req.param('brokerId');
	if(!brokerId) res.send(400);

	client.exists(userId, function(err, bool){
		if(err) res.send(500);

		client.hset(userId,'userId',userId);
		client.hset(userId,'brokerId',brokerId,function(err, val){
			if(err) res.send(500)
			res.send(200);
		});
	});
});

/* DELETE broker id */
router.delete('/:id', function(req,res){
	var client = module.parent.exports.set('redis');

	var userId = req.param('id');
	client.del(userId, function(err){
		if(err) res.send(500);

		client.hset(userId,'userId',userId);
		res.send(200);
	});
});

/* all delete */
module.exports = router;