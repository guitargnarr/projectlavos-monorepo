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
      specWork: false, // Paid client work
      details: "A curated boutique bringing unique finds to Louisville. Built a clean, modern storefront that reflects the brand's personality and makes discovery easy."
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
      specWork: true, // Spec work - business model in development
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
      id: "nachbar",
      title: "Nachbar",
      url: "https://nachbar.vercel.app",
      preview: "/previews/nachbar.png",
      ogImage: "/og-images/nachbar-og.png",
      qrCode: "/qr-codes/nachbar-qr.png",
      description: "Germantown's neighborhood bar",
      altText: "Nachbar Germantown Louisville neighborhood bar website featuring German and Belgian beers, live music schedule",
      category: "Bar",
      specWork: true, // Spec work - business model in development
      details: "Louisville's beloved dive bar since 2007. German & Belgian beers, live music, two dog-friendly patios. Built a site that captures the vibe and keeps regulars informed."
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
    {
      id: "primaryexpresscare",
      title: "Primary Express Care",
      url: "https://primary-express-care.vercel.app",
      preview: "/previews/primary-express-care.png",
      ogImage: "/previews/primary-express-care.png",
      qrCode: "/qr-codes/primary-express-care-qr.png",
      description: "Walk-in urgent care clinic",
      altText: "Primary Express Care Louisville walk-in urgent care clinic medical services no appointment needed",
      category: "Medical",
      specWork: true,
      details: "Louisville's trusted walk-in urgent care clinic. No appointment needed for quality medical care. Serving the community with compassionate, efficient healthcare."
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
    }
  ];

  const [expandedClient, setExpandedClient] = useState(null);
  const [activeClientVersion, setActiveClientVersion] = useState({});

  const projects = [
    {
      id: "fretvision",
      title: "FretVision",
      url: "https://guitar.projectlavos.com",
      preview: "/previews/guitar.png",
      ogImage: "/og-images/guitar-og.png",
      description: "Interactive fretboard, lessons, MIDI playback",
      altText: "FretVision guitar learning app showing interactive fretboard visualization with scale patterns and MIDI playback controls",
      category: "Education",
      details: "Guitar learning apps exist, but none combine fretboard visualization, tab playback, and riff generation in one place. The riff generator uses deterministic Python for music theory—LLMs can't count frets accurately."
    },
    {
      id: "phishguard",
      title: "PhishGuard",
      url: "https://phishguard.projectlavos.com",
      preview: "/previews/phishguard.png",
      ogImage: "/og-images/phishguard-og.png",
      description: "Sentiment analysis NLP for anti-phishing",
      altText: "PhishGuard email security tool analyzing suspicious email content for phishing indicators using sentiment analysis",
      category: "Security",
      details: "Phishing attacks exploit human psychology, not just technical vulnerabilities. PhishGuard analyzes email sentiment patterns to flag manipulation tactics before they reach the inbox."
    },
    {
      id: "vantage",
      title: "Vantage",
      url: "https://jobs.projectlavos.com",
      preview: "/previews/jobs.png",
      ogImage: "/og-images/jobs-og.png",
      description: "Job market analysis & resume tailoring",
      altText: "Vantage job market analytics dashboard showing Louisville KY employment trends and company hiring patterns",
      category: "Career",
      details: "Job boards show listings. Vantage shows patterns—which companies are hiring, what skills are trending locally, and how to position yourself. Built for Louisville first."
    },
    {
      id: "ourjourney",
      title: "OurJourney",
      url: "https://ourjourney.projectlavos.com",
      preview: "/previews/ourjourney.png",
      ogImage: "/og-images/ourjourney-og.png",
      description: "Private space for couples to catalog experiences",
      altText: "OurJourney couple experience tracker app showing shared memories and private journal entries",
      category: "Personal",
      details: "Social media makes sharing performative. OurJourney is the opposite—a private space for two people to document what matters to them, without an audience."
    },
    {
      id: "jobtrack",
      title: "JobTrack",
      url: "https://jobtrack.projectlavos.com",
      preview: "/previews/jobtrack.png",
      ogImage: "/og-images/jobtrack-og.png",
      description: "Application tracking system",
      altText: "JobTrack application tracking dashboard showing job applications, response rates, and interview pipeline",
      category: "Career",
      details: "Spreadsheets work until they don't. JobTrack adds structure to the job search grind—tracking applications, follow-ups, and outcomes in one place."
    },
    {
      id: "psyche",
      title: "Psyche",
      url: "https://psyche-jung.vercel.app",
      preview: "/previews/psyche-jung.png",
      ogImage: "/previews/psyche-jung.png",
      description: "A Jungian exploration hub",
      altText: "Psyche Jungian exploration hub - four portals into depths of understanding: soul, shadow, archetype, and synthesis",
      category: "Creative",
      details: "Four portals into the depths of understanding. Soul, shadow, archetype, and synthesis. The hub connecting explorations of Jungian depth psychology."
    },
    {
      id: "threshold",
      title: "Threshold",
      url: "https://threshold-liminal.vercel.app",
      preview: "/previews/threshold-liminal.png",
      ogImage: "/previews/threshold-liminal.png",
      description: "Liminal spaces",
      altText: "Threshold Liminal creative digital experience exploring liminal spaces and transitional moments",
      category: "Jungian",
      details: "The in-between places where transformation happens. Neither here nor there, but becoming. An exploration of liminal spaces—the thresholds between states."
    },
    {
      id: "umbra",
      title: "Umbra",
      url: "https://umbra-shadow.vercel.app",
      preview: "/previews/umbra-shadow.png",
      ogImage: "/previews/umbra-shadow.png",
      description: "Shadow integration",
      altText: "Umbra shadow integration exploring the rejected parts of ourselves that hold our greatest power",
      category: "Jungian",
      details: "The rejected parts of ourselves that hold our greatest power. What we deny, we cannot transform. An exploration of shadow work and integration."
    },
    {
      id: "forma",
      title: "Forma",
      url: "https://forma-archetypes.vercel.app",
      preview: "/previews/forma-archetypes.png",
      ogImage: "/previews/forma-archetypes.png",
      description: "Archetypal patterns",
      altText: "Forma archetypal patterns exploring universal figures and collective unconscious through interactive design",
      category: "Jungian",
      details: "Universal figures that live in all of us. Hero, Shadow, Sage, Lover, Trickster, Mother. Patterns older than memory, written into the collective unconscious."
    },
    {
      id: "auriga",
      title: "Auriga",
      url: "https://auriga-chariot.vercel.app",
      preview: "/previews/auriga-chariot.png",
      ogImage: "/previews/auriga-chariot.png",
      description: "The Charioteer",
      altText: "Auriga the charioteer exploring human-AI collaboration through Plato's chariot metaphor",
      category: "Jungian",
      details: "The synthesis of human and AI collaboration. The charioteer holds the reins. The horses provide the power. Neither is complete alone. A philosophical exploration of orchestrated partnership."
    }
  ];

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
      {/* Fixed Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-sm border-b border-slate-800/50">
        <div className="max-w-6xl mx-auto px-6 py-3 flex justify-between items-center">
          <span className="text-teal-400 font-semibold text-sm">MS</span>
          <div className="flex gap-6 text-xs text-slate-400">
            <a href="#louisville" className="hover:text-teal-400 transition-colors">Louisville</a>
            <a href="#work" className="hover:text-teal-400 transition-colors">Work</a>
            <a href="#method" className="hover:text-teal-400 transition-colors">Method</a>
            <a href="#contact" className="hover:text-teal-400 transition-colors">Contact</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="min-h-[70vh] flex flex-col justify-center px-6 md:px-12 lg:px-24 pt-24">
        <div className="max-w-4xl">
          <div className="flex flex-col md:flex-row md:items-start gap-8 mb-8">
            <div className="flex flex-col items-center animate-fade-in">
              <img
                src="/headshot.png"
                alt="Matthew Scott - Web Developer and Consultant based in Louisville, Kentucky"
                className="headshot w-40 h-40 md:w-48 md:h-48 rounded-full border-2 border-teal-500/30 object-cover shadow-[0_0_40px_rgba(20,184,166,0.25)]"
              />
              <p className="text-sm text-slate-400 mt-3 text-center">
                Louisville, KY
              </p>
            </div>
            <div className="flex-1">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-white mb-4 sm:mb-6 animate-fade-in-delay-1 text-center md:text-left">
                MATTHEW SCOTT
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-slate-300 leading-relaxed mb-4 sm:mb-6 animate-fade-in-delay-2 text-center md:text-left">
                I untangle complexity. Then I make it useful.
              </p>
              {/* Operating Principles with tooltips */}
              <div className="flex flex-wrap justify-center md:justify-start gap-x-4 gap-y-2 md:gap-x-6 animate-fade-in-delay-3 mb-8">
                {principles.map((principle, idx) => (
                  <span
                    key={idx}
                    className="principle-tag text-xs sm:text-sm text-teal-400 whitespace-nowrap cursor-help relative group"
                    title={principle.tooltip}
                  >
                    {principle.text}
                    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-slate-800 text-slate-300 text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-normal w-48 text-center border border-slate-700 shadow-lg z-10">
                      {principle.tooltip}
                    </span>
                  </span>
                ))}
              </div>
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-3 animate-fade-in-delay-3">
                <button
                  onClick={scrollToWork}
                  className="group flex items-center justify-center gap-2 px-6 py-3 bg-teal-500 hover:bg-teal-400 text-slate-900 font-semibold rounded-lg transition-all duration-300 hover:shadow-[0_0_20px_rgba(20,184,166,0.4)]"
                >
                  See My Work
                  <span className="group-hover:translate-y-1 transition-transform duration-300">↓</span>
                </button>
                <a
                  href="#method"
                  className="group flex items-center justify-center gap-2 px-6 py-3 border-2 border-teal-500 text-teal-400 hover:bg-teal-500/10 font-semibold rounded-lg transition-all duration-300"
                >
                  How I Work
                  <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Louisville Section */}
      <section
        id="louisville"
        className={`px-6 md:px-12 lg:px-24 py-16 border-t border-slate-800 transition-all duration-700 ${visibleSections.louisville ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      >
        <div className="max-w-6xl">
          <h2 className="text-2xl md:text-3xl font-semibold text-white mb-2">
            Louisville
          </h2>
          <p className="text-slate-400 mb-4">
            Louisville first. Every local business deserves to be found online—not just the ones with marketing budgets.
          </p>
          <p className="text-xs text-slate-400 mb-8 italic">
            Note: Projects marked "Spec Work" were built to demonstrate capability while solidifying my business model. Fable & Flow is paid client work.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 transition-all duration-300">
            {localClients.map((client) => {
              const isClientExpanded = expandedClient === client.id;

              return (
                <div
                  key={client.id}
                  onClick={() => setExpandedClient(isClientExpanded ? null : client.id)}
                  className={`
                    og-card group cursor-pointer rounded-lg overflow-hidden bg-slate-800/50 border border-slate-700/50 hover:border-teal-500/30 transition-all duration-300 ease-in-out
                    ${isClientExpanded ? 'sm:col-span-2 lg:col-span-3 row-span-2' : ''}
                    ${expandedClient && !isClientExpanded ? 'opacity-60 scale-95' : 'opacity-100 scale-100'}
                  `}
                >
                  {/* Client Preview Image */}
                  {(() => {
                    const activeVersion = client.versions?.[activeClientVersion[client.id] ?? 0];
                    const displayPreview = isClientExpanded && activeVersion ? activeVersion.preview : client.preview;
                    return (
                      <div className={`overflow-hidden bg-slate-800 transition-all duration-300 ${isClientExpanded ? 'aspect-[16/6]' : 'aspect-[1200/630]'}`}>
                        <img
                          src={displayPreview}
                          alt={client.altText || `${client.title} - ${client.description} - Louisville local business website`}
                          className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                        <div className="hidden w-full h-full items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
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
                        <p className={`text-xs text-slate-400 ${isClientExpanded ? '' : 'truncate'}`}>{client.description}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-xs text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded whitespace-nowrap">
                          {client.category}
                        </span>
                        <span className={`text-teal-400 text-xs transition-transform duration-200 flex-shrink-0 ${isClientExpanded ? 'rotate-180' : ''}`}>
                          {isClientExpanded ? '▲' : '▼'}
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
              );
            })}
          </div>

          <p className="text-slate-400 text-sm mt-8 text-center">
            Are you a Louisville business looking to establish or improve your online presence?{' '}
            <a href="mailto:matthewdscott7@gmail.com" className="text-teal-400 hover:text-teal-300 transition-colors underline underline-offset-2">Let's talk.</a>
          </p>
        </div>
      </section>

      {/* Work Section */}
      <section
        ref={workSectionRef}
        id="work"
        className={`px-6 md:px-12 lg:px-24 py-16 border-t border-slate-800 transition-all duration-700 ${visibleSections.work ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      >
        <div className="max-w-6xl">
          <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4">
            The Work
          </h2>
          <p className="text-slate-400 mb-8">
            Live. Deployed. In production. Click to see for yourself.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 transition-all duration-300">
            {projects.map((project) => {
              const isExpanded = expandedProject === project.id;

              return (
                <div
                  key={project.id}
                  onClick={(e) => handleCardClick(e, project.id)}
                  className={`
                    og-card group cursor-pointer rounded-lg overflow-hidden bg-slate-800/50 border border-slate-700/50 hover:border-teal-500/30 transition-all duration-300 ease-in-out
                    ${isExpanded ? 'sm:col-span-2 lg:col-span-3 row-span-2' : ''}
                    ${expandedProject && !isExpanded ? 'opacity-60 scale-95' : 'opacity-100 scale-100'}
                  `}
                >
                  {/* Preview Image */}
                  <div className={`overflow-hidden bg-slate-800 transition-all duration-300 ${isExpanded ? 'aspect-[16/6]' : 'aspect-[1200/630]'}`}>
                    <img
                      src={project.preview}
                      alt={project.altText || `${project.title} - ${project.description}`}
                      className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div className="hidden w-full h-full items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
                      <span className="text-4xl font-bold text-teal-500/20">{project.title.charAt(0)}</span>
                    </div>
                  </div>

                  {/* Card Info */}
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h3 className="text-sm font-semibold text-white mb-1">{project.title}</h3>
                        <p className={`text-xs text-slate-400 ${isExpanded ? '' : 'truncate'}`}>{project.description}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-xs text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded whitespace-nowrap">
                          {project.category}
                        </span>
                        <span className={`text-teal-400 text-xs transition-transform duration-200 flex-shrink-0 ${isExpanded ? 'rotate-180' : ''}`}>
                          {isExpanded ? '▲' : '▼'}
                        </span>
                      </div>
                    </div>

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
              );
            })}
          </div>
        </div>
      </section>

      {/* The Method Section */}
      <section
        id="method"
        className={`px-6 md:px-12 lg:px-24 py-16 border-t border-slate-800 transition-all duration-700 ${visibleSections.method ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      >
        <div className="max-w-4xl">
          <h2 className="text-2xl md:text-3xl font-semibold text-white mb-8">
            The Method
          </h2>

          <p className="text-slate-300 leading-relaxed mb-6">
            I synthesize. Regulations, technical systems, tangled processes—I turn them
            into maps people actually use. Not reports that collect dust. Views that drive decisions.
          </p>

          <p className="text-slate-300 leading-relaxed mb-6">
            The method: get inside the problem, find what's actually happening—not what
            everyone assumes—and build something that proves the insight works.
          </p>

          <p className="text-slate-300 leading-relaxed mb-8">
            I've done startups and corporate. Seen both playbooks. Now I'm writing my own.
          </p>

          <a
            href="https://auriga-chariot.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-teal-400 hover:text-teal-300 transition-colors text-sm group"
          >
            <span className="border-b border-teal-400/30 group-hover:border-teal-300/50 transition-colors">
              On the nature of human-AI collaboration
            </span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </a>

        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="px-6 md:px-12 lg:px-24 py-16 border-t border-slate-800">
        <div className="max-w-4xl">
          <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4">
            Let's Build Something
          </h2>
          <p className="text-slate-400 mb-2">
            Have a complex problem that needs untangling? A system that should exist but doesn't?
          </p>
          <p className="text-slate-400 mb-8">
            <span className="text-teal-400">Taking specific problems.</span> Not general retainers.
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
          </div>
          <p className="text-slate-400 text-xs mt-12">
            © {new Date().getFullYear()} Matthew Scott. Built with purpose.
          </p>
        </div>
      </footer>
      <Analytics />
    </div>
  );
}

export default App;
