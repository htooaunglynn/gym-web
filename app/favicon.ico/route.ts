const FAVICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img" aria-label="GymHub icon">
  <rect width="64" height="64" rx="14" fill="#0052d0" />
  <path d="M18 26h8v12h-8zM38 26h8v12h-8z" fill="#d0ff3c" />
  <rect x="24" y="29" width="16" height="6" rx="3" fill="#d0ff3c" />
  <circle cx="16" cy="32" r="4" fill="#d0ff3c" />
  <circle cx="48" cy="32" r="4" fill="#d0ff3c" />
</svg>`;

export async function GET() {
    return new Response(FAVICON_SVG, {
        headers: {
            "Content-Type": "image/svg+xml; charset=utf-8",
            "Cache-Control": "public, max-age=86400",
        },
    });
}
