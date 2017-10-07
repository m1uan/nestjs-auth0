import { Controller, Get, Post, Req, Res, Next, HttpStatus,  } from '@nestjs/common';

import * as passport from 'passport';
import 'dotenv/config';
import * as jwt from 'jsonwebtoken';
import * as randomtoken from 'random-token';

@Controller()
export class AppController {

	public env = {
	       AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
	       AUTH0_DOMAIN: process.env.AUTH0_DOMAIN,
	       AUTH0_CALLBACK_URL: process.env.AUTH0_CALLBACK_URL
	}

	@Get()
	public index(@Res() res) {
	    	res.render('index', { 
	    		'title': 'NestJS + Auth0', 
	    		'env': this.env 
	    	});
	}

	@Post('/signup')
	public async signup(@Req() req, @Res() res, @Next() next) {
		await passport.authenticate('local-signup', {
		},(err, user, info)=>{
			
			if(err) {
				throw err;
			}

			if(user) {
				res.json(user);
			} else {
				res.status(HttpStatus.UNAUTHORIZED).json(info);
			}
		})(req, res, next);
	}

	@Post('/api/login')
	public async login(@Req() req, @Res() res, @Next() next) {
		await passport.authenticate('local-login', {
		},(err, user, info)=>{
			
			if(err) {
				throw err;
			}

			if(user) {
				var token = jwt.sign(user.toObject(), 'process.env.JWT_TOKEN_SECRET', {
					expiresIn: '24h' // expires in 24 hours
				  });
				res.json({user, token: token});
			} else {
				res.status(HttpStatus.UNAUTHORIZED).json(info);
			}
		})(req, res, next);
	}

	@Get('/login')
	public async loginView(@Res() res) {
		res.render('login', { 
			'env': this.env 
		});
	}

	@Get('/callback')
	public async callback(@Req() req, @Res() res, @Next() next) {
		await passport.authenticate('auth0', {
			successRedirect: '/user',
	     		failureRedirect: '/url-if-something-fails'
		})(req, res, next);
	}

	@Get('/facebook')
	public async facebooklogin(@Req() req, @Res() res, @Next() next) {
		await passport.authenticate('facebook')(req, res, next);
	}

	@Get('/facebook-token')
	public async facebooktoken(@Req() req, @Res() res, @Next() next) {
		await passport.authenticate('facebook', {
			successRedirect: '/user',
	     		failureRedirect: '/url-if-something-fails'
		})(req, res, next);
	}

	@Get('/logout')
	public logout(@Req() req, @Res() res) {
		req.logout();
	   	res.redirect('/');
	}

	@Get('/api/user')
	public user(@Req() req, @Res() res) {
		console.log(req.user);
		res.json({ 'user': req.user, 'ahoj': req.session });
	}
}
