import { NestFactory } from '@nestjs/core';
import * as express from 'express';
import * as path from 'path';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import * as session from 'express-session';
import * as passport from 'passport';
import { ApplicationModule } from './app.module';
import { PassportService } from './passport.service';
import * as flash from 'connect-flash';

import * as mongoose from 'mongoose';

const app = express();

new PassportService(passport);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.use(cookieParser());
app.use(session({
  secret: 'shhhhhhhhh',
  resave: true,
  saveUninitialized: true,
  cookie: { secure: true }
}));

app.use(flash());

// Init passport authentication
app.use(passport.initialize());
// persistent login sessions
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'assets')));

app.use((req, res, next)=>{
  console.log(req.flash('message'));
  console.log(req.flash('signupMessage'));
  next();
})


const nest = NestFactory.create(ApplicationModule, app);

mongoose.connect('mongodb://localhost/g4t');



nest.listen(process.env.PORT || 3000,() =>
	{
      console.log(`Nest app is listening on port ${process.env.PORT}.`);
      
	}
);