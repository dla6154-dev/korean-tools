import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://rate-snap.com";

  return [
    { url: base,                          lastModified: new Date(), changeFrequency: "daily",   priority: 1    },
    { url: `${base}/age`,                 lastModified: new Date(), changeFrequency: "monthly", priority: 0.9  },
    { url: `${base}/loan`,                lastModified: new Date(), changeFrequency: "monthly", priority: 0.9  },
    { url: `${base}/bmi`,                 lastModified: new Date(), changeFrequency: "monthly", priority: 0.9  },
    { url: `${base}/anniversary`,         lastModified: new Date(), changeFrequency: "monthly", priority: 0.85 },
    { url: `${base}/dday`,                lastModified: new Date(), changeFrequency: "monthly", priority: 0.85 },
    { url: `${base}/severance`,           lastModified: new Date(), changeFrequency: "monthly", priority: 0.8  },
    { url: `${base}/alcohol`,             lastModified: new Date(), changeFrequency: "monthly", priority: 0.8  },
    { url: `${base}/characters`,          lastModified: new Date(), changeFrequency: "monthly", priority: 0.75 },
    { url: `${base}/chosung`,             lastModified: new Date(), changeFrequency: "monthly", priority: 0.75 },
    { url: `${base}/image-compress`,      lastModified: new Date(), changeFrequency: "monthly", priority: 0.75 },
    { url: `${base}/keyboard`,            lastModified: new Date(), changeFrequency: "monthly", priority: 0.75 },
  ];
}
