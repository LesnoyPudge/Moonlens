import MoonlensData from '../models/MoonlensData.js';

export async function getClinicDesc(body) {
    let filter =  {'cities.clinics._id': body};
    let projection = {_id: 0};
    let options = {};

    const doc = await MoonlensData.find(filter, projection, options).lean();
    let clinicData = {};

    for (let countryCount = 0; countryCount < doc.length; countryCount++) {
        for (let cityCount = 0; cityCount < doc[countryCount].cities.length; cityCount++) {
            for (let clinicCount = 0; clinicCount < doc[0].cities[0].clinics.length; clinicCount++) {
                if (doc[countryCount].cities[cityCount].clinics[clinicCount]._id.toString() === body.toString()) {

                    clinicData = {
                        'country_name':doc[countryCount].country_name,
                        'city_name':doc[countryCount].cities[cityCount].city_name,
                        'clinic_id': doc[countryCount].cities[cityCount].clinics[clinicCount]._id,
                        'clinic_name': doc[countryCount].cities[cityCount].clinics[clinicCount].clinic_name,
                        'clinic_address': doc[countryCount].cities[cityCount].clinics[clinicCount].clinic_address,
                        'clinic_email': doc[countryCount].cities[cityCount].clinics[clinicCount].clinic_email,
                        'clinic_site': doc[countryCount].cities[cityCount].clinics[clinicCount].clinic_site,
                        'clinic_phone': doc[countryCount].cities[cityCount].clinics[clinicCount].clinic_phone,
                    };
                } 
            }
        }
    }
    let result = JSON.stringify(clinicData);
    return result;
}

export default getClinicDesc;