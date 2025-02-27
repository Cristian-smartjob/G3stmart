
interface Props {
    status: string;
}

const statusMap:{[key:string]: string} = {
    PENDING: "Pendiente",
    DOWNLOADED: "Descargada",
    REJECTED: "Rechazada",
    APPROVED: "Aprobada"
}

export default function Badge({ status }: Props){

    const getColor = () => {
        if(status === "PENDING"){
            return "gray"
        } else if(status === "REJECTED"){
            return "red"
        }

        return "green"
    }

    const color = getColor()


    return (
        <span className={
            `inline-flex items-center rounded-md bg-${color}-50 px-2 py-1 text-xs font-medium text-${color}-600 ring-1 ring-inset ring-${color}-500/10`
        }>
        {statusMap[status] || status}
      </span>
    )
}

