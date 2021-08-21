import MoonlensData from '../models/MoonlensData.js';

export async function getCountryList() {
    let filter =  {};
    let projection = {_id: 1, country_name: 1};
    let options = {};
    const doc = await MoonlensData.find(filter, projection, options).lean();

    let result = JSON.stringify(doc);
    return result;
}

export default getCountryList;