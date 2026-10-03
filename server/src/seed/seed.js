require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');

const User = require('../models/User');
const Crop = require('../models/Crop');
const Product = require('../models/Product');
const BlogPost = require('../models/BlogPost');
const NGOProgram = require('../models/NGOProgram');
const Testimonial = require('../models/Testimonial');
const Page = require('../models/Page');
const SiteSettings = require('../models/SiteSettings');
const Inquiry = require('../models/Inquiry');
const AuditLogEntry = require('../models/AuditLogEntry');

// Curated, hand-picked African farm / agriculture photos from Pexels (verified real,
// on-theme photos — not a generic placeholder service). IDs map to specific real
// photos; see the git history of this file for how each was chosen if it needs revisiting.
const PEXELS = (id, w = 800, h = 600) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}&h=${h}&fit=crop`;

const IMG = {
  cocoaPods: 37062650, // Ripe cocoa pods on tree in tropical setting
  cocoaHarvest: 35585310, // Abundant harvest of vibrant cacao pods outdoors
  bananaPlantation: 15408866, // Photo of a banana plantation
  plantainFarmer: 37287980, // African farmer holding fresh green plantains
  cashewTree: 10615955, // Cashew fruit on tree
  cashewFruit: 30878379, // Ripe cashew fruits on natural matting
  coffeeBerries: 30711594, // Ripe coffee berries on plant branch in Burundi
  coffeeHarvestWomen: 34792532, // Smiling women harvesting coffee in lush field
  cocoaBeansDryingGhana: 31283914, // Close-up of cocoa farmer's hands spreading beans to dry, Ghana
  cocoaBeansDrySunlight: 32597040, // High-resolution image of raw cocoa beans
  plantainMarketNigeria: 31537314, // Harvested green bananas at Nigerian market
  rawCashewHand: 34449058, // Close-up of raw cashew nuts in hand outdoors
  cashewKernelsBowl: 36631827, // Bowl of raw cashew nuts on a table
  greenCoffeeBeans: 30711593, // Green coffee beans on branch after rain, Burundi
  farmerInspectingCrops: 34411658, // Nigerian farmer examining crops in field
  waterPumpChild: 32154739, // African child operating water pump in village
  womenMarketFlour: 31135663, // African market women selling flour in bowls
  africanClassroomChildren: 28593044, // Joyful children smiling in African classroom
  smilingFarmerWoman1: 34705724, // Smiling Nigerian farmer with fresh tomatoes
  smilingFarmerMan: 33993456, // Smiling African farmer in Nigerian field
  smilingWomanBasketField: 15897037, // Smiling woman with basket on back working in field
  cocoaHandsDryingGhana: 31283913, // Hands spreading cocoa beans for drying, Ghana
  womenHarvestingCrops: 30483244, // Women harvesting crops in a rural setting
  aerialFarmsKenya: 30255157, // Aerial view of patchwork farms in Mau Narok, Kenya
  womanCarryingWater: 36492507, // Woman carrying water bucket in rural setting
  ruralLandscapeFarmers: 30801781, // Scenic rural landscape with farmers in field
  elderlyFarmerField: 38839544, // Elderly farmer in lush green field under bright sky
  farmerInspectingField2: 34411687, // African farmer inspecting crops in field
  farmersWorkingGreenField: 31472079, // African farmers working in lush green field
};

const CROP_IMAGES = {
  cocoa: [IMG.cocoaPods, IMG.cocoaHarvest],
  plantain: [IMG.bananaPlantation, IMG.plantainFarmer],
  cashew: [IMG.cashewTree, IMG.cashewFruit],
  coffee: [IMG.coffeeBerries, IMG.coffeeHarvestWomen],
};

const PRODUCT_IMAGES = {
  'Premium Fermented Cocoa Beans': IMG.cocoaBeansDryingGhana,
  'Cocoa Butter (Bulk)': IMG.cocoaBeansDrySunlight,
  'Green Export Plantain': IMG.plantainMarketNigeria,
  'Raw Cashew Nuts (RCN)': IMG.rawCashewHand,
  'Cashew Kernels W320': IMG.cashewKernelsBowl,
  'Green Coffee Beans AA': IMG.greenCoffeeBeans,
};

const PROGRAM_IMAGES = {
  'farmer-field-schools': IMG.farmerInspectingCrops,
  'clean-water-for-farming-communities': IMG.waterPumpChild,
  'womens-agribusiness-cooperative': IMG.womenMarketFlour,
  'school-feeding-scholarship-fund': IMG.africanClassroomChildren,
};

async function seed() {
  await connectDB();
  console.log('Clearing existing data...');
  await Promise.all([
    User.deleteMany({}),
    Crop.deleteMany({}),
    Product.deleteMany({}),
    BlogPost.deleteMany({}),
    NGOProgram.deleteMany({}),
    Testimonial.deleteMany({}),
    Page.deleteMany({}),
    SiteSettings.deleteMany({}),
    Inquiry.deleteMany({}),
    AuditLogEntry.deleteMany({}),
  ]);

  console.log('Creating users...');
  const [superAdmin, editor, contributor] = await Promise.all([
    User.create({
      name: 'Amara Lobito',
      email: 'admin@lobitofarms.com',
      passwordHash: await User.hashPassword('Admin@12345'),
      role: 'super_admin',
    }),
    User.create({
      name: 'Kwame Editor',
      email: 'editor@lobitofarms.com',
      passwordHash: await User.hashPassword('Editor@12345'),
      role: 'editor',
    }),
    User.create({
      name: 'Nia Contributor',
      email: 'contributor@lobitofarms.com',
      passwordHash: await User.hashPassword('Contributor@12345'),
      role: 'contributor',
    }),
  ]);

  console.log('Creating crops...');
  const cropDefs = [
    {
      name: 'Cocoa',
      slug: 'cocoa',
      category: 'Cash Crop',
      description:
        'Our cocoa is grown across smallholder farms and estate plots, hand-harvested at peak ripeness and fermented under strict quality control to develop the rich flavor profile international buyers rely on.',
      season: 'Main crop: Oct - Mar, Mid crop: May - Aug',
      exportGrade: 'Grade I, Fair Trade certified',
    },
    {
      name: 'Plantain',
      slug: 'plantain',
      category: 'Staple Crop',
      description:
        'Grown in fertile lowland plots with sustainable intercropping practices, our plantains are harvested green for export and ripened under controlled conditions for local distribution.',
      season: 'Year-round, peak Jun - Sep',
      exportGrade: 'Export Grade A',
    },
    {
      name: 'Cashew',
      slug: 'cashew',
      category: 'Cash Crop',
      description:
        'Raw cashew nuts sourced from drought-resistant orchards, sun-dried and sorted by hand before export. We work directly with outgrower communities to guarantee traceability from tree to shipment.',
      season: 'Feb - May',
      exportGrade: 'W240 / W320 kernel grades',
    },
    {
      name: 'Coffee',
      slug: 'coffee',
      category: 'Cash Crop',
      description:
        'Shade-grown Robusta and Arabica beans cultivated on the highland edges of our cooperative farms, wet-processed for a clean, bright cup profile.',
      season: 'Nov - Feb',
      exportGrade: 'AA / AB grades',
    },
  ];

  const crops = await Promise.all(
    cropDefs.map((c, i) =>
      Crop.create({
        ...c,
        images: CROP_IMAGES[c.slug].map((id) => PEXELS(id, 800, 600)),
        status: 'published',
        seo: { metaTitle: `${c.name} | Lobito Farms`, metaDescription: c.description.slice(0, 155) },
        createdBy: superAdmin._id,
        updatedBy: superAdmin._id,
      })
    )
  );

  console.log('Creating products...');
  const productDefs = [
    { name: 'Premium Fermented Cocoa Beans', crop: 'cocoa', moq: '1 container (24 MT)', packaging: '60kg jute bags' },
    { name: 'Cocoa Butter (Bulk)', crop: 'cocoa', moq: '5 MT', packaging: '25kg cartons' },
    { name: 'Green Export Plantain', crop: 'plantain', moq: '18 MT pallet load', packaging: 'Ventilated cartons' },
    { name: 'Raw Cashew Nuts (RCN)', crop: 'cashew', moq: '1 container (20 MT)', packaging: '80kg polypropylene bags' },
    { name: 'Cashew Kernels W320', crop: 'cashew', moq: '2 MT', packaging: 'Vacuum-sealed 22.68kg tins' },
    { name: 'Green Coffee Beans AA', crop: 'coffee', moq: '1 MT', packaging: '60kg GrainPro bags' },
  ];

  for (const p of productDefs) {
    const crop = crops.find((c) => c.slug === p.crop);
    await Product.create({
      name: p.name,
      slug: p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      crop: crop._id,
      description: `${p.name} sourced directly from Lobito Farms' network of cooperative growers, quality-checked and export-ready.`,
      images: [PEXELS(PRODUCT_IMAGES[p.name], 800, 600)],
      specs: 'Moisture content, defect count, and grading available on request.',
      moq: p.moq,
      packaging: p.packaging,
      status: 'published',
      seo: {
        metaTitle: `${p.name} | Lobito Farms`,
        metaDescription: `${p.name} sourced directly from Lobito Farms' network of cooperative growers, quality-checked and export-ready. MOQ ${p.moq}.`.slice(0, 155),
      },
      createdBy: editor._id,
      updatedBy: editor._id,
    });
  }

  console.log('Creating NGO programs...');
  const programDefs = [
    {
      title: 'Farmer Field Schools',
      slug: 'farmer-field-schools',
      description:
        'Hands-on agronomy training helping smallholder farmers improve yield, adopt climate-smart practices, and access fair markets.',
      category: 'Training',
      beneficiaries: 1200,
      location: 'Lobito River Valley',
    },
    {
      title: 'Clean Water for Farming Communities',
      slug: 'clean-water-for-farming-communities',
      description:
        'Borehole and rainwater harvesting infrastructure for villages surrounding our farm clusters, reducing waterborne illness and freeing up time otherwise spent walking for water.',
      category: 'Infrastructure',
      beneficiaries: 3400,
      location: 'Rural cooperative villages',
    },
    {
      title: "Women's Agribusiness Cooperative",
      slug: 'womens-agribusiness-cooperative',
      description:
        'Microgrants and business training for women-led farming cooperatives to process and sell value-added products like cocoa butter and dried plantain chips.',
      category: 'Economic Empowerment',
      beneficiaries: 460,
      location: 'Multiple districts',
    },
    {
      title: 'School Feeding & Scholarship Fund',
      slug: 'school-feeding-scholarship-fund',
      description:
        "Daily meals and scholarship support for children in farming families, funded in part by proceeds from Lobito Farms' export operations.",
      category: 'Education',
      beneficiaries: 890,
      location: 'Lobito District Schools',
    },
  ];

  const programs = await Promise.all(
    programDefs.map((p) =>
      NGOProgram.create({
        ...p,
        image: PEXELS(PROGRAM_IMAGES[p.slug], 800, 600),
        status: 'published',
        seo: { metaTitle: `${p.title} | Lobito Farms Foundation`, metaDescription: p.description.slice(0, 155) },
        createdBy: superAdmin._id,
        updatedBy: superAdmin._id,
      })
    )
  );

  console.log('Creating testimonials...');
  await Testimonial.create([
    {
      name: 'Grace Amoah',
      role: 'Cocoa Cooperative Member',
      quote:
        'The Farmer Field School changed how I farm. My cocoa yield went up and I finally understand fermentation quality standards our buyers ask for.',
      image: PEXELS(IMG.smilingFarmerWoman1, 300, 300),
      featured: true,
    },
    {
      name: 'Samuel Boateng',
      role: 'Export Partner, Rotterdam',
      quote:
        'Lobito Farms is one of the few suppliers whose documentation and traceability match what they promise. Consistent quality, shipment after shipment.',
      image: PEXELS(IMG.smilingFarmerMan, 300, 300),
      featured: true,
    },
    {
      name: 'Fatima Diallo',
      role: "Women's Cooperative Lead",
      quote:
        'With the microgrant, our cooperative bought a drying machine. We now process and sell cashew kernels ourselves instead of raw nuts at a lower price.',
      image: PEXELS(IMG.smilingWomanBasketField, 300, 300),
      featured: false,
    },
  ]);

  console.log('Creating blog posts...');
  const now = Date.now();
  await BlogPost.create([
    {
      title: 'How We Ferment Cocoa for Export-Grade Flavor',
      slug: 'how-we-ferment-cocoa-for-export-grade-flavor',
      excerpt: 'A look inside our fermentation process and why timing determines flavor quality.',
      body: '<p>Fermentation is where cocoa flavor is really made. Our teams turn the beans daily across a six-day fermentation window, monitoring temperature and pH to hit the profile our export partners expect.</p>',
      coverImage: PEXELS(IMG.cocoaHandsDryingGhana, 800, 600),
      author: editor._id,
      tags: ['cocoa', 'export', 'quality'],
      category: 'Farming Practices',
      status: 'published',
      publishedAt: new Date(now - 12 * 86400000),
      seo: { metaTitle: 'How We Ferment Cocoa for Export-Grade Flavor', metaDescription: 'A look inside our fermentation process and why timing determines flavor quality.' },
      createdBy: editor._id,
      updatedBy: editor._id,
    },
    {
      title: 'Inside the Women\'s Agribusiness Cooperative',
      slug: 'inside-the-womens-agribusiness-cooperative',
      excerpt: 'Meet the cooperative turning raw cashew into higher-value kernels.',
      body: '<p>Three years ago, this cooperative sold raw cashew nuts at farm-gate prices. Today, with training and a shared drying facility, they process and sell kernels directly.</p>',
      coverImage: PEXELS(IMG.womenHarvestingCrops, 800, 600),
      author: superAdmin._id,
      tags: ['ngo', 'cashew', 'women'],
      category: 'Community Impact',
      status: 'published',
      publishedAt: new Date(now - 5 * 86400000),
      seo: { metaTitle: "Inside the Women's Agribusiness Cooperative", metaDescription: 'Meet the cooperative turning raw cashew into higher-value kernels.' },
      createdBy: superAdmin._id,
      updatedBy: superAdmin._id,
    },
    {
      title: '2026 Harvest Outlook: What Buyers Should Expect',
      slug: '2026-harvest-outlook-what-buyers-should-expect',
      excerpt: 'Early projections for cocoa and cashew volumes this season.',
      body: '<p>This draft is still being reviewed by our export team before publishing.</p>',
      coverImage: PEXELS(IMG.aerialFarmsKenya, 800, 600),
      author: contributor._id,
      tags: ['export', 'forecast'],
      category: 'Company Updates',
      status: 'draft',
      seo: { metaTitle: '2026 Harvest Outlook: What Buyers Should Expect', metaDescription: 'Early projections for cocoa and cashew volumes this season.' },
      createdBy: contributor._id,
      updatedBy: contributor._id,
    },
    {
      title: 'Why We Invest in Clean Water, Not Just Crops',
      slug: 'why-we-invest-in-clean-water-not-just-crops',
      excerpt: 'Publishing automatically once its scheduled date arrives — a live demo of the CMS scheduling feature.',
      body: '<p>A farm is only as strong as the community around it. This post explains our clean water program and its long-term link to farm productivity.</p>',
      coverImage: PEXELS(IMG.womanCarryingWater, 800, 600),
      author: editor._id,
      tags: ['ngo', 'water'],
      category: 'Community Impact',
      status: 'in_review',
      publishAt: new Date(now + 2 * 60000),
      seo: { metaTitle: 'Why We Invest in Clean Water, Not Just Crops', metaDescription: 'Why Lobito Farms funds clean water infrastructure alongside crop investment.' },
      createdBy: editor._id,
      updatedBy: editor._id,
    },
  ]);

  console.log('Creating Home page (block-based)...');
  await Page.create({
    slug: 'home',
    title: 'Home',
    status: 'published',
    blocks: [
      {
        type: 'hero',
        order: 0,
        config: {
          heading: 'Growing Cocoa, Plantain & Cashew — Growing Communities',
          subheading:
            'Lobito Farms exports premium cash crops while investing in the farming communities that make it possible.',
          image: PEXELS(IMG.ruralLandscapeFarmers, 1600, 900),
          primaryCta: { label: 'Explore Our Crops', href: '/crops' },
          secondaryCta: { label: 'Support Our NGO', href: '/ngo/donate' },
        },
      },
      {
        type: 'stat_counters',
        order: 1,
        config: {
          stats: [
            { label: 'Farmers Supported', value: 5200 },
            { label: 'Hectares Cultivated', value: 3100 },
            { label: 'Tons Exported / Year', value: 8600 },
            { label: 'Active NGO Programs', value: 4 },
          ],
        },
      },
      {
        type: 'card_grid',
        order: 2,
        config: {
          heading: 'Our Crops',
          source: 'crops',
          limit: 4,
        },
      },
      {
        type: 'card_grid',
        order: 3,
        config: {
          heading: 'Foundation Programs',
          source: 'ngoPrograms',
          limit: 3,
        },
      },
      {
        type: 'testimonial_carousel',
        order: 4,
        config: { heading: 'Voices From Our Community' },
      },
      {
        type: 'cta_banner',
        order: 5,
        config: {
          heading: 'Partner With Lobito Farms',
          subheading: 'Whether you are a buyer, donor, or volunteer — there is a way to get involved.',
          cta: { label: 'Contact Us', href: '/contact' },
        },
      },
    ],
    seo: {
      metaTitle: 'Lobito Farms | Cocoa, Plantain & Cashew Exporter and Foundation',
      metaDescription: 'Lobito Farms exports premium cocoa, plantain, cashew and coffee while investing in the farming communities that make it possible.',
    },
    createdBy: superAdmin._id,
    updatedBy: superAdmin._id,
  });

  console.log('Creating About and NGO hub pages (block-based)...');
  await Page.create({
    slug: 'about',
    title: 'About Us',
    status: 'published',
    blocks: [
      {
        type: 'text_image',
        order: 0,
        config: {
          heading: 'Three Generations of Growing Well',
          body: '<p>Lobito Farms started as a single cocoa smallholding and has grown into a cooperative-backed exporter of cocoa, plantain, cashew, and coffee. We still farm the way we started: hands-on, close to the soil, and close to the communities who work it with us.</p><p>Today we work with over 5,000 farmers across our growing region, combining export-grade quality control with a foundation that reinvests in the villages our supply chain depends on.</p>',
          image: PEXELS(IMG.elderlyFarmerField, 900, 700),
          imagePosition: 'right',
        },
      },
      {
        type: 'stat_counters',
        order: 1,
        config: {
          stats: [
            { label: 'Years Farming', value: 34 },
            { label: 'Cooperative Farmers', value: 5200 },
            { label: 'Export Markets', value: 12 },
            { label: 'NGO Programs', value: 4 },
          ],
        },
      },
      {
        type: 'text_image',
        order: 2,
        config: {
          heading: 'Sustainability & Certification',
          body: '<p>Our cocoa is Fair Trade certified, and our agronomy teams train farmers in shade-grown, low-input practices that protect soil health for the next harvest. Every shipment is traceable back to the cooperative that grew it.</p>',
          image: PEXELS(IMG.farmerInspectingField2, 900, 700),
          imagePosition: 'left',
        },
      },
      {
        type: 'cta_banner',
        order: 3,
        config: {
          heading: 'Want to Source From Us?',
          subheading: 'Reach out to our export team for samples, pricing, and certification documents.',
          cta: { label: 'Contact Us', href: '/contact' },
        },
      },
    ],
    seo: {
      metaTitle: 'About Us | Lobito Farms',
      metaDescription: 'Three generations of growing cocoa, plantain, cashew and coffee — and the cooperative of 5,000+ farmers behind it.',
    },
    createdBy: superAdmin._id,
    updatedBy: superAdmin._id,
  });

  await Page.create({
    slug: 'ngo',
    title: 'Lobito Farms Foundation',
    status: 'published',
    blocks: [
      {
        type: 'hero',
        order: 0,
        config: {
          heading: 'Investing in the Communities Behind Every Harvest',
          subheading:
            'The Lobito Farms Foundation runs training, water, education, and economic empowerment programs across our farming communities.',
          image: PEXELS(IMG.farmersWorkingGreenField, 1600, 900),
          primaryCta: { label: 'See Our Programs', href: '#programs' },
          secondaryCta: { label: 'Donate', href: '/ngo/donate' },
        },
      },
      {
        type: 'stat_counters',
        order: 1,
        config: {
          stats: [
            { label: 'People Reached', value: 5950 },
            { label: 'Active Programs', value: programs.length },
            { label: 'Villages Served', value: 18 },
            { label: 'Scholarships Funded', value: 210 },
          ],
        },
      },
      {
        type: 'card_grid',
        order: 2,
        config: { heading: 'Our Programs', source: 'ngoPrograms', limit: 4, anchor: 'programs' },
      },
      {
        type: 'testimonial_carousel',
        order: 3,
        config: { heading: 'Community Voices' },
      },
      {
        type: 'cta_banner',
        order: 4,
        config: {
          heading: 'Get Involved',
          subheading: 'Donate, volunteer, or partner with the Lobito Farms Foundation.',
          cta: { label: 'Volunteer With Us', href: '/ngo/volunteer' },
        },
      },
    ],
    seo: {
      metaTitle: 'Lobito Farms Foundation | NGO Programs',
      metaDescription: 'Training, clean water, education and economic empowerment programs the Lobito Farms Foundation runs across our farming communities.',
    },
    createdBy: superAdmin._id,
    updatedBy: superAdmin._id,
  });

  console.log('Creating simple header pages (Crops, Products, Blog, Gallery, Contact, Shop, Donate, Volunteer)...');
  const simplePageDefs = [
    {
      slug: 'crops',
      title: 'Our Crops',
      metaDescription: 'Cocoa, plantain, cashew, and coffee — grown, processed, and quality-checked for export by Lobito Farms.',
      header: { eyebrow: 'What We Grow', title: 'Our Crops', subtitle: 'Cocoa, plantain, cashew, and coffee — grown, processed, and quality-checked for export.' },
    },
    {
      slug: 'products',
      title: 'Products',
      metaDescription: 'Export-ready cocoa, cashew, plantain, and coffee products with grading, packaging, and MOQ details.',
      header: { eyebrow: 'Export Catalog', title: 'Products', subtitle: 'Export-ready cocoa, cashew, plantain, and coffee products with grading, packaging, and MOQ details.' },
    },
    {
      slug: 'blog',
      title: 'Blog',
      metaDescription: 'Farming practices, community impact, and updates from Lobito Farms.',
      header: { eyebrow: 'News', title: 'Blog', subtitle: 'Farming practices, community impact, and updates from Lobito Farms.' },
    },
    {
      slug: 'gallery',
      title: 'Gallery',
      metaDescription: 'Photos from our farms, harvests, and community programs.',
      header: { eyebrow: 'In Pictures', title: 'Gallery', subtitle: 'Photos from our farms, harvests, and community programs.' },
    },
    {
      slug: 'contact',
      title: 'Contact Us',
      metaDescription: 'Questions about sourcing, partnerships, or our foundation programs — get in touch with Lobito Farms.',
      header: { eyebrow: 'Get in Touch', title: 'Contact Us', subtitle: 'Questions about sourcing, partnerships, or our foundation programs — reach out.' },
    },
    {
      slug: 'shop',
      title: 'Shop',
      metaDescription: 'Order or pre-order bulk cocoa, cashew, plantain, and coffee directly from Lobito Farms.',
      header: { eyebrow: 'Bulk Orders', title: 'Shop', subtitle: 'Select the products and quantities you need — our export team will follow up to confirm pricing and logistics.' },
    },
    {
      slug: 'ngo-volunteer',
      title: 'Get Involved',
      metaDescription: 'Join a Farmer Field School session, a water project build, or a cooperative training day with Lobito Farms.',
      header: { eyebrow: 'Foundation', title: 'Get Involved', subtitle: 'Join a Farmer Field School session, a water project build, or a cooperative training day.' },
    },
  ];

  for (const def of simplePageDefs) {
    await Page.create({
      slug: def.slug,
      title: def.title,
      status: 'published',
      blocks: [{ type: 'page_header', order: 0, config: def.header }],
      seo: { metaTitle: `${def.title} | Lobito Farms`, metaDescription: def.metaDescription },
      createdBy: superAdmin._id,
      updatedBy: superAdmin._id,
    });
  }

  await Page.create({
    slug: 'ngo-donate',
    title: 'Donate',
    status: 'published',
    blocks: [
      {
        type: 'page_header',
        order: 0,
        config: { eyebrow: 'Foundation', title: 'Donate', subtitle: "Your gift funds farmer training, clean water, education, and women's cooperatives." },
      },
      {
        type: 'donate_form',
        order: 1,
        config: {
          amounts: [25, 50, 100, 250],
          note: 'Payment processing is not connected in this build. Submitting this form records your donation interest — our team will follow up with secure payment instructions.',
        },
      },
    ],
    seo: {
      metaTitle: 'Donate | Lobito Farms',
      metaDescription: "Your gift funds farmer training, clean water, education, and women's cooperatives through the Lobito Farms Foundation.",
    },
    createdBy: superAdmin._id,
    updatedBy: superAdmin._id,
  });

  console.log('Creating site settings...');
  await SiteSettings.create({
    singleton: 'main',
    siteName: 'Lobito Farms',
    tagline: 'Cultivating Crops. Cultivating Communities.',
    contactEmail: 'hello@lobitofarms.com',
    contactPhone: '+233 20 000 0000',
    address: 'Lobito River Valley, West Africa',
    social: { facebook: '#', instagram: '#', twitter: '#', linkedin: '#' },
    footerText: `Lobito Farms — sustainably grown cocoa, plantain, cashew and coffee, with a foundation reinvesting in farming communities.`,
    theme: { primaryColor: '#2f5233', accentColor: '#c98a3a' },
    navLinks: [
      { label: 'Home', path: '/' },
      { label: 'About', path: '/about' },
      { label: 'Crops', path: '/crops' },
      { label: 'Products', path: '/products' },
      { label: 'Shop', path: '/shop' },
      { label: 'NGO', path: '/ngo' },
      { label: 'Blog', path: '/blog' },
      { label: 'Gallery', path: '/gallery' },
      { label: 'Contact', path: '/contact' },
    ],
    footerLinkGroups: [
      {
        title: 'Explore',
        links: [
          { label: 'Our Crops', path: '/crops' },
          { label: 'Products', path: '/products' },
          { label: 'Shop', path: '/shop' },
          { label: 'Blog', path: '/blog' },
          { label: 'Gallery', path: '/gallery' },
        ],
      },
      {
        title: 'Foundation',
        links: [
          { label: 'Programs', path: '/ngo' },
          { label: 'Donate', path: '/ngo/donate' },
          { label: 'Volunteer', path: '/ngo/volunteer' },
        ],
      },
    ],
  });

  console.log('\nSeed complete. Login credentials:');
  console.log('  Super Admin:  admin@lobitofarms.com / Admin@12345');
  console.log('  Editor:       editor@lobitofarms.com / Editor@12345');
  console.log('  Contributor:  contributor@lobitofarms.com / Contributor@12345');

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
