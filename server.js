import express from 'express';
import path from 'path';
import http from 'http';
import fs from 'fs';
import url from 'url';
import mongoose from 'mongoose';
import engine from 'ejs-locals';
import bodyParser from 'body-parser';

import Country from './models/MoonlensData.js';
import config from './config/config.js'
import {requestTime, logger} from './public/js/middlewares.js';
import testRoures from './routes/router.js';





const PORT = process.env.PORT || config.get('port');
const hostname = '127.0.0.1';
const app = express();

app.use(bodyParser.json() );
app.use(bodyParser.urlencoded({extended: true})); 
app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('views', path.resolve('./template'));


app.use(express.static(path.resolve('./public')));
// app.use(requestTime);
// app.use(logger);
app.use(testRoures);

// app.get('/', (req, res) => {
//     res.render('index', {title: 'Main page', active: 'main'});
// });

async function start() {
    try {

        await mongoose.connect(config.get('dbconnection'), {
            useNewUrlParser: true,
            useFindAndModify: false,
            useUnifiedTopology: true,
        });

        app.listen(PORT, () => {
            console.log(`server started: ${hostname}:${PORT}`);
        });

    } catch (error) {
        console.error(error);
    }
}

start();

// app.get('/download', (req, res) => {
//     console.log(req.requestTime);
//     res.download(path.resolve('dist/', 'index.html'));
// });


