import {Router} from 'express';
import mongoose from 'mongoose';
import MoonlensData from '../models/MoonlensData.js';
import getClinicCoords from './clinicCoords.js';
import getClinicDesc from './clinicDesc.js';

const router = Router();

router.get('/', (req, res) => {
    res.render('index');
});

router.get('/clinicCoords', async (req, res) => {
    let result = await getClinicCoords();
    res.send(result);
});

router.get('/clinicDesc',async (req, res) => {
    let result = await getClinicDesc();
    res.send(result);
});

router.get('*',async (req, res) => {
    res.status(404).render('error');;
});


// module.exports = router;
export default router;