# Componente PDF para Prefacturas

Este documento describe cómo usar el componente PDF para generar reportes de prefacturas en formato PDF.

## 🛠️ Tecnologías utilizadas

- **Framework**: Next.js App Router
- **Lenguaje**: TypeScript
- **Librería PDF**: @react-pdf/renderer
- **Estilo visual**: Basado en el formato de "Detalle de prefactura"

## 📁 Archivos creados

### Componentes principales:

- `src/components/pdf/PreinvoicePDF.tsx` - Componente principal para generar el PDF
- `src/components/buttons/PDFDownloadButton.tsx` - Botón de descarga PDF
- `src/utils/pdfUtils.ts` - Utilidades para transformar datos

### Funciones de backend:

- `src/app/actions/preInvoices.ts` - Función `fetchPreInvoiceWithDetails()` para obtener datos completos

## 🚀 Uso del componente

### Botón de descarga PDF (ya integrado)

El botón PDF ya está integrado en la tabla de prefacturas (`/preinvoice`). Cada fila tiene un botón verde "PDF" que:

1. Obtiene los datos completos de la prefactura
2. Transforma los datos al formato requerido
3. Genera y descarga el PDF automáticamente

### Uso programático

```tsx
import { PDFDownloadLink } from "@react-pdf/renderer";
import PreinvoicePDF from "@/components/pdf/PreinvoicePDF";
import { transformPreinvoiceDataToPDF } from "@/utils/pdfUtils";

// Ejemplo de uso directo
<PDFDownloadLink document={<PreinvoicePDF data={pdfData} />} fileName="prefactura_cliente_mes_año.pdf">
  {({ loading }) => (loading ? "Generando PDF..." : "Descargar PDF")}
</PDFDownloadLink>;
```

### Uso del botón reutilizable

```tsx
import PDFDownloadButton from "@/components/buttons/PDFDownloadButton";

<PDFDownloadButton preInvoiceId={123} preInvoice={preInvoiceData} className="custom-button-class">
  Descargar PDF
</PDFDownloadButton>;
```

## 📊 Estructura del PDF generado

### Cabecera

- **Título**: "Detalle de prefactura a [Mes] -[Año]"
- **Información superior**:
  - UF VALOR: Valor de la UF utilizada
  - DÍAS HÁBILES DEL PERÍODO: Días trabajables del mes
  - Horas diarias: Horas de trabajo por día

### Tabla principal

Contiene 16 columnas con la siguiente información:

- Rut
- Nombre
- País Residencia
- Perfil/Cargo
- Seniority
- Fecha de ingreso
- Sistema/Proyecto Asociado
- Responsable de Proyecto
- Inasistencias del Período
- Tipo de Inasistencia
- Días trabajados
- Equivalente Horas
- TARIFA por Perfil/Cargo UF/HR
- Valor Período UF/mes
- Valor Período CLP
- Observaciones

### Panel lateral

**"Indicaciones de uso"** con instrucciones predeterminadas:

1. Ingresar todos los profesionales que trabajaron durante el período indicado
2. Las columnas L y M pueden ser variables según el tipo de contrato
3. Los valores en UF se calculan automáticamente según la tarifa por hora
4. Verificar que los días trabajados coincidan con el período facturado
5. Las inasistencias deben estar debidamente justificadas
6. Revisar que todos los datos estén completos antes de generar la factura

## 🔧 Configuración y personalización

### Modificar valores por defecto

En `src/utils/pdfUtils.ts`:

```typescript
const transformedData = transformPreinvoiceDataToPDF(
  preInvoice,
  37000, // Valor UF por defecto
  22, // Días hábiles por defecto
  8 // Horas diarias por defecto
);
```

### Personalizar estilos

Los estilos del PDF se encuentran en `src/components/pdf/PreinvoicePDF.tsx` en el objeto `styles`. Puedes modificar:

- Tamaños de fuente
- Colores
- Espaciado
- Bordes de tabla
- Layout general

### Modificar instrucciones

En `src/utils/pdfUtils.ts`, modifica el array `instructions`:

```typescript
const instructions = [
  "Tu instrucción personalizada 1",
  "Tu instrucción personalizada 2",
  // ...
];
```

## 📝 Formato del archivo generado

- **Formato**: PDF
- **Orientación**: Horizontal (Landscape)
- **Tamaño**: A4
- **Nombre del archivo**: `prefactura_[cliente]_[mes]_[año].pdf`

## 🔍 Datos incluidos

El PDF incluye automáticamente:

- ✅ Información del cliente y contacto
- ✅ Detalles de cada persona/smarter asignado
- ✅ Cálculos automáticos de valores UF y CLP
- ✅ Días trabajados y ausencias
- ✅ Tarifas por hora y valores del período
- ✅ Conversión automática entre UF y CLP

## 🚨 Consideraciones importantes

1. **Datos requeridos**: La prefactura debe tener detalles asociados para generar el PDF
2. **Valor UF**: Se usa el valor UF almacenado en la prefactura o un valor por defecto
3. **Rendimiento**: Los datos se cargan bajo demanda al hacer clic en el botón PDF
4. **Compatibilidad**: Funciona en todos los navegadores modernos
5. **Responsive**: El PDF se genera correctamente en formato A4

## 🐛 Solución de problemas

### Error: "No se pueden obtener los detalles"

- Verificar que la prefactura tenga detalles asociados
- Revisar que la función `fetchPreInvoiceWithDetails()` funcione correctamente

### PDF vacío o con datos faltantes

- Verificar que los datos de la prefactura estén completos
- Revisar la función `transformPreinvoiceDataToPDF()` para mapeo de campos

### Errores de estilo en el PDF

- Verificar que los estilos en `PreinvoicePDF.tsx` sean válidos para @react-pdf/renderer
- No todos los estilos CSS son compatibles con la librería PDF

## 📚 Referencias

- [Documentación de @react-pdf/renderer](https://react-pdf.org/)
- [Guía de estilos para PDFs](https://react-pdf.org/styling)
- [API de Next.js App Router](https://nextjs.org/docs/app)
