import { useState, useEffect, useRef } from 'react';
import { Analytics } from '@vercel/analytics/react';
import AnimatedCharioteer from './components/AnimatedCharioteer';

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

  // Smooth scroll to any section by ID
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const principles = [
    { text: "Show, don't tell", tooltip: "Working software over impressive pitches" },
    { text: "Simple scales", tooltip: "Complexity is easy. Clarity takes work." },
    { text: "Test the seams", tooltip: "Systems fail where they connect" },
    { text: "Tools serve people", tooltip: "Technology works for humans, not the reverse" }
  ];

  // Local Louisville client projects - ordered by quality (premium 3D/Tier 4 sites first)
  const localClients = [
    {
      id: "crestborneprivateoffice",
      title: "Crestborne Private Office",
      url: "https://crestborne-private-office.vercel.app",
      preview: "/previews/crestborne-private-office.png",
      ogImage: "/og-images/crestborne-private-office-og.png",
      qrCode: null,
      description: "UHNW wealth advisory for Asia-Pacific families",
      altText: "Crestborne Private Office independent wealth advisory UHNW ultra high net worth Singapore Hong Kong Dubai EAM external asset manager",
      category: "Financial",
      specWork: true,
      details: "Tier 4 spec site for UHNW wealth management niche. Features Gravitational Lens 3D hero (luminous accretion disk with orbital rings, particle streams, and dark void), Silk Threads section background, Midnight/Silver-Sage/Pearl palette, Cormorant Garamond typography. Anchor+2x2 services grid, split-screen contact, 5-office global presence. Targets External Asset Manager (EAM) firms serving Chinese families across Asia-Pacific."
    },
    {
      id: "morganpottingermcgarvey",
      title: "Morgan Pottinger McGarvey",
      url: "https://morgan-pottinger-mcgarvey.vercel.app",
      preview: "/previews/morgan-pottinger-mcgarvey.png",
      ogImage: "/og-images/morgan-pottinger-mcgarvey-og.png",
      qrCode: "/qr-codes/morgan-pottinger-mcgarvey-qr.png",
      description: "Trusted legal counsel since 1974",
      altText: "Morgan Pottinger McGarvey Louisville Kentucky law firm attorneys banking business litigation personal injury real estate",
      category: "Legal",
      specWork: true,
      details: "Tier 2 demo for established Louisville law firm. Banking & finance, business litigation, personal injury, and real estate law. Representing Kentucky banks, businesses, and individuals with over 50 years of combined legal excellence."
    },
    {
      id: "scoutaesthetics",
      title: "Scout Aesthetics",
      url: "https://scout-aesthetics.vercel.app",
      preview: "/previews/scout-aesthetics.png",
      ogImage: "/og-images/scout-aesthetics-og.png",
      qrCode: "/qr-codes/scout-aesthetics-qr.png",
      description: "Premier med spa and aesthetic wellness center",
      altText: "Scout Aesthetics Louisville Kentucky med spa Botox fillers laser facials body contouring skin rejuvenation",
      category: "Med Spa",
      specWork: true,
      details: "Tier 2 demo for Louisville med spa featuring Torus Knot 3D hero, DNA Helix section background, zigzag feature layout, and glass-morphism contact card. Botox, fillers, laser treatments, facials, and body contouring."
    },
    {
      id: "pillarfinancialadvisors",
      title: "Pillar Financial Advisors",
      url: "https://pillar-financial-advisors.vercel.app",
      preview: "/previews/pillar-financial-advisors.png",
      ogImage: "/og-images/pillar-financial-advisors-og.png",
      qrCode: "/qr-codes/pillar-financial-advisors-qr.png",
      description: "Wealth management and financial planning",
      altText: "Pillar Financial Advisors Louisville Kentucky wealth management financial planning retirement investment estate tax",
      category: "Financial",
      specWork: true,
      details: "Tier 2 demo for Louisville financial advisory firm featuring L-System Tree 3D hero, Orbital System section background, icon-strip feature layout, 2x2 stats grid, and split-screen contact. Retirement planning, investment management, estate and tax planning."
    },
    {
      id: "clementinecater",
      title: "Clementine Catering",
      url: "https://clementine-cater.vercel.app",
      preview: "/previews/clementine-cater.png",
      ogImage: "/og-images/clementine-cater-og.png",
      qrCode: "/qr-codes/clementine-cater-qr.png",
      description: "Bespoke catering at Louisville's most storied venue",
      altText: "Clementine Catering Louisville Kentucky Steve Clements bespoke catering Peterson-Dumesnil House 1869 Italian villa weddings corporate events seasonal organic local ingredients",
      category: "Restaurant",
      specWork: true,
      details: "Premium demo for Louisville's exclusive caterer at the Peterson-Dumesnil House. Custom Chandelier 3D formation hero with gold crystal drops and bloom lighting. Mobius strip section background. Services: weddings, corporate events, intimate dinners, rehearsal dinners, holiday celebrations. Venue showcase with capacity and rates. Gold/green palette with Cormorant Garamond typography."
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
          ogImage: "/og-images/highland-cleaners-tier1-og.png",
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
          ogImage: "/og-images/highland-cleaners-tier4-og.png",
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
      ogImage: "/og-images/cleaningbyregina-cinematic-og.png",
      qrCode: "/qr-codes/cleaning-by-regina-qr.png",
      description: "Louisville's trusted cleaning service",
      altText: "Cleaning By Regina Louisville Kentucky residential commercial cleaning service 25 years experience licensed insured",
      category: "Services",
      specWork: true,
      details: "Professional residential and commercial cleaning services in Louisville. 25+ years of experience. Licensed, insured, and trusted by thousands of families."
    },
    {
      id: "toninichurchsupply",
      title: "Tonini Church Supply",
      url: "https://tonini-church-supply.vercel.app",
      preview: "/previews/tonini-church-supply.png",
      ogImage: "/og-images/toninichurchsupply-cinematic-og.png",
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
      ogImage: "/og-images/tastefultravels-cinematic-og.png",
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
      ogImage: "/og-images/kentuckianagastro-cinematic-og.png",
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
      ogImage: "/og-images/kuhnallergy-cinematic-og.png",
      qrCode: "/qr-codes/kuhn-allergy-qr.png",
      description: "Louisville's trusted allergy & asthma specialist",
      altText: "Dr. Forrest S. Kuhn MD Louisville allergist asthma specialist board certified 30 years experience Dupont Square",
      category: "Medical",
      specWork: true,
      details: "Board-certified allergist with 30+ years experience at Dupont Square. Specializes in seasonal allergies, food allergies, asthma management, insect allergies, drug reactions, and skin allergy testing. Accepting new patients, most insurance accepted."
    },
    {
      id: "uofldemo",
      title: "UofL Demo",
      url: "https://uofl-demo.vercel.app",
      preview: "/previews/uofl-demo.png",
      ogImage: "/og-images/uofldemo-og.png",
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
      ogImage: "/og-images/springhurstendo-og.png",
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
      ogImage: "/og-images/dgvservices-og.png",
      qrCode: "/qr-codes/dgv-services-qr.png",
      description: "Expert medical billing & revenue management",
      altText: "dGv Services Crestwood Kentucky medical billing healthcare revenue management insurance claims workers compensation",
      category: "Medical",
      specWork: true,
      location: "Crestwood, KY",
      details: "Medical billing and healthcare revenue management specialists since 2002. 25+ years experience in workers' compensation, auto, and liability insurance claims. HIPAA compliant, certified coders. Serving Kentucky healthcare providers."
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
      id: "tomdrexler",
      title: "Tom Drexler",
      url: "https://tom-drexler.vercel.app",
      preview: "/previews/tom-drexler.png",
      ogImage: "/og-images/tomdrexler-og.png",
      qrCode: "/qr-codes/tom-drexler-qr.png",
      description: "Louisville's Red Carpet Treatment Since 1982",
      altText: "Tom Drexler Plumbing Air Electric Louisville Kentucky HVAC plumbing electrical drain sewer bathroom remodeling 200+ service trucks 4th generation master plumber",
      category: "Services",
      specWork: true,
      details: "Tier 2 demo for Louisville's premier home services company. 4th generation Master Plumber. HVAC, Plumbing, Electrical, Drain & Sewer, Bathroom Remodeling. 200+ service trucks serving Louisville Metro & Southern Indiana. 24/7 Emergency Service. Red/white/blue patriotic branding."
    },
    {
      id: "fulltiltgym",
      title: "Full Tilt Gym",
      url: "https://full-tilt-gym.vercel.app",
      preview: "/previews/full-tilt-gym.png",
      ogImage: "/og-images/full-tilt-gym-og.png",
      qrCode: "/qr-codes/full-tilt-gym-qr.png",
      description: "Louisville's premier high-intensity fitness studio",
      altText: "Full Tilt Gym Louisville Kentucky fitness studio group classes personal training HIIT boxing cycling strength",
      category: "Fitness",
      specWork: true,
      details: "Tier 4 demo for Louisville fitness studio featuring 3D crystalline hero animation, class scheduling, trainer profiles, and membership pricing. High-intensity group classes, personal training, and open gym."
    },
    {
      id: "caviarcreativeco",
      title: "Caviar Creative Co.",
      url: "https://caviar-creative-co.vercel.app",
      preview: "/previews/caviar-creative-co.png",
      ogImage: "/og-images/caviar-creative-co-og.png",
      qrCode: "/qr-codes/caviar-creative-co-qr.png",
      description: "Strategy, design, story and brand protection",
      altText: "Caviar Creative Co Louisville Kentucky creative agency branding strategy design digital experience automation",
      category: "Services",
      specWork: true,
      details: "Architectural Noir concept demo for creative agency. Strategy, design, story and brand protection served up without compromise. Features particle animation hero, automation showcase, and metrics dashboard."
    },
    {
      id: "fritzsalon",
      title: "Fritz Salon",
      url: "https://fritz-salon.vercel.app",
      preview: "/previews/fritz-salon.png",
      ogImage: "/og-images/fritzsalon-og.png",
      qrCode: "/qr-codes/fritz-salon-qr.png",
      description: "Premier hair salon experience",
      altText: "Fritz Salon Louisville premier hair salon styling coloring treatments professional stylists",
      category: "Beauty",
      specWork: true,
      details: "Premier hair salon in Louisville offering expert styling, coloring, and treatments. Professional stylists dedicated to helping you look and feel your best."
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
      ogImage: "/og-images/campj-og.png",
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
      category: "Senior Living",
      specWork: true,
      details: "Premium senior living demo for Louisville Trilogy Health Services community. Official purple/gold Trilogy branding. Four levels of care: Independent Living, Personal Care, Memory Care (Best Friends Approach), and Skilled Services. U.S. News Best Senior Living award badges."
    },
    {
      id: "pilatespluslouisville",
      title: "Pilates Plus Louisville",
      url: "https://pilates-plus-louisville.vercel.app",
      preview: "/previews/pilates-plus-louisville.png",
      ogImage: "/og-images/pilatespluslouisville-og.png",
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
      ogImage: "/og-images/shawarmashack-og.png",
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
      ogImage: "/og-images/northlimecoffee-og.png",
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
      ogImage: "/og-images/blownawaybar-og.png",
      qrCode: "/qr-codes/blown-away-bar-qr.png",
      description: "Louisville's blow dry and beauty bar",
      altText: "Blown Away Bar Louisville blow dry bar beauty styling blowouts makeup special occasions",
      category: "Beauty",
      specWork: true,
      details: "Louisville's premier blow dry and beauty bar. Expert blowouts, styling, and makeup for any occasion. Walk in gorgeous, walk out blown away."
    },
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
      id: "passtimefishhouse",
      title: "PassTime Fish House",
      url: "https://passtime-fish-house.vercel.app",
      preview: "/previews/passtime-fish-house.png",
      ogImage: "/og-images/passtimefishhouse-og.png",
      qrCode: "/qr-codes/passtime-fish-house-qr.png",
      description: "Louisville's best kept secret since 2001",
      altText: "PassTime Fish House Jeffersontown Louisville Kentucky fresh fried fish cod sandwich dive bar",
      category: "Restaurant",
      specWork: true,
      details: "Home of the 'Almost Famous' Cod Sandwich. Fresh fried fish, cold beer, and dive bar charm in Jeffersontown. Cash only, ATM inside. Louisville's best kept secret since 2001."
    },
    {
      id: "louisvillenailsspa",
      title: "Louisville Nails & Spa",
      url: "https://louisville-nails-spa.vercel.app",
      preview: "/previews/louisville-nails-spa.png",
      ogImage: "/og-images/louisvillenailsspa-og.png",
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
      ogImage: "/og-images/chabadofkentucky-og.png",
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
      ogImage: "/og-images/paintspotlouisville-og.png",
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
      ogImage: "/og-images/mairamediterranean-og.png",
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
      ogImage: "/og-images/cardinaluniforms-og.png",
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
      ogImage: "/og-images/credituniontemplate-og.png",
      qrCode: "/qr-codes/credit-union-template-qr.png",
      description: "Modern credit union website template",
      altText: "Credit Union website template modern banking financial services online banking member services",
      category: "Financial",
      specWork: true,
      details: "Modern website template for credit unions and financial institutions. Features online banking integration, member services, and loan applications. Built for trust and accessibility."
    },
    {
      id: "vancestovall",
      title: "Vance & Stovall Optometry",
      url: "https://vance-stovall-optometry.vercel.app",
      preview: "/previews/vance-stovall-optometry.png",
      ogImage: "/og-images/vancestovall-og.png",
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
      ogImage: "/og-images/dermatologyassociates-og.png",
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
      ogImage: "/og-images/louisvillefamilychiro-og.png",
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
      ogImage: "/og-images/grayfamilydentistry-og.png",
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
      ogImage: "/og-images/dermcarepractitioners-og.png",
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
      ogImage: "/og-images/jrspasalon-og.png",
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
      ogImage: "/og-images/playthingstoyshoppe-og.png",
      qrCode: "/qr-codes/playthings-toy-shoppe-qr.png",
      description: "Louisville's family-owned toy store since 2001",
      altText: "Playthings Toy Shoppe Louisville St Matthews Westport Village family-owned toy store LEGO Jellycat since 2001",
      category: "Retail",
      specWork: true,
      details: "Playful design for Louisville's beloved family toy store. 2 locations (St. Matthews & Westport Village), colorful animations, brand showcase. Fredoka + Nunito fonts capture the fun, family-friendly spirit."
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
      ogImage: "/og-images/claterjewelers-og.png",
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
      ogImage: "/og-images/schwartzbankruptcy-og.png",
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
      ogImage: "/og-images/affinitydental-og.png",
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
      id: "ibanistatools",
      title: "Ibanista Tools",
      url: "https://ibanista-tools.vercel.app",
      preview: "/previews/ibanista-tools.png",
      ogImage: "/og-images/ibanista-tools-og.png",
      qrCode: "/qr-codes/ibanista-tools-qr.png",
      description: "UK-France relocation calculator and region finder",
      altText: "Ibanista Tools UK France relocation budget calculator region finder quiz for British expatriates",
      category: "Client",
      tech: ["React", "TypeScript", "Tailwind", "FastAPI"],
      specWork: true,
      details: "Full-stack relocation toolkit for Ibanista (UK-France relocation specialists). Features interactive budget calculator with real cost data, region finder quiz matching lifestyle preferences to French departments, email capture with SQLite persistence, and admin dashboard. React/TypeScript frontend on Vercel, FastAPI backend on Render."
    }
  ];

  const [expandedClient, setExpandedClient] = useState(null);
  const [activeClientVersion, setActiveClientVersion] = useState({});
  const [clientFilter, setClientFilter] = useState('All');
  const [showAllClients, setShowAllClients] = useState(false);

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

  const allFilteredClients = clientFilter === 'All'
    ? localClients
    : localClients.filter(c => categoryGroups[clientFilter]?.includes(c.category));
  const INITIAL_CLIENT_COUNT = 12;
  const filteredClients = showAllClients || clientFilter !== 'All'
    ? allFilteredClients
    : allFilteredClients.slice(0, INITIAL_CLIENT_COUNT);
  const hasMoreClients = clientFilter === 'All' && !showAllClients && allFilteredClients.length > INITIAL_CLIENT_COUNT;

  // Practical Apps - career/productivity focused
  const practicalProjects = [
    {
      id: "fretvision",
      title: "FretVision",
      url: "https://guitar.projectlavos.com",
      preview: "/previews/fretvision.png",
      ogImage: "/og-images/fretvision-og.png",
      description: "Learn guitar scales visually with interactive lessons",
      altText: "FretVision guitar learning app showing interactive fretboard visualization with scale patterns and MIDI playback controls",
      category: "Education",
      tech: ["React", "Python", "MIDI", "Canvas"],
      details: "Guitar learning apps exist, but none combine fretboard visualization, tab playback, and riff generation in one place. The riff generator uses deterministic Python for music theory—LLMs can't count frets accurately."
    },
    {
      id: "meridian",
      title: "Meridian",
      url: "https://phishguard-ui.vercel.app",
      preview: "/previews/meridian.png",
      ogImage: "/og-images/meridian-og.png",
      description: "US economic data explorer with interactive state-level maps",
      altText: "Meridian US Economic Data Explorer interactive map showing state-level unemployment income population poverty metrics pharmacy market intelligence",
      category: "Data",
      tech: ["Next.js", "TypeScript", "D3", "Tailwind"],
      details: "Market intelligence platform mapping 41,755 independent pharmacies across the US. Interactive state-level economic data including unemployment, income, population, and poverty metrics. Built for RetailMyMeds to identify high-opportunity markets for GLP-1 and MAP prescription routing."
    },
    {
      id: "jobway",
      title: "Jobway",
      url: "https://jobtrack.projectlavos.com",
      preview: "/previews/jobway.png",
      ogImage: "/og-images/jobway-og.png",
      description: "AI-powered job search command center with Gmail integration",
      altText: "Jobway dashboard showing job tracking, ATS optimization scores, email scanning, and follow-up scheduling",
      category: "Career",
      tech: ["React", "FastAPI", "spaCy", "Gmail API"],
      details: "Full-stack job search automation. Gmail OAuth scans your inbox for responses, NLP-powered ATS optimizer scores resumes against job descriptions, smart follow-up scheduling, and analytics dashboard. Not a template—actual automation."
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
      ogImage: "/og-images/psyche-og.png",
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
      ogImage: "/og-images/threshold-og.png",
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
      ogImage: "/og-images/umbra-og.png",
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
      ogImage: "/og-images/forma-og.png",
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
      ogImage: "/og-images/auriga-og.png",
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
      <div className="ambient-bg" aria-hidden="true">
        <div className="orb-3" />
      </div>
      <div className="particles" aria-hidden="true">
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

      <main role="main" aria-label="Matthew Scott - Louisville Web Developer Portfolio">
      {/* Structured page description for search engines and LLM comprehension */}
      <div className="sr-only" aria-hidden="false">
        <h1>Matthew Scott - Web Developer and Consultant, Louisville, Kentucky</h1>
        <p>
          This is the portfolio website of Matthew Scott, a full-stack web developer and consultant based in Louisville, Kentucky.
          The site showcases 51 deployed demo websites built as spec work for real Louisville businesses, plus practical web applications
          and conceptual explorations. Technologies used include React, JavaScript, Python, Vite, Tailwind CSS, FastAPI, Supabase, and AI integrations.
        </p>
        <p>
          The portfolio is organized into sections: Louisville client demos (filterable by category including Healthcare, Food &amp; Drink,
          Legal, Services, Beauty, Retail, Entertainment, Real Estate, and more), practical deployed applications (FretVision guitar learning platform,
          Vantage job market analysis, Meridian US economic data explorer, Jobway job search automation), and conceptual explorations (Auriga, Forma, Psyche Hub, Threshold).
        </p>
        <p>
          Development methodology emphasizes substance over flash, building to last, measuring twice before shipping, and prioritizing
          people over technology. Matthew Scott works with AI collaboration tools and specializes in helping small and medium-sized businesses
          establish their online presence. Contact: matthewdscott7@gmail.com, phone: 502-345-0525.
        </p>
      </div>
      {/* Hero Section - No header, chariot below content */}
      <section
        id="hero"
        aria-label="Introduction - Matthew Scott, Web Developer and Consultant in Louisville, Kentucky"
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
          {/* Profile - First to appear */}
          <div className="flex flex-col items-center mb-6 hero-animate-1">
            <img
              src="/headshot.png"
              alt="Matthew Scott - Web Developer and Consultant based in Louisville, Kentucky"
              className="headshot w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-full border border-slate-600/50 object-cover"
            />
            <p className="text-xs sm:text-sm text-slate-500 mt-3 font-sans tracking-[0.25em] uppercase">
              Louisville, KY
            </p>
          </div>

          {/* Name - Dramatic entrance - INCREASED SIZE */}
          <div className="relative mb-6 hero-animate-2">
            <div className="w-8 h-px bg-gradient-to-r from-transparent via-teal-500 to-transparent mx-auto mb-4 hero-line-expand" aria-hidden="true" />
            <h1 className="heading-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white tracking-[-0.02em]">
              Matthew Scott
            </h1>
          </div>

          {/* Tagline - Follows name - INCREASED SIZE */}
          <p className="text-base sm:text-lg md:text-xl text-slate-400 leading-relaxed mb-3 max-w-lg mx-auto font-light hero-animate-3">
            <span className="accent-italic">Complexity,</span> untangled.
          </p>
          <p className="text-sm sm:text-base text-slate-500 mb-10 max-w-lg mx-auto hero-animate-4">
            Turning ambiguity into systems that actually ship.
          </p>

          {/* CTAs - Refined aesthetic with smooth transitions */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8 hero-animate-5">
            <button
              onClick={scrollToWork}
              aria-label="Scroll to portfolio section showing deployed projects and client work"
              className="group relative flex items-center justify-center gap-3 px-8 py-3.5 text-sm tracking-[0.15em] uppercase transition-all duration-500 ease-out
                bg-gradient-to-r from-teal-500/10 to-teal-600/5
                border border-teal-500/40 hover:border-teal-400/80
                text-teal-300 hover:text-teal-200
                hover:shadow-[0_0_30px_-5px_rgba(20,184,166,0.3)]
                hover:scale-[1.02] active:scale-[0.98]"
            >
              <span className="relative z-10">See My Work</span>
              <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-y-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
              <div className="absolute inset-0 bg-gradient-to-r from-teal-500/0 via-teal-500/5 to-teal-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </button>
            <button
              onClick={() => scrollToSection('method')}
              aria-label="Scroll to methodology section describing development principles and approach"
              className="group relative flex items-center justify-center gap-3 px-8 py-3.5 text-sm tracking-[0.15em] uppercase transition-all duration-500 ease-out
                bg-transparent
                border border-slate-600/60 hover:border-slate-500/80
                text-slate-400 hover:text-slate-300
                hover:shadow-[0_0_20px_-5px_rgba(148,163,184,0.15)]
                hover:scale-[1.02] active:scale-[0.98]"
            >
              <span className="relative z-10">How I Work</span>
              <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>
        </div>

        {/* Chariot Logo - Moved to bottom of hero as visual footer element */}
        <div className="absolute bottom-14 sm:bottom-18 left-0 right-0 flex justify-center hero-animate-6" aria-hidden="true">
          <AnimatedCharioteer className="w-64 h-32 sm:w-72 sm:h-36 md:w-80 md:h-40 opacity-85" />
        </div>

        {/* Principles - Footer of hero, below chariot */}
        <div role="list" aria-label="Core development principles" className="absolute bottom-6 left-0 right-0 flex justify-center flex-wrap gap-x-4 gap-y-1 sm:gap-x-8 px-4 sm:px-6 text-[9px] sm:text-[11px] tracking-widest uppercase hero-principles-fade">
          {principles.map((principle, idx) => (
            <span
              key={idx}
              role="listitem"
              className="principle-tag text-slate-500 hover:text-teal-400 cursor-help transition-colors duration-300"
              title={principle.tooltip}
              aria-label={`${principle.text} - ${principle.tooltip}`}
            >
              {principle.text}
            </span>
          ))}
        </div>
      </section>

      {/* Louisville Section */}
      <section
        id="louisville"
        aria-label="Louisville client portfolio - 51 deployed spec-work demo websites built for local Kentucky businesses across healthcare, food, retail, legal, and services industries"
        className={`px-4 md:px-8 lg:px-16 py-16 border-t border-slate-800 transition-all duration-700 spotlight-warm section-glow-full ${visibleSections.louisville ? 'opacity-100 translate-y-0 in-view' : 'opacity-0 translate-y-8'}`}
      >
        <div className="max-w-7xl mx-auto">
          <h2 className="heading-display text-3xl md:text-4xl text-white mb-2 neon-text tracking-[-0.02em] section-heading-animate">
            Louisville
          </h2>
          <p className="text-slate-400 mb-4 section-stagger-1">
            51 sites you can visit. <span className="accent-italic">Live.</span> Deployed. Working.
          </p>
          <p className="text-xs text-slate-500 mb-6 section-stagger-2">
            Spec work built from public info. Not pitches. Proof.
          </p>

          {/* Category Filter Tabs */}
          <nav aria-label="Filter portfolio sites by business category" className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide -mx-2 px-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}>
            {Object.keys(categoryGroups).map((group) => {
              const count = group === 'All' ? localClients.length : localClients.filter(c => categoryGroups[group]?.includes(c.category)).length;
              if (count === 0 && group !== 'All') return null;
              return (
                <button
                  key={group}
                  onClick={() => { setClientFilter(group); setExpandedClient(null); }}
                  aria-label={`Filter by ${group} category (${count} sites)`}
                  aria-pressed={clientFilter === group}
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
          </nav>

          <div role="list" aria-label="Portfolio of deployed client demo websites" className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 transition-all duration-300">
            {filteredClients.map((client, index) => {
              const isAboveFold = index < 10; // First 10 cards load eagerly
              const categoryAccent = {
                'Healthcare': 'border-t-2 border-t-emerald-500/50',
                'Medical': 'border-t-2 border-t-emerald-500/50',
                'Dental': 'border-t-2 border-t-emerald-500/50',
                'Beauty': 'border-t-2 border-t-pink-500/50',
                'Beauty & Spa': 'border-t-2 border-t-pink-500/50',
                'Spa': 'border-t-2 border-t-pink-500/50',
                'Food & Drink': 'border-t-2 border-t-amber-500/50',
                'Food': 'border-t-2 border-t-amber-500/50',
                'Cafe': 'border-t-2 border-t-amber-500/50',
                'Restaurant': 'border-t-2 border-t-amber-500/50',
                'Retail': 'border-t-2 border-t-blue-400/50',
                'Jewelry': 'border-t-2 border-t-blue-400/50',
                'Entertainment': 'border-t-2 border-t-purple-500/50',
                'Nightlife': 'border-t-2 border-t-purple-500/50',
                'Real Estate': 'border-t-2 border-t-cyan-400/50',
                'Apartments': 'border-t-2 border-t-cyan-400/50',
                'Professional': 'border-t-2 border-t-slate-400/50',
                'Legal': 'border-t-2 border-t-slate-400/50',
                'Finance': 'border-t-2 border-t-slate-400/50',
                'Cleaning': 'border-t-2 border-t-sky-400/50',
                'Fitness': 'border-t-2 border-t-rose-400/50',
                'Wellness': 'border-t-2 border-t-rose-400/50',
                'Education': 'border-t-2 border-t-indigo-400/50',
                'Conceptual': 'border-t-2 border-t-violet-400/50',
                'Services': 'border-t-2 border-t-slate-400/50',
                'Senior Living': 'border-t-2 border-t-emerald-400/50',
                'Brewery': 'border-t-2 border-t-amber-600/50',
                'Bar': 'border-t-2 border-t-purple-500/50',
                'Financial': 'border-t-2 border-t-slate-400/50',
                'Nonprofit': 'border-t-2 border-t-indigo-400/50',
                'Security': 'border-t-2 border-t-red-500/50',
                'Career': 'border-t-2 border-t-teal-400/50',
                'Personal': 'border-t-2 border-t-pink-400/50',
                'Client': 'border-t-2 border-t-teal-400/50',
                'Med Spa': 'border-t-2 border-t-pink-500/50',
                'Youth': 'border-t-2 border-t-orange-400/50',
              }[client.category] || 'border-t-2 border-t-teal-500/30';

              return (
                <article
                  key={client.id}
                  role="listitem"
                  aria-label={`${client.title} - ${client.description} - ${client.category} category`}
                  className="card-subtle-3d group relative"
                  onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = (e.clientX - rect.left) / rect.width - 0.5;
                    const y = (e.clientY - rect.top) / rect.height - 0.5;
                    const inner = e.currentTarget.querySelector('.card-3d-inner');
                    if (inner) {
                      inner.style.setProperty('--rotateX', `${-y * 6}deg`);
                      inner.style.setProperty('--rotateY', `${x * 6}deg`);
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
                    className={`card-3d-inner og-card rounded-lg overflow-hidden bg-slate-800/50 border border-slate-700/50 transition-all duration-300 ease-in-out texture-glass ${categoryAccent}`}
                  >
                    {/* Client Preview Image */}
                    <div className="image-container relative overflow-hidden bg-slate-900 aspect-[3/2]">
                      <div className="skeleton skeleton-loader absolute inset-0" />
                      <img
                        src={client.preview}
                        alt={client.altText || `${client.title} - ${client.description} - Louisville local business website`}
                        className="w-full h-full object-cover object-center transition-all duration-300 group-hover:scale-105 relative z-10"
                        loading={isAboveFold ? "eager" : "lazy"}
                        onLoad={(e) => {
                          e.target.classList.add('loaded');
                          const skeleton = e.target.previousSibling;
                          if (skeleton) skeleton.style.opacity = '0';
                        }}
                        onError={(e) => {
                          e.target.style.opacity = '0';
                          const skeleton = e.target.previousSibling;
                          if (skeleton) {
                            skeleton.style.opacity = '1';
                            skeleton.style.background = 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)';
                            skeleton.style.animation = 'none';
                          }
                        }}
                      />
                      {/* Title overlay at bottom */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900/90 via-slate-900/60 to-transparent p-2 z-10">
                        <h3 className="text-xs font-semibold text-white truncate">{client.title}</h3>
                      </div>
                      {/* Hover overlay with CTA */}
                      <div className="absolute inset-0 bg-slate-900/85 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center z-20 backdrop-blur-sm p-3">
                        <span className="text-[9px] text-teal-400 uppercase tracking-wider mb-1">{client.category}</span>
                        <p className="text-slate-300 text-[10px] text-center leading-relaxed mb-2 line-clamp-3">{client.description}</p>
                        {client.url ? (
                          <a
                            href={client.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 bg-teal-500 hover:bg-teal-400 text-slate-900 font-semibold text-[10px] px-3 py-1.5 rounded transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            View Site <span>→</span>
                          </a>
                        ) : (
                          <span className="text-slate-500 text-[10px]">Coming Soon</span>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {hasMoreClients && (
            <div className="flex justify-center mt-6">
              <button
                onClick={() => setShowAllClients(true)}
                aria-label={`Show all ${allFilteredClients.length} portfolio sites in this category`}
                className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium rounded-lg transition-colors border border-slate-700"
              >
                Show all {allFilteredClients.length} sites
              </button>
            </div>
          )}

          <p className="text-slate-400 text-sm mt-8 text-center">
            Are you a Louisville business looking to establish or improve your online presence?{' '}
            <a href="sms:+15023450525?body=Hey%20Matthew%2C%20I%20saw%20your%20portfolio%20and%20I%27m%20interested%20in%20discussing%20a%20website%20for%20my%20business." aria-label="Text Matthew Scott at 502-345-0525 to discuss a website for your business" className="text-teal-400 hover:text-teal-300 transition-colors underline underline-offset-2">Let's talk.</a>
          </p>
        </div>
      </section>

      {/* Work Section */}
      <section
        ref={workSectionRef}
        id="work"
        aria-label="The Work - Deployed practical applications and conceptual explorations including AI tools, guitar learning platform, job market analysis, and phishing detection"
        className={`px-6 md:px-12 lg:px-24 py-16 border-t border-slate-800 transition-all duration-700 spotlight-warm section-glow-full ${visibleSections.work ? 'opacity-100 translate-y-0 in-view' : 'opacity-0 translate-y-8'}`}
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="heading-display text-2xl md:text-3xl text-white mb-4 neon-text-orange tracking-[-0.02em] section-heading-animate">
            The Work
          </h2>
          <p className="text-slate-400 mb-8 section-stagger-1">
            Tools that solve <span className="accent-italic">real</span> problems. Click to see for yourself.
          </p>

          {/* Practical Apps */}
          <h3 className="heading-display text-xl md:text-2xl text-teal-400 mb-4 flex items-center gap-3 tracking-[-0.01em]">
            <span className="w-2 h-2 bg-teal-400 rounded-full" aria-hidden="true"></span>
            Practical Apps
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 transition-all duration-300 mb-12">
            {practicalProjects.map((project, index) => {
              const isAboveFold = true;

              return (
                <div
                  key={project.id}
                  className="card-subtle-3d group relative"
                  onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = (e.clientX - rect.left) / rect.width - 0.5;
                    const y = (e.clientY - rect.top) / rect.height - 0.5;
                    const inner = e.currentTarget.querySelector('.card-3d-inner');
                    if (inner) {
                      inner.style.setProperty('--rotateX', `${-y * 6}deg`);
                      inner.style.setProperty('--rotateY', `${x * 6}deg`);
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
                  className="card-3d-inner og-card rounded-lg overflow-hidden bg-slate-800/50 border border-slate-700/50 border-t-2 border-t-teal-500/50 transition-all duration-300 ease-in-out texture-glass"
                >
                  {/* Image with title overlay */}
                  <div className="image-container relative overflow-hidden bg-slate-900 aspect-[3/2]">
                    <div className="skeleton skeleton-loader absolute inset-0" />
                    <img
                      src={project.preview}
                      alt={project.altText || `${project.title} - ${project.description}`}
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
                      }}
                    />
                    {/* Title overlay at bottom */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900/90 via-slate-900/60 to-transparent p-2 z-10">
                      <h3 className="text-xs font-semibold text-white truncate">{project.title}</h3>
                    </div>
                    {/* Hover overlay with CTA */}
                    <div className="absolute inset-0 bg-slate-900/85 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center z-20 backdrop-blur-sm p-3">
                      <span className="text-[9px] text-teal-400 uppercase tracking-wider mb-1">{project.tech?.[0] || 'React'}</span>
                      <p className="text-slate-300 text-[10px] text-center leading-relaxed mb-2 line-clamp-3">{project.description}</p>
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 bg-teal-500 hover:bg-teal-400 text-slate-900 font-semibold text-[10px] px-3 py-1.5 rounded transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        View Site <span>→</span>
                      </a>
                    </div>
                  </div>
                </div>
                </div>
              );
            })}
          </div>

          <div className="border-t border-slate-700/30 mb-12"></div>

          {/* Conceptual/Experimental */}
          <h3 className="heading-display text-xl md:text-2xl text-orange-400 mb-2 flex items-center gap-3 tracking-[-0.01em]">
            <span className="w-2 h-2 bg-orange-400 rounded-full" aria-hidden="true"></span>
            Conceptual Explorations
          </h3>
          <p className="text-sm text-slate-500 mb-4">Ideas given form. The inner work made visible.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 transition-all duration-300">
            {experimentalProjects.map((project, index) => {
              const isAboveFold = index < 6;

              return (
                <div
                  key={project.id}
                  className="card-subtle-3d group relative"
                  onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = (e.clientX - rect.left) / rect.width - 0.5;
                    const y = (e.clientY - rect.top) / rect.height - 0.5;
                    const inner = e.currentTarget.querySelector('.card-3d-inner');
                    if (inner) {
                      inner.style.setProperty('--rotateX', `${-y * 6}deg`);
                      inner.style.setProperty('--rotateY', `${x * 6}deg`);
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
                  className="card-3d-inner og-card rounded-lg overflow-hidden bg-slate-800/50 border border-slate-700/50 border-t-2 border-t-orange-500/50 transition-all duration-300 ease-in-out texture-glass"
                >
                  {/* Preview Image with title overlay */}
                  <div className="image-container relative overflow-hidden bg-slate-900 aspect-[3/2]">
                    <div className="skeleton skeleton-loader absolute inset-0" />
                    <img
                      src={project.preview}
                      alt={project.altText || `${project.title} - ${project.description}`}
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
                      }}
                    />
                    {/* Title overlay at bottom */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900/90 via-slate-900/60 to-transparent p-2 z-10">
                      <h3 className="text-xs font-semibold text-white truncate">{project.title}</h3>
                    </div>
                    {/* Hover overlay with CTA */}
                    <div className="absolute inset-0 bg-slate-900/85 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center z-20 backdrop-blur-sm p-3">
                      <span className="text-[9px] text-orange-400 uppercase tracking-wider mb-1">{project.tech?.[0] || 'React'}</span>
                      <p className="text-slate-300 text-[10px] text-center leading-relaxed mb-2 line-clamp-3">{project.description}</p>
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 bg-orange-500 hover:bg-orange-400 text-slate-900 font-semibold text-[10px] px-3 py-1.5 rounded transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        View Site <span>→</span>
                      </a>
                    </div>
                  </div>
                </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* The Method Section - INCREASED TYPOGRAPHY */}
      <section
        id="method"
        aria-label="The Method - Development philosophy and principles: substance first, built to last, measure twice, people over tech"
        className={`relative px-6 md:px-12 lg:px-24 py-24 md:py-32 border-t border-slate-800 transition-all duration-700 spotlight-warm section-glow-full ${visibleSections.method ? 'opacity-100 translate-y-0 in-view' : 'opacity-0 translate-y-8'}`}
      >
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="heading-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white mb-6 neon-text tracking-[-0.02em] section-heading-animate">
            The Method
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-slate-400 mb-16 section-stagger-1 max-w-3xl mx-auto leading-relaxed">
            How the work gets done matters as much as <span className="accent-italic">what</span> gets built.
          </p>

          {/* Principles - Stacked layout for better readability at larger sizes */}
          <div className="space-y-10 md:space-y-12 mb-16">
            <div className="group">
              <div className="flex items-center justify-center gap-4 mb-2">
                <span className="w-12 h-px bg-gradient-to-r from-transparent to-teal-400 group-hover:w-16 transition-all duration-300" aria-hidden="true" />
                <p className="heading-display text-xl sm:text-2xl md:text-3xl text-white tracking-[-0.01em]">
                  Substance <span className="accent-italic">first</span>
                </p>
                <span className="w-12 h-px bg-gradient-to-l from-transparent to-teal-400 group-hover:w-16 transition-all duration-300" aria-hidden="true" />
              </div>
              <p className="text-sm sm:text-base md:text-lg text-slate-400">Working software over impressive pitches.</p>
            </div>

            <div className="group">
              <div className="flex items-center justify-center gap-4 mb-2">
                <span className="w-12 h-px bg-gradient-to-r from-transparent to-teal-400 group-hover:w-16 transition-all duration-300" aria-hidden="true" />
                <p className="heading-display text-xl sm:text-2xl md:text-3xl text-white tracking-[-0.01em]">
                  Built <span className="accent-italic">to</span> last
                </p>
                <span className="w-12 h-px bg-gradient-to-l from-transparent to-teal-400 group-hover:w-16 transition-all duration-300" aria-hidden="true" />
              </div>
              <p className="text-sm sm:text-base md:text-lg text-slate-400">Good systems outlast good intentions.</p>
            </div>

            <div className="group">
              <div className="flex items-center justify-center gap-4 mb-2">
                <span className="w-12 h-px bg-gradient-to-r from-transparent to-amber-500 group-hover:w-16 transition-all duration-300" aria-hidden="true" />
                <p className="heading-display text-xl sm:text-2xl md:text-3xl text-white tracking-[-0.01em]">
                  Measure <span className="accent-italic">twice</span>
                </p>
                <span className="w-12 h-px bg-gradient-to-l from-transparent to-amber-500 group-hover:w-16 transition-all duration-300" aria-hidden="true" />
              </div>
              <p className="text-sm sm:text-base md:text-lg text-slate-400">Test the work, then ship it.</p>
            </div>

            <div className="group">
              <div className="flex items-center justify-center gap-4 mb-2">
                <span className="w-12 h-px bg-gradient-to-r from-transparent to-amber-500 group-hover:w-16 transition-all duration-300" aria-hidden="true" />
                <p className="heading-display text-xl sm:text-2xl md:text-3xl text-white tracking-[-0.01em]">
                  People <span className="accent-italic">over</span> tech
                </p>
                <span className="w-12 h-px bg-gradient-to-l from-transparent to-amber-500 group-hover:w-16 transition-all duration-300" aria-hidden="true" />
              </div>
              <p className="text-sm sm:text-base md:text-lg text-slate-400">Technology works for humans, not the reverse.</p>
            </div>
          </div>

          <p className="text-slate-500 text-sm sm:text-base md:text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
            The right process reveals itself through the work—not before it.
          </p>

          <a
            href="mailto:matthewdscott7@gmail.com"
            aria-label="Email Matthew Scott to discuss a web development project"
            className="inline-flex items-center gap-3 text-teal-400 hover:text-teal-300 transition-all duration-300 text-base sm:text-lg group"
          >
            <span className="border-b border-teal-400/40 group-hover:border-teal-300/60 pb-0.5 transition-colors">
              Let's talk
            </span>
            <span className="text-xl group-hover:translate-x-1.5 transition-transform duration-300" aria-hidden="true">→</span>
          </a>
        </div>
      </section>

      {/* Writing / Articles CTA */}
      <section
        id="writing"
        aria-label="Writing and Articles - Observations on AI collaboration, verification methodology, and software development philosophy"
        className={`relative px-6 md:px-12 lg:px-24 py-20 md:py-28 border-t border-slate-800 section-glow-full transition-all duration-700 ${visibleSections.writing ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      >
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-slate-500 text-xs tracking-[0.2em] uppercase mb-4">Writing</p>
          <h2 className="heading-display text-2xl md:text-3xl lg:text-4xl text-white mb-4 tracking-[-0.02em]">
            Beyond the <span className="accent-italic">Code</span>
          </h2>
          <p className="text-slate-400 mb-8 max-w-xl mx-auto">
            Observations on AI collaboration, verification, and what "working" actually means.
          </p>
          <a
            href="/blog"
            aria-label="Read articles about AI collaboration, the verification gap, and software development philosophy"
            className="group relative inline-flex items-center gap-3 px-8 py-3.5 text-sm tracking-[0.15em] uppercase transition-all duration-500 ease-out bg-gradient-to-r from-teal-500/10 to-teal-600/5 border border-teal-500/40 hover:border-teal-400/80 text-teal-300 hover:text-teal-200 hover:shadow-[0_0_30px_-5px_rgba(20,184,166,0.3)] hover:scale-[1.02] active:scale-[0.98]"
          >
            <span className="relative z-10">Read Articles</span>
            <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>
      </section>

      {/* Guitar Reference Library CTA */}
      <section
        id="guitar"
        aria-label="Guitar scale reference library - 24 downloadable PDF books with verified tablature"
        className={`relative px-6 md:px-12 lg:px-24 py-20 md:py-28 border-t border-slate-800 section-glow-full transition-all duration-700 ${visibleSections.guitar ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      >
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-slate-500 text-xs tracking-[0.2em] uppercase mb-4">Guitar</p>
          <h2 className="heading-display text-2xl md:text-3xl lg:text-4xl text-white mb-4 tracking-[-0.02em]">
            Fretboard <span className="accent-italic">Mastery</span>
          </h2>
          <p className="text-slate-400 mb-8 max-w-xl mx-auto">
            24 scale reference books. 480 exercises each. Every key, every position, mathematically verified tablature.
          </p>
          <a
            href="/guitar"
            aria-label="Browse 24 guitar scale reference books with verified tablature"
            className="group relative inline-flex items-center gap-3 px-8 py-3.5 text-sm tracking-[0.15em] uppercase transition-all duration-500 ease-out bg-gradient-to-r from-teal-500/10 to-teal-600/5 border border-teal-500/40 hover:border-teal-400/80 text-teal-300 hover:text-teal-200 hover:shadow-[0_0_30px_-5px_rgba(20,184,166,0.3)] hover:scale-[1.02] active:scale-[0.98]"
          >
            <span className="relative z-10">Browse Library</span>
            <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>
      </section>
      </main>

      {/* Footer */}
      <footer id="contact" aria-label="Contact Matthew Scott - Email, social media links, and site navigation" className="px-6 md:px-12 lg:px-24 py-20 border-t border-slate-800 texture-brass">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="heading-display text-2xl md:text-3xl text-white mb-4 neon-text tracking-[-0.02em] section-heading-animate">
            Let's <span className="accent-italic">Build</span>
          </h2>
          <p className="text-slate-400 mb-2 section-stagger-1">
            If you recognize the work, reach out.
          </p>
          <p className="text-slate-500 mb-10 section-stagger-2">
            If you need convincing, I'm not for you.
          </p>
          <nav aria-label="Footer navigation - contact email, manifesto, and articles" className="flex items-center justify-center gap-4 heading-display text-lg md:text-xl tracking-[-0.01em] mb-8">
            <a
              href="mailto:matthewdscott7@gmail.com"
              aria-label="Send email to Matthew Scott at matthewdscott7@gmail.com"
              className="text-white hover:text-teal-400 transition-colors"
            >
              matthewdscott7@gmail.com
            </a>
            <span className="text-slate-600" aria-hidden="true">·</span>
            <a
              href="/manifesto"
              aria-label="Read Matthew Scott's development manifesto and philosophy"
              className="text-white hover:text-amber-500 transition-colors"
            >
              The <span className="accent-italic">Manifesto</span>
            </a>
            <span className="text-slate-600" aria-hidden="true">&middot;</span>
            <a
              href="/blog"
              aria-label="Read articles about AI collaboration, verification, and software development"
              className="text-white hover:text-teal-400 transition-colors"
            >
              Articles
            </a>
            <span className="text-slate-600" aria-hidden="true">&middot;</span>
            <a
              href="/guitar"
              aria-label="Browse guitar scale reference books"
              className="text-white hover:text-teal-400 transition-colors"
            >
              Guitar
            </a>
          </nav>

          {/* Social Media Icons */}
          <div className="flex items-center justify-center gap-6" role="list" aria-label="Social media profiles">
            <a
              href="https://linkedin.com/in/mscott77"
              target="_blank"
              rel="noopener noreferrer"
              className="group"
              aria-label="LinkedIn"
            >
              <svg
                className="w-6 h-6 text-slate-400 group-hover:text-[#0A66C2] group-hover:scale-110 transition-all duration-300"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
            <a
              href="https://instagram.com/guitargnar"
              target="_blank"
              rel="noopener noreferrer"
              className="group"
              aria-label="Instagram"
            >
              <svg
                className="w-6 h-6 text-slate-400 group-hover:text-[#E4405F] group-hover:scale-110 transition-all duration-300"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
              </svg>
            </a>
            <a
              href="https://www.facebook.com/guitargnar/"
              target="_blank"
              rel="noopener noreferrer"
              className="group"
              aria-label="Facebook"
            >
              <svg
                className="w-6 h-6 text-slate-400 group-hover:text-[#1877F2] group-hover:scale-110 transition-all duration-300"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
          </div>
          {/* Footer bottom with centered watermark */}
          <div className="mt-16 pt-8 border-t border-slate-800/50 flex flex-col items-center gap-4">
            {/* Auriga Watermark */}
            <button onClick={() => window.location.href = '/dashboard'} aria-label="Project Lavos" className="cursor-pointer bg-transparent border-0 p-0">
              <img
                src="/projectlavos-watermark-teal.svg"
                alt="Project Lavos"
                className="w-32 h-16 object-contain opacity-50 hover:opacity-80 transition-opacity"
              />
            </button>
            {/* Copyright and legal */}
            <div className="text-center">
              <p className="text-slate-500 text-xs">
                © {new Date().getFullYear()} Matthew Scott
              </p>
              <a
                href="/privacy"
                aria-label="View privacy policy for projectlavos.com"
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
