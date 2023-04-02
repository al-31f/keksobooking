//модуль выводит объяления (в поле для карты)

const printAdvertisements = (point) => {

  const advertisementElementTemplate = document.querySelector('#card').content.querySelector('.popup');

  const OFFER_TYPE = {
    flat: 'Квартира',
    bungalow: 'Бунгало',
    hotel: 'Отель',
    house: 'Дом',
    palace: 'Дворец',
  }
  const advertisementElement = advertisementElementTemplate.cloneNode(true);

  const advertisementElementAvatar = advertisementElement.querySelector('.popup__avatar');
  const advertisementElementTitle = advertisementElement.querySelector('.popup__title');
  const advertisementElementTextAddress = advertisementElement.querySelector('.popup__text--address');
  const advertisementElementPrice = advertisementElement.querySelector('.popup__text--price');
  const advertisementElementType = advertisementElement.querySelector('.popup__type');
  const advertisementElementCapacity = advertisementElement.querySelector('.popup__text--capacity');
  const advertisementElementTime = advertisementElement.querySelector('.popup__text--time');
  const advertisementElementFeacherList = advertisementElement.querySelector('.popup__features');
  const advertisementElementDescription = advertisementElement.querySelector('.popup__description');
  const advertisementElementPhotoList = advertisementElement.querySelector('.popup__photos');

  advertisementElementAvatar.src = point.author.avatar;

  //подстановка дефолтной картинки, если не загрузилась из данных - вынести в переменную
  advertisementElementAvatar.onerror = function(){
    advertisementElementAvatar.src = 'img/avatars/default.png';
  }

  advertisementElementTitle.textContent = point.offer.title;
  advertisementElementTextAddress.textContent = point.offer.address;
  advertisementElementPrice.innerHTML = point.offer.price + ' <span>₽/ночь</span>';
  advertisementElementType.textContent = OFFER_TYPE[point.offer.type];
  advertisementElementCapacity.textContent = point.offer.rooms + ' комнаты для ' + point.offer.guests + ' гостей';
  advertisementElementTime.textContent = 'Заезд после  ' + point.offer.checkin + ', выезд до ' + point.offer.checkout;

  //Очистка списка удобств
  while (advertisementElementFeacherList.firstChild) {
    advertisementElementFeacherList.removeChild(advertisementElementFeacherList.firstChild)
  }
  //наполнение списка удобств
  //проверка наличия списка удобств в данных
  if (point.offer.features !== undefined) {
    for (let j = 0 ; j < point.offer.features.length ; j++) {
      const feature = document.createElement('li');
      feature.classList.add('popup__feature', `popup__feature--${point.offer.features[j]}`)
      advertisementElementFeacherList.appendChild(feature);
    }
  }

  advertisementElementDescription.textContent = point.offer.description;

  //наполняем фотоальбом и удаляем 0 элемент, который из шаблона
  //проверка наличия списка фото в данных
  if (point.offer.photos !== undefined) {
    for (let j = 0; j < point.offer.photos.length ; j++) {
      const photoElement = advertisementElementPhotoList.children[0].cloneNode(true);
      photoElement.src = point.offer.photos[j];
      advertisementElementPhotoList.appendChild(photoElement);
    }
  }
  advertisementElementPhotoList.removeChild(advertisementElementPhotoList.children[0]);
  return advertisementElement;
}

export {printAdvertisements};
