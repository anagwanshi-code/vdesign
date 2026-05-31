import { groq } from "next-sanity";

export const ALL_PRODUCTS_QUERY = groq`*[_type == "product" && coalesce(status, "active") != "archived"] | order(_createdAt desc) {
  _id,
  title,
  "slug": slug.current,
  price,
  rating,
  reviewsCount,
  isBestSeller,
  "imageUrl": image.asset->url,
  "categoryName": category->title,
  "categoryId": category._ref,
  _createdAt
}`;

export const ALL_CATEGORIES_QUERY = groq`*[_type == "category"] | order(title asc) {
  _id,
  title,
  "slug": slug.current
}`;

export const PORTFOLIO_QUERY = groq`*[_type == "portfolio"] | order(_createdAt desc)[0...4] {
  _id,
  title,
  "slug": slug.current,
  "shortDescription": coalesce(shortDescription, description),
  "category": category->title,
  "imageUrl": coalesce(coverImage.asset->url, image.asset->url),
  "videoUrl": loopingVideo.asset->url
}`;

export const ALL_PORTFOLIO_QUERY = groq`*[_type == "portfolio"] | order(_createdAt desc) {
  _id,
  title,
  "slug": slug.current,
  "category": category->title,
  "clientName": coalesce(clientName, client),
  "shortDescription": coalesce(shortDescription, description),
  "imageUrl": coalesce(coverImage.asset->url, image.asset->url),
  "videoUrl": loopingVideo.asset->url
}`;

export const PORTFOLIO_SLUGS_QUERY = groq`*[_type == "portfolio" && defined(slug.current)]{
  "slug": slug.current
}`;

export const PORTFOLIO_DETAIL_QUERY = groq`*[_type == "portfolio" && slug.current == $slug][0] {
  _id,
  title,
  "slug": slug.current,
  "clientName": coalesce(clientName, client),
  timeline,
  servicesProvided,
  "category": category->title,
  "shortDescription": coalesce(shortDescription, description),
  "imageUrl": coalesce(coverImage.asset->url, image.asset->url),
  "videoUrl": loopingVideo.asset->url,
  body,
  gallery[] {
    _key,
    "url": asset->url,
    alt
  }
}`;

/** @deprecated Use PORTFOLIO_DETAIL_QUERY */
export const PORTFOLIO_BY_SLUG_QUERY = PORTFOLIO_DETAIL_QUERY;

export const HOME_FEATURED_PRODUCTS_QUERY = groq`*[_type == "product"] | order(_createdAt desc)[0...4] {
  _id,
  title,
  "slug": slug.current,
  price,
  rating,
  reviewsCount,
  isBestSeller,
  "imageUrl": image.asset->url,
  "categoryName": category->title
}`;

/** @deprecated Use PORTFOLIO_QUERY */
export const HOME_RECENT_PORTFOLIO_QUERY = PORTFOLIO_QUERY;

export const ABOUT_PAGE_QUERY = groq`*[_type == "aboutPage"][0] {
  heroTitle,
  heroHighlight,
  heroDescription,
  "heroImageUrl": heroImage.asset->url,
  journeyTitle,
  journeyTimeline,
  valuesTitle,
  valuesList,
  studioHeading,
  studioDescription,
  "studioImageUrls": studioImages[].asset->url
}`;

export const FOUNDER_QUERY = groq`*[_type == "founder"][0] {
  name,
  role,
  heading,
  quote,
  bio,
  "imageUrl": image.asset->url,
  "signatureUrl": signature.asset->url
}`;

export const LATEST_POSTS_QUERY = groq`*[_type == "post"] | order(publishedAt desc)[0...3] {
  _id,
  title,
  "slug": slug.current,
  publishedAt,
  excerpt,
  "imageUrl": image.asset->url,
  "categoryName": category->title
}`;

export const RESOURCES_PAGE_QUERY = groq`*[_type == "resourcesPage"][0] {
  heroTitle,
  heroHighlight,
  heroSuffix,
  heroDescription,
  "heroImageUrl": heroImage.asset->url
}`;

export const RESOURCES_POSTS_QUERY = groq`*[_type == "post"] | order(publishedAt desc)[0...4] {
  _id,
  title,
  "slug": slug.current,
  publishedAt,
  excerpt,
  "imageUrl": image.asset->url,
  "categoryName": category->title
}`;

export const DOWNLOADS_QUERY = groq`*[_type == "downloadResource"] | order(_createdAt asc) {
  _id,
  title,
  subtitle,
  "fileUrl": file.asset->url,
  "previewImageUrl": previewImage.asset->url
}`;

export const INDUSTRIES_QUERY = groq`*[_type == "industry"] | order(_createdAt asc) {
  _id,
  title,
  "slug": slug.current,
  shortDescription,
  icon,
  "imageUrl": coverImage.asset->url
}`;

export const SERVICES_PAGE_QUERY = groq`*[_type == "servicesPage"][0] {
  eyebrow,
  heroHeading,
  heroHighlight,
  heroDescription,
  "heroImageUrl": heroImage.asset->url,
  videoLink
}`;

export const SERVICES_QUERY = groq`*[_type == "service"] | order(_createdAt asc) {
  _id,
  title,
  "slug": slug.current,
  shortDescription,
  "imageUrl": coverImage.asset->url
}`;

export const CONTACT_PAGE_QUERY = groq`*[_type == "contactPage"][0] {
  heading,
  subheading,
  email,
  phone,
  address,
  whatsapp,
  workingHours,
  googleMapUrl,
  offices
}`;
