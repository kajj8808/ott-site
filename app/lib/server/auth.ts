import { redirect } from "next/navigation";

export function authWithUserSession() {
  // 로그인 상태 확인
  const userSession = false;
  // 로그인되어 있지 않다면 로그인 페이지로 redirect
  if (!userSession) {
    redirect("/log-in");
  } else {
    return userSession;
  }
}
