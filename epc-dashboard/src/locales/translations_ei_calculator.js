const translationsEICalculator = {
  en: {
    title: 'Environmental Impact Calculator',
    propertyType: 'Property Type',
    heatingType: 'Heating Type',
    duration: 'Heating Duration (hours)',
    placeholder: 'Enter hours',
    select: 'Select',
    house: 'House',
    flat: 'Flat',
    bungalow: 'Bungalow',
    electric: 'Electric',
    gas: 'Gas',
    calculateButton: 'Process Results',
    invalidInput: 'Invalid inputs. Please ensure property type and heating type are correct.',
    results: (propertyType, heatingType, duration, chargePhoneIcon, gandpicon) =>
      `For a ${propertyType} with ${heatingType} heating over ${duration} hours:
      - Phone charges: ${chargePhoneIcon} phones
      - Distance travel: ${gandpicon} km`,
    phoneAlt: 'Phone charges equivalent',
    airplaneAlt: 'Airplane travel equivalent',
  },
  fr: {
    title: "Calculateur d'Impact Environnemental",
    propertyType: 'Type de Propriété',
    heatingType: 'Type de Chauffage',
    duration: 'Durée du Chauffage (heures)',
    placeholder: 'Entrez les heures',
    select: 'Sélectionner',
    house: 'Maison',
    flat: 'Appartement',
    bungalow: 'Bungalow',
    electric: 'Électrique',
    gas: 'Gaz',
    calculateButton: 'Traiter les Résultats',
    invalidInput: 'Entrées invalides. Veuillez vérifier le type de propriété et de chauffage.',
    results: (propertyType, heatingType, duration, chargePhoneIcon, gandpicon) =>
      `Pour une ${propertyType} avec un chauffage ${heatingType} pendant ${duration} heures :
      - Charges de téléphone : ${chargePhoneIcon} téléphones
      - Voyage en avion : ${gandpicon} km`,
    phoneAlt: 'Charges de téléphone équivalentes',
    airplaneAlt: "Voyage en avion équivalent",
  },
  es: {
    title: 'Calculadora de Impacto Ambiental',
    propertyType: 'Tipo de Propiedad',
    heatingType: 'Tipo de Calefacción',
    duration: 'Duración de la Calefacción (horas)',
    placeholder: 'Ingrese horas',
    select: 'Seleccionar',
    house: 'Casa',
    flat: 'Apartamento',
    bungalow: 'Bungalow',
    electric: 'Eléctrico',
    gas: 'Gas',
    calculateButton: 'Procesar Resultados',
    invalidInput: 'Entradas inválidas. Asegúrese de que el tipo de propiedad y calefacción sean correctos.',
    results: (propertyType, heatingType, duration, chargePhoneIcon, gandpicon) =>
      `Para una ${propertyType} con calefacción ${heatingType} durante ${duration} horas:
      - Cargas de teléfono: ${chargePhoneIcon} teléfonos
      - Viaje en avión: ${gandpicon} km`,
    phoneAlt: 'Cargas de teléfono equivalentes',
    airplaneAlt: 'Viaje en avión equivalente',
  },
  pl: {
    title: 'Kalkulator Wpływu na Środowisko',
    propertyType: 'Rodzaj Nieruchomości',
    heatingType: 'Rodzaj Ogrzewania',
    duration: 'Czas Ogrzewania (godziny)',
    placeholder: 'Wprowadź godziny',
    select: 'Wybierz',
    house: 'Dom',
    flat: 'Mieszkanie',
    bungalow: 'Bungalow',
    electric: 'Elektryczne',
    gas: 'Gazowe',
    calculateButton: 'Przetwórz Wyniki',
    invalidInput: 'Nieprawidłowe dane. Upewnij się, że rodzaj nieruchomości i ogrzewania są poprawne.',
    results: (propertyType, heatingType, duration, chargePhoneIcon, gandpicon) =>
      `Dla ${propertyType} z ogrzewaniem ${heatingType} przez ${duration} godzin:
      - Liczba naładowanych telefonów: ${chargePhoneIcon}
      - Przebyta odległość: ${gandpicon} km`,
    phoneAlt: 'Odpowiednik ładowania telefonu',
    airplaneAlt: 'Odpowiednik podróży samolotem',
  },
  zh: {
    title: '环境影响计算器',
    propertyType: '房产类型',
    heatingType: '供暖类型',
    duration: '供暖时长（小时）',
    placeholder: '输入小时数',
    select: '选择',
    house: '房子',
    flat: '公寓',
    bungalow: '平房',
    electric: '电',
    gas: '燃气',
    calculateButton: '处理结果',
    invalidInput: '输入无效。请确保房产类型和供暖类型正确。',
    results: (propertyType, heatingType, duration, chargePhoneIcon, gandpicon) =>
      `对于 ${propertyType} 使用 ${heatingType} 供暖 ${duration} 小时：
      - 相当于充电的手机数量：${chargePhoneIcon} 部
      - 相当于旅行的距离：${gandpicon} 公里`,
    phoneAlt: '等效的手机充电次数',
    airplaneAlt: '等效的飞机旅行距离',
  }
};

export default translationsEICalculator;
