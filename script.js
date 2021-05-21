'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');
const imagesContainer = document.querySelector('.images');

//////////////////////////////////////////////////////////
const renderCountry = function (data, className = '') {
    const html = `
    <article class="country ${className}" >
        <img class="country__img" src="${data.flag}" />
        <div class="country__data">
        <h3 class="country__name">${data.name}</h3>
        <h4 class="country__region">${data.region}</h4>
        <p class="country__row"><span>👫</span>${data.population.toLocaleString()} people</p>
        <p class="country__row"><span>🗣️</span>${data.demonym}</p>
        <p class="country__row"><span>💰</span>${data.currencies[0]['name']}</p>
        </div>
    </article>
    `;
    countriesContainer.insertAdjacentHTML('beforeend', html);
    countriesContainer.style.opacity = 1;
}

const renderError = function (msg) {
    countriesContainer.insertAdjacentText('beforeend', msg);
}

// const getJSON = function (url, errMsg = 'Something went wrong') {
//     return fetch(url)
//         .then(response => {
//             if (!response.ok) throw new Error(`${errMsg} ${response.status}`)
//             return response.json()
//         })
// }

// const getCountryData = function (country) {
//     // Country 1
//     getJSON(`https://restcountries.eu/rest/v2/name/${country}`, 'Country not found')
//         .then(data => {
//             renderCountry(data[0]);
//             const neighbour = data[0].borders[0];
//             if (!neighbour) throw new Error('No neighbour can be found');

//             // Country 2
//             return getJSON(`https://restcountries.eu/rest/v2/name/${neighbour}`).then(data => renderCountry(data[0], 'neighbour'))

//         }).catch(err => {
//             console.error(err);
//             renderError(`Something went wrong ~ ${err}`)
//         }).finally(() => {
//             countriesContainer.style.opacity = 1;
//         });
// }

const getPosition = function () {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}

const getCountry = async function () {
    try {
        //Geolocation
        const pos = await getPosition();
        const { latitude: lat, longitude: lng } = pos.coords;

        //Reverse geocoding
        const resGeo = await fetch(`https://geocode.xyz/${lat},${lng}?geoit=json`);
        if (!resGeo.ok) throw new Error('Problem with getting location data')
        const dataGeo = await resGeo.json();

        //Country data
        const res = await fetch(`https://restcountries.eu/rest/v2/name/${dataGeo.country}`);
        const data = await res.json();
        renderCountry(data[0]);

        //Get neighbours
        const neighbours = await data[0].borders;
        neighbours.forEach(async function (neighb) {
            const neighRes = await fetch(`https://restcountries.eu/rest/v2/name/${neighb}`);
            const neighData = await neighRes.json();
            renderCountry(neighData[0], 'neighbour');
        });

        return `You are in ${dataGeo.city}, ${dataGeo.country}`

    } catch (err) {
        renderError(`💣 ${err.message}`);

        //Reject promise returned from asnyc function
        throw err;
    }
};

// (async function () {
//     try {
//         const city = await getCountry();
//         console.log(`2: ${city}`);
//     } catch (err) {
//         console.error(`2: ${err.message}`)
//     }
//     console.log('3: Finished loading country');
// })();
btn.addEventListener('click', () => {
    getCountry().then(res => btn.textContent = res)
    btn.classList.add('btn-country--disabled');
})


///////////////////// Coding Challenge #1///////////////////////////

const wait = function (second) {
    return new Promise((resolve) => {
        setTimeout(resolve, second * 1000)
    })
}

const createImage = function (imgPath) {
    return new Promise((resolve, reject) => {
        const imgEl = document.createElement('img');
        imgEl.src = imgPath;

        imgEl.addEventListener('load', () => {
            imagesContainer.append(imgEl);
            resolve(imgEl);
        });

        imgEl.addEventListener('error', () => {
            reject(new Error('Image not found!'));
        })
    })
}

let currentImageEl;
// createImage('img/img-1.jpg')
//     .then(img => {
//         currentImageEl = img;
//         console.log('Image 1 loaded');
//         return wait(2);
//     })
//     .then(() => {
//         currentImageEl.style.display = 'none';
//         return createImage('img/img-2.jpg')
//     })
//     .then(img2 => {
//         currentImageEl = img2;
//         console.log('Image 2 loaded');
//         return wait(2)
//     })
//     .then(() => {
//         currentImageEl.style.display = 'none';
//     })
//     .catch(err => console.error(err));

const loadNPause = async function () {
    try {
        //load img1
        const img1 = await createImage('img/img-1.jpg');

        //wait 2 seconds, then hide img1
        await wait(2);
        img1.style.display = 'none';

        await wait(2);

        //load img2
        const img2 = await createImage('img/img-2.jpg');
        await wait(2);
        img2.style.display = 'none';
    } catch (err) {
        console.error(err);
    }
}

//loadNPause()

const loadAll = async function (imgArr) {
    try {
        const imgs = imgArr.map(async img => await createImage(img));
        //  console.log(imgs);

        const imgsEl = await Promise.all(imgs);
        //  console.log(imgsEl);

        imgsEl.forEach(img => img.classList.add('parallel'))

    } catch (err) {
        console.error(err);
    }

    //  Promise.all([createImage(imgArr[0]), createImage(imgArr[1]), createImage(imgArr[2])])
}
//loadAll(['img/img-1.jpg', 'img/img-2.jpg', 'img/img-3.jpg'])
