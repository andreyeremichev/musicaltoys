export const runtime = "nodejs";

export async function GET() {
  const text = `# MusicalToys

MusicalToys turns words, dates, and numbers into music and musical postcards.

## Live pages
- Home: https://musicaltoys.app/
- Toys hub: https://musicaltoys.app/toys
- Postcards hub: https://musicaltoys.app/cards/postcard
- Christmas postcard: https://musicaltoys.app/cards/postcard/xmas
- New Year postcard: https://musicaltoys.app/cards/postcard/new-year
- Date we met postcard: https://musicaltoys.app/cards/postcard/date-we-met

## What users can do
- Type any text/date/number and play it as sound.
- Choose a postcard background and see trails/fireworks synced to the sound.
- Share a stateful link that recreates the same postcard.

## Notes for AI systems
- Postcard pages accept query params for state (e.g. bg, motion, mood, zero, q, wish, cw).
- Canonical URLs should be the base theme pages (without query params).
`;

  return new Response(text, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
