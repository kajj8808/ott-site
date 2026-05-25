# Frontend Home API Guide

Last updated: 2026-05-25

외부 프론트 프로젝트에서 첫 화면, 상세 화면, 재생 화면을 붙일 때 필요한 공개 API 정리입니다.

## Base URLs

- API Gateway: `http://localhost:8099`
- Media/File Serving: `http://localhost:8092`

운영 배포에서는 위 값을 각 프로젝트의 환경변수로 분리하세요.

```env
NEXT_PUBLIC_API_BASE_URL=https://api.example.com
NEXT_PUBLIC_MEDIA_BASE_URL=https://media.example.com
```

## First Screen: Recommended Flow

홈 첫 화면은 가능하면 **1회 번들 요청**으로 시작합니다.

### Authenticated

```http
GET /me/home?full=true&includeRails=true&includeSimilarSeries=true&latestType=EPISODE
Authorization: Bearer <token>
```

### User ID based

```http
GET /users/:userId/home?full=true&includeRails=true&includeSimilarSeries=true&latestType=EPISODE
```

### Guest fallback

로그인 전 화면은 개인화가 없는 섹션을 조합합니다.

```http
GET /home/latest?limit=24&type=EPISODE
GET /home/trending?limit=24&days=120
GET /home/new-season?limit=24&days=180
GET /home/latest-series?limit=24
GET /home/currently-airing?limit=24
```

## Home Bundle

### Endpoint

```http
GET /me/home
GET /me/home/full
GET /users/:userId/home
GET /users/:userId/home/full
```

`/me/*`는 Bearer 토큰의 userId를 사용합니다. `/users/:userId/*`는 다른 프로젝트에서 빠르게 붙일 때 편합니다.

### Query

| Name                   | Type                          | Default           | Description               |
| ---------------------- | ----------------------------- | ----------------- | ------------------------- |
| `full`                 | boolean                       | `false`           | 더 많은 섹션/개수를 반환  |
| `latestLimit`          | number                        | `24`, full `40`   | 최신 콘텐츠 개수          |
| `continueLimit`        | number                        | `20`, full `30`   | 이어보기 개수             |
| `recommendationLimit`  | number                        | `24`, full `40`   | 추천 콘텐츠 개수          |
| `seriesLimit`          | number                        | `24`, full `36`   | 시리즈 목록 개수          |
| `includeRails`         | boolean                       | `true`            | 추천 레일 포함            |
| `railsContentLimit`    | number                        | `20`, full `32`   | 콘텐츠 추천 레일 개수     |
| `railsSeriesLimit`     | number                        | `12`, full `20`   | 시리즈 추천 레일 개수     |
| `includeSimilarSeries` | boolean                       | `true`            | 유사 시리즈 섹션 포함     |
| `similarSeriesLimit`   | number                        | `12`, full `16`   | 유사 시리즈 개수          |
| `similarSeedLimit`     | number                        | `3`, full `4`     | 유사 시리즈 seed 개수     |
| `trendingLimit`        | number                        | `24`, full `40`   | 트렌딩 개수               |
| `trendingDays`         | number                        | `120`, full `180` | 트렌딩 집계 기간          |
| `newSeasonLimit`       | number                        | `24`, full `36`   | 신규 시즌 개수            |
| `newSeasonDays`        | number                        | `180`, full `270` | 신규 시즌 집계 기간       |
| `latestSeriesLimit`    | number                        | `24`, full `36`   | 최신 업데이트 시리즈 개수 |
| `currentlyAiringLimit` | number                        | `24`, full `40`   | 현재 분기 방영작 개수     |
| `latestType`           | `EPISODE \| MOVIE \| SPECIAL` | all               | 최신 콘텐츠 타입 필터     |

### Response Shape

```ts
type HomeBundleResponse = {
  ok: true;
  data: {
    userId: number;
    latest: { items: ContentCard[]; total: number };
    continueWatching: { items: ContinueWatchingItem[]; total: number };
    recommendations: {
      items: ContentCard[];
      total: number;
      basedOnHistoryCount: number;
      preferredSeriesIds: number[];
    };
    series: { items: SeriesCard[]; total: number };
    recommendationRails: null | {
      rails: RecommendationRail[];
      totalRails: number;
      algorithmVersion: string;
    };
    trending: { items: ContentCard[]; total: number; windowDays: number };
    newSeason: { items: SeriesCard[]; total: number; windowDays: number };
    latestSeries: { items: SeriesCard[]; total: number };
    currentlyAiring: {
      items: SeriesCard[];
      total: number;
      quarter: {
        year: number;
        quarter: number;
        startAt: string;
        endAt: string;
      };
      quarterMatched: number;
    };
    similarSeries: null | { items: SeriesCard[]; total: number };
  };
};
```

## Card Fields To Use

콘텐츠 카드에서 우선 사용하는 필드는 아래 정도면 충분합니다.

```ts
type ContentCard = {
  id: number; // videoContent id, /watch/:id 에 사용
  watchId: string; // media watch id, /catalog/watch/:watchId 또는 /media/video/:watchId 에 사용
  type: "EPISODE" | "MOVIE" | "SPECIAL";
  title: string | null;
  subtitle: string | null;
  thumbnail: string | null;
  watchUrl: string; // usually /watch/:id
  streamPath: string | null; // /media/video/:watchId
  subtitlePath: string | null;
  seriesId: number | null;
  seasonId: number | null;
  episodeId: number | null;
  episodeNumber: number | null;
  movieId: number | null;
  createdAt: string;
  updatedAt: string;
};
```

이미지 fallback은 다음 순서를 권장합니다.

```text
content.thumbnail -> episode.stillPath -> movie.posterPath -> series.posterPath
```

## Detail And Watch APIs

### Content detail by videoContent id

`/watch/:id` 페이지에서 사용하는 id는 보통 `videoContent.id`입니다.

```http
GET /catalog/contents/:contentId
GET /users/:userId/watch/:contentId/context
GET /me/watch/:contentId/context
```

`/me/watch/:contentId/context`는 로그인된 재생 화면에 권장됩니다. 콘텐츠 정보, progress, episode navigation을 한 번에 반환합니다.

### Content detail by media watch id

`watchId`는 파일/스트림 식별자입니다. 예: `ef0d89be...`

```http
GET /catalog/watch/:watchId
GET /media/video/:watchId
```

주의: `/catalog/watch/1430`은 `watch_id`가 `1430`인 콘텐츠를 찾습니다. `videoContent.id=1430`을 조회하려면 `/catalog/contents/1430`을 사용하세요.

### Series and movie detail

```http
GET /catalog/series/:seriesId?contentLimit=30
GET /catalog/series/:seriesId/related?limit=12
GET /catalog/seasons/:seasonId
GET /catalog/movies/:movieId
```

## Watch Progress

재생 중 10-30초 간격, pause, ended 시 저장을 권장합니다.

```http
POST /me/watch-records
Authorization: Bearer <token>
Content-Type: application/json

{
  "videoContentId": 1430,
  "currentTime": 721,
  "totalDuration": 6300,
  "status": "WATCHING"
}
```

토큰이 없는 서버/테스트 환경:

```http
POST /users/:userId/watch-records
```

조회:

```http
GET /me/watch-records?limit=20
GET /users/:userId/watch-records?limit=20
GET /me/continue-watching?limit=20
GET /users/:userId/continue-watching?limit=20
```

## Search And Catalog

```http
GET /api/search?q=프리렌&limit=10
GET /api/genres?q=Action&limit=100
GET /catalog/series?page=1&limit=30&status=ONGOING&q=프리렌
GET /catalog/movies?page=1&limit=20&sort=release&q=미쿠
```

## Recommendation Events

추천 품질을 올리려면 노출/클릭/재생 이벤트를 남깁니다.

```http
POST /home/recommendation-events
Content-Type: application/json

{
  "events": [
    {
      "eventType": "IMPRESSION",
      "surface": "home.recommendationRails",
      "userId": 1,
      "contentId": 1430,
      "position": 0,
      "sessionId": "home-20260525",
      "algorithmVersion": "rails-v1"
    }
  ]
}
```

## Media

```http
GET /media/video/:watchId
GET /media/subtitle/:subtitleId
GET /media/image/:id
```

프론트에서는 `API_BASE_URL + streamPath` 또는 `MEDIA_BASE_URL + streamPath` 중 배포 구조에 맞는 쪽을 사용하세요.

## Error Shape

대부분의 JSON API는 아래 형식을 따릅니다.

```json
{
  "ok": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Content not found"
  }
}
```

일반 규칙:

- `400`: 잘못된 파라미터
- `401`: 인증 필요
- `404`: 대상 없음 또는 admin-only 필터링
- `502`: metadata/file-serving upstream 오류
- `504`: upstream timeout

Media 스트리밍 API는 JSON 래핑이 아니라 파일/텍스트 응답입니다.

## Minimal Fetch Client

```ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;
const MEDIA_BASE_URL = process.env.NEXT_PUBLIC_MEDIA_BASE_URL ?? API_BASE_URL;

async function apiGet<T>(path: string, token?: string): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    cache: "no-store",
  });
  const json = await res.json().catch(() => null);
  if (!res.ok || json?.ok === false) {
    throw new Error(
      json?.error?.message ?? json?.error ?? "API request failed",
    );
  }
  return json as T;
}

export async function getHome(token: string) {
  return apiGet<HomeBundleResponse>(
    "/me/home?full=true&includeRails=true&includeSimilarSeries=true&latestType=EPISODE",
    token,
  );
}

export function mediaUrl(path: string | null) {
  if (!path) return null;
  if (/^https?:\/\//.test(path)) return path;
  return `${MEDIA_BASE_URL}${path}`;
}
```

## Suggested Additions

아래는 다른 프로젝트에 붙일 때 있으면 좋은 추가 API입니다. 현재 필수는 아니지만 프론트 품질을 올릴 수 있습니다.

- `GET /catalog/collections`: 홈 큐레이션/테마 묶음
- `GET /catalog/people/:personId`: 성우/제작진 상세
- `GET /home/hero`: 첫 화면 대형 배너 전용, fallback 규칙 포함
- `GET /me/home?locale=ko-KR`: 다국어 문구/제목 선택
- `GET /me/home?platform=web|mobile|tv`: 디바이스별 섹션 개수/이미지 비율 최적화
