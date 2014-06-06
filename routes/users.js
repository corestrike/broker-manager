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
	var videoBrokerId = req.param('videoBrokerId');
	var documentBrokerId = req.param('documentBrokerId');
	var presentationBrokerId = req.param('presentationBrokerId');

	if(!videoBrokerId && !documentBrokerId && !presentationBrokerId) res.send(400);

	client.exists(userId, function(err, bool){
		if(err) res.send(500);

		client.hset(userId,'userId',userId);
		if(videoBrokerId){
			console.log("update videoBrokerId");
			client.hset(userId,'videoBrokerId',videoBrokerId,function(err, val){
				if(err) res.send(500);
				res.send(200);
			});
		}else if(documentBrokerId){
			console.log("update documentBrokerId");
			client.hset(userId,'documentBrokerId',documentBrokerId,function(err, val){
				if(err) res.send(500);
				res.send(200);
			});
		}else if(presentationBrokerId){
			console.log("update presentationBrokerId");
			client.hset(userId,'presentationBrokerId',presentationBrokerId,function(err, val){
				if(err) res.send(500);
				res.send(200);
			});
		}
	});
});

router.put('/:id/videoBrokerId', function(req,res){
	var client = module.parent.exports.set('redis');
	var userId = req.param('id');
	var brokerId = req.param('brokerId');
	if(!brokerId) res.send(400);

	client.exists(userId, function(err, bool){
		if(err) res.send(500);

		client.hset(userId,'userId',userId);
		client.hset(userId,'videoBrokerId',brokerId,function(err, val){
			if(err) res.send(500);
			res.send(200);
		});
	});
});

router.put('/:id/documentBrokerId', function(req,res){
	var client = module.parent.exports.set('redis');
	var userId = req.param('id');
	var brokerId = req.param('brokerId');
	if(!brokerId) res.send(400);

	client.exists(userId, function(err, bool){
		if(err) res.send(500);

		client.hset(userId,'userId',userId);
		client.hset(userId,'documentBrokerId',brokerId,function(err, val){
			if(err) res.send(500);
			res.send(200);
		});
	});
});

router.put('/:id/presentationBrokerId', function(req,res){
	var client = module.parent.exports.set('redis');
	var userId = req.param('id');
	var brokerId = req.param('brokerId');
	if(!brokerId) res.send(400);

	client.exists(userId, function(err, bool){
		if(err) res.send(500);

		client.hset(userId,'userId',userId);
		client.hset(userId,'presentationBrokerId',brokerId,function(err, val){
			if(err) res.send(500);
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