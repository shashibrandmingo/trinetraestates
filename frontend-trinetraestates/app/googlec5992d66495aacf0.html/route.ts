export const dynamic = "force-static";

export function GET() {
  return new Response("google-site-verification: googlec5992d66495aacf0.html", {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
    },
  });
}
