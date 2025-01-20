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
    results: (propertyType, heatingType, duration, elephantEq, phoneEq, airplaneEq) =>
      `For a ${propertyType} with ${heatingType} heating over ${duration} hours:
      - Elephant weight equivalent: ${elephantEq} elephants
      - Phone charges: ${phoneEq} phones
      - Airplane travel: ${airplaneEq} km`,
    elephantAlt: 'Elephant weight equivalent',
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
    results: (propertyType, heatingType, duration, elephantEq, phoneEq, airplaneEq) =>
      `Pour une ${propertyType} avec un chauffage ${heatingType} pendant ${duration} heures :
      - Équivalent en poids d'éléphant : ${elephantEq} éléphants
      - Charges de téléphone : ${phoneEq} téléphones
      - Voyage en avion : ${airplaneEq} km`,
    elephantAlt: "Équivalent en poids d'éléphant",
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
    results: (propertyType, heatingType, duration, elephantEq, phoneEq, airplaneEq) =>
      `Para una ${propertyType} con calefacción ${heatingType} durante ${duration} horas:
      - Equivalente en peso de elefante: ${elephantEq} elefantes
      - Cargas de teléfono: ${phoneEq} teléfonos
      - Viaje en avión: ${airplaneEq} km`,
    elephantAlt: 'Equivalente en peso de elefante',
    phoneAlt: 'Cargas de teléfono equivalentes',
    airplaneAlt: 'Viaje en avión equivalente',
  },
};

export default translationsEICalculator;
