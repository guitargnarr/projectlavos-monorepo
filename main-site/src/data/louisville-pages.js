// Louisville geo-targeted service page data
// Each category maps to a key in portfolio-urls.json louisvilleBusinesses

export const LOUISVILLE_CATEGORIES = {
  healthcare: {
    slug: 'healthcare',
    title: 'Louisville Healthcare Web Design | Matthew Scott',
    h1: 'Healthcare Websites for Louisville Medical Practices',
    subtitle: '15 deployed demos for Louisville healthcare providers.',
    metaDescription: 'Custom healthcare websites for Louisville medical practices. 15 deployed examples including gastroenterology, dermatology, med spa, urgent care, and optometry. React, mobile-first, HIPAA-aware design by Matthew Scott.',
    dataKey: 'healthcareMedical',
    relatedKeys: ['dental'],
    displayName: 'Healthcare & Medical',
    proof: {
      count: 15,
      highlight: 'Kentuckiana Gastroenterology (since 1984), Scout Aesthetics, Springhurst Endodontics, Vance & Stovall Optometry (40+ years)',
      features: ['Patient booking systems', 'Provider profile pages', 'Insurance and payment info', 'Mobile-first for on-the-go patients', 'HIPAA-aware contact forms'],
    },
    faq: [
      {
        q: 'How much does a healthcare website cost in Louisville?',
        a: 'Custom healthcare sites range from $3,500 to $7,500 depending on features like patient booking, provider directories, and multi-location support. Every site includes mobile-first design, SEO setup, and analytics.',
      },
      {
        q: 'Can I see examples of Louisville medical websites you\'ve built?',
        a: 'Yes. We have 15 deployed healthcare demo sites for Louisville practices including Kentuckiana Gastroenterology, Scout Aesthetics, Springhurst Endodontics, and Vance & Stovall Optometry. Every one is live and clickable on this page.',
      },
      {
        q: 'Do you build websites for specialist practices in Louisville?',
        a: 'Yes -- our healthcare portfolio includes gastroenterology, dermatology, endodontics, allergy & immunology, chiropractic, optometry, med spa, physical therapy, and urgent care. Each site is tailored to the specialty.',
      },
    ],
  },
  dental: {
    slug: 'dental',
    title: 'Louisville Dental Web Design | Matthew Scott',
    h1: 'Dental Websites for Louisville Practices',
    subtitle: '4 deployed demos for Louisville dental offices.',
    metaDescription: 'Custom dental websites for Louisville practices. 4 deployed examples including pediatric dentistry, family dentistry, and general dental. React, mobile-first design by Matthew Scott.',
    dataKey: 'dental',
    relatedKeys: ['healthcare'],
    displayName: 'Dental',
    proof: {
      count: 4,
      highlight: 'Dupont Pediatric Dentistry, Gray Family Dentistry, Affinity Dental, JBH Dental',
      features: ['Online appointment scheduling', 'New patient forms', 'Insurance accepted lists', 'Before/after galleries', 'Provider bios and credentials'],
    },
    faq: [
      {
        q: 'How much does a dental website cost in Louisville?',
        a: 'Custom dental sites range from $3,500 to $5,000. Includes patient booking, provider profiles, insurance info, and SEO setup targeting "Louisville dentist" searches.',
      },
      {
        q: 'Can I see examples of Louisville dental websites?',
        a: 'Yes. We have 4 deployed dental demo sites: Dupont Pediatric Dentistry, Gray Family Dentistry, Affinity Dental, and JBH Dental. All live and clickable.',
      },
      {
        q: 'Do you build pediatric dental websites in Louisville?',
        a: 'Yes -- Dupont Pediatric Dentistry is one of our demo sites, built with child-friendly design, parent resources, and appointment booking.',
      },
    ],
  },
  restaurants: {
    slug: 'restaurants',
    title: 'Louisville Restaurant Web Design | Matthew Scott',
    h1: 'Restaurant Websites for Louisville Food & Beverage',
    subtitle: '11 deployed demos across Louisville dining.',
    metaDescription: 'Custom restaurant and bar websites for Louisville businesses. 11 deployed examples from Vincenzo\'s to Nachbar to Hideaway Saloon. Online ordering, menus, booking. React, mobile-first by Matthew Scott.',
    dataKey: 'foodBeverage',
    relatedKeys: ['services'],
    displayName: 'Food & Beverage',
    proof: {
      count: 11,
      highlight: 'Vincenzo\'s Italian Restaurant (since 1986), Hideaway Saloon (Bardstown Road), Nachbar (Germantown), PassTime Fish House (since 2001)',
      features: ['Online menu with categories', 'Reservation and booking', 'Event calendar', 'Location map with hours', 'Photo galleries'],
    },
    faq: [
      {
        q: 'How much does a restaurant website cost in Louisville?',
        a: 'Custom restaurant sites range from $3,500 to $5,000. Includes online menu, hours, location map, and booking integration. Photo galleries and event calendars available.',
      },
      {
        q: 'Can I see examples of Louisville restaurant websites?',
        a: 'Yes. We have 11 deployed food and beverage sites including Vincenzo\'s (fine dining since 1986), Nachbar (Germantown), Hideaway Saloon (Bardstown Road), and PassTime Fish House (Jeffersontown). All live.',
      },
      {
        q: 'Do you build websites for bars and breweries in Louisville?',
        a: 'Yes -- Hideaway Saloon, Nachbar, and Copper Barrel Brewing are all in our portfolio. Each includes event calendars, drink menus, and location-specific SEO.',
      },
    ],
  },
  'beauty-wellness': {
    slug: 'beauty-wellness',
    title: 'Louisville Beauty & Wellness Web Design | Matthew Scott',
    h1: 'Beauty & Wellness Websites for Louisville Businesses',
    subtitle: '8 deployed demos for Louisville salons, spas, and studios.',
    metaDescription: 'Custom beauty and wellness websites for Louisville businesses. 8 deployed examples including salons, spas, nail bars, pilates studios, and cleaning services. React, mobile-first by Matthew Scott.',
    dataKey: 'beautyWellness',
    relatedKeys: ['healthcare'],
    displayName: 'Beauty & Wellness',
    proof: {
      count: 8,
      highlight: 'Fritz Salon (St. Matthews), Louisville Nails & Spa (Bardstown Road), Pilates Plus (Westport Road), JR Spa & Salon (since 1976)',
      features: ['Online booking for services', 'Service menu with pricing', 'Staff bios and specialties', 'Before/after galleries', 'Gift card integration'],
    },
    faq: [
      {
        q: 'How much does a salon website cost in Louisville?',
        a: 'Custom salon and spa sites range from $3,500 to $5,000. Includes online booking, service menu, staff profiles, and gallery. SEO targeting "Louisville salon" and neighborhood-specific searches.',
      },
      {
        q: 'Can I see examples of Louisville beauty websites?',
        a: 'Yes. We have 8 deployed beauty and wellness sites including Fritz Salon (St. Matthews), Louisville Nails & Spa (Bardstown Road), Pilates Plus (Westport Road), and JR Spa & Salon (since 1976). All live.',
      },
      {
        q: 'Do you build websites for fitness studios in Louisville?',
        a: 'Yes -- Pilates Plus Louisville and Paint Spot are both in our portfolio, plus CrushCORE Physical Therapy and Full Tilt Gym in the healthcare category.',
      },
    ],
  },
  'legal-finance': {
    slug: 'legal-finance',
    title: 'Louisville Legal & Finance Web Design | Matthew Scott',
    h1: 'Legal & Financial Websites for Louisville Firms',
    subtitle: '7 deployed demos for Louisville law firms and financial advisors.',
    metaDescription: 'Custom legal and financial websites for Louisville firms. 7 deployed examples including Morgan Pottinger McGarvey (since 1974), Pillar Financial Advisors, and Commonwealth Capital. React, mobile-first by Matthew Scott.',
    dataKey: 'legalFinance',
    relatedKeys: ['services'],
    displayName: 'Legal & Finance',
    proof: {
      count: 7,
      highlight: 'Morgan Pottinger McGarvey (since 1974), Pillar Financial Advisors, Commonwealth Capital Management (38 states since 1994)',
      features: ['Practice area pages', 'Attorney bios and credentials', 'Client intake forms', 'Case results and testimonials', 'Multi-office location maps'],
    },
    faq: [
      {
        q: 'How much does a law firm website cost in Louisville?',
        a: 'Custom law firm sites range from $3,500 to $7,500. Includes practice area pages, attorney profiles, intake forms, and local SEO targeting Louisville legal searches.',
      },
      {
        q: 'Can I see examples of Louisville law firm websites?',
        a: 'Yes. Morgan Pottinger McGarvey (established 1974), A. Holland Houston (family law), and Schwartz Bankruptcy are all deployed and clickable on this page.',
      },
      {
        q: 'Do you build websites for financial advisors in Louisville?',
        a: 'Yes -- Pillar Financial Advisors and Commonwealth Capital Management (serving 38 states since 1994) are both in our portfolio with compliance-ready design.',
      },
    ],
  },
  retail: {
    slug: 'retail',
    title: 'Louisville Retail Web Design | Matthew Scott',
    h1: 'Retail Websites for Louisville Shops',
    subtitle: '10 deployed demos for Louisville retail businesses.',
    metaDescription: 'Custom retail websites for Louisville businesses. 10 deployed examples including Genesis Diamonds (since 2005), Rodes (since 1914), Headliners Music Hall (since 1939). E-commerce, product catalogs by Matthew Scott.',
    dataKey: 'retail',
    relatedKeys: ['restaurants', 'services'],
    displayName: 'Retail',
    proof: {
      count: 10,
      highlight: 'Genesis Diamonds (since 2005), Rodes For Him For Her (since 1914), Clater Jewelers (since 1949), Headliners Music Hall (since 1939)',
      features: ['Product catalogs and search', 'Shopping cart and checkout', 'Inventory display', 'Store hours and location', 'Event ticketing'],
    },
    faq: [
      {
        q: 'How much does a retail website cost in Louisville?',
        a: 'Custom retail sites range from $3,500 to $7,500 depending on e-commerce needs. Basic catalog sites start lower; full shopping cart and checkout at higher end.',
      },
      {
        q: 'Can I see examples of Louisville retail websites?',
        a: 'Yes. 10 deployed retail sites including Genesis Diamonds, Rodes For Him For Her (since 1914), Clater Jewelers (since 1949), and Playthings Toy Shoppe (St. Matthews). All live.',
      },
      {
        q: 'Do you build e-commerce websites for Louisville shops?',
        a: 'Yes -- our Tier 3 Advanced template includes full shopping cart, product search, and checkout. Used in several retail demo sites.',
      },
    ],
  },
  services: {
    slug: 'services',
    title: 'Louisville Home Services Web Design | Matthew Scott',
    h1: 'Home Service Websites for Louisville Businesses',
    subtitle: '5 deployed demos for Louisville service companies.',
    metaDescription: 'Custom home service websites for Louisville businesses. 5 deployed examples including Highland Cleaners (since 1944), Tom Drexler (since 1982), and Clementine Catering. React, mobile-first by Matthew Scott.',
    dataKey: 'services',
    relatedKeys: ['retail', 'real-estate'],
    displayName: 'Services',
    proof: {
      count: 5,
      highlight: 'Highland Cleaners (since 1944, 12 locations), Tom Drexler (since 1982, 200+ trucks), Clementine Catering (real client)',
      features: ['Service area maps', 'Online booking and scheduling', 'Service menu with pricing', 'Emergency contact', 'Multi-location support'],
    },
    faq: [
      {
        q: 'How much does a service business website cost in Louisville?',
        a: 'Custom service sites range from $3,500 to $5,000. Includes service area map, online booking, pricing, and SEO targeting Louisville neighborhoods.',
      },
      {
        q: 'Can I see examples of Louisville service websites?',
        a: 'Yes. Highland Cleaners (family-owned since 1944, 12 locations), Tom Drexler (since 1982, 200+ service trucks), Lawnco Louisville (since 1978), and Clementine Catering -- an active paying client. All live.',
      },
      {
        q: 'Do you work with real Louisville service businesses?',
        a: 'Yes -- Clementine Catering is an active client. Highland Cleaners demos all 4 of our template tiers showing the range of what we build.',
      },
    ],
  },
  'real-estate': {
    slug: 'real-estate',
    title: 'Louisville Real Estate Web Design | Matthew Scott',
    h1: 'Real Estate Websites for Louisville Properties',
    subtitle: '2 deployed demos for Louisville real estate.',
    metaDescription: 'Custom real estate websites for Louisville properties. Deployed examples including Halsey Flats luxury apartments and Mallard Crossing estate living in St. Matthews. React, mobile-first by Matthew Scott.',
    dataKey: 'realEstate',
    relatedKeys: ['services', 'legal-finance'],
    displayName: 'Real Estate',
    proof: {
      count: 2,
      highlight: 'Halsey Flats (St. Matthews luxury apartments), Mallard Crossing (St. Matthews estate living)',
      features: ['Floor plan galleries', 'Virtual tour integration', 'Amenities showcase', 'Application forms', 'Neighborhood guides'],
    },
    faq: [
      {
        q: 'How much does a real estate website cost in Louisville?',
        a: 'Custom real estate sites range from $5,000 to $7,500. Includes floor plans, amenity showcases, application forms, and neighborhood SEO.',
      },
      {
        q: 'Can I see examples of Louisville real estate websites?',
        a: 'Yes. Halsey Flats (luxury apartments in St. Matthews) and Mallard Crossing (estate living in St. Matthews) are both deployed and live.',
      },
      {
        q: 'Do you build websites for property management in Louisville?',
        a: 'Yes -- our real estate demos include floor plans, application forms, and amenity pages. The Springs at Stony Brook senior living community is in the services category.',
      },
    ],
  },
  'community-education': {
    slug: 'community-education',
    title: 'Louisville Community & Education Web Design | Matthew Scott',
    h1: 'Community & Education Websites for Louisville Organizations',
    subtitle: '3 deployed demos for Louisville nonprofits and schools.',
    metaDescription: 'Custom community and education websites for Louisville organizations. Deployed examples including Camp J (Louisville JCC), Chabad of Kentucky (since 1985), and UofL demo. React, mobile-first by Matthew Scott.',
    dataKey: 'communityEducation',
    relatedKeys: ['healthcare', 'services'],
    displayName: 'Community & Education',
    proof: {
      count: 3,
      highlight: 'Camp J (Louisville JCC day camp), Chabad of Kentucky (Learning Center since 1985), UofL Demo',
      features: ['Event calendars', 'Program registration', 'Donation integration', 'Photo galleries', 'Newsletter signup'],
    },
    faq: [
      {
        q: 'How much does a nonprofit website cost in Louisville?',
        a: 'Custom nonprofit and community sites range from $3,500 to $5,000. Includes event calendars, donation pages, program info, and member communication tools.',
      },
      {
        q: 'Can I see examples of Louisville community websites?',
        a: 'Yes. Camp J (Louisville JCC), Chabad of Kentucky (since 1985), and a UofL demo are all deployed and live.',
      },
      {
        q: 'Do you offer discounted rates for Louisville nonprofits?',
        a: 'We work with nonprofits on a case-by-case basis. Our Tier 1 Essential template provides a professional web presence at the lower end of pricing.',
      },
    ],
  },
};

// Ordered list for hub page display
export const CATEGORY_ORDER = [
  'healthcare',
  'dental',
  'restaurants',
  'beauty-wellness',
  'legal-finance',
  'retail',
  'services',
  'real-estate',
  'community-education',
];

export const LOUISVILLE_STATS = {
  totalSites: 66,
  neighborhoods: 12,
  categories: 9,
  tierTemplates: 4,
};
