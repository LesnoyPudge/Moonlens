import {Router} from 'express';
import mongoose from 'mongoose';
import MoonlensData from '../models/MoonlensData.js';

const router = Router();

router.get('/', (req, res) => {
    res.render('index');
});

router.get('/clinic-coords', async (req, res) => {
    MoonlensData.find({})
        .then(function(result) {
            res.send(JSON.stringify(result));
        });
});

router.get('*',async (req, res) => {
    res.status(404).render('error');;
});


// module.exports = router;
export default router;