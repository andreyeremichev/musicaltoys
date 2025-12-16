// app/sitemap.ts
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://musicaltoys.app";
  const now = new Date();

  const urls = [
    { url: `${base}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/toys`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },

    // Live postcards hub + themes
    { url: `${base}/cards/postcard`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/cards/postcard/xmas`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/cards/postcard/new-year`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/cards/postcard/date-we-met`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },

    // Live toys (adjust to match your routes)
    { url: `${base}/toys/text-to-tone`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/toys/key-clock`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/toys/tone-dial`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/toys/shape-of-harmony`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
  ];

  return urls;
}