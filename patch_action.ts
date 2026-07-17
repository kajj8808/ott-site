import * as fs from 'fs';

const actionPath = 'app/(tabs)/(home)/action.ts';
let code = fs.readFileSync(actionPath, 'utf8');

const regexToRemove = /export const ContentCardSchema = z\.object\(\{[^]*?export type HomeBundleResponse = z\.infer<typeof HomeBundleResponseSchema>;\n/m;

code = code.replace(regexToRemove, '');

code = code.replace(
  `import {
  ContinueWatchingResponseSchema,
  HomeLatestResponseSchema,
  HomeLatestSeriesResponseSchema,
  SeriesRecommendationsResponseSchema,
} from "./schema";`,
  `import {
  ContinueWatchingResponseSchema,
  HomeBundleResponseSchema,
  HomeLatestResponseSchema,
  HomeLatestSeriesResponseSchema,
  SeriesRecommendationsResponseSchema,
} from "./schema";`
);

code = `\"use server\";\n` + code;

fs.writeFileSync(actionPath, code);
