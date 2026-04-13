"use client";

export type RgbColor = {
  r: number;
  g: number;
  b: number;
};

export type LoadedImageFile = {
  file: File;
  name: string;
  type: string;
  dataUrl: string;
  image: HTMLImageElement;
  width: number;
  height: number;
};

export type ImagePreviewItem = {
  id: string;
  name: string;
  type: string;
  size: number;
  width: number;
  height: number;
  dataUrl: string;
};

export type PaletteColor = {
  hex: string;
  rgb: RgbColor;
  ratio: number;
  pixels: number;
};

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function formatBytes(bytes: number) {
  if (bytes >= 1024 * 1024) {
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  }

  return `${(bytes / 1024).toFixed(1)} KB`;
}

export function fileNameWithoutExtension(name: string) {
  return name.replace(/\.[^.]+$/, "");
}

export function replaceExtension(name: string, nextExtension: string) {
  return `${fileNameWithoutExtension(name)}.${nextExtension.replace(/^\./, "")}`;
}

export function rgbToHex(rgb: RgbColor) {
  const toHex = (value: number) => clamp(Math.round(value), 0, 255).toString(16).padStart(2, "0");
  return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`.toUpperCase();
}

export function normalizeHex(input: string) {
  const trimmed = input.trim().replace(/^#/, "");

  if (!/^[0-9a-fA-F]{3}$|^[0-9a-fA-F]{6}$/.test(trimmed)) {
    return null;
  }

  if (trimmed.length === 3) {
    return `#${trimmed
      .split("")
      .map((char) => char + char)
      .join("")
      .toUpperCase()}`;
  }

  return `#${trimmed.toUpperCase()}`;
}

export function hexToRgb(input: string) {
  const normalized = normalizeHex(input);

  if (!normalized) {
    return null;
  }

  return {
    r: Number.parseInt(normalized.slice(1, 3), 16),
    g: Number.parseInt(normalized.slice(3, 5), 16),
    b: Number.parseInt(normalized.slice(5, 7), 16),
  };
}

export function rgbToText(rgb: RgbColor) {
  return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
}

export function parseRgbInput(input: string) {
  const normalized = input
    .trim()
    .replace(/^rgb\s*\(/i, "")
    .replace(/\)$/, "");
  const parts = normalized.split(/[,\s]+/).filter(Boolean);

  if (parts.length !== 3) {
    return null;
  }

  const values = parts.map((part) => Number(part));

  if (values.some((value) => Number.isNaN(value) || value < 0 || value > 255)) {
    return null;
  }

  return {
    r: Math.round(values[0]),
    g: Math.round(values[1]),
    b: Math.round(values[2]),
  };
}

export function createImageId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error ?? new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

export function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error ?? new Error("Failed to read blob"));
    reader.readAsDataURL(blob);
  });
}

export function loadImageFromDataUrl(dataUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Failed to load image"));
    image.src = dataUrl;
  });
}

export async function loadImageFile(file: File): Promise<LoadedImageFile> {
  const dataUrl = await readFileAsDataUrl(file);
  const image = await loadImageFromDataUrl(dataUrl);

  return {
    file,
    name: file.name,
    type: file.type || "image/png",
    dataUrl,
    image,
    width: image.naturalWidth,
    height: image.naturalHeight,
  };
}

export async function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: string,
  quality = 0.92,
) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Canvas export failed"));
          return;
        }

        resolve(blob);
      },
      type,
      quality,
    );
  });
}

export async function renderImageVariant(
  source: LoadedImageFile,
  options: {
    width: number;
    height: number;
    type: string;
    quality?: number;
    backgroundColor?: string;
  },
) {
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(options.width));
  canvas.height = Math.max(1, Math.round(options.height));

  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Canvas is not supported in this browser");
  }

  if (options.backgroundColor) {
    context.fillStyle = options.backgroundColor;
    context.fillRect(0, 0, canvas.width, canvas.height);
  } else {
    context.clearRect(0, 0, canvas.width, canvas.height);
  }

  context.drawImage(source.image, 0, 0, canvas.width, canvas.height);

  const blob = await canvasToBlob(canvas, options.type, options.quality ?? 0.92);
  const dataUrl = await blobToDataUrl(blob);

  return {
    blob,
    dataUrl,
    width: canvas.width,
    height: canvas.height,
  };
}

export function createPreviewItem(source: LoadedImageFile): ImagePreviewItem {
  return {
    id: createImageId(),
    name: source.name,
    type: source.type,
    size: source.file.size,
    width: source.width,
    height: source.height,
    dataUrl: source.dataUrl,
  };
}

export function scaleToFit(sourceWidth: number, sourceHeight: number, maxWidth: number, maxHeight: number) {
  const ratio = Math.min(maxWidth / sourceWidth, maxHeight / sourceHeight);

  return {
    width: Math.max(1, Math.round(sourceWidth * ratio)),
    height: Math.max(1, Math.round(sourceHeight * ratio)),
  };
}

function colorDistance(first: RgbColor, second: RgbColor) {
  return Math.sqrt(
    (first.r - second.r) ** 2 +
      (first.g - second.g) ** 2 +
      (first.b - second.b) ** 2,
  );
}

export function extractPaletteFromImage(source: LoadedImageFile, limit = 6): PaletteColor[] {
  const sampleCanvas = document.createElement("canvas");
  const longestSide = Math.max(source.width, source.height);
  const scale = longestSide > 160 ? 160 / longestSide : 1;

  sampleCanvas.width = Math.max(1, Math.round(source.width * scale));
  sampleCanvas.height = Math.max(1, Math.round(source.height * scale));

  const context = sampleCanvas.getContext("2d", { willReadFrequently: true });

  if (!context) {
    return [];
  }

  context.drawImage(source.image, 0, 0, sampleCanvas.width, sampleCanvas.height);

  const { data } = context.getImageData(0, 0, sampleCanvas.width, sampleCanvas.height);
  const buckets = new Map<string, { r: number; g: number; b: number; count: number }>();
  let totalPixels = 0;

  for (let index = 0; index < data.length; index += 4) {
    const alpha = data[index + 3];

    if (alpha < 120) {
      continue;
    }

    const red = data[index];
    const green = data[index + 1];
    const blue = data[index + 2];
    const key = `${red >> 4}-${green >> 4}-${blue >> 4}`;
    const current = buckets.get(key) ?? { r: 0, g: 0, b: 0, count: 0 };

    current.r += red;
    current.g += green;
    current.b += blue;
    current.count += 1;
    buckets.set(key, current);
    totalPixels += 1;
  }

  const ranked = Array.from(buckets.values())
    .map((bucket) => ({
      rgb: {
        r: Math.round(bucket.r / bucket.count),
        g: Math.round(bucket.g / bucket.count),
        b: Math.round(bucket.b / bucket.count),
      },
      pixels: bucket.count,
    }))
    .sort((first, second) => second.pixels - first.pixels);

  const selected: PaletteColor[] = [];

  for (const candidate of ranked) {
    if (selected.every((item) => colorDistance(item.rgb, candidate.rgb) >= 36)) {
      selected.push({
        hex: rgbToHex(candidate.rgb),
        rgb: candidate.rgb,
        pixels: candidate.pixels,
        ratio: totalPixels > 0 ? candidate.pixels / totalPixels : 0,
      });
    }

    if (selected.length === limit) {
      break;
    }
  }

  if (selected.length < limit) {
    for (const candidate of ranked) {
      if (selected.some((item) => item.hex === rgbToHex(candidate.rgb))) {
        continue;
      }

      selected.push({
        hex: rgbToHex(candidate.rgb),
        rgb: candidate.rgb,
        pixels: candidate.pixels,
        ratio: totalPixels > 0 ? candidate.pixels / totalPixels : 0,
      });

      if (selected.length === limit) {
        break;
      }
    }
  }

  return selected;
}

export function downloadDataUrl(dataUrl: string, filename: string) {
  const anchor = document.createElement("a");
  anchor.href = dataUrl;
  anchor.download = filename;
  anchor.click();
}
