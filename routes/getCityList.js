import MoonlensData from '../models/MoonlensData.js';

export async function getCityList(body) {
    let filter =  { _id: body.countryId };
    let projection = 'cities._id cities.city_name';
    let options = {};
    const doc = await MoonlensData.find(filter, projection, options).lean();

    let cities = [];
    let cityData;
    for (let countryCount = 0; countryCount < doc.length; countryCount++) {
        for (let cityCount = 0; cityCount < doc[countryCount].cities.length; cityCount++) {
            cityData = {
                '_id': doc[countryCount].cities[cityCount]._id,
                'city_name': doc[countryCount].cities[cityCount].city_name,
            }
            cities.push(cityData);
        }
    }

    let result = JSON.stringify(cities);
    return result;
}

export default getCityList;