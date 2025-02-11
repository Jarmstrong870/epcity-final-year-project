const translations = {
    en: {
      title: 'Glossary of Terms',
      glossary: {
        'Basic Information': {
          address: { label: 'ADDRESS', description: 'Location of the property' },
          postcode: { label: 'POSTCODE', description: 'The postcode of the property' },
          'property-type': { label: 'PROPERTY TYPE', description: 'Describes the type of property such as House, Flat, Maisonette etc.' },
        },
        'Energy Performance': {
          'current-energy-rating': { label: 'CURRENT ENERGY RATING', description: 'Energy rating on a scale of A to G.' },
          'current-energy-efficiency': { label: 'CURRENT ENERGY EFFICIENCY', description: 'Energy efficiency based on cost of energy.' },
          'potential-energy-efficiency': { label: 'POTENTIAL ENERGY EFFICIENCY', description: 'The potential energy efficiency rating of the property.' },
          'main-heat-energy-efficiency': { label: 'MAIN HEAT ENERGY EFFICIENCY', description: 'Energy efficiency rating: very good to very poor.' },
        },
        'Cost Information': {
          'heating-cost': { label: 'HEATING COST', description: 'GBP. Current estimated annual energy costs for heating the property.' },
          'lighting-cost': { label: 'LIGHTING COST', description: 'GBP. Current estimated annual energy costs for lighting the property.' },
          'hot-water-cost': { label: 'HOT WATER COST', description: 'GBP. Current estimated annual energy costs for hot water.' },
        },
        'Property Details': {
          'construction-age-band': { label: 'CONSTRUCTION AGE BAND', description: 'Age band when building part constructed.' },
          'total-floor-area': { label: 'TOTAL FLOOR AREA', description: 'The total useful floor area of all enclosed spaces (m²).' },
          'number-heated-rooms': { label: 'NUMBER OF HEATED ROOMS', description: 'Number of heated rooms if more than half of habitable rooms are not heated.' },
          tenure: { label: 'TENURE', description: 'Describes the tenure type: Owner-occupied; Rented (social); Rented (private).' },
        },
      },
    },
    fr: {
      title: 'Glossaire des Termes',
      glossary: {
        'Informations de base': {
          address: { label: 'ADRESSE', description: 'Emplacement de la propriété' },
          postcode: { label: 'CODE POSTAL', description: 'Le code postal de la propriété' },
          'property-type': { label: 'TYPE DE PROPRIÉTÉ', description: 'Décrit le type de propriété tel que maison, appartement, maisonette, etc.' },
        },
        'Performance énergétique': {
          'current-energy-rating': { label: 'CLASSEMENT ÉNERGÉTIQUE ACTUEL', description: 'Classement énergétique potentiel sur une échelle de A à G.' },
          'current-energy-efficiency': { label: 'EFFICACITÉ ÉNERGÉTIQUE ACTUELLE', description: 'Basé sur le coût de l’énergie pour le chauffage, l’eau et l’éclairage.' },
          'potential-energy-efficiency': { label: 'EFFICACITÉ ÉNERGÉTIQUE POTENTIELLE', description: "L'efficacité énergétique potentielle de la propriété." },
          'main-heat-energy-efficiency': { label: 'EFFICACITÉ DE CHAUFFAGE PRINCIPAL', description: 'Classement : très bon à très médiocre.' },
        },
        'Informations sur les coûts': {
          'heating-cost': { label: 'COÛT DU CHAUFFAGE', description: 'GBP. Coût annuel estimé pour le chauffage.' },
          'lighting-cost': { label: 'COÛT DE L’ÉCLAIRAGE', description: 'GBP. Coût annuel estimé pour l’éclairage.' },
          'hot-water-cost': { label: "COÛT DE L'EAU CHAUDE", description: "GBP. Coût annuel estimé pour l'eau chaude." },
        },
        'Détails de la propriété': {
          'construction-age-band': { label: "PÉRIODE DE CONSTRUCTION", description: 'Période où la propriété a été construite.' },
          'total-floor-area': { label: 'SUPERFICIE TOTALE', description: 'Superficie totale utile de la propriété (m²).' },
          'number-heated-rooms': { label: 'NOMBRE DE PIÈCES CHAUFFÉES', description: 'Nombre de pièces chauffées dans la propriété.' },
          tenure: { label: 'TENURE', description: 'Type de tenure : Propriétaire; Loué (social); Loué (privé).' },
        },
      },
    },
    es: {
      title: 'Glosario de Términos',
      glossary: {
        'Información básica': {
          address: { label: 'DIRECCIÓN', description: 'Ubicación de la propiedad' },
          postcode: { label: 'CÓDIGO POSTAL', description: 'El código postal de la propiedad' },
          'property-type': { label: 'TIPO DE PROPIEDAD', description: 'Describe el tipo de propiedad, como casa, apartamento, etc.' },
        },
        'Rendimiento energético': {
          'current-energy-rating': { label: 'CLASIFICACIÓN ENERGÉTICA ACTUAL', description: 'Clasificación energética estimada en una escala de A a G.' },
          'current-energy-efficiency': { label: 'EFICIENCIA ENERGÉTICA ACTUAL', description: 'Basado en el coste de la energía para calefacción, agua y luz.' },
          'potential-energy-efficiency': { label: 'EFICIENCIA ENERGÉTICA POTENCIAL', description: 'La eficiencia energética potencial de la propiedad.' },
          'main-heat-energy-efficiency': { label: 'EFICIENCIA DE CALEFACCIÓN PRINCIPAL', description: 'Clasificación: muy buena a muy pobre.' },
        },
        'Información de costos': {
          'heating-cost': { label: 'COSTO DE CALEFACCIÓN', description: 'GBP. Costo anual estimado para calefacción.' },
          'lighting-cost': { label: 'COSTO DE ILUMINACIÓN', description: 'GBP. Costo anual estimado para iluminación.' },
          'hot-water-cost': { label: 'COSTO DE AGUA CALIENTE', description: 'GBP. Costo anual estimado para agua caliente.' },
        },
        'Detalles de la propiedad': {
          'construction-age-band': { label: 'PERÍODO DE CONSTRUCCIÓN', description: 'Período en que se construyó la propiedad.' },
          'total-floor-area': { label: 'SUPERFICIE TOTAL', description: 'Superficie total útil de la propiedad (m²).' },
          'number-heated-rooms': { label: 'NÚMERO DE HABITACIONES CALEFACCIONADAS', description: 'Número de habitaciones calefaccionadas en la propiedad.' },
          tenure: { label: 'TENENCIA', description: 'Tipo de tenencia: Propietario; Alquilado (social); Alquilado (privado).' },
        },
      },
    },

    pl: {
      title: 'Słownik Terminów',
      glossary: {
        'Podstawowe Informacje': {
          address: { label: 'ADRES', description: 'Lokalizacja nieruchomości' },
          postcode: { label: 'KOD POCZTOWY', description: 'Kod pocztowy nieruchomości' },
          'property-type': { label: 'RODZAJ NIERUCHOMOŚCI', description: 'Opisuje typ nieruchomości, np. Dom, Mieszkanie, Kamienica itp.' },
        },
        'Wydajność Energetyczna': {
          'current-energy-rating': { label: 'AKTUALNA OCENA ENERGETYCZNA', description: 'Ocena energetyczna w skali od A do G.' },
          'current-energy-efficiency': { label: 'AKTUALNA EFEKTYWNOŚĆ ENERGETYCZNA', description: 'Efektywność energetyczna oparta na kosztach energii.' },
          'potential-energy-efficiency': { label: 'POTENCJALNA EFEKTYWNOŚĆ ENERGETYCZNA', description: 'Potencjalna ocena efektywności energetycznej nieruchomości.' },
          'main-heat-energy-efficiency': { label: 'EFEKTYWNOŚĆ ENERGETYCZNA OGRZEWANIA', description: 'Ocena efektywności energetycznej: od bardzo dobrej do bardzo słabej.' },
        },
        'Informacje o Kosztach': {
          'heating-cost': { label: 'KOSZT OGRZEWANIA', description: 'GBP. Szacunkowe roczne koszty ogrzewania nieruchomości.' },
          'lighting-cost': { label: 'KOSZT OŚWIETLENIA', description: 'GBP. Szacunkowe roczne koszty oświetlenia nieruchomości.' },
          'hot-water-cost': { label: 'KOSZT CIEPŁEJ WODY', description: 'GBP. Szacunkowe roczne koszty ciepłej wody.' },
        },
        'Szczegóły Nieruchomości': {
          'construction-age-band': { label: 'OKRES BUDOWY', description: 'Okres, w którym część budynku została zbudowana.' },
          'total-floor-area': { label: 'CAŁKOWITA POWIERZCHNIA', description: 'Całkowita użytkowa powierzchnia wszystkich zamkniętych pomieszczeń (m²).' },
          'number-heated-rooms': { label: 'LICZBA OGRZEWANYCH POMIESZCZEŃ', description: 'Liczba ogrzewanych pomieszczeń, jeśli więcej niż połowa pokoi mieszkalnych nie jest ogrzewana.' },
          tenure: { label: 'FORMA WŁASNOŚCI', description: 'Opis formy własności: Własność; Wynajem (społeczny); Wynajem (prywatny).' },
        },
      },
    },
    zh: {
      title: '术语表',
      glossary: {
        '基本信息': {
          address: { label: '地址', description: '房产的位置' },
          postcode: { label: '邮政编码', description: '房产的邮政编码' },
          'property-type': { label: '房产类型', description: '描述房产类型，例如房屋、公寓、联排别墅等。' },
        },
        '能源性能': {
          'current-energy-rating': { label: '当前能源评级', description: '能源评级，范围从A到G。' },
          'current-energy-efficiency': { label: '当前能源效率', description: '基于能源成本的能源效率。' },
          'potential-energy-efficiency': { label: '潜在能源效率', description: '房产的潜在能源效率评级。' },
          'main-heat-energy-efficiency': { label: '主要供暖能源效率', description: '能源效率评级：非常好到非常差。' },
        },
        '费用信息': {
          'heating-cost': { label: '供暖费用', description: '英镑。房产供暖的年度预估能源费用。' },
          'lighting-cost': { label: '照明费用', description: '英镑。房产照明的年度预估能源费用。' },
          'hot-water-cost': { label: '热水费用', description: '英镑。热水的年度预估能源费用。' },
        },
        '房产详情': {
          'construction-age-band': { label: '建筑年代段', description: '建筑部分建造的年代段。' },
          'total-floor-area': { label: '总建筑面积', description: '所有封闭空间的总有效使用面积（平方米）。' },
          'number-heated-rooms': { label: '供暖房间数量', description: '如果超过一半的居住房间未供暖，显示供暖房间的数量。' },
          tenure: { label: '产权形式', description: '描述产权类型：自住；出租（社会）；出租（私人）。' },
        },
      },
    },
  

  };
  
  export default translations;
  