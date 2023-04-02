/* global _:readonly */
import { addPoints, clearMarker } from './map.js';

const DEFAULT_VALUE = 'any';
const AMOUNT_OF_POINTS = 10;
const RERENDER_DELAY = 500;
const priceRage = {

  low: {
    from: 0,
    to: 10000,
  },
  middle: {
    from: 10000,
    to: 50000,
  },
  high: {
    from: 50000,
    to: 1000000,
  },
};

const fiterData = (data) => {

  const mapFilters = document.querySelector('.map__filters');
  const housingTypeElement = document.querySelector('#housing-type');
  const housingPriceElement = document.querySelector('#housing-price');
  const housingRoomsElement = document.querySelector('#housing-rooms');
  const housingGuestsElement = document.querySelector('#housing-guests');
  const housingFeaturesElement = document.querySelector('#housing-features');
  const features = housingFeaturesElement.querySelectorAll('.map__checkbox');

  let filteredData = data.slice(0,AMOUNT_OF_POINTS);

  const checkType = (datum) => housingTypeElement.value === DEFAULT_VALUE || datum.offer.type === housingTypeElement.value;
  const checkPrice = (datum) => housingPriceElement.value === DEFAULT_VALUE || (datum.offer.price >= priceRage[housingPriceElement.value].from && datum.offer.price <= priceRage[housingPriceElement.value].to)
  const checkRooms = (datum) => housingRoomsElement.value === DEFAULT_VALUE || datum.offer.rooms.toString() === housingRoomsElement.value;
  const checkGuests = (datum) => housingGuestsElement.value === DEFAULT_VALUE || datum.offer.guests.toString() === housingGuestsElement.value;


  const checkFeatures = (datum) => Array.from(features)
    .every((feature) => {
      if (!feature.checked) {
        return true;
      }
      if (!datum.offer.features) {
        return false;
      }
      return datum.offer.features.includes(feature.value);
    });


  const checkFiltres = (datum) => {
    if (checkType(datum) && checkPrice(datum) && checkRooms(datum) && checkGuests(datum) && checkFeatures(datum)) {
      return true;
    }
  }
  addPoints(filteredData);

  const onChangeFilter = () => {

    clearMarker();
    filteredData = data.slice().filter(checkFiltres).slice(0, AMOUNT_OF_POINTS);
    addPoints(filteredData);

  }

  mapFilters.addEventListener('change', _.debounce(
    () => onChangeFilter(),
    RERENDER_DELAY,
  ));
};


export {fiterData};
