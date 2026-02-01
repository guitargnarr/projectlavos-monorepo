import { useState, useEffect, useRef } from 'react';
import { Analytics } from '@vercel/analytics/react';

function App() {
  const [expandedProject, setExpandedProject] = useState(null);
  // Initialize sections as visible by default (Safari mobile fallback)
  const [visibleSections, setVisibleSections] = useState({
    louisville: true,
    work: true,
    method: true
  });
  const workSectionRef = useRef(null);

  // Scroll animation observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('section[id]').forEach((section) => {
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToWork = () => {
    workSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const principles = [
    { text: "Substance first", tooltip: "Clear results over impressive pitches" },
    { text: "Built to last", tooltip: "Good systems outlast good intentions" },
    { text: "Measure twice", tooltip: "Test the work, then ship it" },
    { text: "People over tech", tooltip: "Technology works for people, not the other way around" }
  ];

  // Local Louisville client projects
  const localClients = [
    // Priority 1-13: Best showcase sites
    {
      id: "fritzsalon",
      title: "Fritz Salon",
      url: "https://fritz-salon.vercel.app",
      preview: "/previews/fritz-salon.png",
      ogImage: "/previews/fritz-salon.png",
      qrCode: "/qr-codes/fritz-salon-qr.png",
      description: "Premier hair salon experience",
      altText: "Fritz Salon Louisville premier hair salon styling coloring treatments professional stylists",
      category: "Beauty",
      specWork: true,
      details: "Premier hair salon in Louisville offering expert styling, coloring, and treatments. Professional stylists dedicated to helping you look and feel your best."
    },
    {
      id: "hideawaysaloon",
      title: "Hideaway Saloon",
      url: "https://hideaway-saloon.vercel.app",
      preview: "/previews/hideaway-saloon.png",
      ogImage: "/og-images/hideaway-saloon-og.png",
      qrCode: "/qr-codes/hideaway-saloon-qr.png",
      description: "Louisville's premier video game dive bar",
      altText: "Hideaway Saloon Louisville Kentucky video game bar arcade games fighting game tournaments dive bar Bardstown Road",
      category: "Bar",
      specWork: true,
      details: "Louisville's original video game dive bar on Bardstown Road. Family-owned since the 1970s, rebranded to a gaming destination in 2015. 1000+ games, weekly fighting game tournaments, cold drinks. Open Mon-Sat 7PM-4AM."
    },
    {
      id: "headlinersmusichall",
      title: "Headliners Music Hall",
      url: "https://headliners-louisville.vercel.app",
      preview: "/previews/headliners-music-hall.png",
      ogImage: "/og-images/headliners-music-hall-og.png",
      qrCode: "/qr-codes/headliners-music-hall-qr.png",
      description: "Louisville's legendary music venue since 1939",
      altText: "Headliners Music Hall Louisville Kentucky live music venue concerts speakeasy prohibition era murals 1939",
      category: "Entertainment",
      specWork: true,
      details: "Art Deco aesthetic for Louisville's legendary live music venue, built during Prohibition in 1939. Original murals by National Distillers, film grain overlays, ambient sound toggle, period typography. 85+ years of unforgettable nights on Baxter Ave."
    },
    {
      id: "louisvilleaesthetics",
      title: "Louisville Aesthetics",
      url: "https://louisville-aesthetics.vercel.app",
      preview: "/previews/louisville-aesthetics.png",
      ogImage: "/og-images/louisville-aesthetics-og.png",
      qrCode: "/qr-codes/louisville-aesthetics-qr.png",
      description: "Modern medical aesthetics clinic",
      altText: "Louisville Aesthetics Med Spa Leesgate Road premium medical aesthetics services",
      category: "Med Spa",
      specWork: true,
      details: "A premium med spa on Leesgate Road. Smooth animations, refined interactions, and a booking flow that feels as polished as the services they offer."
    },
    {
      id: "dupontpediatric",
      title: "Dupont Pediatric Dentistry",
      url: "https://dupont-pediatric-dentistry.vercel.app",
      preview: "/previews/dupont-pediatric-dentistry.png",
      ogImage: "/og-images/dupont-pediatric-dentistry-og.png",
      qrCode: "/qr-codes/dupont-pediatric-dentistry-qr.png",
      description: "Louisville's kid-friendly dental office",
      altText: "Dupont Pediatric Dentistry Louisville Kentucky Dr Jenna Dr Schulten board certified pediatric dentists kids dental care",
      category: "Medical",
      specWork: true,
      details: "Tier 4 demo for Louisville's trusted pediatric dental practice. Dr. Jenna & Dr. Schulten, board-certified pediatric dentists. Parent portal, admin dashboard, 3-step booking wizard, toast notifications. Purple/violet kid-friendly branding. Serving Louisville families since the practice's founding."
    },
    {
      id: "genesisdiamonds",
      title: "Genesis Diamonds",
      url: "https://genesis-diamonds.vercel.app",
      preview: "/previews/genesis-diamonds.png",
      ogImage: "/og-images/genesis-diamonds-og.png",
      qrCode: "/qr-codes/genesis-diamonds-qr.png",
      description: "Louisville's premier jeweler since 2005",
      altText: "Genesis Diamonds Louisville Kentucky GIA certified diamonds engagement rings luxury watches Tacori Verragio",
      category: "Jewelry",
      specWork: true,
      details: "Tier 4 ultra-luxury demo for Louisville's premier diamond destination. AI Oracle concierge, user authentication, GIA-certified diamonds, luxury watches (Rolex, Patek Philippe). Best Price Guarantee, 120% Lifetime Upgrade. Obsidian/gold theme for UHNW clientele."
    },
    {
      id: "jwcafe",
      title: "JW Cafe",
      url: "https://jw-cafe-bakery.vercel.app",
      preview: "/previews/jwcafe.png",
      ogImage: "/og-images/jwcafe-og.png",
      qrCode: "/qr-codes/jwcafe-qr.png",
      description: "Local cafe & bakery digital storefront",
      altText: "JW Cafe and Bakery Louisville website showing menu, hours, and location for neighborhood coffee shop",
      category: "Cafe",
      specWork: true,
      details: "A neighborhood cafe and bakery serving Louisville. Created an inviting online presence with menu, hours, and location—everything customers need at a glance."
    },
    {
      id: "cottagecafe",
      title: "Cottage Cafe",
      url: "https://cottage-cafe-eight.vercel.app",
      preview: "/previews/cottagecafe.png",
      ogImage: "/og-images/cottagecafe-og.png",
      qrCode: "/qr-codes/cottagecafe-qr.png",
      description: "Homemade comfort food since 1992",
      altText: "Cottage Cafe Middletown Louisville homemade soups sandwiches and famous desserts in charming yellow cottage",
      category: "Cafe",
      specWork: true,
      details: "A Louisville institution since 1992. Homemade soups, fresh sandwiches, and desserts like grandmother used to make—all served in a charming 100-year-old yellow cottage in Middletown."
    },
    {
      id: "campj",
      title: "Camp J",
      url: "https://camp-j-lovat.vercel.app",
      preview: "/previews/camp-j.png",
      ogImage: "/previews/camp-j.png",
      qrCode: "/qr-codes/camp-j-qr.png",
      description: "Where adventures begin & friendships last",
      altText: "Camp J Louisville Jewish Community Center day camp summer spring fall winter programs ages 5-17",
      category: "Youth",
      specWork: true,
      details: "Louisville's premier Jewish Community Center day camp. Summer, spring, fall, and winter programs for ages 5-17. Swimming, sports, arts, STEM, and more. Open to all faiths."
    },
    {
      id: "springsstonyvbrook",
      title: "The Springs at Stony Brook",
      url: "https://springs-stony-brook.vercel.app",
      preview: "/previews/springs-stony-brook.png",
      ogImage: "/og-images/springs-stony-brook-og.png",
      qrCode: "/qr-codes/springs-stony-brook-qr.png",
      description: "Where Family Comes To Live",
      altText: "The Springs at Stony Brook senior living Louisville Kentucky Trilogy Health Services Independent Living Personal Care Memory Care Skilled Services",
      category: "Healthcare",
      specWork: true,
      details: "Premium senior living demo for Louisville Trilogy Health Services community. Official purple/gold Trilogy branding. Four levels of care: Independent Living, Personal Care, Memory Care (Best Friends Approach), and Skilled Services. U.S. News Best Senior Living award badges."
    },
    {
      id: "pilatespluslouisville",
      title: "Pilates Plus Louisville",
      url: "https://pilates-plus-louisville.vercel.app",
      preview: "/previews/pilates-plus-louisville.png",
      ogImage: "/previews/pilates-plus-louisville.png",
      qrCode: "/qr-codes/pilates-plus-louisville-qr.png",
      description: "Transform your body with Pilates",
      altText: "Pilates Plus Louisville Westport Road fitness studio classes schedule booking instructors",
      category: "Fitness",
      specWork: true,
      details: "Louisville's premier Pilates studio on Westport Road. Expert instructors, flexible class schedules, and a welcoming community. Build strength, improve flexibility, find your balance."
    },
    {
      id: "shawarmashack",
      title: "Shawarma Shack",
      url: "https://shawarma-shack.vercel.app",
      preview: "/previews/shawarma-shack.png",
      ogImage: "/previews/shawarma-shack.png",
      qrCode: "/qr-codes/shawarma-shack-qr.png",
      description: "Authentic Middle Eastern flavors",
      altText: "Shawarma Shack St Matthews Louisville build your own shawarma bowls wraps Middle Eastern food",
      category: "Restaurant",
      specWork: true,
      details: "Build-your-own shawarma coming to St. Matthews. Fresh ingredients, bold spices, recipes passed down through generations. Chipotle-style service for authentic Middle Eastern cuisine. Opening 2025."
    },
    {
      id: "northlimecoffee",
      title: "North Lime Coffee & Donuts",
      url: "https://north-lime-coffee.vercel.app",
      preview: "/previews/north-lime-coffee.png",
      ogImage: "/previews/north-lime-coffee.png",
      qrCode: "/qr-codes/north-lime-coffee-qr.png",
      description: "Parliament of Owls coffee & donuts",
      altText: "North Lime Coffee and Donuts Louisville Lexington Kentucky Parliament of Owls membership coffee subscriptions rotating donut menu",
      category: "Cafe",
      specWork: true,
      details: "Louisville & Lexington's beloved donut shop with Parliament of Owls membership, fresh-roasted coffee subscriptions, rotating donut schedule, and merchandise. Interactive donut quiz, CSS animations, code splitting. 268KB optimized bundle."
    },
    {
      id: "blownawaybar",
      title: "Blown Away Bar",
      url: "https://blown-away-bar.vercel.app",
      preview: "/previews/blown-away-bar.png",
      ogImage: "/previews/blown-away-bar.png",
      qrCode: "/qr-codes/blown-away-bar-qr.png",
      description: "Louisville's blow dry and beauty bar",
      altText: "Blown Away Bar Louisville blow dry bar beauty styling blowouts makeup special occasions",
      category: "Beauty",
      specWork: true,
      details: "Louisville's premier blow dry and beauty bar. Expert blowouts, styling, and makeup for any occasion. Walk in gorgeous, walk out blown away."
    },
    // Remaining sites
    {
      id: "fableflow",
      title: "Fable & Flow",
      url: "https://fableandflows.vercel.app",
      preview: "/previews/fableflow.png",
      ogImage: "/og-images/fableflow-og.png",
      qrCode: "/qr-codes/fableflow-qr.png",
      description: "Boutique retail brand presence",
      altText: "Fable & Flow Louisville boutique retail website featuring curated home goods and unique local finds",
      category: "Retail",
      specWork: false,
      details: "A curated boutique bringing unique finds to Louisville. Built a clean, modern storefront that reflects the brand's personality and makes discovery easy."
    },
    {
      id: "nachbar",
      title: "Nachbar",
      url: "https://nachbar.vercel.app",
      preview: "/previews/nachbar.png",
      ogImage: "/og-images/nachbar-og.png",
      qrCode: "/qr-codes/nachbar-qr.png",
      description: "Germantown's neighborhood bar",
      altText: "Nachbar Germantown Louisville neighborhood bar website featuring German and Belgian beers, live music schedule",
      category: "Bar",
      specWork: true,
      details: "Louisville's beloved dive bar since 2007. German & Belgian beers, live music, two dog-friendly patios. Built a site that captures the vibe and keeps regulars informed."
    },
    {
      id: "copperbarrelbrewing",
      title: "Copper Barrel Brewing",
      url: "https://copper-barrel-brewing.vercel.app",
      preview: "/previews/copper-barrel-brewing.png",
      ogImage: "/og-images/copper-barrel-brewing-og.png",
      qrCode: "/qr-codes/copper-barrel-brewing-qr.png",
      description: "Louisville craft brewery & taproom",
      altText: "Copper Barrel Brewing Louisville Kentucky craft brewery taproom local beers on tap fresh brews",
      category: "Brewery",
      specWork: true,
      details: "Louisville's craft brewery featuring small-batch beers brewed on-site. Full taproom experience with rotating taps, events calendar, and online shop for merchandise."
    },
    {
      id: "crushcore-pt",
      title: "CrushCORE",
      url: "https://crushcore-pt.vercel.app",
      preview: "/previews/crushcore-pt.png",
      ogImage: "/og-images/crushcore-pt-og.png",
      qrCode: "/qr-codes/crushcore-pt-qr.png",
      description: "Orthopedic & pelvic health physical therapy",
      altText: "CrushCORE Louisville Kentucky physical therapy Dr Jaclyn Crush orthopedic pelvic health cash-based PT",
      category: "Healthcare",
      specWork: true,
      details: "Cash-based physical therapy practice specializing in orthopedic and pelvic health. Dr. Jaclyn Crush, PT, DPT offers personalized one-on-one care including telehealth and home visits."
    },
    {
      id: "rejuvenation",
      title: "Rejuvenation Med Spa",
      url: "https://rejuvenation-med-spa.vercel.app",
      preview: "/previews/rejuvenation.png",
      ogImage: "/og-images/rejuvenation-og.png",
      qrCode: "/qr-codes/rejuvenation-qr.png",
      description: "Pain management & medical aesthetics",
      altText: "Rejuvenation Med Spa East End Louisville pain management and medical aesthetics with Dr. Labatia",
      category: "Med Spa",
      specWork: true,
      details: "Pain management meets medical aesthetics. Dr. Labatia brings 30+ years of expertise to Louisville's East End. Clean, trust-forward design for a practice that deserves to be found."
    },
    {
      id: "primary-express-care",
      title: "Primary Express Care",
      url: "https://primary-express-care.vercel.app",
      preview: "/previews/primary-express-care.png",
      ogImage: "/og-images/primary-express-care-og.png",
      qrCode: "/qr-codes/primary-express-care-qr.png",
      description: "Multi-location urgent care & wellness",
      altText: "Primary Express Care Louisville urgent care two locations Dutchmans Lane Dixie Highway walk-ins welcome",
      category: "Healthcare",
      specWork: true,
      details: "Multi-location urgent care serving Louisville (Dutchmans Lane & Dixie Highway). Walk-ins welcome, open 7 days. Service search, 3-step booking wizard, real-time wait times."
    },
    {
      id: "kyfamilylawyer",
      title: "A. Holland Houston",
      url: "https://ky-family-lawyer.vercel.app",
      preview: "/previews/ky-family-lawyer.png",
      ogImage: "/og-images/ky-family-lawyer-og.png",
      qrCode: "/qr-codes/ky-family-lawyer-qr.png",
      description: "Louisville family law attorney & mediator",
      altText: "A. Holland Houston Louisville Kentucky family law attorney divorce mediation child custody domestic violence",
      category: "Legal",
      specWork: true,
      details: "Compassionate family law services in Louisville. Divorce, mediation, child custody, and domestic violence cases handled with care. A trust-forward design for sensitive legal matters."
    },
    {
      id: "highlandcleaners",
      title: "Highland Cleaners",
      url: "https://highland-cleaners.vercel.app",
      preview: "/previews/highland-cleaners.png",
      ogImage: "/og-images/highland-cleaners-og.png",
      qrCode: "/qr-codes/highland-cleaners-qr.png",
      description: "Louisville's trusted dry cleaner since 1944",
      altText: "Highland Cleaners Louisville Kentucky dry cleaning 12 locations free pickup delivery eco-friendly green cleaning",
      category: "Services",
      specWork: true,
      details: "Family-owned dry cleaning serving Louisville for 80 years. 12 convenient locations, free pickup & delivery, eco-friendly green cleaning.",
      versions: [
        {
          label: "Essential",
          url: "https://highland-cleaners-tier1.vercel.app",
          preview: "/previews/highland-cleaners-tier1.png",
          ogImage: "/previews/highland-cleaners-tier1.png",
          qrCode: "/qr-codes/highland-cleaners-tier1-qr.png",
          description: "Where most businesses start. Single page, essential info, quick to scan. Gets you found, gets you calls.",
          features: "Single page • Contact info • Service list • Mobile-ready"
        },
        {
          label: "Growth",
          url: "https://highland-cleaners.vercel.app",
          preview: "/previews/highland-cleaners.png",
          ogImage: "/og-images/highland-cleaners-og.png",
          qrCode: "/qr-codes/highland-cleaners-qr.png",
          description: "Ready to compete. Multiple pages, service details, location finder. Builds trust and drives action.",
          features: "Multi-page • Location finder • Service breakdown • SEO optimized"
        },
        {
          label: "Professional",
          url: "https://highland-cleaners-v2.vercel.app",
          preview: "/previews/highland-cleaners-v2.png",
          ogImage: "/og-images/highland-cleaners-v2-og.png",
          qrCode: "/qr-codes/highland-cleaners-v2-qr.png",
          description: "Standing out from the crowd. Bold rebrand, premium feel, refined interactions. Commands attention.",
          features: "Custom branding • Premium design • Photo gallery • Animations"
        },
        {
          label: "Enterprise",
          url: "https://highland-cleaners-tier4.vercel.app",
          preview: "/previews/highland-cleaners-tier4.png",
          ogImage: "/previews/highland-cleaners-tier4.png",
          qrCode: "/qr-codes/highland-cleaners-tier4-qr.png",
          description: "Full business system. Customer accounts, order tracking, admin dashboard. Your website works for you.",
          features: "User auth • Order tracking • Admin dashboard • Analytics"
        }
      ]
    },
    {
      id: "lawnco",
      title: "Lawnco Louisville",
      url: "https://lawnco-louisville.vercel.app",
      preview: "/previews/lawnco-louisville.png",
      ogImage: "/og-images/lawnco-louisville-og.png",
      qrCode: "/qr-codes/lawnco-louisville-qr.png",
      description: "Premier landscaping & lawn care since 1978",
      altText: "Lawnco Louisville Kentucky landscaping lawn care maintenance residential commercial family owned",
      category: "Services",
      specWork: true,
      details: "Louisville's trusted landscaping and lawn maintenance specialists since 1978. Family-owned, serving residential and commercial properties with expert care."
    },
    {
      id: "cleaningbyregina",
      title: "Cleaning By Regina",
      url: "https://cleaning-by-regina.vercel.app",
      preview: "/previews/cleaning-by-regina.png",
      ogImage: "/previews/cleaning-by-regina.png",
      qrCode: "/qr-codes/cleaning-by-regina-qr.png",
      description: "Louisville's trusted cleaning service",
      altText: "Cleaning By Regina Louisville Kentucky residential commercial cleaning service 25 years experience licensed insured",
      category: "Services",
      specWork: true,
      details: "Professional residential and commercial cleaning services in Louisville. 25+ years of experience. Licensed, insured, and trusted by thousands of families."
    },
    {
      id: "passtimefishhouse",
      title: "PassTime Fish House",
      url: "https://passtime-fish-house.vercel.app",
      preview: "/previews/passtime-fish-house.png",
      ogImage: "/previews/passtime-fish-house.png",
      qrCode: "/qr-codes/passtime-fish-house-qr.png",
      description: "Louisville's best kept secret since 2001",
      altText: "PassTime Fish House Jeffersontown Louisville Kentucky fresh fried fish cod sandwich dive bar",
      category: "Restaurant",
      specWork: true,
      details: "Home of the 'Almost Famous' Cod Sandwich. Fresh fried fish, cold beer, and dive bar charm in Jeffersontown. Cash only, ATM inside. Louisville's best kept secret since 2001."
    },
    {
      id: "toninichurchsupply",
      title: "Tonini Church Supply",
      url: "https://tonini-church-supply.vercel.app",
      preview: "/previews/tonini-church-supply.png",
      ogImage: "/previews/tonini-church-supply.png",
      qrCode: "/qr-codes/tonini-church-supply-qr.png",
      description: "Serving the faithful since 1883",
      altText: "Tonini Church Supply Co Cincinnati Ohio church goods vestments sacred art candles clergy apparel 142 years",
      category: "Retail",
      specWork: true,
      location: "Cincinnati, OH",
      details: "Five generations of the Tonini family providing quality church goods, vestments, and sacred art to parishes throughout the Midwest. 142 years of service, 18,000+ products."
    },
    {
      id: "tastefultravels",
      title: "Tasteful Travels",
      url: "https://tasteful-travels.vercel.app",
      preview: "/previews/tasteful-travels.png",
      ogImage: "/previews/tasteful-travels.png",
      qrCode: "/qr-codes/tasteful-travels-qr.png",
      description: "Global flavors, Kentucky soul",
      altText: "Tasteful Travels World Market Logan Street Market Louisville Kentucky Proud globally sourced specialty foods",
      category: "Retail",
      specWork: true,
      details: "An inspirational pantry shop at Logan Street Market. Kentucky Proud products alongside globally sourced specialty foods from Mediterranean, Asian, European, and American traditions."
    },
    {
      id: "kentuckianagastro",
      title: "Kentuckiana Gastroenterology",
      url: "https://kentuckiana-gastro.vercel.app",
      preview: "/previews/kentuckiana-gastro.png",
      ogImage: "/previews/kentuckiana-gastro.png",
      qrCode: "/qr-codes/kentuckiana-gastro-qr.png",
      description: "Expert gastroenterology care you can trust",
      altText: "Kentuckiana Gastroenterology Louisville colonoscopy endoscopy digestive health specialists",
      category: "Medical",
      specWork: true,
      details: "Board-certified gastroenterology specialists serving Louisville since 1984. Colonoscopy, endoscopy, ERCP, and comprehensive digestive health care at their state-of-the-art surgery center."
    },
    {
      id: "kuhnallergy",
      title: "Dr. Forrest S. Kuhn, MD",
      url: "https://kuhn-allergy.vercel.app",
      preview: "/previews/kuhn-allergy.png",
      ogImage: "/previews/kuhn-allergy.png",
      qrCode: "/qr-codes/kuhn-allergy-qr.png",
      description: "Louisville's trusted allergy & asthma specialist",
      altText: "Dr. Forrest S. Kuhn MD Louisville allergist asthma specialist board certified 30 years experience Dupont Square",
      category: "Medical",
      specWork: true,
      details: "Board-certified allergist with 30+ years experience at Dupont Square. Specializes in seasonal allergies, food allergies, asthma management, insect allergies, drug reactions, and skin allergy testing. Accepting new patients, most insurance accepted."
    },
    {
      id: "louisvillenailsspa",
      title: "Louisville Nails & Spa",
      url: "https://louisville-nails-spa.vercel.app",
      preview: "/previews/louisville-nails-spa.png",
      ogImage: "/previews/louisville-nails-spa.png",
      qrCode: "/qr-codes/louisville-nails-spa-qr.png",
      description: "Treat yourself to beautiful nails",
      altText: "Louisville Nails and Spa Bardstown Road manicure pedicure nail art beauty salon",
      category: "Beauty",
      specWork: true,
      details: "Louisville's premier nail salon on Bardstown Road. Classic manicures to stunning nail art, relaxing pedicures, and exceptional service in a welcoming atmosphere. Every visit is special."
    },
    {
      id: "chabadofkentucky",
      title: "Chabad of Kentucky",
      url: "https://chabad-of-kentucky.vercel.app",
      preview: "/previews/chabad-of-kentucky.png",
      ogImage: "/previews/chabad-of-kentucky.png",
      qrCode: "/qr-codes/chabad-of-kentucky-qr.png",
      description: "Bringing Jewish life to the Bluegrass",
      altText: "Chabad of Kentucky Louisville Jewish Learning Center programs education community services",
      category: "Nonprofit",
      specWork: true,
      details: "Louisville's Jewish Learning Center serving Kentucky since 1985. Programs include Jewish Day School, Friendship Circle, holiday celebrations, and Shabbat services. Rebuilding after their 2022 fire."
    },
    {
      id: "paintspotlouisville",
      title: "Paint Spot",
      url: "https://paint-spot-louisville.vercel.app",
      preview: "/previews/paint-spot-louisville.png",
      ogImage: "/previews/paint-spot-louisville.png",
      qrCode: "/qr-codes/paint-spot-louisville-qr.png",
      description: "Unleash your inner artist",
      altText: "Paint Spot Louisville paint your own pottery studio parties events creative destination since 2000",
      category: "Entertainment",
      specWork: true,
      details: "Louisville's creative destination since 2000. Paint your own pottery, host unforgettable parties, and create lasting memories. 500+ pottery options, 10K+ happy artists, 4.9 star rating."
    },
    {
      id: "mairamediterranean",
      title: "Maira Mediterranean",
      url: "https://maira-mediterranean.vercel.app",
      preview: "/previews/maira-mediterranean.png",
      ogImage: "/previews/maira-mediterranean.png",
      qrCode: "/qr-codes/maira-mediterranean-qr.png",
      description: "Authentic Mediterranean cuisine",
      altText: "Maira Mediterranean restaurant Louisville authentic Mediterranean cuisine fresh ingredients family recipes",
      category: "Restaurant",
      specWork: true,
      details: "Authentic Mediterranean cuisine in Louisville. Fresh ingredients, family recipes, and warm hospitality. Experience the flavors of the Mediterranean."
    },
    {
      id: "cardinaluniforms",
      title: "Cardinal Uniforms",
      url: "https://cardinal-uniforms.vercel.app",
      preview: "/previews/cardinal-uniforms.png",
      ogImage: "/previews/cardinal-uniforms.png",
      qrCode: "/qr-codes/cardinal-uniforms-qr.png",
      description: "Professional uniforms and workwear",
      altText: "Cardinal Uniforms Louisville professional uniforms workwear scrubs corporate apparel embroidery",
      category: "Retail",
      specWork: true,
      details: "Louisville's source for professional uniforms and workwear. Scrubs, corporate apparel, and custom embroidery. Outfitting businesses and professionals since day one."
    },
    {
      id: "credituniontemplate",
      title: "Credit Union Template",
      url: "https://credit-union-template-demo.vercel.app",
      preview: "/previews/credit-union-template.png",
      ogImage: "/previews/credit-union-template.png",
      qrCode: "/qr-codes/credit-union-template-qr.png",
      description: "Modern credit union website template",
      altText: "Credit Union website template modern banking financial services online banking member services",
      category: "Financial",
      specWork: true,
      details: "Modern website template for credit unions and financial institutions. Features online banking integration, member services, and loan applications. Built for trust and accessibility."
    },
    {
      id: "uofldemo",
      title: "UofL Demo",
      url: "https://uofl-demo.vercel.app",
      preview: "/previews/uofl-demo.png",
      ogImage: "/previews/uofl-demo.png",
      qrCode: "/qr-codes/uofl-demo-qr.png",
      description: "University website template demo",
      altText: "University of Louisville website demo higher education admissions campus student portal",
      category: "Education",
      specWork: true,
      details: "Modern university website template showcasing higher education web design. Features admissions portal, campus life, academics, and student resources. Go Cards!"
    },
    {
      id: "springhurstendo",
      title: "Springhurst Endodontics",
      url: "https://springhurst-endo.vercel.app",
      preview: "/previews/springhurst-endo.png",
      ogImage: "/previews/springhurst-endo.png",
      qrCode: "/qr-codes/springhurst-endo-qr.png",
      description: "Expert root canal care",
      altText: "Springhurst Endodontics Louisville root canal specialists Dr. Jolanta Sauer comfortable environment",
      category: "Medical",
      specWork: true,
      details: "5-star rated root canal specialists in Louisville. Led by Dr. Jolanta Sauer, providing the highest standard of endodontic care in a comfortable environment. Book online appointments available."
    },
    {
      id: "dgvservices",
      title: "dGv Services",
      url: "https://dgv-services.vercel.app",
      preview: "/previews/dgv-services.png",
      ogImage: "/previews/dgv-services.png",
      qrCode: "/qr-codes/dgv-services-qr.png",
      description: "Expert medical billing & revenue management",
      altText: "dGv Services Crestwood Kentucky medical billing healthcare revenue management insurance claims workers compensation",
      category: "Medical",
      specWork: true,
      location: "Crestwood, KY",
      details: "Medical billing and healthcare revenue management specialists since 2002. 25+ years experience in workers' compensation, auto, and liability insurance claims. HIPAA compliant, certified coders. Serving Kentucky healthcare providers."
    },
    {
      id: "vancestovall",
      title: "Vance & Stovall Optometry",
      url: "https://vance-stovall-optometry.vercel.app",
      preview: "/previews/vance-stovall-optometry.png",
      ogImage: "/previews/vance-stovall-optometry.png",
      qrCode: "/qr-codes/vance-stovall-optometry-qr.png",
      description: "Clear vision, personal care",
      altText: "Drs. Vance and Stovall Optometry downtown Louisville Kentucky independent eye care practice comprehensive exams designer eyewear",
      category: "Medical",
      specWork: true,
      details: "Downtown Louisville's trusted independent optometry practice. 40+ years providing comprehensive eye care with a personal touch. Designer eyewear, contact lens fitting, eye disease management. Located near the 2nd Street Bridge."
    },
    {
      id: "dermatologyassociates",
      title: "Dermatology Associates PSC",
      url: "https://dermatology-associates-psc.vercel.app",
      preview: "/previews/dermatology-associates-psc.png",
      ogImage: "/previews/dermatology-associates-psc.png",
      qrCode: "/qr-codes/dermatology-associates-psc-qr.png",
      description: "Expert skin care you can trust",
      altText: "Dermatology Associates PSC Louisville Kentucky board-certified dermatologists medical surgical cosmetic dermatology skin cancer treatment",
      category: "Medical",
      specWork: true,
      details: "Louisville's trusted dermatology practice with board-certified physicians. Comprehensive skin care including medical dermatology, surgical procedures, and cosmetic treatments. Skin cancer screening and treatment specialists."
    },
    {
      id: "louisvillefamilychiro",
      title: "Louisville Family Chiropractic",
      url: "https://louisville-family-chiro.vercel.app",
      preview: "/previews/louisville-family-chiro.png",
      ogImage: "/previews/louisville-family-chiro.png",
      qrCode: "/qr-codes/louisville-family-chiro-qr.png",
      description: "Whole family wellness care",
      altText: "Louisville Family Chiropractic Kentucky chiropractor spinal adjustments family wellness care pain relief natural healing",
      category: "Medical",
      specWork: true,
      details: "Family-focused chiropractic care in Louisville. Gentle spinal adjustments for all ages, from infants to seniors. Natural pain relief, wellness care, and preventive treatments to keep your whole family healthy."
    },
    {
      id: "grayfamilydentistry",
      title: "Gray Family Dentistry",
      url: "https://gray-family-dentistry.vercel.app",
      preview: "/previews/gray-family-dentistry.png",
      ogImage: "/previews/gray-family-dentistry.png",
      qrCode: "/qr-codes/gray-family-dentistry-qr.png",
      description: "Smiles for the whole family",
      altText: "Gray Family Dentistry Louisville Kentucky family dentist cosmetic dentistry cleanings fillings crowns dental implants",
      category: "Medical",
      specWork: true,
      details: "Comprehensive family dentistry serving Louisville. General and cosmetic dental services including cleanings, fillings, crowns, and implants. Creating healthy smiles for patients of all ages in a comfortable environment."
    },
    {
      id: "dermcarepractitioners",
      title: "DermCARE Practitioners",
      url: "https://dermcare-practitioners.vercel.app",
      preview: "/previews/dermcare-practitioners.png",
      ogImage: "/previews/dermcare-practitioners.png",
      qrCode: "/qr-codes/dermcare-practitioners-qr.png",
      description: "Advanced dermatology solutions",
      altText: "DermCARE Practitioners Louisville Kentucky dermatology clinic advanced skin treatments acne eczema psoriasis cosmetic procedures",
      category: "Medical",
      specWork: true,
      details: "Advanced dermatology care in Louisville. Specializing in medical and cosmetic skin treatments including acne, eczema, psoriasis, and anti-aging procedures. Personalized treatment plans with cutting-edge technology."
    },
    {
      id: "jrspasalon",
      title: "JR Spa & Salon",
      url: "https://jr-spa-salon.vercel.app",
      preview: "/previews/jr-spa-salon.png",
      ogImage: "/og-images/jr-spa-salon-og.png",
      qrCode: "/qr-codes/jr-spa-salon-qr.png",
      description: "Louisville's premier men's grooming since 1976",
      altText: "JR Spa and Salon for Men Louisville Kentucky luxury grooming spa haircuts massage facials since 1976",
      category: "Spa",
      specWork: true,
      details: "Dark luxury aesthetic for Louisville's premier men's spa, established 1976. Gold accents, elegant typography, service booking interface. A refined digital presence matching their 48-year legacy."
    },
    {
      id: "playthingstoyshoppe",
      title: "Playthings Toy Shoppe",
      url: "https://playthings-toy-shoppe.vercel.app",
      preview: "/previews/playthings-toy-shoppe.png",
      ogImage: "/og-images/playthings-toy-shoppe-og.png",
      qrCode: "/qr-codes/playthings-toy-shoppe-qr.png",
      description: "Louisville's family-owned toy store since 2001",
      altText: "Playthings Toy Shoppe Louisville St Matthews Westport Village family-owned toy store LEGO Jellycat since 2001",
      category: "Retail",
      specWork: true,
      details: "Playful design for Louisville's beloved family toy store. 2 locations (St. Matthews & Westport Village), colorful animations, brand showcase. Fredoka + Nunito fonts capture the fun, family-friendly spirit."
    },
    {
      id: "halseyflats",
      title: "Halsey Flats",
      url: "https://halsey-flats.vercel.app",
      preview: "/previews/halsey-flats.png",
      ogImage: "/og-images/halsey-flats-og.png",
      qrCode: "/qr-codes/halsey-flats-qr.png",
      description: "Elevated living in St. Matthews",
      altText: "Halsey Flats luxury apartments St Matthews Louisville Kentucky 2-4 bedroom floor plans pool fitness center amenities",
      category: "Real Estate",
      specWork: true,
      details: "Tier 3 demo for St. Matthews luxury apartments. 5 floor plans ($1,195-$1,795/mo), 3D card hover effects, tour scheduling, amenities showcase, neighborhood guide. Modern React + Framer Motion with parallax hero."
    },
    {
      id: "sophiasrugs",
      title: "Sophia's Rugs",
      url: "https://sophias-rugs.vercel.app",
      preview: "/previews/sophias-rugs.png",
      ogImage: "/og-images/sophias-rugs-og.png",
      qrCode: "/qr-codes/sophias-rugs-qr.png",
      description: "Exquisite rugs & expert care since 1998",
      altText: "Sophia's Rugs Louisville Kentucky Oriental area outdoor rugs professional cleaning repair appraisal services",
      category: "Retail",
      specWork: true,
      details: "Tier 3 e-commerce demo for Louisville's premier rug destination. Oriental, area, and outdoor rugs plus professional cleaning, repair, stain removal, and appraisal services. Shopping cart, search/filter, lightbox gallery, 3D card effects."
    },
    {
      id: "mallardcrossing",
      title: "Mallard Crossing",
      url: "https://mallard-crossing.vercel.app",
      preview: "/previews/mallard-crossing.png",
      ogImage: "/og-images/mallard-crossing-og.png",
      qrCode: "/qr-codes/mallard-crossing-qr.png",
      description: "Estate living in St. Matthews, Louisville",
      altText: "Mallard Crossing apartments St Matthews Louisville KY luxury apartments estate living pet friendly",
      category: "Real Estate",
      specWork: true,
      details: "Tier 4 ultra-luxury demo for 600-unit apartment community in St. Matthews. AI Oracle leasing concierge, resident authentication with tier system, 6 floor plans (duck-themed names), tour scheduling. Forest green/copper estate theme for upscale renters."
    },
    {
      id: "claterjewelers",
      title: "Clater Jewelers",
      url: "https://clater-jewelers.vercel.app",
      preview: "/previews/clater-jewelers.png",
      ogImage: "/previews/clater-jewelers.png",
      qrCode: "/qr-codes/clater-jewelers-qr.png",
      description: "Where Louisville finds forever since 1949",
      altText: "Clater Jewelers Louisville Kentucky premier jeweler since 1949 direct diamond importers custom designs engagement rings",
      category: "Retail",
      specWork: true,
      details: "Louisville's premier jeweler since 1949. Direct diamond importers, custom designs, and 75+ years of excellence. Navy/gold palette with 3D card effects. GIA certified, 5.0 Google rating, family owned."
    },
    {
      id: "schwartzbankruptcy",
      title: "Schwartz Bankruptcy Law Center",
      url: "https://schwartz-bankruptcy.vercel.app",
      preview: "/previews/schwartz-bankruptcy.png",
      ogImage: "/previews/schwartz-bankruptcy.png",
      qrCode: "/qr-codes/schwartz-bankruptcy-qr.png",
      description: "Your fresh start begins here",
      altText: "Schwartz Bankruptcy Law Center Louisville Kentucky Richard A. Schwartz bankruptcy attorney Chapter 7 Chapter 13 debt relief",
      category: "Legal",
      specWork: true,
      details: "Louisville's trusted bankruptcy attorney with 25+ years experience. Richard A. Schwartz handles Chapter 7, Chapter 13, and business bankruptcy. Platinum Client Champion 2023, AV Preeminent rated. Two locations: Louisville & New Albany. Free consultation."
    },
    {
      id: "affinitydental",
      title: "Affinity Dental",
      url: "https://affinity-dental.vercel.app",
      preview: "/previews/affinity-dental.png",
      ogImage: "/previews/affinity-dental.png",
      qrCode: "/qr-codes/affinity-dental-qr.png",
      description: "Louisville's 5-star rated dental practice",
      altText: "Affinity Dental Louisville Kentucky Dr Shannon Vickery DMD 23 years experience general cosmetic dentistry Invisalign implants",
      category: "Medical",
      specWork: true,
      details: "Tier 4 demo for Louisville's top-rated dental practice. Dr. Shannon Vickery with 23+ years experience. Patient portal, admin dashboard, 3-step booking wizard, toast notifications. $99 new patient special. Orange brand palette matching their existing identity."
    },
    {
      id: "jbhdental",
      title: "JBH Dental",
      url: "https://jbh-dental.vercel.app",
      preview: "/previews/jbh-dental.png",
      ogImage: "/og-images/jbh-dental-og.png",
      qrCode: "/qr-codes/jbh-dental-qr.png",
      description: "Trust your smile to experience",
      altText: "JBH Dental Louisville Kentucky Dr James B Howell DMD 27 years experience family dentistry St Matthews Dutchmans Lane",
      category: "Medical",
      specWork: true,
      details: "Tier 4 demo for trusted Louisville family dentist. Dr. James B. Howell, DMD with 27+ years of experience since 1998. Patient portal, admin dashboard, 3-step booking wizard, toast notifications. Sage green brand palette. Located on Dutchmans Lane in St. Matthews area."
    },
    {
      id: "tomdrexler",
      title: "Tom Drexler",
      url: "https://tom-drexler.vercel.app",
      preview: "/previews/tom-drexler.png",
      ogImage: "/previews/tom-drexler.png",
      qrCode: "/qr-codes/tom-drexler-qr.png",
      description: "Louisville's Red Carpet Treatment Since 1982",
      altText: "Tom Drexler Plumbing Air Electric Louisville Kentucky HVAC plumbing electrical drain sewer bathroom remodeling 200+ service trucks 4th generation master plumber",
      category: "Services",
      specWork: true,
      details: "Tier 2 demo for Louisville's premier home services company. 4th generation Master Plumber. HVAC, Plumbing, Electrical, Drain & Sewer, Bathroom Remodeling. 200+ service trucks serving Louisville Metro & Southern Indiana. 24/7 Emergency Service. Red/white/blue patriotic branding."
    }
  ];

  const [expandedClient, setExpandedClient] = useState(null);
  const [activeClientVersion, setActiveClientVersion] = useState({});
  const [clientFilter, setClientFilter] = useState('All');

  // Category grouping for filter tabs
  const categoryGroups = {
    'All': null,
    'Healthcare': ['Medical', 'Healthcare', 'Fitness'],
    'Beauty & Spa': ['Beauty', 'Med Spa', 'Spa'],
    'Food & Drink': ['Cafe', 'Restaurant', 'Bar', 'Brewery'],
    'Retail': ['Retail', 'Jewelry'],
    'Entertainment': ['Entertainment', 'Youth', 'Nonprofit'],
    'Services': ['Services'],
    'Legal & Finance': ['Legal', 'Financial'],
    'Real Estate': ['Real Estate'],
    'Education': ['Education'],
  };

  const filteredClients = clientFilter === 'All'
    ? localClients
    : localClients.filter(c => categoryGroups[clientFilter]?.includes(c.category));

  // Practical Apps - career/productivity focused
  const practicalProjects = [
    {
      id: "ibanistatools",
      title: "Ibanista Tools",
      url: "https://ibanista-tools.vercel.app",
      preview: "/previews/ibanista-tools-preview.png",
      ogImage: "/og-images/ibanista-tools-og.png",
      qrCode: "/qr-codes/ibanista-tools-qr.png",
      description: "UK-France relocation calculator and region finder",
      altText: "Ibanista Tools UK France relocation budget calculator region finder quiz for British expatriates",
      category: "Client",
      tech: ["React", "TypeScript", "Tailwind", "FastAPI"],
      details: "Full-stack relocation toolkit for Ibanista (UK-France relocation specialists). Features interactive budget calculator with real cost data, region finder quiz matching lifestyle preferences to French departments, email capture with SQLite persistence, and admin dashboard. React/TypeScript frontend on Vercel, FastAPI backend on Render."
    },
    {
      id: "fretvision",
      title: "FretVision",
      url: "https://guitar.projectlavos.com",
      preview: "/previews/guitar.png",
      ogImage: "/og-images/guitar-og.png",
      description: "Learn guitar scales visually with interactive lessons",
      altText: "FretVision guitar learning app showing interactive fretboard visualization with scale patterns and MIDI playback controls",
      category: "Education",
      tech: ["React", "Python", "MIDI", "Canvas"],
      details: "Guitar learning apps exist, but none combine fretboard visualization, tab playback, and riff generation in one place. The riff generator uses deterministic Python for music theory—LLMs can't count frets accurately."
    },
    {
      id: "phishguard",
      title: "PhishGuard",
      url: "https://phishguard.projectlavos.com",
      preview: "/previews/phishguard.png",
      ogImage: "/og-images/phishguard-og.png",
      description: "Detect phishing emails before they fool your team",
      altText: "PhishGuard email security tool analyzing suspicious email content for phishing indicators using sentiment analysis",
      category: "Security",
      tech: ["React", "NLP", "Python", "FastAPI"],
      details: "Phishing attacks exploit human psychology, not just technical vulnerabilities. PhishGuard analyzes email sentiment patterns to flag manipulation tactics before they reach the inbox."
    },
    {
      id: "vantage",
      title: "Vantage",
      url: "https://jobs.projectlavos.com",
      preview: "/previews/jobs.png",
      ogImage: "/og-images/jobs-og.png",
      description: "See which Louisville companies are actually hiring",
      altText: "Vantage job market analytics dashboard showing Louisville KY employment trends and company hiring patterns",
      category: "Career",
      tech: ["React", "PostgreSQL", "Python", "Vercel"],
      details: "Job boards show listings. Vantage shows patterns—which companies are hiring, what skills are trending locally, and how to position yourself. Built for Louisville first."
    },
    {
      id: "jobtrack",
      title: "JobTrack",
      url: "https://jobtrack.projectlavos.com",
      preview: "/previews/jobtrack.png",
      ogImage: "/og-images/jobtrack-og.png",
      description: "Track applications and never miss a follow-up",
      altText: "JobTrack application tracking dashboard showing job applications, response rates, and interview pipeline",
      category: "Career",
      tech: ["React", "Supabase", "TypeScript"],
      details: "Spreadsheets work until they don't. JobTrack adds structure to the job search grind—tracking applications, follow-ups, and outcomes in one place."
    }
  ];

  // Experimental/Conceptual - Jungian depth psychology explorations
  const experimentalProjects = [
    {
      id: "ourjourney",
      title: "OurJourney",
      url: "https://ourjourney.projectlavos.com",
      preview: "/previews/ourjourney.png",
      ogImage: "/og-images/ourjourney-og.png",
      description: "A private space for two people to document what matters",
      altText: "OurJourney couple experience tracker app showing shared memories and private journal entries",
      category: "Personal",
      tech: ["React", "Supabase", "Vercel"],
      details: "Social media makes sharing performative. OurJourney is the opposite—a private space for two people to document what matters to them, without an audience."
    },
    {
      id: "psyche",
      title: "Psyche",
      url: "https://psyche-jung.vercel.app",
      preview: "/previews/psyche-jung.png",
      ogImage: "/previews/psyche-jung.png",
      description: "Four portals into Jungian depth psychology",
      altText: "Psyche Jungian exploration hub - four portals into depths of understanding: soul, shadow, archetype, and synthesis",
      category: "Conceptual",
      tech: ["React", "Framer Motion"],
      details: "Four portals into the depths of understanding. Soul, shadow, archetype, and synthesis. The hub connecting explorations of Jungian depth psychology."
    },
    {
      id: "threshold",
      title: "Threshold",
      url: "https://threshold-liminal.vercel.app",
      preview: "/previews/threshold-liminal.png",
      ogImage: "/previews/threshold-liminal.png",
      description: "An exploration of liminal spaces and transformation",
      altText: "Threshold Liminal creative digital experience exploring liminal spaces and transitional moments",
      category: "Conceptual",
      tech: ["React", "CSS Animation"],
      details: "The in-between places where transformation happens. Neither here nor there, but becoming. An exploration of liminal spaces—the thresholds between states."
    },
    {
      id: "umbra",
      title: "Umbra",
      url: "https://umbra-shadow.vercel.app",
      preview: "/previews/umbra-shadow.png",
      ogImage: "/previews/umbra-shadow.png",
      description: "Exploring shadow work and integration",
      altText: "Umbra shadow integration exploring the rejected parts of ourselves that hold our greatest power",
      category: "Conceptual",
      tech: ["React", "Canvas"],
      details: "The rejected parts of ourselves that hold our greatest power. What we deny, we cannot transform. An exploration of shadow work and integration."
    },
    {
      id: "forma",
      title: "Forma",
      url: "https://forma-archetypes.vercel.app",
      preview: "/previews/forma-archetypes.png",
      ogImage: "/previews/forma-archetypes.png",
      description: "Universal figures written into the collective unconscious",
      altText: "Forma archetypal patterns exploring universal figures and collective unconscious through interactive design",
      category: "Conceptual",
      tech: ["React", "SVG Animation"],
      details: "Universal figures that live in all of us. Hero, Shadow, Sage, Lover, Trickster, Mother. Patterns older than memory, written into the collective unconscious."
    },
    {
      id: "auriga",
      title: "Auriga",
      url: "https://auriga-chariot.vercel.app",
      preview: "/previews/auriga-chariot.png",
      ogImage: "/previews/auriga-chariot.png",
      description: "Human-AI collaboration through Plato's chariot metaphor",
      altText: "Auriga the charioteer exploring human-AI collaboration through Plato's chariot metaphor",
      category: "Conceptual",
      tech: ["React", "Framer Motion"],
      details: "The synthesis of human and AI collaboration. The charioteer holds the reins. The horses provide the power. Neither is complete alone. A philosophical exploration of orchestrated partnership."
    }
  ];

  // Combined for backward compatibility
  const projects = [...practicalProjects, ...experimentalProjects];

  const handleCardClick = (e, projectId) => {
    e.preventDefault();
    setExpandedProject(expandedProject === projectId ? null : projectId);
  };

  const handleVisitSite = (e, url) => {
    e.stopPropagation();
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Ambient background effects */}
      <div className="ambient-bg">
        <div className="orb-3" />
      </div>
      <div className="particles">
        <div className="particle" />
        <div className="particle" />
        <div className="particle" />
        <div className="particle" />
        <div className="particle" />
        <div className="particle" />
        <div className="particle" />
        <div className="particle" />
        <div className="particle" />
        <div className="particle" />
      </div>

      <main>
      {/* Hero Section - No header, chariot below content */}
      <section
        id="hero"
        className="relative min-h-[100svh] flex flex-col items-center justify-center px-6 md:px-12 lg:px-24 py-12 texture-velvet overflow-hidden"
      >
        {/* Ambient Background */}
        <div className="hero-ambient" aria-hidden="true">
          <div className="hero-gradient-base" />
          <div className="hero-orb hero-orb--teal-1" />
          <div className="hero-orb hero-orb--teal-2" />
          <div className="hero-orb hero-orb--teal-3" />
        </div>

        {/* Centered Content */}
        <div className="max-w-2xl mx-auto relative z-10 text-center flex flex-col items-center">
          {/* Profile */}
          <div className="flex flex-col items-center animate-fade-in mb-6">
            <img
              src="/headshot.png"
              alt="Matthew Scott - Web Developer and Consultant based in Louisville, Kentucky"
              className="headshot w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-full border border-slate-600/50 object-cover"
            />
            <p className="text-[10px] text-slate-500 mt-3 font-sans tracking-[0.3em] uppercase">
              Louisville, KY
            </p>
          </div>

          {/* Name */}
          <div className="relative mb-6">
            <div className="w-8 h-px bg-gradient-to-r from-transparent via-teal-500 to-transparent mx-auto mb-4" />
            <h1 className="heading-serif text-3xl sm:text-4xl md:text-5xl font-semibold text-white tracking-[0.04em]">
              Matthew Scott
            </h1>
          </div>

          {/* Tagline */}
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed mb-2 max-w-md mx-auto font-light">
            I untangle complexity. Then I make it useful.
          </p>
          <p className="text-xs text-slate-500 mb-8 max-w-md mx-auto">
            Louisville websites. AI systems. Working software.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row justify-center gap-3 mb-12">
            <button
              onClick={scrollToWork}
              className="btn-tactile group flex items-center justify-center gap-2 px-5 py-2.5 bg-transparent border border-slate-600 text-slate-300 hover:border-teal-500 hover:text-teal-400 text-xs tracking-wider uppercase transition-all duration-300"
            >
              See My Work
            </button>
            <a
              href="#method"
              className="btn-tactile group flex items-center justify-center gap-2 px-5 py-2.5 bg-transparent border border-slate-600 text-slate-300 hover:border-teal-500 hover:text-teal-400 text-xs tracking-wider uppercase transition-all duration-300"
            >
              How I Work
            </a>
          </div>

          {/* Chariot Logo */}
          <div className="chariot-logo mb-12">
            <img
              src="/projectlavos-watermark-white.svg"
              alt="Project Lavos"
              className="w-48 h-24 md:w-64 md:h-32 object-contain opacity-85"
            />
          </div>
        </div>

        {/* Principles - Footer of hero, horizontal */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-x-8 text-[10px] tracking-widest uppercase">
          {principles.map((principle, idx) => (
            <span
              key={idx}
              className="principle-tag text-slate-500 hover:text-teal-400 cursor-help transition-colors duration-300"
              title={principle.tooltip}
            >
              {principle.text}
            </span>
          ))}
        </div>
      </section>

      {/* Louisville Section */}
      <section
        id="louisville"
        className={`px-6 md:px-12 lg:px-24 py-20 border-t border-slate-800 transition-all duration-700 spotlight-warm section-glow-full ${visibleSections.louisville ? 'opacity-100 translate-y-0 in-view' : 'opacity-0 translate-y-8'}`}
      >
        <div className="max-w-6xl">
          <h2 className="heading-serif text-3xl md:text-4xl font-semibold text-white mb-2 neon-text">
            Louisville
          </h2>
          <p className="text-slate-400 mb-4">
            51 sites you can visit. Live. Deployed. Working.
          </p>
          <p className="text-xs text-slate-500 mb-6">
            Spec work built from public info. Not pitches. Proof.
          </p>

          {/* Category Filter Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide -mx-2 px-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}>
            {Object.keys(categoryGroups).map((group) => {
              const count = group === 'All' ? localClients.length : localClients.filter(c => categoryGroups[group]?.includes(c.category)).length;
              if (count === 0 && group !== 'All') return null;
              return (
                <button
                  key={group}
                  onClick={() => { setClientFilter(group); setExpandedClient(null); }}
                  className={`flex-shrink-0 px-3 py-1.5 text-xs font-medium rounded-full transition-all duration-200 whitespace-nowrap ${
                    clientFilter === group
                      ? 'bg-teal-500 text-slate-900'
                      : 'bg-teal-500/10 text-teal-400 hover:bg-teal-500/20 border border-teal-500/20'
                  }`}
                >
                  {group} <span className="ml-1 opacity-70">{count}</span>
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 transition-all duration-300">
            {filteredClients.map((client, index) => {
              const isClientExpanded = expandedClient === client.id;
              const isAboveFold = index < 9; // First 9 cards load eagerly

              return (
                <div
                  key={client.id}
                  className={`card-subtle-3d card-expandable card-click-hint ${isClientExpanded ? 'sm:col-span-2 lg:col-span-3 row-span-2 expanded' : ''}`}
                  onMouseMove={(e) => {
                    if (isClientExpanded) return; // Don't tilt when expanded
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = (e.clientX - rect.left) / rect.width - 0.5;
                    const y = (e.clientY - rect.top) / rect.height - 0.5;
                    const inner = e.currentTarget.querySelector('.card-3d-inner');
                    if (inner) {
                      // Subtle 8-degree rotation
                      inner.style.setProperty('--rotateX', `${-y * 8}deg`);
                      inner.style.setProperty('--rotateY', `${x * 8}deg`);
                    }
                  }}
                  onMouseLeave={(e) => {
                    const inner = e.currentTarget.querySelector('.card-3d-inner');
                    if (inner) {
                      inner.style.setProperty('--rotateX', '0deg');
                      inner.style.setProperty('--rotateY', '0deg');
                    }
                  }}
                >
                <div
                  onClick={() => setExpandedClient(isClientExpanded ? null : client.id)}
                  className={`
                    card-3d-inner card-press og-card group cursor-pointer rounded-lg overflow-hidden bg-slate-800/50 border border-slate-700/50 hover:border-teal-500/30 transition-all duration-300 ease-in-out texture-glass
                    ${expandedClient && !isClientExpanded ? 'opacity-60 scale-95' : 'opacity-100 scale-100'}
                  `}
                >
                  {/* Client Preview Image with Skeleton Loader */}
                  {(() => {
                    const activeVersion = client.versions?.[activeClientVersion[client.id] ?? 0];
                    const displayPreview = isClientExpanded && activeVersion ? activeVersion.preview : client.preview;
                    return (
                      <div className={`image-container overflow-hidden bg-slate-800 transition-all duration-300 ${isClientExpanded ? 'aspect-[16/6]' : 'aspect-video sm:aspect-[1200/630]'}`}>
                        {/* Skeleton shimmer loader */}
                        <div className="skeleton skeleton-loader absolute inset-0" />
                        <img
                          src={displayPreview}
                          alt={client.altText || `${client.title} - ${client.description} - Louisville local business website`}
                          className="w-full h-full object-cover object-center transition-all duration-300 group-hover:scale-105 relative z-10"
                          loading={isAboveFold ? "eager" : "lazy"}
                          onLoad={(e) => {
                            e.target.classList.add('loaded');
                            const skeleton = e.target.previousSibling;
                            if (skeleton) skeleton.style.opacity = '0';
                          }}
                          onError={(e) => {
                            e.target.style.display = 'none';
                            const skeleton = e.target.previousSibling;
                            if (skeleton) skeleton.style.opacity = '0';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                        <div className="hidden w-full h-full items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 absolute inset-0">
                          <span className="text-4xl font-bold text-teal-500/20">{client.title.charAt(0)}</span>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Client Info */}
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-sm font-semibold text-white">{client.title}</h3>
                          {client.location && (
                            <span className="text-[10px] text-slate-400 bg-slate-700/50 px-1.5 py-0.5 rounded">
                              {client.location}
                            </span>
                          )}
                          {client.specWork ? (
                            <span className="text-[10px] text-orange-400/80 bg-orange-500/10 px-1.5 py-0.5 rounded border border-orange-500/20">
                              Spec Work
                            </span>
                          ) : (
                            <span className="text-[10px] text-green-400/80 bg-green-500/10 px-1.5 py-0.5 rounded border border-green-500/20">
                              Client
                            </span>
                          )}
                        </div>
                        <p className={`text-xs text-slate-400 ${isClientExpanded ? '' : 'line-clamp-2'}`}>{client.description}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-xs text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded whitespace-nowrap">
                          {client.category}
                        </span>
                        <span
                          className={`text-teal-400 transition-transform duration-200 flex-shrink-0 ${isClientExpanded ? 'rotate-180' : ''}`}
                          title={isClientExpanded ? 'Click to collapse' : 'Click to expand'}
                        >
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="inline-block">
                            <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </span>
                      </div>
                    </div>

                    {/* Expanded Content */}
                    {isClientExpanded && (
                      <div className="mt-4 pt-4 border-t border-slate-700 animate-fade-in">
                        {/* Version Toggle (if multiple versions exist) */}
                        {client.versions && client.versions.length > 1 && (
                          <div className="mb-6">
                            <p className="text-xs text-slate-500 mb-3 uppercase tracking-wide">Website Evolution</p>
                            <div className="flex gap-2">
                              {client.versions.map((version, idx) => (
                                <button
                                  key={version.label}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveClientVersion(prev => ({ ...prev, [client.id]: idx }));
                                  }}
                                  className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                                    (activeClientVersion[client.id] ?? 0) === idx
                                      ? 'bg-teal-500 text-slate-900'
                                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                                  }`}
                                >
                                  {version.label}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Version-specific content */}
                        {(() => {
                          const activeVersion = client.versions?.[activeClientVersion[client.id] ?? 0];
                          const currentPreview = activeVersion?.preview || client.preview;
                          const currentOgImage = activeVersion?.ogImage || client.ogImage;
                          const currentQrCode = activeVersion?.qrCode || client.qrCode;
                          const currentUrl = activeVersion?.url || client.url;
                          const versionDescription = activeVersion?.description;
                          const versionFeatures = activeVersion?.features;

                          return (
                            <>
                              {/* Version Journey Copy (when versions exist) */}
                              {versionDescription && (
                                <div className="mb-4 p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
                                  <p className="text-sm text-slate-300 leading-relaxed mb-2">
                                    {versionDescription}
                                  </p>
                                  {versionFeatures && (
                                    <p className="text-xs text-teal-400/80">
                                      {versionFeatures}
                                    </p>
                                  )}
                                </div>
                              )}

                              {/* OG Image & QR Code Row */}
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                {/* Social Preview (OG Image) */}
                                <div className="md:col-span-2">
                                  <p className="text-xs text-slate-500 mb-2 uppercase tracking-wide">Social Preview</p>
                                  <div className="rounded-lg overflow-hidden border border-slate-700">
                                    <img
                                      src={currentOgImage}
                                      alt={`${client.title} social preview`}
                                      className="w-full h-auto"
                                      onError={(e) => {
                                        e.target.src = currentPreview;
                                      }}
                                    />
                                  </div>
                                </div>

                                {/* QR Code */}
                                <div>
                                  <p className="text-xs text-slate-500 mb-2 uppercase tracking-wide">Scan to Visit</p>
                                  <div className="rounded-lg overflow-hidden border border-slate-700 bg-white p-4 flex items-center justify-center min-h-[150px]">
                                    {currentQrCode ? (
                                      <img
                                        src={currentQrCode}
                                        alt={`QR code for ${client.title}`}
                                        className="w-full h-auto max-w-[150px]"
                                        onError={(e) => {
                                          e.target.style.display = 'none';
                                          e.target.nextSibling.style.display = 'block';
                                        }}
                                      />
                                    ) : null}
                                    <div className={`text-slate-400 text-xs text-center ${currentQrCode ? 'hidden' : 'block'}`}>
                                      Coming Soon
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Details (business overview - always shown) */}
                              <p className="text-sm text-slate-300 leading-relaxed mb-4">
                                {client.details}
                              </p>

                              {/* Action Buttons */}
                              <div className="flex gap-3 mt-4">
                                {currentUrl ? (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      window.open(currentUrl, '_blank');
                                    }}
                                    className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-900 text-xs font-semibold rounded transition-colors"
                                  >
                                    Visit Site →
                                  </button>
                                ) : (
                                  <span className="px-4 py-2 bg-slate-700 text-slate-400 text-xs font-semibold rounded">
                                    Coming Soon
                                  </span>
                                )}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setExpandedClient(null);
                                  }}
                                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white text-xs font-semibold rounded transition-colors"
                                >
                                  Close
                                </button>
                              </div>
                            </>
                          );
                        })()}
                      </div>
                    )}
                  </div>
                </div>
                </div>
              );
            })}
          </div>

          <p className="text-slate-400 text-sm mt-8 text-center">
            Are you a Louisville business looking to establish or improve your online presence?{' '}
            <a href="sms:+15023450525?body=Hey%20Matthew%2C%20I%20saw%20your%20portfolio%20and%20I%27m%20interested%20in%20discussing%20a%20website%20for%20my%20business." className="text-teal-400 hover:text-teal-300 transition-colors underline underline-offset-2">Let's talk.</a>
          </p>
        </div>
      </section>

      {/* Work Section */}
      <section
        ref={workSectionRef}
        id="work"
        className={`px-6 md:px-12 lg:px-24 py-16 border-t border-slate-800 transition-all duration-700 spotlight-warm section-glow-full ${visibleSections.work ? 'opacity-100 translate-y-0 in-view' : 'opacity-0 translate-y-8'}`}
      >
        <div className="max-w-6xl">
          <h2 className="heading-serif text-2xl md:text-3xl font-semibold text-white mb-4 neon-text-orange">
            The Work
          </h2>
          <p className="text-slate-400 mb-8">
            Tools that solve problems. Click to see for yourself.
          </p>

          {/* Practical Apps */}
          <h3 className="text-lg font-medium text-teal-400 mb-4 flex items-center gap-2">
            <span className="w-2 h-2 bg-teal-400 rounded-full"></span>
            Practical Apps
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 transition-all duration-300 mb-12">
            {practicalProjects.map((project, index) => {
              const isExpanded = expandedProject === project.id;
              const isAboveFold = true;

              return (
                <div
                  key={project.id}
                  className={`card-subtle-3d card-expandable card-click-hint ${isExpanded ? 'sm:col-span-2 lg:col-span-4 row-span-2 expanded' : ''}`}
                  onMouseMove={(e) => {
                    if (isExpanded) return;
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = (e.clientX - rect.left) / rect.width - 0.5;
                    const y = (e.clientY - rect.top) / rect.height - 0.5;
                    const inner = e.currentTarget.querySelector('.card-3d-inner');
                    if (inner) {
                      inner.style.setProperty('--rotateX', `${-y * 8}deg`);
                      inner.style.setProperty('--rotateY', `${x * 8}deg`);
                    }
                  }}
                  onMouseLeave={(e) => {
                    const inner = e.currentTarget.querySelector('.card-3d-inner');
                    if (inner) {
                      inner.style.setProperty('--rotateX', '0deg');
                      inner.style.setProperty('--rotateY', '0deg');
                    }
                  }}
                >
                <div
                  onClick={(e) => handleCardClick(e, project.id)}
                  className={`
                    card-3d-inner card-press og-card group cursor-pointer rounded-lg overflow-hidden bg-slate-800/50 border border-slate-700/50 hover:border-teal-500/30 transition-all duration-300 ease-in-out texture-glass
                    ${expandedProject && !isExpanded ? 'opacity-60 scale-95' : 'opacity-100 scale-100'}
                  `}
                >
                  <div className={`image-container overflow-hidden bg-slate-800 transition-all duration-300 ${isExpanded ? 'aspect-[16/6]' : 'aspect-video sm:aspect-[1200/630]'}`}>
                    <div className="skeleton skeleton-loader absolute inset-0" />
                    <img
                      src={project.preview}
                      alt={project.altText || `${project.title} - ${project.description}`}
                      className="w-full h-full object-cover object-top transition-all duration-300 group-hover:scale-105 relative z-10"
                      loading={isAboveFold ? "eager" : "lazy"}
                      onLoad={(e) => {
                        e.target.classList.add('loaded');
                        const skeleton = e.target.previousSibling;
                        if (skeleton) skeleton.style.opacity = '0';
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        const skeleton = e.target.previousSibling;
                        if (skeleton) skeleton.style.opacity = '0';
                      }}
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h3 className="text-sm font-semibold text-white mb-1">{project.title}</h3>
                        <p className={`text-xs text-slate-400 ${isExpanded ? '' : 'line-clamp-2'}`}>{project.description}</p>
                      </div>
                      <span
                        className={`text-teal-400 transition-transform duration-200 flex-shrink-0 ${isExpanded ? 'rotate-180' : ''}`}
                        title={isExpanded ? 'Click to collapse' : 'Click to expand'}
                      >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="inline-block">
                          <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </span>
                    </div>
                    {/* Tech Stack Badges */}
                    {project.tech && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {project.tech.slice(0, 3).map((t) => (
                          <span key={t} className="text-[10px] text-slate-500 bg-slate-700/50 px-1.5 py-0.5 rounded">{t}</span>
                        ))}
                      </div>
                    )}
                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-slate-700 animate-fade-in">
                        <p className="text-sm text-slate-300 mb-4">{project.details}</p>
                        <button
                          onClick={(e) => handleVisitSite(e, project.url)}
                          className="inline-flex items-center gap-2 text-sm text-teal-400 hover:text-teal-300 transition-colors"
                        >
                          Visit Site <span className="text-xs">→</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                </div>
              );
            })}
          </div>

          <div className="border-t border-slate-700/30 mb-12"></div>

          {/* Conceptual/Experimental */}
          <h3 className="text-lg font-medium text-orange-400 mb-4 flex items-center gap-2">
            <span className="w-2 h-2 bg-orange-400 rounded-full"></span>
            Conceptual Explorations
            <span className="text-xs text-slate-500 font-normal ml-2">Jungian depth psychology</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 transition-all duration-300">
            {experimentalProjects.map((project, index) => {
              const isExpanded = expandedProject === project.id;
              const isAboveFold = index < 6; // First 6 Work cards load eagerly

              return (
                <div
                  key={project.id}
                  className={`card-subtle-3d card-expandable card-click-hint ${isExpanded ? 'sm:col-span-2 lg:col-span-3 row-span-2 expanded' : ''}`}
                  onMouseMove={(e) => {
                    if (isExpanded) return; // Don't tilt when expanded
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = (e.clientX - rect.left) / rect.width - 0.5;
                    const y = (e.clientY - rect.top) / rect.height - 0.5;
                    const inner = e.currentTarget.querySelector('.card-3d-inner');
                    if (inner) {
                      // Subtle 8-degree rotation
                      inner.style.setProperty('--rotateX', `${-y * 8}deg`);
                      inner.style.setProperty('--rotateY', `${x * 8}deg`);
                    }
                  }}
                  onMouseLeave={(e) => {
                    const inner = e.currentTarget.querySelector('.card-3d-inner');
                    if (inner) {
                      inner.style.setProperty('--rotateX', '0deg');
                      inner.style.setProperty('--rotateY', '0deg');
                    }
                  }}
                >
                <div
                  onClick={(e) => handleCardClick(e, project.id)}
                  className={`
                    card-3d-inner card-press og-card group cursor-pointer rounded-lg overflow-hidden bg-slate-800/50 border border-slate-700/50 hover:border-teal-500/30 transition-all duration-300 ease-in-out texture-glass
                    ${expandedProject && !isExpanded ? 'opacity-60 scale-95' : 'opacity-100 scale-100'}
                  `}
                >
                  {/* Preview Image with Skeleton Loader */}
                  <div className={`image-container overflow-hidden bg-slate-800 transition-all duration-300 ${isExpanded ? 'aspect-[16/6]' : 'aspect-[1200/630]'}`}>
                    {/* Skeleton shimmer loader */}
                    <div className="skeleton skeleton-loader absolute inset-0" />
                    <img
                      src={project.preview}
                      alt={project.altText || `${project.title} - ${project.description}`}
                      className="w-full h-full object-cover object-top transition-all duration-300 group-hover:scale-105 relative z-10"
                      loading={isAboveFold ? "eager" : "lazy"}
                      onLoad={(e) => {
                        e.target.classList.add('loaded');
                        const skeleton = e.target.previousSibling;
                        if (skeleton) skeleton.style.opacity = '0';
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        const skeleton = e.target.previousSibling;
                        if (skeleton) skeleton.style.opacity = '0';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div className="hidden w-full h-full items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 absolute inset-0">
                      <span className="text-4xl font-bold text-teal-500/20">{project.title.charAt(0)}</span>
                    </div>
                  </div>

                  {/* Card Info */}
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h3 className="text-sm font-semibold text-white mb-1">{project.title}</h3>
                        <p className={`text-xs text-slate-400 ${isExpanded ? '' : 'line-clamp-2'}`}>{project.description}</p>
                      </div>
                      <span
                        className={`text-orange-400 transition-transform duration-200 flex-shrink-0 ${isExpanded ? 'rotate-180' : ''}`}
                        title={isExpanded ? 'Click to collapse' : 'Click to expand'}
                      >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="inline-block">
                          <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </span>
                    </div>
                    {/* Tech Stack Badges */}
                    {project.tech && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {project.tech.map((t) => (
                          <span key={t} className="text-[10px] text-slate-500 bg-slate-700/50 px-1.5 py-0.5 rounded">{t}</span>
                        ))}
                      </div>
                    )}

                    {/* Expanded Content */}
                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-slate-700 animate-fade-in">
                        {/* OG Image Preview */}
                        {project.ogImage && (
                          <div className="mb-4">
                            <p className="text-xs text-slate-500 mb-2 uppercase tracking-wide">Social Preview</p>
                            <div className="rounded-lg overflow-hidden border border-slate-700">
                              <img
                                src={project.ogImage}
                                alt={`${project.title} social preview`}
                                className="w-full h-auto"
                                onError={(e) => {
                                  e.target.src = project.preview;
                                }}
                              />
                            </div>
                          </div>
                        )}

                        {/* Details */}
                        <p className="text-sm text-slate-300 leading-relaxed mb-4">
                          {project.details}
                        </p>

                        {/* Action Buttons */}
                        <div className="flex gap-3 mt-4">
                          <button
                            onClick={(e) => handleVisitSite(e, project.url)}
                            className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-900 text-xs font-semibold rounded transition-colors"
                          >
                            Visit Site →
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); setExpandedProject(null); }}
                            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white text-xs font-semibold rounded transition-colors"
                          >
                            Close
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* The Method Section */}
      <section
        id="method"
        className={`px-6 md:px-12 lg:px-24 py-16 border-t border-slate-800 transition-all duration-700 spotlight-warm section-glow-full texture-wood ${visibleSections.method ? 'opacity-100 translate-y-0 in-view' : 'opacity-0 translate-y-8'}`}
      >
        <div className="max-w-4xl">
          <h2 className="heading-serif text-2xl md:text-3xl font-semibold text-white mb-3 neon-text">
            The Method
          </h2>
          <p className="text-slate-400 mb-8 max-w-2xl">
            Nine years translating federal healthcare regulations into working systems. Now I apply that rigor to your problems.
          </p>

          <div className="space-y-6 mb-8">
            <div className="border-l-2 border-teal-400 pl-6">
              <h3 className="font-bold text-white">Truth over theater</h3>
              <p className="text-slate-400">No aspirational claims. Only what can be shown and proven.</p>
            </div>
            <div className="border-l-2 border-teal-400 pl-6">
              <h3 className="font-bold text-white">Guardrails over vibes</h3>
              <p className="text-slate-400">AI where it's strong. Deterministic logic where it fails.</p>
            </div>
            <div className="border-l-2 border-teal-400 pl-6">
              <h3 className="font-bold text-white">Zero-trust by default</h3>
              <p className="text-slate-400">Verification matters more than confidence.</p>
            </div>
            <div className="border-l-2 border-teal-400 pl-6">
              <h3 className="font-bold text-white">Human impact first</h3>
              <p className="text-slate-400">Quality isn't abstract. It affects real people.</p>
            </div>
          </div>

          <p className="text-slate-500 text-sm mb-6">
            I work at the seams where disciplines don't connect—translating between technical and business realms, extracting methods so they become repeatable.
          </p>

          <a
            href="mailto:matthewdscott7@gmail.com"
            className="inline-flex items-center gap-2 text-teal-400 hover:text-teal-300 transition-colors text-sm group"
          >
            <span className="border-b border-teal-400/30 group-hover:border-teal-300/50 transition-colors">
              Let's talk
            </span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </a>

        </div>
      </section>
      </main>

      {/* Footer */}
      <footer id="contact" className="px-6 md:px-12 lg:px-24 py-16 border-t border-slate-800 texture-brass">
        <div className="max-w-4xl">
          <h2 className="heading-serif text-2xl md:text-3xl font-semibold text-white mb-4 neon-text">
            Let's Build
          </h2>
          <p className="text-slate-400 mb-2">
            If you recognize the work, reach out.
          </p>
          <p className="text-slate-500 mb-8">
            If you need convincing, I'm not for you.
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap gap-4 sm:gap-6">
            <a
              href="mailto:matthewdscott7@gmail.com"
              className="footer-link text-teal-400 hover:text-teal-300 transition-colors text-sm sm:text-base"
            >
              matthewdscott7@gmail.com
            </a>
            <a
              href="https://github.com/guitargnarr"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link text-teal-400 hover:text-teal-300 transition-colors text-sm sm:text-base"
            >
              GitHub
            </a>
            <a
              href="https://linkedin.com/in/mscott77"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link text-teal-400 hover:text-teal-300 transition-colors text-sm sm:text-base"
            >
              LinkedIn
            </a>
            <a
              href="/manifesto"
              className="footer-link text-orange-400 hover:text-orange-300 transition-colors text-sm sm:text-base"
            >
              The Manifesto
            </a>
          </div>
          {/* Footer bottom with centered watermark */}
          <div className="mt-16 pt-8 border-t border-slate-800/50 flex flex-col items-center gap-4">
            {/* Auriga Watermark */}
            <a href="https://projectlavos.com" aria-label="Project Lavos">
              <img
                src="/projectlavos-watermark-teal.svg"
                alt="Project Lavos"
                className="w-32 h-16 object-contain opacity-50 hover:opacity-80 transition-opacity"
              />
            </a>
            {/* Copyright and legal */}
            <div className="text-center">
              <p className="text-slate-500 text-xs">
                © {new Date().getFullYear()} Matthew Scott
              </p>
              <a
                href="/privacy"
                className="text-slate-600 hover:text-teal-400 text-xs transition-colors"
              >
                Privacy Policy
              </a>
            </div>
          </div>
        </div>
      </footer>
      <Analytics />
    </div>
  );
}

export default App;
