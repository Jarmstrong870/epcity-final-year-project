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
  };
  
  export default translationsEICalculator;
  