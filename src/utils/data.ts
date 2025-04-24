export function formatCurrency(number: number, locale: string = "es-ES", currency: string = "CLP") {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(number);
}

/**
 * Formatea un número a formato de moneda con separadores de miles
 * @param value - Valor numérico a formatear
 * @returns Cadena de texto formateada con signo peso y separadores de miles
 */
export function formatToMoneyString(value: number | null): string {
  if (value === null) return "";
  return "$" + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// interface PlaceComponent {
//   long_name: string;
//   short_name: string;
//   types: string[];
// }

// export function getFomattedPlace(place: { address_components: PlaceComponent[] }) {}
