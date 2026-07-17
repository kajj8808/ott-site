import * as fs from 'fs';

const pagePath = 'app/(tabs)/(home)/page.tsx';
let code = fs.readFileSync(pagePath, 'utf8');

// Fix type definitions
code = code.replace(
  `type ContentRail = Extract<RecommendationRail, { kind: "CONTENT" }>;
type SeriesRail = Extract<RecommendationRail, { kind: "SERIES" }>;`,
  `type ContentRail = RecommendationRail & { type: "CONTENT" };
type SeriesRail = RecommendationRail & { type: "SERIES" };`
);

code = code.replace(
  `function isContentRail(rail: RecommendationRail): rail is ContentRail {
  return rail.kind === "CONTENT";
}

function isSeriesRail(rail: RecommendationRail): rail is SeriesRail {
  return rail.kind === "SERIES";
}`,
  `function isContentRail(rail: RecommendationRail): rail is ContentRail {
  return rail.type === "CONTENT";
}

function isSeriesRail(rail: RecommendationRail): rail is SeriesRail {
  return rail.type === "SERIES";
}`
);

// Fix hero
code = code.replace(
  `const hero = home.latestSeries.items[0]?.series;`,
  `const hero = home.latestSeries.items[0];`
);
code = code.replace(
  `{hero.overview ? (
                <p className="line-clamp-2 max-w-xl text-sm leading-6 text-white/75 sm:line-clamp-3 sm:text-base">
                  {hero.overview}
                </p>
              ) : null}`,
  `{'overview' in hero && hero.overview ? (
                <p className="line-clamp-2 max-w-xl text-sm leading-6 text-white/75 sm:line-clamp-3 sm:text-base">
                  {(hero as any).overview}
                </p>
              ) : null}`
);

// Fix latestSeries mapping
code = code.replace(
  `home.latestSeries.items.map((item) => ({
                ...item.series,
                updatedAt:
                  item.latestContent.updatedAt ?? item.series.updatedAt,
              }))`,
  `home.latestSeries.items`
);

// Fix currentlyAiring mapping
code = code.replace(
  `home.currentlyAiring.items.map((item) => ({
                ...item.series,
                updatedAt:
                  item.latestContent?.updatedAt ?? item.series.updatedAt,
              }))`,
  `home.currentlyAiring.items`
);

// Fix similarSeries mapping
code = code.replace(
  `home.similarSeries.rails.flatMap((rail) => rail.items)`,
  `home.similarSeries.items`
);

// Fix newSeason mapping
code = code.replace(
  `home.newSeason.items.map((item) => ({
                ...item.series,
                updatedAt:
                  item.series.updatedAt ??
                  item.createdAt ??
                  item.airDate ??
                  undefined,
              }))`,
  `home.newSeason.items`
);

// Fix recommendation rails mappings (Series)
code = code.replace(
  `rail.items.map((item) => ({
                    ...item.series,
                    updatedAt:
                      item.latestContent.updatedAt ?? item.series.updatedAt,
                  }))`,
  `rail.items as any`
);
code = code.replace(
  `rail.items.map((item) => ({
                    ...item.series,
                    updatedAt:
                      item.latestContent.updatedAt ?? item.series.updatedAt,
                  }))`,
  `rail.items as any`
);

// Fix recommendation rails mappings (Content)
code = code.replace(
  `rail.items.map((item) => item.content)`,
  `rail.items as any`
);

fs.writeFileSync(pagePath, code);
