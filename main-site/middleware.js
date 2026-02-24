// Route-specific metadata for edge middleware HTML rewriting.
// Vercel edge middleware intercepts these routes and transforms the static
// index.html meta tags before serving to crawlers and link preview bots.

const META = {
  '/blog': {
    title: 'Articles | Observations on AI Development | Project Lavos',
    description: "Articles on AI-assisted development, verification methodology, and what 'working' actually means. By Matthew Scott, Louisville web developer.",
    url: 'https://projectlavos.com/blog',
    image: 'https://projectlavos.com/og-image.png',
    imageAlt: 'Project Lavos — Matthew Scott, Louisville web developer and AI consultant',
    type: 'website',
    breadcrumbs: [
      { name: 'Home', url: 'https://projectlavos.com' },
      { name: 'Blog', url: 'https://projectlavos.com/blog' },
    ],
  },
  '/blog/verification-gap': {
    title: 'The Verification Gap | Why "Looks Right" Isn\'t "Works Right" When Using AI | Project Lavos',
    description: 'An exploration of verification challenges in AI-assisted development. When AI generates code that looks correct, how do humans verify it actually works?',
    url: 'https://projectlavos.com/blog/verification-gap',
    image: 'https://projectlavos.com/articles/verification-gap/page-1.png',
    imageAlt: 'The Verification Gap — cover page showing the title and abstract',
    type: 'article',
    breadcrumbs: [
      { name: 'Home', url: 'https://projectlavos.com' },
      { name: 'Blog', url: 'https://projectlavos.com/blog' },
      { name: 'The Verification Gap', url: 'https://projectlavos.com/blog/verification-gap' },
    ],
    article: {
      headline: 'The Verification Gap',
      alternativeHeadline: 'Why "Looks Right" Isn\'t "Works Right" When Using AI',
      datePublished: '2026-02-01',
      dateModified: '2026-02-24',
      wordCount: 2800,
      articleSection: 'AI Collaboration',
      keywords: ['AI collaboration', 'verification', 'software development', 'code review', 'AI-assisted development', 'Louisville web developer'],
    },
  },
  '/guitar': {
    title: 'Guitar Scale Reference Library | 24 PDF Books | Project Lavos',
    description: '24 downloadable guitar scale reference books with verified tablature. Covers pentatonic, blues, diatonic modes, harmonic minor, melodic minor, symmetric, bebop, and exotic scales. 480 exercises per book across 12 keys and 5 CAGED positions.',
    url: 'https://projectlavos.com/guitar',
    image: 'https://projectlavos.com/og-image.png',
    imageAlt: 'Project Lavos — Matthew Scott, Louisville web developer and AI consultant',
    type: 'website',
    breadcrumbs: [
      { name: 'Home', url: 'https://projectlavos.com' },
      { name: 'Guitar Scale Library', url: 'https://projectlavos.com/guitar' },
    ],
  },
  '/manifesto': {
    title: 'The Manifesto | Development Philosophy | Project Lavos',
    description: 'Development philosophy: substance over flash, built to last, measure twice, people over tech. How Matthew Scott approaches web development and AI collaboration.',
    url: 'https://projectlavos.com/manifesto',
    image: 'https://projectlavos.com/og-image.png',
    imageAlt: 'Project Lavos — Matthew Scott, Louisville web developer and AI consultant',
    type: 'website',
    breadcrumbs: [
      { name: 'Home', url: 'https://projectlavos.com' },
      { name: 'Manifesto', url: 'https://projectlavos.com/manifesto' },
    ],
  },
};

function buildBreadcrumbJsonLd(breadcrumbs) {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  });
}

function buildArticleJsonLd(meta) {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: meta.article.headline,
    alternativeHeadline: meta.article.alternativeHeadline,
    description: meta.description,
    url: meta.url,
    mainEntityOfPage: meta.url,
    image: meta.image,
    datePublished: meta.article.datePublished,
    dateModified: meta.article.dateModified,
    wordCount: meta.article.wordCount,
    articleSection: meta.article.articleSection,
    keywords: meta.article.keywords,
    inLanguage: 'en',
    isAccessibleForFree: true,
    author: {
      '@type': 'Person',
      '@id': 'https://projectlavos.com/#matthew-scott',
      name: 'Matthew Scott',
      url: 'https://projectlavos.com',
    },
    publisher: {
      '@type': 'Organization',
      '@id': 'https://projectlavos.com/#organization',
      name: 'Project Lavos LLC',
      url: 'https://projectlavos.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://projectlavos.com/favicon.svg',
      },
    },
  });
}

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
  html = html.replace(
    /<meta property="og:image:alt" content="[^"]*" \/>/,
    `<meta property="og:image:alt" content="${meta.imageAlt}" />`
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
  html = html.replace(
    /<meta name="twitter:image:alt" content="[^"]*" \/>/,
    `<meta name="twitter:image:alt" content="${meta.imageAlt}" />`
  );

  // Replace canonical
  html = html.replace(
    /<link rel="canonical" href="[^"]*" \/>/,
    `<link rel="canonical" href="${meta.url}" />`
  );

  // Replace BreadcrumbList JSON-LD (identified by id="breadcrumb-jsonld")
  if (meta.breadcrumbs) {
    html = html.replace(
      /<script type="application\/ld\+json" id="breadcrumb-jsonld">[\s\S]*?<\/script>/,
      `<script type="application/ld+json" id="breadcrumb-jsonld">\n    ${buildBreadcrumbJsonLd(meta.breadcrumbs)}\n    </script>`
    );
  }

  // Inject article-specific BlogPosting JSON-LD before </head>
  if (meta.article) {
    const articleTag = `<script type="application/ld+json" id="article-jsonld">\n    ${buildArticleJsonLd(meta)}\n    </script>\n  `;
    html = html.replace('</head>', `${articleTag}</head>`);
  }

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
