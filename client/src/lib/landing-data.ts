export const heroSlides = [
  {
    src: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&q=75',
    alt: 'Modern apartment building',
  },
  {
    src: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=75',
    alt: 'Luxury duplex home',
  },
  {
    src: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=75',
    alt: 'Suburban bungalow',
  },
  {
    src: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=75',
    alt: 'Terrace housing row',
  },
  {
    src: 'https://images.unsplash.com/photo-1600585152915-d208bec867a1?w=1200&q=75',
    alt: 'Home interior living room',
  },
] as const

export const propertyTypes = [
  {
    id: 'apartment',
    name: 'Apartments',
    description:
      'Multi-unit buildings ideal for urban rentals. Track rooms, tenants, and monthly rent in one place.',
    image:
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=75',
    href: '/register',
    tag: 'Most Popular',
  },
  {
    id: 'duplex',
    name: 'Duplex',
    description:
      'Two-unit properties with shared walls. Perfect for landlords managing paired tenants.',
    image:
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=75',
    href: '/register',
    tag: 'Family Units',
  },
  {
    id: 'bungalow',
    name: 'Bungalow',
    description:
      'Single-storey homes with standalone appeal. Manage occupancy and payments effortlessly.',
    image:
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=75',
    href: '/register',
    tag: 'Standalone',
  },
  {
    id: 'terrace',
    name: 'Terrace Houses',
    description:
      'Row-style housing common across Nigerian cities. Assign rooms and monitor vacancy rates.',
    image:
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=75',
    href: '/register',
    tag: 'Urban Living',
  },
  {
    id: 'studio',
    name: 'Studio Flats',
    description:
      'Compact single-room units for students and young professionals. Quick tenant onboarding.',
    image:
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=75',
    href: '/register',
    tag: 'Compact',
  },
  {
    id: 'commercial',
    name: 'Commercial Units',
    description:
      'Shops and office spaces with lease tracking. Handle dues, reminders, and payment status.',
    image:
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&q=75',
    href: '/register',
    tag: 'Business',
  },
] as const

export const features = [
  {
    title: 'Property Management',
    description:
      'Add properties, rooms, and tenants. View occupancy stats and vacancy at a glance.',
    icon: 'building' as const,
  },
  {
    title: 'Rent & Payments',
    description:
      'Create payment records, track PENDING, PAID, and OVERDUE status with automated reminders.',
    icon: 'wallet' as const,
  },
  {
    title: 'Tenant Portal',
    description:
      'Tenants log in to view their assigned room, check dues, and mark payments from any device.',
    icon: 'users' as const,
  },
  {
    title: 'Analytics Dashboard',
    description:
      'Real-time revenue, monthly income, overdue counts, and portfolio stats for landlords.',
    icon: 'chart' as const,
  },
] as const

export const steps = [
  {
    step: '01',
    title: 'Register as Landlord',
    description: 'Create your free account in under a minute.',
  },
  {
    step: '02',
    title: 'Add Properties & Rooms',
    description: 'Set up your portfolio — apartments, duplexes, bungalows, and more.',
  },
  {
    step: '03',
    title: 'Onboard Tenants',
    description: 'Create tenant accounts and assign them to available rooms.',
  },
  {
    step: '04',
    title: 'Collect Rent',
    description: 'Track payments, send reminders, and view analytics on your dashboard.',
  },
] as const
