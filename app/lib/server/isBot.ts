"use server";

import { headers } from "next/headers";

export async function isBotRequest() {
  const userAgent = (await headers()).get("user-agent");
  const botKeywords = ["discordbot", "slackbot", "kakaotalk"];

  const isBot = botKeywords.some((botKeyword) =>
    userAgent?.includes(botKeyword),
  );
  return isBot;
}
