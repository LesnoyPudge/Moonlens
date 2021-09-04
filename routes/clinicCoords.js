import MoonlensData from '../models/MoonlensData.js';

export async function getClinicCoords() {
    let filter = {};
    let projection = 'cities.clinics._id cities.clinics.clinic_coords';
    let options = {};

    const doc = await MoonlensData.find(filter, projection, options).lean();

    let clinics = [];

    for (let countryCount = 0; countryCount < doc.length; countryCount++) {
        for (let cityCount = 0; cityCount < doc[countryCount].cities.length; cityCount++) {
            for (let clinicCount = 0; clinicCount < doc[0].cities[0].clinics.length; clinicCount++) {

                let clinicData = {
                    'type': 'Feature',
                    'id': doc[countryCount].cities[cityCount].clinics[clinicCount]._id,
                    'geometry': {
                        'type': 'Point', 
                        'coordinates': doc[countryCount].cities[cityCount].clinics[clinicCount].clinic_coords,
                    },
                    'properties': {
                        'balloonTitle': 'идет загрузка...',
                    },
                    'options': {
                        'balloonLayout': 'customLayout', 
                        'balloonContentLayout': 'customContentLayout',
                        'iconLayout': 'default#imageWithContent',
                        'iconImageHref': '',
                        'iconContentLayout': 'MyIconContentLayout',
                        'hideIconOnBalloonOpen': false,
                        'iconImageSize': [
                            50,
                            63
                        ],
                        'iconImageOffset': [
                            -25,
                            -64
                        ],
                        'balloonOffset': [
                            -1,
                            -5
                        ],
                    },
                };
                clinics.push(clinicData);
            }
        }
    }

    let result = {
        'type': 'FeatureCollection',
        'features': clinics   
    };

    return result;
}

export default getClinicCoords;