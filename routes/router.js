import {Router} from 'express';
import getClinicCoords from './clinicCoords.js';
import getClinicDesc from './clinicDesc.js';
import getCountryList from './getCountryList.js';
import getCityList from './getCityList.js';
import getClinicList from './getClinicList.js';

const router = Router();

router.get('/', (req, res) => {
    res.render('index');
    res.flush()
});

router.get('/playground', (req, res) => {
    res.render('playground');
    res.flush()
});

router.get('/clinicCoords', async (req, res) => {
    let result = await getClinicCoords();
    res.send(result);
    res.flush()
});

router.post('/clinicDesc',async (req, res) => {
    let result = await getClinicDesc(req.body);
    res.send(result);
    res.flush()
});

router.get('/getCountryList',async (req, res) => {
    let result = await getCountryList();
    res.send(result);
    res.flush()
});

router.post('/getCityList',async (req, res) => {
    let result = await getCityList(req.body);
    res.send(result);
    res.flush()
});

router.post('/getClinicList',async (req, res) => {
    let result = await getClinicList(req.body);
    res.send(result);
    res.flush()
});

router.get('*',async (req, res) => {
    res.status(404).render('error');
    res.flush()
});

export default router;