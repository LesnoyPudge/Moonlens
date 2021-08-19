import mongoose from 'mongoose';
const Schema = mongoose.Schema;
mongoose.pluralize(null);

const clinicSchema = new Schema({
    clinic_name: String,
    clinic_address: String,
    clinic_email: String,
    clinic_site: String,
    clinic_phone: String,
    clinic_coords: [Number]
},
    {versionKey: false}
);

const citySchema = new Schema({
    city_name: String,
    city_coords: [Number],
    clinics: [clinicSchema]
},
    {versionKey: false}
);

const countrySchema = new Schema({
    country_name: String,
    cities: [citySchema]
},
    {versionKey: false}
);


const MoonlensData = mongoose.model('MoonlensData', countrySchema);

// const moonlensData = new MoonlensData(
//     {
//         country_name: "Россия",
//         cities: [
//             {
//                 city_name: "Екатеринбург",
//                 city_coords: [40, 50],
//                 clinics: [
//                     {
//                         clinic_coords: [44, 51],
//                         clinic_name: "Рога и Копыта",
//                         clinic_address: "Высоцкий",
//                         clinic_email: "exmp@.ru",
//                         clinic_site: "siteLink.ru",
//                         clinic_phone: "8 800 555 35 35"
//                     }
//                 ]
//             },
//             {
//                 city_name: "Москва",
//                 city_coords: [41, 51],
//                 clinics: [
//                     {
//                         clinic_coords: [44.5, 51.5],
//                         clinic_name: "Клиника в Москве",
//                         clinic_address: "Адрес в Москве",
//                         clinic_email: "exmp@.ru",
//                         clinic_site: "siteLink.ru",
//                         clinic_phone: "8 800 555 35 35"
//                     }
//                 ]
//             },
//             {
//                 city_name: "Санкт-Петербург",
//                 city_coords: [42, 52],
//                 clinics: [
//                     {
//                         clinic_coords: [43.4, 50.5],
//                         clinic_name: "Клиника в СПБ",
//                         clinic_address: "Адрес в СПБ",
//                         clinic_email: "exmp@.ru",
//                         clinic_site: "siteLink.ru",
//                         clinic_phone: "8 800 555 35 35"
//                     }
//                 ]
//             }
//         ]
//     },
//     {
//         country_name: "Украина",
//         cities: [
//             {
//                 city_name: "Киев",
//                 city_coords: [45, 55],
//                 clinics: [
//                     {
//                         clinic_coords: [45, 55],
//                         clinic_name: "Клиника в Киеве",
//                         clinic_address: "Адрес в Киеве",
//                         clinic_email: "exmp@.ru",
//                         clinic_site: "siteLink.ru",
//                         clinic_phone: "8 800 555 35 35"
//                     }
//                 ]
//             }
//         ]
//     },
//     {
//         country_name: "Беларусь",
//         cities: [
//             {
//                 city_name: "Минск",
//                 city_coords: [35, 45],
//                 clinics: [
//                     {
//                         clinic_coords: [35, 45],
//                         clinic_name: "Клиника в Минске",
//                         clinic_address: "Адрес в Минске",
//                         clinic_email: "exmp@.ru",
//                         clinic_site: "siteLink.ru",
//                         clinic_phone: "8 800 555 35 35"
//                     }
//                 ]
//             }
//         ]
//     }
// );


// moonlensData.save()
//     .then(function(doc){
//         console.log("Сохранен объект", doc);
//         // mongoose.disconnect();  // отключение от базы данных
//     })
//     .catch(function (err){
//         console.log(err);
//         mongoose.disconnect();
//     });


export default MoonlensData;