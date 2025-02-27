import { Client } from "@/interface/common";

export function filterClient( clients: Client[], query: string): Client[]{
    const normalizeQuery = query.normalize().toLocaleLowerCase()
    return clients.filter(item => 
        item.name.normalize().toLocaleLowerCase().indexOf(normalizeQuery) >= 0
   )
}