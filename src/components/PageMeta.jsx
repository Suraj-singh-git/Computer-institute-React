import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const siteName = 'S&D Developers'
const businessDescription =
  'S&D Developers is the portfolio website of Suraj Singh, offering website design, Laravel development, API integration, booking systems, payment gateway integration, and responsive business websites.'
const defaultImage = '/og-cover.svg'
const defaultLocale = 'en_IN'
const routeLabels = {
  '/': 'Home',
  '/services': 'Services',
  '/work': 'Work',
  '/about': 'About',
  '/contact': 'Contact',
}

function upsertMeta(attribute, key, content) {
  if (!content) {
    return
  }

  const selector = `meta[${attribute}="${key}"]`
  let tag = document.querySelector(selector)

  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute(attribute, key)
    document.head.appendChild(tag)
  }

  tag.setAttribute('content', content)
}

function upsertLink(rel, href) {
  let tag = document.querySelector(`link[rel="${rel}"]`)

  if (!tag) {
    tag = document.createElement('link')
    tag.setAttribute('rel', rel)
    document.head.appendChild(tag)
  }

  tag.setAttribute('href', href)
}

function upsertJsonLd(id, data) {
  let tag = document.getElementById(id)

  if (!tag) {
    tag = document.createElement('script')
    tag.type = 'application/ld+json'
    tag.id = id
    document.head.appendChild(tag)
  }

  tag.textContent = JSON.stringify(data)
}

function buildBreadcrumbList(origin, pathname, pageLabel) {
  const homeItem = {
    '@type': 'ListItem',
    position: 1,
    name: 'Home',
    item: `${origin}/`,
  }

  if (pathname === '/') {
    return {
      '@type': 'BreadcrumbList',
      '@id': `${origin}/#breadcrumb`,
      itemListElement: [homeItem],
    }
  }

  return {
    '@type': 'BreadcrumbList',
    '@id': `${origin}${pathname}#breadcrumb`,
    itemListElement: [
      homeItem,
      {
        '@type': 'ListItem',
        position: 2,
        name: pageLabel,
        item: `${origin}${pathname}`,
      },
    ],
  }
}

function PageMeta({
  title,
  description,
  image = defaultImage,
  type = 'website',
  robots = 'index,follow',
  pageType = 'WebPage',
}) {
  const { pathname } = useLocation()

  useEffect(() => {
    const origin = window.location.origin
    const pageUrl = new URL(pathname, origin).toString()
    const imageUrl = new URL(image, origin).toString()
    const pageLabel = routeLabels[pathname] ?? title

    document.title = title
    document.documentElement.lang = 'en'

    upsertMeta('name', 'description', description)
    upsertMeta('name', 'robots', robots)
    upsertMeta('name', 'author', 'Suraj Singh')
    upsertMeta('property', 'og:title', title)
    upsertMeta('property', 'og:description', description)
    upsertMeta('property', 'og:type', type)
    upsertMeta('property', 'og:url', pageUrl)
    upsertMeta('property', 'og:image', imageUrl)
    upsertMeta('property', 'og:site_name', siteName)
    upsertMeta('property', 'og:locale', defaultLocale)
    upsertMeta('name', 'twitter:card', 'summary_large_image')
    upsertMeta('name', 'twitter:title', title)
    upsertMeta('name', 'twitter:description', description)
    upsertMeta('name', 'twitter:image', imageUrl)

    upsertLink('canonical', pageUrl)

    upsertJsonLd('sd-page-graph', {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'ProfessionalService',
          '@id': `${origin}/#business`,
          name: siteName,
          url: origin,
          image: imageUrl,
          logo: `${origin}/favicon.svg`,
          description: businessDescription,
          priceRange: 'Rs. 9,999+',
          telephone: '+91 87389 17652',
          email: 'surajsingh20796@gmail.com',
          areaServed: 'India',
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'Hata',
            addressRegion: 'Uttar Pradesh',
            addressCountry: 'IN',
          },
          founder: {
            '@id': `${origin}/#suraj-singh`,
          },
          serviceType: [
            'Website Design',
            'Business Website Development',
            'Laravel Development',
            'API Integration',
            'Payment Gateway Integration',
            'Booking System Development',
          ],
        },
        {
          '@type': 'Person',
          '@id': `${origin}/#suraj-singh`,
          name: 'Suraj Singh',
          jobTitle: 'Laravel Developer and Website Developer',
          url: origin,
          email: 'surajsingh20796@gmail.com',
          telephone: '+91 87389 17652',
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'Hata',
            addressRegion: 'Uttar Pradesh',
            addressCountry: 'IN',
          },
          worksFor: {
            '@id': `${origin}/#business`,
          },
        },
        {
          '@type': 'WebSite',
          '@id': `${origin}/#website`,
          url: origin,
          name: siteName,
          description: businessDescription,
          inLanguage: 'en-IN',
          publisher: {
            '@id': `${origin}/#business`,
          },
        },
        buildBreadcrumbList(origin, pathname, pageLabel),
        {
          '@type': pageType,
          '@id': `${pageUrl}#page`,
          url: pageUrl,
          name: title,
          description,
          isPartOf: {
            '@id': `${origin}/#website`,
          },
          about: {
            '@id': `${origin}/#suraj-singh`,
          },
          primaryImageOfPage: imageUrl,
        },
      ],
    })
  }, [description, image, pathname, robots, title, type, pageType])

  return null
}

export default PageMeta
