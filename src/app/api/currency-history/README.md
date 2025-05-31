# Currency History API Endpoints

Esta documentación describe los endpoints disponibles para manejar el historial de valores de monedas (UF y USD).

## Endpoints Disponibles

### 1. Actualización UF por Años Completos (Optimizado)

**POST** `/api/currency-history/update/uf`

Actualiza valores UF consultando y guardando años completos desde mindicador.cl

#### Parámetros (Body JSON - Opcional)

```json
{
  "monthsForward": 6 // Determina qué años consultar (0-24, default: 2)
}
```

#### Estrategia de Consulta

- **Años completos**: Consulta `https://mindicador.cl/api/uf/{yyyy}` para obtener todo el año
- **Guardado completo**: Guarda TODOS los valores del año en la base de datos (sin filtrar)
- **Determinación inteligente**: `monthsForward` solo determina qué años consultar (año actual + año siguiente si es necesario)
- **Transacciones batch**: Procesa múltiples registros en transacciones para mejor rendimiento
- **Upsert optimizado**: Inserta nuevos registros o actualiza existentes según sea necesario

#### Lógica de Años a Consultar

```javascript
// monthsForward = 2 → Solo año actual (2025)
// monthsForward = 8 → Año actual + siguiente (2025, 2026)
const today = new Date();
const cutoffDate = addMonths(today, monthsForward);
const years = [today.getFullYear()];
if (cutoffDate.getFullYear() > today.getFullYear()) {
  years.push(cutoffDate.getFullYear());
}
```

#### Ejemplo de Uso

```bash
# Actualizar solo año actual (2025)
curl -X POST http://localhost:3000/api/currency-history/update/uf \
  -H "Content-Type: application/json" \
  -d '{"monthsForward": 2}'

# Actualizar año actual + siguiente (2025, 2026)
curl -X POST http://localhost:3000/api/currency-history/update/uf \
  -H "Content-Type: application/json" \
  -d '{"monthsForward": 8}'

# Usar valor por defecto (solo año actual)
curl -X POST http://localhost:3000/api/currency-history/update/uf
```

#### Respuesta Exitosa

```json
{
  "success": true,
  "message": "Actualización UF completada - años completos guardados en base de datos",
  "summary": {
    "monthsForward": 6,
    "yearsProcessed": 1,
    "totalInserted": 160,
    "totalUpdated": 0,
    "totalSkipped": 0,
    "totalErrors": 0,
    "dateRange": {
      "minDate": "2025-01-01",
      "maxDate": "2025-12-31"
    },
    "processedYears": ["2025"],
    "errorYears": undefined
  }
}
```

#### Ventajas de la Nueva Estrategia

- **🚀 Más rápido**: 1-2 requests vs múltiples requests mensuales
- **📊 Datos completos**: Guarda todo el año disponible en la API
- **🔄 Transaccional**: Procesa en lotes para mejor consistencia
- **📈 Escalable**: Determina automáticamente qué años necesita
- **🎯 Eficiente**: Una sola consulta por año completo

### 2. Actualización USD Diaria

**POST** `/api/currency-history/update/usd`

Actualiza el valor USD del día actual desde mindicador.cl

#### Ejemplo de Uso

```bash
curl -X POST http://localhost:3000/api/currency-history/update/usd
```

#### Respuesta Exitosa

```json
{
  "success": true,
  "message": "Valor USD actualizado",
  "data": {
    "date": "17-01-2025",
    "usdValue": 1010.68,
    "action": "updated",
    "previousValue": 1008.5
  }
}
```

### 3. Consulta UF por Mes (Debugging)

**GET** `/api/currency-history/uf/month/:yyyy-MM`

Obtiene todos los valores UF de un mes específico con estadísticas

#### Parámetros

- `yyyy-MM`: Año y mes en formato YYYY-MM (ej: 2025-06)

#### Ejemplo de Uso

```bash
curl http://localhost:3000/api/currency-history/uf/month/2025-01
```

#### Respuesta Exitosa

```json
{
  "success": true,
  "data": {
    "month": "2025-01",
    "year": 2025,
    "monthNum": 1,
    "statistics": {
      "totalDays": 31,
      "daysInMonth": 31,
      "missingDays": 0,
      "completeness": "100.0%",
      "minUF": 38421.65,
      "maxUF": 38438.98,
      "avgUF": 38430.12
    },
    "values": [
      {
        "date": "2025-01-01",
        "uf": 38421.65,
        "created_at": "2025-01-17T10:30:00.000Z",
        "updated_at": "2025-01-17T10:30:00.000Z"
      }
      // ... más valores
    ]
  }
}
```

### 4. Endpoints Existentes

#### Obtener Último Valor

**GET** `/api/currency-history/latest`

Obtiene los valores más recientes de UF y USD.

#### Actualización Completa (Legacy)

**POST** `/api/currency-history/update`

Actualiza valores faltantes desde la última fecha hasta hoy (UF y USD juntos).

## Características Técnicas

### Optimizaciones de la Nueva Estrategia UF

#### Consulta por Años Completos

```javascript
// Estrategia actual (optimizada)
GET / api / uf / 2025; // 365 valores completos del año
GET / api / uf / 2026; // 365 valores completos del año (si es necesario)
// = 1-2 requests, datos completos del año

// Se guarda TODO en la base de datos, sin filtros
```

#### Determinación Inteligente de Años

```javascript
function getYearsToFetch(monthsForward) {
  const today = new Date();
  const cutoffDate = addMonths(today, monthsForward);

  const years = [today.getFullYear()]; // Siempre año actual
  if (cutoffDate.getFullYear() > today.getFullYear()) {
    years.push(cutoffDate.getFullYear()); // Agregar año siguiente si es necesario
  }
  return years;
}
```

#### Procesamiento Completo

```javascript
// Se procesan TODOS los valores del año
await prisma.$transaction(async () => {
  for (const day of yearData.serie) {
    // Sin filtros
    await upsertUFRecord(day.fecha, day.valor);
  }
});
```

### Manejo de Errores

- **Tolerancia a fallos**: Los errores por años futuros no causan crash
- **Logging detallado**: Cada operación se registra en consola
- **Validación de datos**: Se verifican valores antes de insertar
- **Timeouts extendidos**: 15 segundos para años completos

### Casos de Uso

#### Actualización Programada

```bash
# Cron job diario para USD
0 9 * * 1-5 curl -X POST http://localhost:3000/api/currency-history/update/usd

# Cron job mensual para UF (año actual + siguiente)
0 8 1 * * curl -X POST http://localhost:3000/api/currency-history/update/uf \
  -H "Content-Type: application/json" -d '{"monthsForward": 12}'
```

#### Debugging y Monitoreo

```bash
# Verificar completitud de enero 2025
curl http://localhost:3000/api/currency-history/uf/month/2025-01

# Verificar valores futuros
curl http://localhost:3000/api/currency-history/uf/month/2025-06
```

## Migración y Compatibilidad

### Cambios en la API UF

- ✅ **Endpoint**: Mismo endpoint `/api/currency-history/update/uf`
- ✅ **Parámetros**: Mismos parámetros de entrada
- ✅ **Respuesta**: Estructura similar con campos adicionales
- 🆕 **Comportamiento**: Ahora guarda años completos en lugar de filtrar
- 🆕 **Rendimiento**: 3-5x más rápido
- 🆕 **Capacidad**: Hasta 24 meses para determinar años

### Nuevos Campos en Respuesta

```json
{
  "summary": {
    "totalSkipped": 23, // Registros omitidos (ya existían)
    "dateRange": {
      // Rango completo del año procesado
      "minDate": "2025-01-01",
      "maxDate": "2025-12-31"
    },
    "yearsProcessed": ["2025"] // Años consultados y guardados
  }
}
```

### Beneficios de la Migración

- ✅ **Datos completos**: Guarda todo el año disponible
- ✅ **Velocidad**: Reducción significativa en tiempo de respuesta
- ✅ **Confiabilidad**: Menos requests = menos puntos de falla
- ✅ **Simplicidad**: No hay filtros complejos de fechas
- ✅ **Eficiencia**: Menos carga en la API externa
- ✅ **Flexibilidad**: Los datos están disponibles para cualquier fecha del año

La nueva implementación mantiene compatibilidad total mientras ofrece mejoras significativas en rendimiento y completitud de datos.
