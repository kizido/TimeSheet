import { createCookie, redirect } from "react-router";

let secret = process.env.COOKIE_SECRET || "default";
if (secret === "default") {
  console.warn("NO COOKIE_SECRET SET, THE APP IS INSECURE");
}

export let authCookie = createCookie("auth", {
  httpOnly: true,
  path: "/",
  sameSite: "lax",
  secrets: [secret],
  secure: process.env.NODE_ENV === "production",
  maxAge: 60 * 60 * 24 * 7,
});

export async function requireAuthCookie(request: Request) {
  let userId = await authCookie.parse(request.headers.get("Cookie"));
  if (!userId) {
    throw redirect("/", {
      headers: {
        "Set-Cookie": await authCookie.serialize("", {
          maxAge: 0,
        }),
      },
    });
  }
  return userId;
}
