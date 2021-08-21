import MoonlensData from '../models/MoonlensData.js';

export async function getClinicList(body) {
    
    let filter;
    let result;
    let clinics = [];
    let clinicData = {};

    if (body.dataValue == undefined) {
        filter =  {};
        let projection = 'cities.clinics';
        let options = {};

        const doc = await MoonlensData.find(filter, projection, options).lean();
        // console.log('Got body: ', body);
        console.log('Raw output: ', doc)
        
        for (let countryCount = 0; countryCount < doc.length; countryCount++) {
            for (let cityCount = 0; cityCount < doc[countryCount].cities.length; cityCount++) {
                for (let clinicCount = 0; clinicCount < doc[0].cities[0].clinics.length; clinicCount++) {
                    clinicData = {
                        '_id': doc[countryCount].cities[cityCount].clinics[clinicCount]._id,
                        'clinic_name': doc[countryCount].cities[cityCount].clinics[clinicCount].clinic_name,
                        'clinic_address': doc[countryCount].cities[cityCount].clinics[clinicCount].clinic_address,
                        'clinic_email': doc[countryCount].cities[cityCount].clinics[clinicCount].clinic_email,
                        'clinic_site': doc[countryCount].cities[cityCount].clinics[clinicCount].clinic_site,
                        'clinic_phone': doc[countryCount].cities[cityCount].clinics[clinicCount].clinic_phone,
                    };
                    clinics.push(clinicData); 
                };
            };
        };
        console.log(JSON.stringify(clinics));
        result = JSON.stringify(clinics);
    } else {
        filter = { 'cities._id': body.dataValue };
        filter =  {};
        let projection = '';
        let options = {};

        const doc = await MoonlensData.find(filter, projection, options).lean();
        // console.log('Got body: ', body);
        console.log('Raw output: ', doc)
        
        for (let countryCount = 0; countryCount < doc.length; countryCount++) {
            for (let cityCount = 0; cityCount < doc[countryCount].cities.length; cityCount++) {
                for (let clinicCount = 0; clinicCount < doc[0].cities[0].clinics.length; clinicCount++) {
                    // console.log(doc[countryCount].cities[cityCount]._id.toString(), ' и ', body.dataValue.toString())
                    if (doc[countryCount].cities[cityCount]._id.toString() === body.dataValue.toString()) {
                        clinicData = {
                            '_id': doc[countryCount].cities[cityCount].clinics[clinicCount]._id,
                            'clinic_name': doc[countryCount].cities[cityCount].clinics[clinicCount].clinic_name,
                            'clinic_address': doc[countryCount].cities[cityCount].clinics[clinicCount].clinic_address,
                            'clinic_email': doc[countryCount].cities[cityCount].clinics[clinicCount].clinic_email,
                            'clinic_site': doc[countryCount].cities[cityCount].clinics[clinicCount].clinic_site,
                            'clinic_phone': doc[countryCount].cities[cityCount].clinics[clinicCount].clinic_phone,
                        };
                    };
                };
            };
        };
        console.log(JSON.stringify(clinicData));
        result = JSON.stringify(clinicData);
    }
    console.log('filter: ', filter);
    
    console.log(result);
    return result;
}

export default getClinicList;