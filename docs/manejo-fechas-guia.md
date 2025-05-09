# Guía de manejo de fechas en la aplicación

## Introducción

Esta guía documenta las mejores prácticas y soluciones implementadas para el manejo de fechas en la aplicación, especialmente relacionadas con el valor de UF y las fechas de facturación.

## Problemas detectados

Se identificaron los siguientes problemas en el manejo de fechas:

1. **Inconsistencias en zonas horarias**: Algunas fechas se convertían a la zona horaria local causando discrepancias, especialmente entre el día de facturación (30) y el día mostrado para la UF (29).

2. **Diferencias en la creación de fechas**: Algunas fechas se creaban con `new Date()` estándar y otras con métodos personalizados, causando inconsistencias.

3. **Problemas con rangos de consulta**: Las fechas usadas para consultar valores de UF no consideraban el día completo en UTC.

4. **Huecos en datos de UF**: Frecuentemente faltan valores de UF para días específicos (especialmente fines de semana y feriados), lo que causa problemas cuando el día de facturación cae en uno de estos días sin datos.

## Soluciones implementadas

### 1. Funciones de utilidad estandarizadas

Se creó un conjunto de funciones en `src/utils/date.ts`:

- `calcularDiasHabiles`: Calcula días hábiles usando UTC para evitar problemas de zona horaria
- `getBillableDate`: Obtiene fecha facturable usando UTC
- `formatearFechaChile`: Genera fechas en formato chileno
- `fechaToISOString`: Convierte fechas a formato ISO de manera consistente
- `crearRangoFechaUTC`: Genera rangos de fecha precisos en UTC
- `corregirFechaVisualizacionUF`: Corrige fechas para su visualización

### 2. Uso consistente de UTC

Se modificaron todas las manipulaciones de fecha para usar UTC consistentemente:

```typescript
// Antes
const date = new Date(year, month, day);

// Después
const date = new Date(Date.UTC(year, month, day, 12, 0, 0));
```

El uso de UTC + mediodía (12:00) evita problemas de cambio de día por zonas horarias.

### 3. Correción en la visualización de fechas

Se implementó una lógica específica para corregir la visualización de fechas de UF, especialmente relevante en días de fin de mes (29, 30, 31) o cuando faltan datos para el día exacto de facturación:

```typescript
// Corrige la fecha según el día de facturación
const fechaCorrecta = corregirFechaVisualizacionUF(fecha, diaFacturacion);
```

La función `corregirFechaVisualizacionUF` maneja varios casos especiales:
- Fechas exactas que coinciden con el día de facturación
- Fechas cercanas (dentro de 5 días) al día de facturación
- Casos de fin de mes vs inicio de mes siguiente
- Otras situaciones especiales

### 4. Búsqueda mejorada de valores de UF

Se implementó una estrategia robusta para buscar valores de UF:

1. **Búsqueda con aproximación**: Busca el valor de UF para el día de facturación o el día anterior más cercano si no existe valor exacto
2. **Ajuste de visualización**: Siempre muestra la fecha del día de facturación, aunque internamente use un valor de otro día
3. **Manejo de fines de semana y huecos**: Implementación específica para casos donde faltan varios días de datos
4. **Fallback a valores anteriores**: Sistema de respaldo para garantizar que siempre haya un valor disponible

## Casos especiales manejados

### Días faltantes
Cuando no hay valores para días específicos (por ejemplo, el día 20 de abril falta y solo hay datos para el 17 y el 21), el sistema:
1. Busca la UF más reciente anterior (17 de abril)
2. Usa ese valor de UF para los cálculos
3. Muestra la fecha como "20 de abril" para mantener coherencia con el día de facturación

### Fines de semana y feriados
Se implementa una lógica específica para detectar si la fecha de facturación cae en un fin de semana o feriado, buscando automáticamente el último día hábil anterior.

### Cambios de mes
Se manejan casos especiales donde el día de facturación está cerca del fin de mes pero el valor de UF disponible pertenece al principio del mes siguiente.

## Buenas prácticas para el manejo de fechas

1. **Usar siempre UTC para almacenamiento y cálculos**
   ```typescript
   const fecha = new Date(Date.UTC(year, month, day, 12, 0, 0));
   ```

2. **Formatear fechas solo en el momento de visualización**
   ```typescript
   fecha.toLocaleDateString('es-CL');
   ```

3. **Usar funciones de utilidad para operaciones comunes**
   ```typescript
   const isoDate = fechaToISOString(fecha);
   const rango = crearRangoFechaUTC(fecha);
   ```

4. **Para consultas de base de datos, usar estrategias de aproximación**
   ```typescript
   where: {
     date: {
       lte: targetDate // Buscar fecha exacta o anterior más cercana
     },
     orderBy: { date: 'desc' },
     limit: 1
   }
   ```

5. **Al trabajar con días específicos (ej. facturación), verificar si coinciden con fin de semana o si faltan datos**

6. **Para valores de UF, considerar tanto la fecha como el valor, manteniendo la fecha de facturación en la UI**

## Archivos actualizados

1. `src/utils/date.ts` - Nuevas funciones de utilidad con casos especiales
2. `src/app/actions/preInvoices.ts` - Función getAppropriateUFValue mejorada para manejar huecos en datos
3. `src/components/pages/PreinvoceDetail.tsx` - Visualización de fechas
4. `src/app/api/currency-history/update/route.ts` - Actualización de UF

## Conclusión

Estas mejoras garantizan un manejo consistente de fechas en toda la aplicación, especialmente para los valores de UF y fechas de facturación, evitando discrepancias visuales y errores de cálculo, incluso en casos donde faltan datos para días específicos. 