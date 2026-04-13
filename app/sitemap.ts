import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://rate-snap.com";

  return [
    { url: base,                          lastModified: new Date(), changeFrequency: "daily",   priority: 1    },
    // Date tools
    { url: `${base}/age`,                 lastModified: new Date(), changeFrequency: "monthly", priority: 0.9  },
    { url: `${base}/date-calc`,           lastModified: new Date(), changeFrequency: "monthly", priority: 0.9  },
    { url: `${base}/date-diff`,           lastModified: new Date(), changeFrequency: "monthly", priority: 0.9  },
    { url: `${base}/weekday`,             lastModified: new Date(), changeFrequency: "monthly", priority: 0.85 },
    { url: `${base}/anniversary`,         lastModified: new Date(), changeFrequency: "monthly", priority: 0.85 },
    { url: `${base}/dday`,                lastModified: new Date(), changeFrequency: "monthly", priority: 0.85 },
    // Life tools
    { url: `${base}/loan`,                lastModified: new Date(), changeFrequency: "monthly", priority: 0.9  },
    { url: `${base}/bmi`,                 lastModified: new Date(), changeFrequency: "monthly", priority: 0.9  },
    { url: `${base}/severance`,           lastModified: new Date(), changeFrequency: "monthly", priority: 0.8  },
    { url: `${base}/net-pay`,             lastModified: new Date(), changeFrequency: "monthly", priority: 0.85 },
    { url: `${base}/weekly-holiday-pay`,  lastModified: new Date(), changeFrequency: "monthly", priority: 0.85 },
    { url: `${base}/annual-leave`,        lastModified: new Date(), changeFrequency: "monthly", priority: 0.85 },
    { url: `${base}/discount`,            lastModified: new Date(), changeFrequency: "monthly", priority: 0.8  },
    { url: `${base}/alcohol`,             lastModified: new Date(), changeFrequency: "monthly", priority: 0.8  },
    { url: `${base}/starbucks-reward`,    lastModified: new Date(), changeFrequency: "monthly", priority: 0.8  },
    { url: `${base}/unit-price`,          lastModified: new Date(), changeFrequency: "monthly", priority: 0.75 },
    // Text tools
    { url: `${base}/characters`,          lastModified: new Date(), changeFrequency: "monthly", priority: 0.75 },
    { url: `${base}/chosung`,             lastModified: new Date(), changeFrequency: "monthly", priority: 0.75 },
    { url: `${base}/keyboard`,            lastModified: new Date(), changeFrequency: "monthly", priority: 0.75 },
    { url: `${base}/line-break-remover`,  lastModified: new Date(), changeFrequency: "monthly", priority: 0.75 },
    { url: `${base}/case-converter`,      lastModified: new Date(), changeFrequency: "monthly", priority: 0.75 },
    { url: `${base}/json-formatter`,      lastModified: new Date(), changeFrequency: "monthly", priority: 0.75 },
    { url: `${base}/base64`,              lastModified: new Date(), changeFrequency: "monthly", priority: 0.7  },
    { url: `${base}/url-encoder`,         lastModified: new Date(), changeFrequency: "monthly", priority: 0.7  },
    { url: `${base}/markdown-to-html`,    lastModified: new Date(), changeFrequency: "monthly", priority: 0.7  },
    { url: `${base}/lorem-ipsum`,         lastModified: new Date(), changeFrequency: "monthly", priority: 0.7  },
    // Image tools
    { url: `${base}/image-compress`,      lastModified: new Date(), changeFrequency: "monthly", priority: 0.75 },
    { url: `${base}/image-to-webp`,       lastModified: new Date(), changeFrequency: "monthly", priority: 0.75 },
    { url: `${base}/image-resize`,        lastModified: new Date(), changeFrequency: "monthly", priority: 0.75 },
    { url: `${base}/image-to-base64`,     lastModified: new Date(), changeFrequency: "monthly", priority: 0.7  },
    { url: `${base}/color-palette`,       lastModified: new Date(), changeFrequency: "monthly", priority: 0.75 },
    { url: `${base}/hex-rgb`,             lastModified: new Date(), changeFrequency: "monthly", priority: 0.75 },
    { url: `${base}/image-to-pdf`,        lastModified: new Date(), changeFrequency: "monthly", priority: 0.7  },
    { url: `${base}/complementary-color`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7  },
    // Random tools
    { url: `${base}/what-to-eat`,        lastModified: new Date(), changeFrequency: "monthly", priority: 0.8  },
    { url: `${base}/random-picker`,      lastModified: new Date(), changeFrequency: "monthly", priority: 0.8  },
    { url: `${base}/ladder`,             lastModified: new Date(), changeFrequency: "monthly", priority: 0.8  },
    // Utility tools
    { url: `${base}/qr-code`,            lastModified: new Date(), changeFrequency: "monthly", priority: 0.85 },
  ];
}
