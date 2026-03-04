// Route-specific metadata for edge middleware HTML rewriting.
// Vercel edge middleware intercepts these routes and transforms the static
// index.html meta tags before serving to crawlers and link preview bots.

const META = {
  '/blog': {
    title: 'Articles | Observations on AI Development | Project Lavos',
    description: "Articles on AI-assisted development, verification methodology, and what 'working' actually means. By Matthew Scott, Louisville web developer.",
    url: 'https://projectlavos.com/blog',
    image: 'https://projectlavos.com/og-blog.png',
    imageAlt: 'Beyond the Code — Articles on AI Development by Matthew Scott',
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
    image: 'https://projectlavos.com/og-guitar.png',
    imageAlt: 'Scale Reference Library — 24 Guitar Scale Books by Project Lavos',
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
    image: 'https://projectlavos.com/og-manifesto.png',
    imageAlt: 'The Manifesto — What One Person Can Build by Matthew Scott',
    type: 'website',
    breadcrumbs: [
      { name: 'Home', url: 'https://projectlavos.com' },
      { name: 'Manifesto', url: 'https://projectlavos.com/manifesto' },
    ],
  },
  '/louisville': {
    title: 'Louisville Web Development | 66 Demo Sites | Matthew Scott',
    description: 'Louisville web developer with 66 deployed demo websites for real local businesses across healthcare, restaurants, legal, retail, beauty, and services. 12 neighborhoods covered. React, mobile-first, SEO-ready.',
    url: 'https://projectlavos.com/louisville',
    image: 'https://projectlavos.com/og-image.png',
    imageAlt: 'Louisville Web Development — 66 Demo Sites by Matthew Scott',
    type: 'website',
    breadcrumbs: [
      { name: 'Home', url: 'https://projectlavos.com' },
      { name: 'Louisville', url: 'https://projectlavos.com/louisville' },
    ],
    service: {
      name: 'Louisville Web Development',
      description: '66 deployed demo websites for real Louisville businesses across 9 industries and 12 neighborhoods.',
      areaServed: 'Louisville, Kentucky',
    },
  },
};

const LOUISVILLE_CATEGORY_META = {
  healthcare: {
    title: 'Louisville Healthcare Web Design | Matthew Scott',
    description: 'Custom healthcare websites for Louisville medical practices. 15 deployed examples including gastroenterology, dermatology, med spa, urgent care, and optometry. React, mobile-first, HIPAA-aware design.',
    displayName: 'Healthcare & Medical',
  },
  dental: {
    title: 'Louisville Dental Web Design | Matthew Scott',
    description: 'Custom dental websites for Louisville practices. 4 deployed examples including pediatric dentistry, family dentistry, and general dental. React, mobile-first design.',
    displayName: 'Dental',
  },
  restaurants: {
    title: 'Louisville Restaurant Web Design | Matthew Scott',
    description: 'Custom restaurant and bar websites for Louisville businesses. 11 deployed examples from fine dining to craft breweries. Online ordering, menus, booking. React, mobile-first.',
    displayName: 'Food & Beverage',
  },
  'beauty-wellness': {
    title: 'Louisville Beauty & Wellness Web Design | Matthew Scott',
    description: 'Custom beauty and wellness websites for Louisville businesses. 8 deployed examples including salons, spas, nail bars, pilates studios. React, mobile-first.',
    displayName: 'Beauty & Wellness',
  },
  'legal-finance': {
    title: 'Louisville Legal & Finance Web Design | Matthew Scott',
    description: 'Custom legal and financial websites for Louisville firms. 7 deployed examples including law firms, financial advisors, and wealth management. React, mobile-first.',
    displayName: 'Legal & Finance',
  },
  retail: {
    title: 'Louisville Retail Web Design | Matthew Scott',
    description: 'Custom retail websites for Louisville businesses. 10 deployed examples including jewelers, clothiers, toy shops, and music venues. E-commerce, product catalogs.',
    displayName: 'Retail',
  },
  services: {
    title: 'Louisville Home Services Web Design | Matthew Scott',
    description: 'Custom home service websites for Louisville businesses. 5 deployed examples including cleaners, landscaping, plumbing, and catering. React, mobile-first.',
    displayName: 'Services',
  },
  'real-estate': {
    title: 'Louisville Real Estate Web Design | Matthew Scott',
    description: 'Custom real estate websites for Louisville properties. Deployed examples including luxury apartments and estate living in St. Matthews. React, mobile-first.',
    displayName: 'Real Estate',
  },
  'community-education': {
    title: 'Louisville Community & Education Web Design | Matthew Scott',
    description: 'Custom community and education websites for Louisville organizations. Deployed examples including day camps, learning centers, and university demos. React, mobile-first.',
    displayName: 'Community & Education',
  },
};

function buildServiceJsonLd(meta) {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: meta.service.name,
    description: meta.service.description,
    provider: {
      '@type': 'Person',
      '@id': 'https://projectlavos.com/#matthew-scott',
      name: 'Matthew Scott',
      url: 'https://projectlavos.com',
    },
    areaServed: {
      '@type': 'City',
      name: meta.service.areaServed,
    },
    url: meta.url,
  });
}

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
  let meta = META[url.pathname];

  // Dynamic Louisville category pages
  if (!meta) {
    const match = url.pathname.match(/^\/louisville\/([a-z-]+)$/);
    if (match) {
      const catMeta = LOUISVILLE_CATEGORY_META[match[1]];
      if (catMeta) {
        meta = {
          title: catMeta.title,
          description: catMeta.description,
          url: `https://projectlavos.com/louisville/${match[1]}`,
          image: 'https://projectlavos.com/og-image.png',
          imageAlt: `${catMeta.displayName} Web Design in Louisville by Matthew Scott`,
          type: 'website',
          breadcrumbs: [
            { name: 'Home', url: 'https://projectlavos.com' },
            { name: 'Louisville', url: 'https://projectlavos.com/louisville' },
            { name: catMeta.displayName, url: `https://projectlavos.com/louisville/${match[1]}` },
          ],
          service: {
            name: `Louisville ${catMeta.displayName} Web Design`,
            description: catMeta.description,
            areaServed: 'Louisville, Kentucky',
          },
        };
      }
    }
  }

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

  // Inject Service JSON-LD for Louisville pages before </head>
  if (meta.service) {
    const serviceTag = `<script type="application/ld+json" id="service-jsonld">\n    ${buildServiceJsonLd(meta)}\n    </script>\n  `;
    html = html.replace('</head>', `${serviceTag}</head>`);
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
  matcher: ['/blog', '/blog/:slug', '/guitar', '/manifesto', '/louisville', '/louisville/:slug'],
};
