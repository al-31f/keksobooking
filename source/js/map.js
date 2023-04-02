/* eslint-disable no-undef */
//подключение карты и вывод похожих объявлений

import {activateForm, mapFiltersClass, adFormClass} from './form.js';
import {printAdvertisements} from './print-advertisements.js';
import {getData} from './fetch.js';
import {fiterData} from './filters.js';

const TOKIO_LAT_LNG = {
  lat : 35.68951,
  lng : 139.69201,
}

const map = L.map('map-canvas')
  .on('load', () => {
    activateForm(adFormClass);
  })
  .setView({
    lat: TOKIO_LAT_LNG.lat,
    lng: TOKIO_LAT_LNG.lng,
  }, 10);

L.tileLayer(
  'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
).addTo(map);

const mainPinIcon = L.icon({
  iconUrl: 'img/main-pin.svg',
  iconSize: [52, 52],
  iconAnchor: [26, 52],
});

const mainMarker = L.marker(
  {
    lat: TOKIO_LAT_LNG.lat,
    lng: TOKIO_LAT_LNG.lng,
  },
  {
    draggable: true,
    icon: mainPinIcon,
  },
);

mainMarker.addTo(map);

let addressFieldElement = document.querySelector('#address');
addressFieldElement.readOnly = true;
addressFieldElement.value = TOKIO_LAT_LNG.lat + ', ' + TOKIO_LAT_LNG.lng;
mainMarker.on('moveend', (evt) => {
  const marckedAddress = evt.target.getLatLng();

  addressFieldElement.value = marckedAddress.lat.toFixed(5) + ', ' + marckedAddress.lng.toFixed(5);
});


const anyPinIcon = L.icon({
  iconUrl: 'img/pin.svg',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

const markerGroup = L.layerGroup().addTo(map);
const clearMarker = () => markerGroup.clearLayers();

const addPoints = (data) => {
  data.forEach((point) => {

    const marker = L.marker(
      {
        lat: point.location.lat,
        lng: point.location.lng,
      },
      {
        icon: anyPinIcon,
      },
    );

    marker.addTo(markerGroup)
      .bindPopup(printAdvertisements(point));

  });
  activateForm(mapFiltersClass);
};

getData(fiterData);

export {addPoints, clearMarker};
