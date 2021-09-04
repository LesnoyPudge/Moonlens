import express from 'express';
import path from 'path';
import mongoose from 'mongoose';
import engine from 'ejs-locals';
import bodyParser from 'body-parser';
import config from './config/config.js'
import router from './routes/router.js';
import compression from 'compression';

// const PORT = process.env.PORT || config.get('port');
// const hostname = '127.0.0.1';
const hostname = '194.58.100.129';
const PORT = process.env.PORT || 80;
const app = express();

app.use(compression());
app.use(bodyParser.json() );
app.use(bodyParser.urlencoded({extended: true})); 
app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('views', path.resolve('./template'));


app.use(express.static(path.resolve('./public')));
app.use(router);


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

