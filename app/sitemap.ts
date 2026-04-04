import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://korean-tools.vercel.app";

  const paths = [
    { url: baseUrl, priority: 1 },
    { url: `${baseUrl}/age`, priority: 0.9 },
    { url: `${baseUrl}/anniversary`, priority: 0.9 },
    { url: `${baseUrl}/dday`, priority: 0.9 },
    { url: `${baseUrl}/bmi`, priority: 0.9 },
    { url: `${baseUrl}/characters`, priority: 0.9 },
    { url: `${baseUrl}/loan`, priority: 0.9 },
    { url: `${baseUrl}/severance`, priority: 0.8 },
    { url: `${baseUrl}/alcohol`, priority: 0.8 },
    { url: `${baseUrl}/chosung`, priority: 0.8 },
    { url: `${baseUrl}/keyboard`, priority: 0.8 },
    { url: `${baseUrl}/en`, priority: 0.9 },
  ];

  return paths.map(({ url, priority }) => ({
    url,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority,
  }));
}
