async function getSeriesDetail(seriesId: string) {
  console.log(
    `${process.env.NEXT_PUBLIC_MEDIA_SERVER_URL}/api/series/${seriesId}`
  );
  const json = await (
    await fetch(
      `${process.env.NEXT_PUBLIC_MEDIA_SERVER_URL}/api/series/${seriesId}`
    )
  ).json();
  console.log(json);
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await getSeriesDetail(id);
  return (
    <div>
      <h3></h3>
    </div>
  );
}
