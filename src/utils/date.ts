export function calcularDiasHabiles(fechaInicio: Date, fechaFin: Date): number {

    if (fechaInicio > fechaFin) {
        [fechaInicio, fechaFin] = [fechaFin, fechaInicio]; 
    }

    const diasTotales = Math.floor((fechaFin.getTime() - fechaInicio.getTime()) / (1000 * 3600 * 24)) + 1;

    let diasDeFinDeSemana = 0;

    for (let i = 0; i < diasTotales; i++) {
        const diaActual = new Date(fechaInicio);
        diaActual.setDate(fechaInicio.getDate() + i);
        const diaSemana = diaActual.getDay();

        if (diaSemana === 0 || diaSemana === 6) {
            diasDeFinDeSemana++;
        }
    }

    return diasTotales - diasDeFinDeSemana;
}

export function getBillableDate(year: number, month: number, date: number){
    const current = new Date(year, month, 1)
    const nextMonth = new Date(year, month  + 1, 0);
    current.setDate(Math.min(date, nextMonth.getDate()))
    current.setHours(0)
    current.setSeconds(0)
    current.setMinutes(0)
    return current
}

