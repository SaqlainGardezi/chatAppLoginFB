module.exports	=	function(express, app, passport, config, rooms){
	var router	=	express.Router();

		//middleware to check if logged in don't show index page
	function publicPage(req,res, next){ 
		if(req.isAuthenticated()){
			res.redirect('/chatrooms');
		}
		else{
			next();
		}
	}
	router.get('/', publicPage, function(req, res, next){
		res.render('index', {title: "chat"});
	});

	function securePages(req, res, next){
		if(req.isAuthenticated()){
			next();
		}
		else{
			res.redirect('/');
		}
	}

	router.get('/auth/facebook', passport.authenticate('facebook'));
	router.get('/auth/facebook/callback', passport.authenticate('facebook', {
		successRedirect: '/chatrooms',
		failureRedirect: '/'
	}));
	router.get('/chatrooms', securePages, function(req, res, next){
				//res.send('chatrooms', {title: 'Chatrooms'});   <--DON'T WORK
		res.render('chatrooms', {title: 'Chatrooms', user: req.user, config:config});
	});

	router.get('/room/:id', securePages, function(req, res, next){
		var room_name = findTitle(req.params.id);
		res.render('room', { user: req.user, config:config, room_name: room_name, room_number: req.params.id});
	});

	function findTitle(room_id){
		var n = 0;
		while(n< rooms.length){
			if(rooms[n].room_number == room_id){
				return rooms[n].room_name;
				break;
			}
			else{
				n++;
				continue;
			}
		}
	}

	router.get('/logout', function(req, res, next){
		req.logout();
		res.redirect('/');
	});


		// set default route to instance of this router
	app.use('/', router);
};