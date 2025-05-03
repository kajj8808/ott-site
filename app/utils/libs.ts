export function getVideoUrl(watchId: string) {
  return `${process.env.NEXT_PUBLIC_MEDIA_SERVER_URL}/media/video/${watchId}`;
}

export function getSubtitleUrl(subtitleId: string | null) {
  return subtitleId
    ? `${process.env.NEXT_PUBLIC_MEDIA_SERVER_URL}/api/subtitle/${subtitleId}`
    : "undefined";
}

export function daysAgo(dateString: string) {
  "use client";
  const date = new Date(dateString);
  const now = new Date();

  const diffTime = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return "오늘";
  }

  if (diffDays === 1) {
    return "어제";
  }

  return `${diffDays}일 전`;
}

export function cls(...classList: string[]) {
  return classList.join(" ");
}
