!function(){"use strict";const t=document.querySelector(".btn-country"),n=document.querySelector(".countries"),e=(document.querySelector(".images"),function(t,e=""){const o=`\n    <article class="country ${e}" >\n        <img class="country__img" src="${t.flag}" />\n        <div class="country__data">\n        <h3 class="country__name">${t.name}</h3>\n        <h4 class="country__region">${t.region}</h4>\n        <p class="country__row"><span>👫</span>${t.population.toLocaleString()} people</p>\n        <p class="country__row"><span>🗣️</span>${t.demonym}</p>\n        <p class="country__row"><span>💰</span>${t.currencies[0].name}</p>\n        </div>\n    </article>\n    `;n.insertAdjacentHTML("beforeend",o),n.style.opacity=1}),o=async function(){try{const t=await new Promise(((t,n)=>{navigator.geolocation.getCurrentPosition(t,n)})),{latitude:n,longitude:o}=t.coords,a=await fetch(`https://geocode.xyz/${n},${o}?geoit=json`);if(!a.ok)throw new Error("Problem with getting location data");const c=await a.json(),r=await fetch(`https://restcountries.eu/rest/v2/name/${c.country}`),s=await r.json();e(s[0]);return(await s[0].borders).forEach((async function(t){const n=await fetch(`https://restcountries.eu/rest/v2/name/${t}`),o=await n.json();e(o[0],"neighbour")})),`You are in ${c.city}, ${c.country}`}catch(e){throw t=`💣 ${e.message}`,n.insertAdjacentText("beforeend",t),e}var t};t.addEventListener("click",(()=>{o().then((n=>t.textContent=n)),t.classList.add("btn-country--disabled")}))}();
//# sourceMappingURL=index.19b300bf.js.map
