import { siteConfig } from "@/config/site";

export function googleMapsEmbedUrl(query = siteConfig.address) {
  const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const encoded = encodeURIComponent(query);
  return key
    ? `https://www.google.com/maps/embed/v1/place?key=${key}&q=${encoded}`
    : `https://www.google.com/maps?q=${encoded}&output=embed`;
}
