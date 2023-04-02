//работа с формой

import {sendData} from './fetch.js'
import {showAlert} from './util.js';
const TOKIO_LAT_LNG = {
  lat : 35.68951,
  lng : 139.69201,
}
const COMMENT_MIN_LENGTH = 30;
const COMMENT_MAX_LENGTH = 30;
const DEFAULT_CAPACITY = '1';
const ROOM_NUMBER_NOT_FOR_GUESTS = 100;

const MAX_PRICE = 1000000;
//Минимальная цена за ночь
const MIN_PRICES = {
  bungalow : 0,
  flat : 1000,
  hotel : 3000,
  house : 5000,
  palace : 10000,
};

//деактивация формы
const adFormClass = '.ad-form';
const mapFiltersClass = '.map__filters';
const formAdvertisement = document.querySelector(adFormClass);
const formMapFilters = document.querySelector(mapFiltersClass);


const deactivateForm = (formClass) => {
  const formAdvertisement = document.querySelector(formClass);
  const fieldsets = formAdvertisement.querySelectorAll('fieldset');
  fieldsets.forEach(fieldset => {
    fieldset.disabled = true;
  });
  formAdvertisement.classList.add('ad-form--disabled');
}

const activateForm = (formClass) => {
  const formAdvertisement = document.querySelector(formClass);
  const fieldsets = formAdvertisement.querySelectorAll('fieldset');
  fieldsets.forEach(fieldset => {
    fieldset.disabled = false;
  });
  formAdvertisement.classList.remove('ad-form--disabled');
}

deactivateForm(adFormClass);
deactivateForm(mapFiltersClass);


const typeOfEstateElement = document.querySelector('#type');
const price = document.querySelector('#price');

//Вставка отеля в форму создания объявления
const hotelElement = document.createElement('option');
hotelElement.value = 'hotel';
hotelElement.textContent = 'Отель';
const houseElement = typeOfEstateElement.querySelector('option[value=house]');
typeOfEstateElement.insertBefore(hotelElement, houseElement);

//Вставка отеля в форму фильтрации
const housingTypeElement = document.querySelector('#housing-type');
const flatElementFilter = housingTypeElement.querySelector('option[value=flat]');
housingTypeElement.insertBefore(hotelElement.cloneNode(true), flatElementFilter);

//Валидирует цену
const validatePrice = () => {
  if (Number(price.value) < price.min) {
    price.setCustomValidity('Минимальная цена ' + price.min + ', увеличьте цену');
  } else if (Number(price.value) > MAX_PRICE) {
    price.setCustomValidity('Максимальная цена - 1 000 000, уменьшите цену');
  } else {
    price.setCustomValidity('');
  }

  price.reportValidity();
};

//минимальная цена по умолчанию
price.placeholder = MIN_PRICES['flat'];
price.min = MIN_PRICES['flat'];

typeOfEstateElement.addEventListener('change', () => {
  price.placeholder = MIN_PRICES[typeOfEstateElement.value];
  price.min = MIN_PRICES[typeOfEstateElement.value];
  validatePrice();
});

//синхронизация заезда/выезда
const timeInElement = document.querySelector('#timein');
const timeOutElement = document.querySelector('#timeout');

timeInElement.addEventListener('change', () => {
  timeOutElement.value = timeInElement.value;
});

timeOutElement.addEventListener('change', () => {

  timeInElement.value = timeOutElement.value;
});


//Валидируем форму
const titleElement = document.querySelector('#title');
//const submitElement = document.querySelector('.ad-form__submit')

titleElement.addEventListener('input', () => {
  const valueLength = titleElement.value.length;

  if (valueLength < COMMENT_MIN_LENGTH) {
    titleElement.setCustomValidity('Ещё ' + (COMMENT_MIN_LENGTH - valueLength) +' симв.');
  } else if (valueLength > COMMENT_MAX_LENGTH) {
    titleElement.setCustomValidity('Удалите лишние ' + (valueLength - COMMENT_MAX_LENGTH) +' симв.');
  } else {
    titleElement.setCustomValidity('');
  }

  titleElement.reportValidity();
});


price.addEventListener('input', validatePrice);


const roomNumber = document.querySelector('#room_number');
const capacity = document.querySelector('#capacity');

//значение по умолчанию для гостей
capacity.value = DEFAULT_CAPACITY;
const capacityOptions = capacity.querySelectorAll('option');

const enableOptions = () => {
  capacityOptions.forEach((option) => {

    option.disabled = false;

  })
};

const validateCapacity = () => {

  const index = capacity.selectedIndex;
  if (capacityOptions[index].disabled === true) {
    capacity.setCustomValidity('Выберите доступную опцию');
  } else {
    capacity.setCustomValidity('');
  }

  capacity.reportValidity();

};

validateCapacity();

const disableOptions = () => {

  capacityOptions.forEach((option) => {

    if (Number(roomNumber.value) === ROOM_NUMBER_NOT_FOR_GUESTS && Number(option.value) !== 0 ) {
      //enableOptions();
      option.disabled = true;
    } else if (Number(roomNumber.value) < Number(option.value)) {
      option.disabled = true;
    }
    if (Number(roomNumber.value) !== ROOM_NUMBER_NOT_FOR_GUESTS && Number(option.value) === 0 ) {
      //enableOptions();
      option.disabled = true;
    }

  });
};


disableOptions();

roomNumber.addEventListener('change', () => {
  enableOptions();
  disableOptions();
  validateCapacity();
  capacity.addEventListener('change', () => {
    validateCapacity();
  });


});


//попап
// При удачной отправке открывается попап, подключается эвенлистнер на эск и на клик.
//при нажатии эск или клик, удаляется попап и оба эвентлистнера

const bodyElement = document.querySelector('body');
const successMessage = document.querySelector('#success').content.querySelector('.success');
const errorMessage = document.querySelector('#error').content.querySelector('.error');

const isEscEvent = (evt) => {
  return evt.key === 'Escape' || evt.key === 'Esc';
};
const closeModal = () => {
  //successMessage.remove();
  bodyElement.removeChild(bodyElement.lastElementChild);
  document.removeEventListener('keydown', onPopupEscKeydown);
  document.removeEventListener('click', onDocumentClick);
};

const onPopupEscKeydown = (evt) => {
  if (isEscEvent(evt)) {
    evt.preventDefault();
    closeModal();
  }
};

const onDocumentClick = () => {
  closeModal();
};


const printMessage = (message) => {
  bodyElement.appendChild(message);
  document.addEventListener('keydown', onPopupEscKeydown);
  document.addEventListener('click', onDocumentClick);
};


const setFormAdvertisement = (onSuccess, onFail) => {
  formAdvertisement.addEventListener('submit', (evt) => {
    evt.preventDefault();

    sendData(
      () => onSuccess(),
      () => onFail(),
      new FormData(evt.target),
    );
  });
};


const resetForm = () => {
  formMapFilters.reset();
  formAdvertisement.reset()
  //значение по умолчанию для гостей
  capacity.value = DEFAULT_CAPACITY;
  let addressFieldElement = document.querySelector('#address');
  addressFieldElement.value = TOKIO_LAT_LNG.lat +', ' + TOKIO_LAT_LNG.lng;
};


const resetButton = document.querySelector('.ad-form__reset');

resetButton.addEventListener('click', (evt) => {
  evt.preventDefault();
  resetForm();
});


const onSuccessSend = () => {
  showAlert('Данные отправлены');
  printMessage(successMessage);
  resetForm();
};

const onFailSend = () => {
  showAlert('Это провал');
  printMessage(errorMessage);
};

setFormAdvertisement(onSuccessSend, onFailSend);


export {activateForm, adFormClass, mapFiltersClass};
