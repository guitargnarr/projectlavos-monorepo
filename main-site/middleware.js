const META = {
  '/blog': {
    title: 'Articles | Observations on AI Development | Project Lavos',
    description: "Articles on AI-assisted development, verification methodology, and what 'working' actually means. By Matthew Scott, Louisville web developer.",
    url: 'https://projectlavos.com/blog',
    image: 'https://projectlavos.com/og-image.png',
    type: 'website',
  },
  '/blog/verification-gap': {
    title: 'The Verification Gap | Why "Looks Right" Isn\'t "Works Right" When Using AI | Project Lavos',
    description: 'An exploration of verification challenges in AI-assisted development. When AI generates code that looks correct, how do humans verify it actually works?',
    url: 'https://projectlavos.com/blog/verification-gap',
    image: 'https://projectlavos.com/articles/verification-gap/page-1.png',
    type: 'article',
  },
  '/guitar': {
    title: 'Guitar Scale Reference Library | 24 PDF Books | Project Lavos',
    description: '24 downloadable guitar scale reference books with verified tablature. Covers pentatonic, blues, diatonic modes, harmonic minor, melodic minor, symmetric, bebop, and exotic scales. 480 exercises per book across 12 keys and 5 CAGED positions.',
    url: 'https://projectlavos.com/guitar',
    image: 'https://projectlavos.com/og-image.png',
    type: 'website',
  },
  '/manifesto': {
    title: 'The Manifesto | Development Philosophy | Project Lavos',
    description: 'Development philosophy: substance over flash, built to last, measure twice, people over tech. How Matthew Scott approaches web development and AI collaboration.',
    url: 'https://projectlavos.com/manifesto',
    image: 'https://projectlavos.com/og-image.png',
    type: 'website',
  },
};

export default async function middleware(request) {
  const url = new URL(request.url);
  const meta = META[url.pathname];

  // Only transform routes with custom meta
  if (!meta) return;

  // Fetch the original response (index.html via SPA rewrite)
  const response = await fetch(request);
  const contentType = response.headers.get('content-type') || '';

  // Only transform HTML responses
  if (!contentType.includes('text/html')) return response;

  let html = await response.text();

  // Replace title
  html = html.replace(
    /<title>[^<]*<\/title>/,
    `<title>${meta.title}</title>`
  );

  // Replace meta description
  html = html.replace(
    /<meta name="description" content="[^"]*" \/>/,
    `<meta name="description" content="${meta.description}" />`
  );

  // Replace OG tags
  html = html.replace(
    /<meta property="og:title" content="[^"]*" \/>/,
    `<meta property="og:title" content="${meta.title}" />`
  );
  html = html.replace(
    /<meta property="og:description" content="[^"]*" \/>/,
    `<meta property="og:description" content="${meta.description}" />`
  );
  html = html.replace(
    /<meta property="og:url" content="[^"]*" \/>/,
    `<meta property="og:url" content="${meta.url}" />`
  );
  html = html.replace(
    /<meta property="og:type" content="[^"]*" \/>/,
    `<meta property="og:type" content="${meta.type}" />`
  );
  html = html.replace(
    /<meta property="og:image" content="[^"]*" \/>/,
    `<meta property="og:image" content="${meta.image}" />`
  );

  // Replace Twitter tags
  html = html.replace(
    /<meta name="twitter:title" content="[^"]*" \/>/,
    `<meta name="twitter:title" content="${meta.title}" />`
  );
  html = html.replace(
    /<meta name="twitter:description" content="[^"]*" \/>/,
    `<meta name="twitter:description" content="${meta.description}" />`
  );
  html = html.replace(
    /<meta name="twitter:image" content="[^"]*" \/>/,
    `<meta name="twitter:image" content="${meta.image}" />`
  );

  // Replace canonical
  html = html.replace(
    /<link rel="canonical" href="[^"]*" \/>/,
    `<link rel="canonical" href="${meta.url}" />`
  );

  return new Response(html, {
    status: response.status,
    headers: {
      ...Object.fromEntries(response.headers.entries()),
      'content-type': 'text/html; charset=utf-8',
    },
  });
}

export const config = {
  matcher: ['/blog', '/blog/:slug', '/guitar', '/manifesto'],
};
