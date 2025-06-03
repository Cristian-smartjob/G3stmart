import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { PreinvoicePDFData } from "@/utils/pdfUtils";

// Estilos para el PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 15,
    fontSize: 6,
  },
  topSection: {
    flexDirection: "row",
    marginBottom: 15,
  },
  leftColumn: {
    flex: 1,
    marginRight: 10,
  },
  rightColumn: {
    flex: 1,
    marginLeft: 10,
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  headerInfoContainer: {
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
  },
  headerInfoRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
  },
  headerInfoRowLast: {
    flexDirection: "row",
  },
  headerLabel: {
    flex: 2,
    fontSize: 8,
    fontWeight: "bold",
    padding: 4,
    textAlign: "left",
    borderRightWidth: 1,
    borderRightColor: "#000",
  },
  headerValue: {
    flex: 1,
    fontSize: 8,
    fontWeight: "bold",
    padding: 4,
    textAlign: "right",
    backgroundColor: "#ffff99",
  },
  instructionsContainer: {
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
    padding: 8,
    backgroundColor: "#fafafa",
  },
  instructionsTitle: {
    fontSize: 9,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  instructionItem: {
    fontSize: 6,
    marginBottom: 4,
    lineHeight: 1.3,
    textAlign: "justify",
  },
  tableContainer: {
    width: "100%",
  },
  table: {
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
  },
  tableRow: {
    margin: "auto",
    flexDirection: "row",
  },
  tableHeader: {
    backgroundColor: "#e0e0e0",
    fontWeight: "bold",
  },
  // Bordes comunes para todas las columnas
  commonBorders: {
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
    padding: 1,
  },
  // Columnas con anchos fijos optimizados para portrait (total: ~565 puntos)
  tableColXS: {
    width: 30, // RUT - aumentado de 24 a 30
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
    padding: 1,
  },
  tableColXXS: {
    width: 18, // Seniority - mantiene el tamaño original
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
    padding: 1,
  },
  tableColS: {
    width: 28, // País, Fechas, valores numéricos pequeños
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
    padding: 1,
  },
  tableColSPlus: {
    width: 34, // Valor Período CLP - aumentado de 28 a 34
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
    padding: 1,
  },
  tableColM: {
    width: 42, // Perfil/Cargo
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
    padding: 1,
  },
  tableColL: {
    width: 44, // Sistema/Proyecto - reducido de 50 a 44
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
    padding: 1,
  },
  tableColLPlus: {
    width: 50, // Nombre - mantiene un ancho adecuado
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
    padding: 1,
  },
  tableColXL: {
    width: 53, // Responsable de Proyecto - reducido de 59 a 53
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
    padding: 1,
  },
  tableColXXL: {
    width: 70, // Observaciones
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
    padding: 1,
  },
  tableCellHeader: {
    fontSize: 4.2,
    fontWeight: "bold",
    textAlign: "center",
    lineHeight: 0.9,
    paddingVertical: 0.5,
  },
  tableCell: {
    fontSize: 4,
    textAlign: "center",
    lineHeight: 1.1,
  },
  tableCellLeft: {
    fontSize: 4,
    textAlign: "left",
    lineHeight: 1.1,
  },
});

interface PreinvoicePDFProps {
  data: PreinvoicePDFData;
}

const PreinvoicePDF: React.FC<PreinvoicePDFProps> = ({ data }) => {
  // Validar que data existe y tiene las propiedades necesarias
  if (!data || !data.title || !data.details) {
    return (
      <Document>
        <Page size="A4" orientation="portrait" style={styles.page}>
          <View style={styles.topSection}>
            <Text style={styles.title}>Error: Datos insuficientes para generar PDF</Text>
          </View>
        </Page>
      </Document>
    );
  }

  return (
    <Document>
      <Page size="A4" orientation="portrait" style={styles.page}>
        {/* Top Section - Two Columns */}
        <View style={styles.topSection}>
          {/* Left Column - Title and Header Info */}
          <View style={styles.leftColumn}>
            <Text style={styles.title}>{data.title || "Detalle de prefactura"}</Text>

            <View style={styles.headerInfoContainer}>
              <View style={styles.headerInfoRow}>
                <Text style={styles.headerLabel}>UF VALOR</Text>
                <Text style={styles.headerValue}>{(data.ufValue || 0).toLocaleString("es-CL")}</Text>
              </View>
              <View style={styles.headerInfoRow}>
                <Text style={styles.headerLabel}>DÍAS HÁBILES DEL PERÍODO</Text>
                <Text style={styles.headerValue}>{data.workingDays || 0}</Text>
              </View>
              <View style={styles.headerInfoRowLast}>
                <Text style={styles.headerLabel}>Horas diarias</Text>
                <Text style={styles.headerValue}>{data.dailyHours || 0}</Text>
              </View>
            </View>
          </View>

          {/* Right Column - Instructions */}
          <View style={styles.rightColumn}>
            <View style={styles.instructionsContainer}>
              <Text style={styles.instructionsTitle}>Indicaciones de uso</Text>
              {(data.instructions || []).map((instruction, index) => (
                <Text key={index} style={styles.instructionItem}>
                  {index + 1}.- {instruction || ""}
                </Text>
              ))}
            </View>
          </View>
        </View>

        {/* Table Section */}
        <View style={styles.tableContainer}>
          <View style={styles.table}>
            {/* Table Header */}
            <View style={[styles.tableRow, styles.tableHeader]}>
              <View style={styles.tableColXS}>
                <Text style={styles.tableCellHeader}>Rut</Text>
              </View>
              <View style={styles.tableColLPlus}>
                <Text style={styles.tableCellHeader}>Nombre</Text>
              </View>
              <View style={styles.tableColS}>
                <Text style={styles.tableCellHeader}>País Residencia</Text>
              </View>
              <View style={styles.tableColM}>
                <Text style={styles.tableCellHeader}>Perfil/Cargo</Text>
              </View>
              <View style={styles.tableColXXS}>
                <Text style={styles.tableCellHeader}>Seniority</Text>
              </View>
              <View style={styles.tableColS}>
                <Text style={styles.tableCellHeader}>Fecha de ingreso</Text>
              </View>
              <View style={styles.tableColL}>
                <Text style={styles.tableCellHeader}>Sistema/Proyecto Asociado</Text>
              </View>
              <View style={styles.tableColXL}>
                <Text style={styles.tableCellHeader}>Responsable de Proyecto</Text>
              </View>
              <View style={styles.tableColS}>
                <Text style={styles.tableCellHeader}>Inasistencias del Período</Text>
              </View>
              <View style={styles.tableColS}>
                <Text style={styles.tableCellHeader}>Tipo de Inasistencia</Text>
              </View>
              <View style={styles.tableColS}>
                <Text style={styles.tableCellHeader}>Días trabajados</Text>
              </View>
              <View style={styles.tableColS}>
                <Text style={styles.tableCellHeader}>Equivalente Horas</Text>
              </View>
              <View style={styles.tableColS}>
                <Text style={styles.tableCellHeader}>TARIFA por Perfil/Cargo UF/HR</Text>
              </View>
              <View style={styles.tableColS}>
                <Text style={styles.tableCellHeader}>Valor Período UF/mes</Text>
              </View>
              <View style={styles.tableColSPlus}>
                <Text style={styles.tableCellHeader}>Valor Período CLP</Text>
              </View>
              <View style={styles.tableColXXL}>
                <Text style={styles.tableCellHeader}>Observaciones</Text>
              </View>
            </View>

            {/* Table Rows */}
            {(data.details || []).map((detail, index) => {
              // Validar y sanitizar cada valor antes de usarlo
              const safeDetail = {
                rut: detail?.rut || "N/A",
                name: detail?.name || "N/A",
                country: detail?.country || "N/A",
                profile: detail?.profile || "N/A",
                seniority: detail?.seniority || "N/A",
                startDate: detail?.startDate || "N/A",
                project: detail?.project || "N/A",
                projectManager: detail?.projectManager || "N/A",
                absences: Number(detail?.absences) || 0,
                absenceType: detail?.absenceType || "N/A",
                workedDays: Number(detail?.workedDays) || 0,
                equivalentHours: Number(detail?.equivalentHours) || 0,
                tariffUF: Number(detail?.tariffUF) || 0,
                periodValueUF: Number(detail?.periodValueUF) || 0,
                periodValueCLP: Number(detail?.periodValueCLP) || 0,
                observations: detail?.observations || "",
              };

              return (
                <View key={index} style={styles.tableRow}>
                  <View style={styles.tableColXS}>
                    <Text style={styles.tableCell}>{safeDetail.rut}</Text>
                  </View>
                  <View style={styles.tableColLPlus}>
                    <Text style={styles.tableCellLeft}>{safeDetail.name}</Text>
                  </View>
                  <View style={styles.tableColS}>
                    <Text style={styles.tableCell}>{safeDetail.country}</Text>
                  </View>
                  <View style={styles.tableColM}>
                    <Text style={styles.tableCellLeft}>{safeDetail.profile}</Text>
                  </View>
                  <View style={styles.tableColXXS}>
                    <Text style={styles.tableCell}>{safeDetail.seniority}</Text>
                  </View>
                  <View style={styles.tableColS}>
                    <Text style={styles.tableCell}>{safeDetail.startDate}</Text>
                  </View>
                  <View style={styles.tableColL}>
                    <Text style={styles.tableCellLeft}>{safeDetail.project}</Text>
                  </View>
                  <View style={styles.tableColXL}>
                    <Text style={styles.tableCellLeft}>{safeDetail.projectManager}</Text>
                  </View>
                  <View style={styles.tableColS}>
                    <Text style={styles.tableCell}>{safeDetail.absences}</Text>
                  </View>
                  <View style={styles.tableColS}>
                    <Text style={styles.tableCell}>{safeDetail.absenceType}</Text>
                  </View>
                  <View style={styles.tableColS}>
                    <Text style={styles.tableCell}>{safeDetail.workedDays}</Text>
                  </View>
                  <View style={styles.tableColS}>
                    <Text style={styles.tableCell}>{safeDetail.equivalentHours}</Text>
                  </View>
                  <View style={styles.tableColS}>
                    <Text style={styles.tableCell}>
                      {isFinite(safeDetail.tariffUF) ? safeDetail.tariffUF.toFixed(4) : "0.0000"}
                    </Text>
                  </View>
                  <View style={styles.tableColS}>
                    <Text style={styles.tableCell}>
                      {isFinite(safeDetail.periodValueUF) ? safeDetail.periodValueUF.toFixed(2) : "0.00"}
                    </Text>
                  </View>
                  <View style={styles.tableColSPlus}>
                    <Text style={styles.tableCell}>
                      ${isFinite(safeDetail.periodValueCLP) ? safeDetail.periodValueCLP.toLocaleString("es-CL") : "0"}
                    </Text>
                  </View>
                  <View style={styles.tableColXXL}>
                    <Text style={styles.tableCellLeft}>{safeDetail.observations}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default PreinvoicePDF;
