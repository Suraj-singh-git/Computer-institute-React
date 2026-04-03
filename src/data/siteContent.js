import { buildWhatsAppHref } from '../utils/contact'

export const stats = [
  { value: '3+ Years', label: 'Laravel and website experience' },
  {
    value: '5 Launches',
    label: 'Live launches across real business sectors',
  },
  {
    value: '12+ Skills',
    label: 'Frontend, backend, APIs, and payments',
  },
]

export const services = [
  {
    icon: 'website',
    title: 'Business Website Design',
    text: 'Responsive business websites designed to explain your service clearly, build trust quickly, and turn visitors into enquiries.',
    bullets: [
      'Homepage, service pages, about page, contact page, and enquiry flow',
      'Responsive design for mobile, tablet, and desktop users',
      'SEO-friendly headings, page structure, and internal linking',
    ],
  },
  {
    icon: 'app',
    title: 'Laravel Web Development',
    text: 'Custom Laravel development for dashboards, admin panels, business platforms, and websites that need practical backend logic.',
    bullets: [
      'Laravel, PHP, MySQL, and data-driven backend workflows',
      'Admin panels, dashboards, role-based access, and CRUD systems',
      'Scalable business logic for service, booking, and management platforms',
    ],
  },
  {
    icon: 'launch',
    title: 'API and Payment Integration',
    text: 'Third-party integrations for websites and apps, including REST APIs, social login, payment gateways, and connected business tools.',
    bullets: [
      'REST API development and integration',
      'CCAvenue, PayPal, Stripe, and Razorpay integration',
      'Google, Facebook, GitHub, and Twitter login support',
    ],
  },
  {
    icon: 'refresh',
    title: 'Booking and Real-Time Features',
    text: 'Booking systems, wallet flows, notifications, chat, and live business features for projects that need practical user interaction.',
    bullets: [
      'Firebase notifications and chat modules',
      'Booking systems and customer communication workflows',
      'Exotel and related service integrations',
    ],
  },
]

export const projects = [
  {
    title: 'The Taramandal',
    category: 'Astrology platform and consultation website',
    result:
      'Delivered website and backend features for astrologer discovery, wallet recharge, consultations, bookings, and daily astrology content.',
    summary:
      'The live platform presents online astrology services, personalised readings, and daily guidance. My work focused on the Laravel backend, connected website features, wallet logic, booking flow, and user-facing consultation journeys.',
    highlights: ['Live website', 'Wallet and booking flows', 'Consultation platform'],
    image: 'https://thetaramandal.com/public/banner/1742363836.png',
    url: 'https://thetaramandal.com/',
    linkLabel: 'Visit Taramandal',
  },
  {
    title: 'Supawtails',
    category: 'Pet care platform and community website',
    result:
      'Built and supported web features for pet care services, community-focused content, events, and the broader digital presence around the Supawtails app.',
    summary:
      'The public site highlights pet care services, events, social features, and app adoption. This project combined service presentation, pet-focused content structure, and feature support around a larger platform experience.',
    highlights: ['Live website', 'Pet care services', 'Community and event features'],
    image:
      'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=1200&q=80',
    url: 'https://supawtails.com/',
    linkLabel: 'Visit Supawtails',
  },
  {
    title: 'UTEI',
    category: 'Educational institute website',
    result:
      'Built and supported an institute website for course discovery, branch information, enquiry capture, and student verification journeys.',
    summary:
      'The live site presents institute details, courses, branches, blogs, gallery, enquiry forms, and verification pages. It shows structured information architecture and a practical lead-generation flow for an education brand.',
    highlights: ['Course and branch pages', 'Enquiry forms', 'Verification pages'],
    image: 'https://utei.in/frontend/assets/images/front-end-img/about/aboutus.png',
    url: 'https://utei.in/',
    linkLabel: 'Visit UTEI',
  },
  {
    title: 'CanadaPest',
    category: 'Pest control service website',
    result:
      'Developed backend services and a responsive website for service bookings, enquiries, and admin-side service management.',
    summary:
      'CanadaPest focused on practical service-business needs, including responsive pages, booking enquiries, and an admin workflow for managing services and customer communication.',
    highlights: ['Responsive website', 'Service booking flow', 'Admin panel support'],
    image:
      'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'RV Wala',
    category: 'Vehicle booking website',
    result:
      'Created a backend system and website for vehicle booking, rental management, user registration, listings, and payment flow.',
    summary:
      'RV Wala was focused on booking management and user actions, with vehicle listings, booking logic, registrations, and payments connected into one system.',
    highlights: ['Vehicle listing system', 'Booking management', 'Payment integration'],
    image:
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
  },
]

export const heroSlides = [
  {
    eyebrow: 'S&D Developers',
    title: 'Websites that bring more enquiries.',
    text: 'Responsive websites and landing pages built to turn visitors into real business leads.',
    image:
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1600&q=80',
    primaryLabel: 'See Website Plans',
    primaryTo: '#plans',
    secondaryLabel: 'View My Work',
    secondaryTo: '/work',
  },
  {
    eyebrow: 'Laravel Development',
    title: 'Backend builds that work properly.',
    text: 'From admin panels to APIs and booking flows, I build business-ready Laravel systems.',
    image:
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=80',
    primaryLabel: 'Explore Services',
    primaryTo: '/services',
    secondaryLabel: 'Start a Project',
    secondaryTo: '/contact',
  },
  {
    eyebrow: 'Real Launches',
    title: 'Real launches for real clients.',
    text: 'Featured work across astrology, pet care, education, and service businesses.',
    image:
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1600&q=80',
    primaryLabel: 'See Live Projects',
    primaryTo: '/work',
    secondaryLabel: 'Contact Suraj Singh',
    secondaryTo: '/contact',
  },
]

export const showcaseServices = [
  {
    title: 'Website Design',
    text: 'Business websites with clear messaging, strong visuals, responsive layout, and a structure made to generate enquiries.',
    image:
      'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Landing Pages',
    text: 'Focused one-page or multi-section landing pages for campaigns, local businesses, product launches, and lead generation.',
    image:
      'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Laravel Development',
    text: 'Custom Laravel development for dashboards, admin panels, web applications, and business logic that needs reliable backend support.',
    image:
      'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Booking Systems',
    text: 'Appointment, consultation, and service booking features with user-friendly flows and admin-side control.',
    image:
      'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'API Integration',
    text: 'REST APIs, payment gateways, social login, chat, and third-party tools connected properly into the website workflow.',
    image:
      'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Maintenance Support',
    text: 'Post-launch support for updates, small improvements, bug fixes, and feature additions after the site goes live.',
    image:
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80',
  },
]

export const experienceBenefits = [
  {
    title: 'Mobile Friendly',
    text: 'Layouts that stay polished and easy to use on phones, tablets, and desktops.',
  },
  {
    title: 'Responsive',
    text: 'Every section is built to adapt cleanly across screen sizes and modern devices.',
  },
  {
    title: 'SEO Ready',
    text: 'Pages are structured with clean headings, descriptive content, metadata, and crawl-friendly internal links.',
  },
  {
    title: 'Lead Focused',
    text: 'The layout is shaped to move visitors toward contact, trust, and project discussion.',
  },
]

export const pricingPlans = [
  {
    name: 'Basic',
    price: 'Rs. 9,999',
    summary: 'Starter website package for local businesses, freelancers, and personal brands.',
    features: [
      'Up to 5 sections',
      'Responsive landing page',
      'Contact form integration',
      'Basic on-page SEO setup',
      'Delivery support after launch',
    ],
  },
  {
    name: 'Advance',
    price: 'Rs. 14,999',
    summary: 'Multi-section business website with stronger service presentation and content depth.',
    features: [
      'Up to 8 sections',
      'Custom service layout',
      'Lead capture forms',
      'Google-ready structure',
      '30 days support',
    ],
  },
  {
    name: 'Premium',
    price: 'Rs. 19,999',
    summary: 'For businesses that want stronger homepage polish, more sections, and a better conversion flow.',
    features: [
      'Up to 12 sections',
      'Premium homepage styling',
      'Multiple call-to-action areas',
      'Speed and SEO optimisation',
      '60 days support',
    ],
    featured: true,
  },
  {
    name: 'Ultimate',
    price: 'Rs. 29,999+',
    summary: 'Custom project package for advanced website workflows or Laravel-based business features.',
    features: [
      'Custom scope planning',
      'Backend or admin panel support',
      'Booking or workflow features',
      'API and payment integration',
      'Priority support',
    ],
  },
]

export const launchSteps = [
  {
    step: '1',
    title: 'Discover',
    text: 'We define the business goal, target audience, important keywords, required pages, and project priorities.',
  },
  {
    step: '2',
    title: 'Design and Build',
    text: 'The website is designed in your theme, then developed with responsive sections, clear calls to action, and SEO-friendly page structure.',
  },
  {
    step: '3',
    title: 'Launch and Support',
    text: 'After testing, the website goes live with support for fixes, content updates, and future improvement work.',
  },
]

export const projectProofCards = [
  {
    name: 'The Taramandal',
    label: 'Astrology platform',
    text: 'Astrologer discovery, consultation journeys, wallet logic, and booking-oriented user flows.',
  },
  {
    name: 'Supawtails',
    label: 'Pet care experience',
    text: 'Service presentation, community-led platform structure, and a stronger public-facing digital presence.',
  },
  {
    name: 'UTEI',
    label: 'Education website',
    text: 'Course information, branch discovery, enquiry forms, and verification-focused institute workflows.',
  },
]

export const clientShowcase = [
  { name: 'The Taramandal', tag: 'Astrology' },
  { name: 'Supawtails', tag: 'Pet Care' },
  { name: 'UTEI', tag: 'Education' },
  { name: 'CanadaPest', tag: 'Services' },
  { name: 'RV Wala', tag: 'Bookings' },
]

export const processSteps = [
  {
    title: 'Understand the Requirement',
    text: 'I begin by understanding your business goal, target audience, required pages or features, and how users should move through the website.',
  },
  {
    title: 'Plan the Structure',
    text: 'Before development, I define the page structure, key headings, content flow, backend needs, and any integrations required for the project.',
  },
  {
    title: 'Build and Integrate',
    text: 'I build the website or application, create backend logic, and connect features like payments, login, chat, APIs, or booking systems.',
  },
  {
    title: 'Test and Launch',
    text: 'After development, I test the important flows, improve readability and performance, and prepare the project for deployment and real users.',
  },
]

export const faqs = [
  {
    question: 'What type of projects do you work on?',
    answer:
      'I work on business websites, landing pages, Laravel applications, booking systems, admin panels, API integrations, payment gateways, and real-time features like chat or notifications.',
  },
  {
    question: 'Will my website be SEO-friendly?',
    answer:
      'Yes. I build websites with clean headings, page titles, meta descriptions, descriptive content, internal links, responsive layout, and a crawl-friendly structure. No one can guarantee top rankings, but I can make the site technically stronger for search visibility.',
  },
  {
    question: 'Can you handle both design and backend development?',
    answer:
      'Yes. My experience includes frontend website development, Laravel backend APIs, admin panels, payment integrations, authentication, and user management features.',
  },
  {
    question: 'Can you improve or redesign an existing website?',
    answer:
      'Yes. I can redesign existing websites, improve structure and readability, add new sections, modernise the UI, and connect missing backend or enquiry features.',
  },
]

export const trustPoints = [
  'Laravel and PHP backend experience',
  'SEO-friendly website structure',
  'Payment gateway, booking system, and API integration',
]

export const aboutStats = [
  { value: 'MCA', label: 'Master of Computer Application completed in 2020' },
  { value: '2 Roles', label: 'Professional experience at two software companies' },
  { value: 'Hindi + English', label: 'Fluent communication for team and client work' },
]

export const contactMethods = [
  {
    title: 'Email',
    text: 'surajsingh20796@gmail.com',
    href: 'mailto:surajsingh20796@gmail.com',
  },
  {
    title: 'Phone',
    text: '+91 87389 17652',
    href: 'tel:+918738917652',
  },
  {
    title: 'WhatsApp',
    text: 'Chat directly on WhatsApp',
    href: buildWhatsAppHref(),
    external: true,
  },
  {
    title: 'Location',
    text: 'Hata, Kushinagar, Uttar Pradesh',
    href: '#',
  },
]

export const techStack = [
  'HTML',
  'CSS',
  'Tailwind CSS',
  'JavaScript',
  'jQuery',
  'Bootstrap',
  'PHP',
  'Laravel',
  'REST API Development',
  'MySQL',
  'Firebase',
  'Git',
]

export const personalStrengths = [
  'Clear communication throughout planning and development',
  'Strong attention to detail in both frontend and backend work',
  'Consistent self-learning and improvement through real project delivery',
  'Practical approach to business needs, not only visual design',
]

export const experienceTimeline = [
  {
    company: 'Rashi Network Private Limited',
    role: 'Laravel Developer',
    duration: '15 December 2024 - Present',
    points: [
      'Working as a backend and website developer for scalable APIs and dynamic web platforms.',
      'Building real-time features, payment integrations, booking systems, and user management solutions.',
    ],
  },
  {
    company: 'Eigerlab Technologies',
    role: 'Laravel Developer',
    duration: '18 December 2021 - 10 May 2024',
    points: [
      'Developed and deployed n-tier architecture based web applications with Laravel, PHP, MySQL, and related technologies.',
      'Built backend systems, APIs, admin panels, and third-party integrations across multiple projects.',
    ],
  },
]

export const education = [
  {
    degree: 'MCA',
    school: 'Swami Vivekanand Subharti University, Meerut',
    year: '2020',
  },
  {
    degree: 'BCA',
    school: 'Swami Vivekanand Subharti University, Meerut',
    year: '2016',
  },
]
