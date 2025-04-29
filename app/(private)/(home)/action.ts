export interface Series {
  id: number;
  title: string;
  overview: string;
  logo: string | null;
  backdrop_path: string;
  poster_path: string;
  original: string | null;
  status: string;
  updated_at: string;
}

interface SeriesResponse {
  ok: boolean;
  result: Series[];
}

export async function getNowPlayingSeries() {
  const json = (await (
    await fetch(
      `${process.env.NEXT_PUBLIC_MEDIA_SERVER_URL}/api/series/now_playing`
    )
  ).json()) as SeriesResponse;

  if (!json.ok) {
    return null;
  }

  return json.result;
}

export async function getSeriesIncludingDb() {
  const json = (await (
    await fetch(`${process.env.NEXT_PUBLIC_MEDIA_SERVER_URL}/api/series/bd`)
  ).json()) as SeriesResponse;

  if (!json.ok) {
    return null;
  }

  return json.result;
}

export async function getAllSeries() {
  const json = (await (
    await fetch(`${process.env.NEXT_PUBLIC_MEDIA_SERVER_URL}/api/series/all`)
  ).json()) as SeriesResponse;

  if (!json.ok) {
    return null;
  }

  return json.result;
}
