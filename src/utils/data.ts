export function formatCurrency(number: number, locale: string = "es-ES", currency: string = "CLP") {
  // Si el valor es muy pequeño (menor a 1000), probablemente es UF
  if (number < 1000 && currency === "UF") {
    return `${number.toFixed(2)} UF`;
  } else if (number < 1000 && currency === "CLP") {
    // Para valores pequeños en CLP usamos formato normal
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: "CLP",
    }).format(number);
  }
  
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency === "UF" ? "CLP" : currency, // UF no es un código de moneda válido para Intl.NumberFormat
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
