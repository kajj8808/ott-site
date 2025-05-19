"use server";

interface MoiveResponse {
  ok: boolean;
  result: {
    id: number;
    video_content_id: number;
    title: string;
    overview: string;
    backdrop_path: string;
    created_at: string;
    updated_at: string;
  };
}

export async function getMovieDetial(id: string, userToken: string) {
  const json = (await (
    await fetch(`${process.env.NEXT_PUBLIC_MEDIA_SERVER_URL}/api/movie/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
    })
  ).json()) as MoiveResponse;

  if (!json.ok) {
    return null;
  }

  return json.result;
}
