import * as fs from 'fs';

const schemaPath = 'app/(tabs)/(home)/schema.ts';
let code = fs.readFileSync(schemaPath, 'utf8');

// Replace RecommendationRailSchema
const newRailSchema = `const RecommendationRailSchema = z.discriminatedUnion("kind", [
  z.object({
    id: z.string(),
    title: z.string(),
    kind: z.literal("CONTENT"),
    items: z.array(ScoredContentSchema),
    total: z.number(),
  }),
  z.object({
    id: z.string(),
    title: z.string(),
    kind: z.literal("SERIES"),
    items: z.array(
      z.object({
        score: z.number(),
        series: SeriesCardSchema,
        latestContent: ContentCardSchema.pick({
          id: true,
          watchId: true,
          type: true,
          createdAt: true,
          updatedAt: true,
        }),
      }),
    ),
    total: z.number(),
  }),
  z.object({
    id: z.string(),
    title: z.string(),
    kind: z.literal("WATCH_RECORD"),
    items: z.array(z.any()), // using any to avoid defining the whole ContinueWatchingItemSchema here for simplicity
    total: z.number(),
  }),
]);`;

code = code.replace(/const RecommendationRailSchema = z\.discriminatedUnion\("kind", \[[\s\S]*?\]\);/, newRailSchema);

fs.writeFileSync(schemaPath, code);
