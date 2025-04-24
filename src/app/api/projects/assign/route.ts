import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const assignmentData = await request.json();
    
    // Implementar un endpoint para asignar personas a proyectos
    // Dado que no hay una relación directa en el esquema, aquí habría que:
    // 1. Crear una tabla de asignación (AssignedProjects) o
    // 2. Utilizar otra estrategia como agregar proyecto_id a la tabla People
    
    // Como solución temporal, solo devolvemos los datos recibidos
    // En un entorno real, necesitarías adaptar esto según tu esquema
    return NextResponse.json(
      { 
        success: true, 
        message: "Proyecto asignado correctamente (simulado)",
        data: assignmentData 
      }, 
      { status: 200 }
    );
  } catch (error) {
    console.error("Error assigning project:", error);
    return NextResponse.json(
      { message: "Error assigning project" },
      { status: 500 }
    );
  }
} 