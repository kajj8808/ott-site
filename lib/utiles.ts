export async function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, ms);
  });
}

import { formatDistanceToNowStrict } from "date-fns";
import { ko } from "date-fns/locale";
export function timeAgo(date: Date) {
  return formatDistanceToNowStrict(date, { addSuffix: true, locale: ko });
}
