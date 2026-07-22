export interface Package {
  num: string;
  name: string;
  desc: string;
  price: string;
  featured: boolean;
  tag?: string;
  includes: string[];
  mailtoSubject: string;
}

export const packages: Package[] = [
  {
    num: '01',
    name: 'The Storefront',
    desc: 'A clean, professional presence for a business that mainly needs to be found, trusted, and easy to reach.',
    price: '$2,000',
    featured: false,
    mailtoSubject: 'The Storefront',
    includes: [
      'Up to 5 custom pages',
      'Mobile-first, fast-loading build',
      'Contact form and map',
      'Basic SEO setup',
      'Accessibility built in from the start',
    ],
  },
  {
    num: '02',
    name: 'The Custom Build',
    desc: 'A fuller site with real design work, room to grow, and the features a working business actually uses day to day.',
    price: '$4,500',
    featured: true,
    tag: 'Most chosen',
    mailtoSubject: 'The Custom Build',
    includes: [
      'Up to 10 custom pages',
      'Custom design in your brand',
      'A CMS so you can edit it yourself',
      'Booking, menus, or galleries',
      'Analytics and SEO setup',
    ],
  },
  {
    num: '03',
    name: 'The Shopfront',
    desc: 'For businesses selling online. Product pages, checkout, and a setup you can run without a developer on call.',
    price: '$7,000',
    featured: false,
    mailtoSubject: 'The Shopfront',
    includes: [
      'Everything in The Custom Build',
      'Online store and checkout',
      'Product and inventory setup',
      'Payment integration',
      'Training so you can manage it',
    ],
  },
];

export interface CarePlan {
  name: string;
  rate: string;
  unit: string;
  desc: string;
}

export const carePlans: CarePlan[] = [
  {
    name: 'Essential',
    rate: 'From $150',
    unit: '/ month',
    desc: 'Hosting, security updates, backups, and uptime monitoring. The peace-of-mind tier.',
  },
  {
    name: 'Growth',
    rate: 'From $300',
    unit: '/ month',
    desc: 'Everything in Essential, plus a set block of content and design changes each month.',
  },
  {
    name: 'Partner',
    rate: "Let's talk",
    unit: '',
    desc: 'Priority support and ongoing development for businesses treating the site as a core channel.',
  },
];

export interface ProcessStep {
  num: string;
  title: string;
  desc: string;
}

export const processSteps: ProcessStep[] = [
  {
    num: 'STEP 01',
    title: 'Discovery call',
    desc: 'We talk through your business, your goals, and what the site needs to do. Free, and no pressure to commit.',
  },
  {
    num: 'STEP 02',
    title: 'Proposal and deposit',
    desc: 'You get a clear scope, timeline, and price in writing. A deposit reserves your spot and I get started.',
  },
  {
    num: 'STEP 03',
    title: 'Design and build',
    desc: 'I build in stages and share progress as we go, with two rounds of revisions along the way.',
  },
  {
    num: 'STEP 04',
    title: 'Launch and care',
    desc: 'We go live together. From there, a care plan keeps everything updated and running smoothly.',
  },
];

export const contactEmail = 'hello@okeefesarah.com';

export function packageMailtoHref(pkg: Pick<Package, 'mailtoSubject'>): string {
  return `mailto:${contactEmail}?subject=${encodeURIComponent(pkg.mailtoSubject)}`;
}
