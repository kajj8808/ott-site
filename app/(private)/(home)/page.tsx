import Image from "next/image";
import db from "../../../prisma/client";
async function getSeriesList() {
  const seriesList = await db.series.findMany({
    take: 9,
    orderBy: {
      updated_at: "desc",
    },
  });
  return seriesList;
}

export default async function Home() {
  const seriesList = await getSeriesList();

  return (
    <section className="p-8">
      <div>
        <h2 className="text-xs opacity-70">Series</h2>
        <h3 className="font-semibold text-xl">최근 업데이트 된 애니메이션</h3>
      </div>
      <div className="grid grid-cols-2 gap-6 mt-2">
        {seriesList.map((series) => (
          <div
            key={series.id}
            className="rounded-md flex flex-col gap-1 relative group"
          >
            <div className="overflow-hidden rounded-md">
              <Image
                width={320}
                height={160}
                src={series.poster_path!}
                alt={`${series.title}-backdrop`}
              />
            </div>
            <div className="absolute flex w-full h-full justify-center items-center group-hover:opacity-100 opacity-0 transition-all text-white p-5 bg-black/60">
              {series.overview.slice(0, 120)}
            </div>

            <div className="absolute top-0 h-full w-full bg-gradient-to-b from-black/50 via-transparent to-transparent" />
            <div className="absolute bottom-0 flex h-full w-full items-end bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            <div className="absolute bottom-0 p-3 flex-col w-full h-full">
              <span className="text-sm font-semibold">{series.title}</span>
              <div className="flex justify-between py-1">
                <span className="text-xs opacity-80">시즌2 2화</span>
              </div>
            </div>
            <span className="text-xs opacity-80 absolute bottom-0 p-3 right-0">
              1일전
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
