export function formatCurrency(number: number, locale: string = 'es-ES', currency: string = 'CLP') {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
    }).format(number);
}

interface PlaceComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

export function getFomattedPlace(place: {address_components:PlaceComponent[]} ){
  
}