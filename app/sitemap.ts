// app/sitemap.ts
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://musicaltoys.app";
  const now = new Date();

  const urls: MetadataRoute.Sitemap = [
    // Home
    {
      url: `${base}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },

    // Trust & info pages
    {
      url: `${base}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${base}/contact`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${base}/terms`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.4,
    },

    // Contextual daily pages (secondary)
    {
      url: `${base}/today`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.3,
    },
    {
      url: `${base}/calendar`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.4,
    },
    {
  url: `${base}/fireplace`,
  lastModified: now,
  changeFrequency: "weekly",
  priority: 0.4,
},

    // Hubs
{
  url: `${base}/gestures`,
  lastModified: now,
  changeFrequency: "weekly",
  priority: 0.95,
},
{
  url: `${base}/toys`,
  lastModified: now,
  changeFrequency: "weekly",
  priority: 0.9,
},
{
  url: `${base}/cards`,
  lastModified: now,
  changeFrequency: "weekly",
  priority: 0.9,
},

    // Cards / Postcards
    {
      url: `${base}/cards/postcard`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${base}/cards/postcard/xmas`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${base}/cards/postcard/new-year`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${base}/cards/postcard/date-we-met`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },

    // Individual toys
    {
      url: `${base}/toys/text-to-tone`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${base}/toys/key-clock`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${base}/toys/tone-dial`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${base}/toys/shape-of-harmony`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ];

  return urls;
}