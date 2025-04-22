export function getVideoUrl(watchId: string) {
  return `${process.env.NEXT_PUBLIC_MEDIA_SERVER_URL}/media/video/${watchId}`;
}

export function getSubtitleUrl(subtitleId: string | null) {
  return subtitleId
    ? `${process.env.NEXT_PUBLIC_MEDIA_SERVER_URL}/api/subtitle/${subtitleId}`
    : "undefined";
}
