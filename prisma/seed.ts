import { PrismaClient } from "@prisma/client";
import axios from "axios";

const prisma = new PrismaClient();

type SerieItem = {
  fecha: string;
  valor: number;
};

async function fetchYearData(tipo: string, year: number): Promise<SerieItem[]> {
  const res = await axios.get(`https://mindicador.cl/api/${tipo}/${year}`);
  return res.data.serie as SerieItem[];
}

async function main() {
  const startYear = 2024;
  const endYear = new Date().getFullYear();
  const allData: Record<string, { uf?: number; usd?: number }> = {};

  for (let year = startYear; year <= endYear; year++) {
    const ufSerie = await fetchYearData("uf", year);
    const usdSerie = await fetchYearData("dolar", year);
    ufSerie.forEach((item) => {
      const date = item.fecha.substring(0, 10);
      if (!allData[date]) allData[date] = {};
      allData[date].uf = item.valor;
    });
    usdSerie.forEach((item) => {
      const date = item.fecha.substring(0, 10);
      if (!allData[date]) allData[date] = {};
      allData[date].usd = item.valor;
    });
  }

  for (const [date, values] of Object.entries(allData)) {
    if (values.uf !== undefined && values.usd !== undefined) {
      await prisma.currencyHistory.upsert({
        where: { date: new Date(date) },
        update: { uf: values.uf, usd: values.usd },
        create: {
          date: new Date(date),
          uf: values.uf,
          usd: values.usd,
        },
      });
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
