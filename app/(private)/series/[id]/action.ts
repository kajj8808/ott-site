export interface Episode {
  overview: string;
  name: string;
  episode_number: number;
  video_content_id: number;
  still_path: string;
  runtime: number;
  updated_at: string;
}
export interface Season {
  name: string;
  episodes: Episode[];
  source_type: string;
  updated_at: string;
}
interface SeriesResponse {
  ok: boolean;
  series: {
    title: string;
    overview: string;
    backdrop_path: string;
    updated_at: string;
    season: Season[];
  };
}
export async function getSeriesDetail(seriesId: string) {
  const json = (await (
    await fetch(
      `${process.env.NEXT_PUBLIC_MEDIA_SERVER_URL}/api/series/${seriesId}`
    )
  ).json()) as SeriesResponse;

  if (json.ok) {
    console.log(json.series.season[0].episodes);
    return json.series;
  }
}
