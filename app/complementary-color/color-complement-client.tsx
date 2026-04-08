"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "../language-context";

type Rgb = {
  r: number;
  g: number;
  b: number;
};

type SelectedColor = {
  hex: string;
  rgb: Rgb;
  source: "screen" | "image" | "manual";
};

type EyeDropperInstance = {
  open: () => Promise<{ sRGBHex: string }>;
};

type EyeDropperWindow = Window & {
  EyeDropper?: new () => EyeDropperInstance;
};

const T = {
  ko: {
    title: "보색 찾기",
    subtitle:
      "화면이나 이미지에서 색을 선택하면 보색과 HEX, RGB 값을 바로 확인할 수 있습니다.",
    desktopTitle: "화면에서 바로 선택",
    desktopDescription:
      "데스크톱 Chrome 또는 Edge에서는 스포이드로 화면의 아무 지점이나 찍을 수 있습니다.",
    eyedropper: "화면 스포이드 열기",
    eyedropperUnsupported: "이 브라우저에서는 화면 스포이드를 지원하지 않습니다.",
    manualTitle: "직접 입력",
    manualDescription: "HEX 코드를 입력하거나 컬러 피커로 색을 직접 고를 수 있습니다.",
    uploadTitle: "이미지에서 색 선택",
    uploadDescription:
      "모바일에서는 스크린샷을 업로드한 뒤 원하는 지점을 탭해서 색을 추출하세요.",
    uploadButton: "이미지 선택",
    resetImage: "이미지 초기화",
    noImage: "업로드한 이미지가 아직 없습니다.",
    tapHint: "이미지를 탭하면 그 지점의 색과 보색을 계산합니다.",
    selectedTitle: "선택 결과",
    originalColor: "원본 색",
    complementaryColor: "보색",
    hexLabel: "HEX",
    rgbLabel: "RGB",
    copy: "복사",
    copied: "복사됨",
    copyFailed: "복사에 실패했습니다. 직접 선택해서 복사해 주세요.",
    unsupportedHint: "스포이드는 브라우저 보안 정책상 사용자 클릭으로만 실행됩니다.",
    invalidHex: "올바른 HEX 코드를 입력해 주세요. 예: #2563EB",
    emptyState: "아직 선택된 색이 없습니다. 화면에서 찍거나 이미지를 탭해 보세요.",
    sourceScreen: "화면에서 선택",
    sourceImage: "이미지에서 선택",
    sourceManual: "직접 입력",
    tipsTitle: "사용 팁",
    tips: [
      "이미지에서 색을 찍을 때는 한 픽셀 대신 주변 색을 평균 내서 더 안정적으로 추출합니다.",
      "회색처럼 채도가 낮은 색은 보색 차이가 작게 보일 수 있습니다.",
      "모바일에서는 스크린샷 업로드 후 탭하는 방식이 가장 안정적입니다.",
    ],
  },
  en: {
    title: "Complementary Color Finder",
    subtitle:
      "Pick a color from your screen or an uploaded image to instantly see its complementary HEX and RGB values.",
    desktopTitle: "Pick from screen",
    desktopDescription:
      "On desktop Chrome or Edge, use the eyedropper to sample any visible point on your screen.",
    eyedropper: "Open eyedropper",
    eyedropperUnsupported: "This browser does not support screen eyedropper.",
    manualTitle: "Enter manually",
    manualDescription: "Type a HEX code or use the color picker directly.",
    uploadTitle: "Pick from image",
    uploadDescription:
      "On mobile, upload a screenshot and tap the point you want to sample.",
    uploadButton: "Choose image",
    resetImage: "Reset image",
    noImage: "No image has been uploaded yet.",
    tapHint: "Tap the image to sample that point and calculate the complementary color.",
    selectedTitle: "Selection result",
    originalColor: "Original color",
    complementaryColor: "Complementary color",
    hexLabel: "HEX",
    rgbLabel: "RGB",
    copy: "Copy",
    copied: "Copied",
    copyFailed: "Copy failed. Please select and copy the value manually.",
    unsupportedHint: "The eyedropper can only be opened from a direct user action.",
    invalidHex: "Enter a valid HEX code. Example: #2563EB",
    emptyState: "No color selected yet. Pick from the screen or tap an image.",
    sourceScreen: "Picked from screen",
    sourceImage: "Picked from image",
    sourceManual: "Entered manually",
    tipsTitle: "Tips",
    tips: [
      "Image sampling averages nearby pixels for more stable color picking.",
      "Low-saturation colors such as gray may appear to have a subtle complement.",
      "On mobile, screenshot upload plus tap selection is the most reliable flow.",
    ],
  },
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function normalizeHex(value: string) {
  const trimmed = value.trim().replace(/^#/, "");

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

function hexToRgb(hex: string): Rgb {
  const normalized = normalizeHex(hex);

  if (!normalized) {
    return { r: 37, g: 99, b: 235 };
  }

  return {
    r: Number.parseInt(normalized.slice(1, 3), 16),
    g: Number.parseInt(normalized.slice(3, 5), 16),
    b: Number.parseInt(normalized.slice(5, 7), 16),
  };
}

function rgbToHex(rgb: Rgb) {
  const toHex = (value: number) => value.toString(16).padStart(2, "0").toUpperCase();
  return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`;
}

function rgbToHsl(rgb: Rgb) {
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const lightness = (max + min) / 2;

  if (max === min) {
    return { h: 0, s: 0, l: lightness };
  }

  const diff = max - min;
  const saturation =
    lightness > 0.5 ? diff / (2 - max - min) : diff / (max + min);

  let hue = 0;

  switch (max) {
    case r:
      hue = (g - b) / diff + (g < b ? 6 : 0);
      break;
    case g:
      hue = (b - r) / diff + 2;
      break;
    default:
      hue = (r - g) / diff + 4;
      break;
  }

  return { h: hue / 6, s: saturation, l: lightness };
}

function hslToRgb(h: number, s: number, l: number): Rgb {
  if (s === 0) {
    const gray = Math.round(l * 255);
    return { r: gray, g: gray, b: gray };
  }

  const hueToRgb = (p: number, q: number, t: number) => {
    let normalized = t;

    if (normalized < 0) normalized += 1;
    if (normalized > 1) normalized -= 1;
    if (normalized < 1 / 6) return p + (q - p) * 6 * normalized;
    if (normalized < 1 / 2) return q;
    if (normalized < 2 / 3) return p + (q - p) * (2 / 3 - normalized) * 6;
    return p;
  };

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;

  return {
    r: Math.round(hueToRgb(p, q, h + 1 / 3) * 255),
    g: Math.round(hueToRgb(p, q, h) * 255),
    b: Math.round(hueToRgb(p, q, h - 1 / 3) * 255),
  };
}

function getComplementaryRgb(rgb: Rgb) {
  const hsl = rgbToHsl(rgb);
  const complementaryHue = (hsl.h + 0.5) % 1;
  return hslToRgb(complementaryHue, hsl.s, hsl.l);
}

function rgbText(rgb: Rgb) {
  return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
}

function foregroundColor(rgb: Rgb) {
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
  return luminance > 0.62 ? "text-slate-900" : "text-white";
}

function sampleAverageColor(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
) {
  let totalRed = 0;
  let totalGreen = 0;
  let totalBlue = 0;
  let samples = 0;

  for (let offsetY = -2; offsetY <= 2; offsetY += 1) {
    for (let offsetX = -2; offsetX <= 2; offsetX += 1) {
      const pixelX = clamp(x + offsetX, 0, width - 1);
      const pixelY = clamp(y + offsetY, 0, height - 1);
      const pixel = context.getImageData(pixelX, pixelY, 1, 1).data;

      totalRed += pixel[0];
      totalGreen += pixel[1];
      totalBlue += pixel[2];
      samples += 1;
    }
  }

  return {
    r: Math.round(totalRed / samples),
    g: Math.round(totalGreen / samples),
    b: Math.round(totalBlue / samples),
  };
}

function ColorCard({
  title,
  hex,
  rgb,
  hexLabel,
  rgbLabel,
  copy,
  copied,
  copiedKey,
  onCopy,
}: {
  title: string;
  hex: string;
  rgb: Rgb;
  hexLabel: string;
  rgbLabel: string;
  copy: string;
  copied: string;
  copiedKey: string | null;
  onCopy: (value: string, key: string) => void;
}) {
  const rgbValue = rgbText(rgb);
  const swatchText = foregroundColor(rgb);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-semibold text-slate-900">{title}</p>
      <div
        className={`mt-4 rounded-2xl px-5 py-10 ${swatchText}`}
        style={{ backgroundColor: hex }}
      >
        <p className="text-sm font-medium opacity-80">{title}</p>
        <p className="mt-2 text-3xl font-bold">{hex}</p>
      </div>

      <div className="mt-4 space-y-3">
        {[{ label: hexLabel, value: hex, key: `${title}-hex` }, { label: rgbLabel, value: rgbValue, key: `${title}-rgb` }].map((row) => (
          <div
            key={row.key}
            className="flex items-center justify-between gap-3 rounded-2xl bg-slate-50 px-4 py-3"
          >
            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                {row.label}
              </p>
              <p className="mt-1 truncate text-sm font-semibold text-slate-900">
                {row.value}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onCopy(row.value, row.key)}
              className="shrink-0 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-100"
            >
              {copiedKey === row.key ? copied : copy}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ColorComplementClient() {
  const { lang } = useLanguage();
  const t = T[lang];
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageUrlRef = useRef<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<SelectedColor | null>(null);
  const [manualHex, setManualHex] = useState("#2563EB");
  const [pickedPoint, setPickedPoint] = useState<{ xPercent: number; yPercent: number } | null>(
    null,
  );
  const [imageInfo, setImageInfo] = useState<{
    name: string;
    width: number;
    height: number;
  } | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    return () => {
      if (imageUrlRef.current) {
        URL.revokeObjectURL(imageUrlRef.current);
      }
    };
  }, []);

  const complementaryColor = selectedColor
    ? {
        hex: rgbToHex(getComplementaryRgb(selectedColor.rgb)),
        rgb: getComplementaryRgb(selectedColor.rgb),
      }
    : null;

  function setSelectedFromHex(hex: string, source: SelectedColor["source"]) {
    const normalized = normalizeHex(hex);

    if (!normalized) {
      return false;
    }

    setManualHex(normalized);
    setSelectedColor({
      hex: normalized,
      rgb: hexToRgb(normalized),
      source,
    });
    setMessage("");
    return true;
  }

  function handleManualHexChange(value: string) {
    setManualHex(value);

    if (!value.trim()) {
      return;
    }

    if (setSelectedFromHex(value, "manual")) {
      setPickedPoint(null);
      return;
    }

    setMessage(t.invalidHex);
  }

  async function handleCopy(value: string, key: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedKey(key);
      window.setTimeout(() => {
        setCopiedKey((current) => (current === key ? null : current));
      }, 1400);
    } catch {
      setMessage(t.copyFailed);
    }
  }

  async function handleEyeDropper() {
    const eyedropperApi = (window as EyeDropperWindow).EyeDropper;

    if (!eyedropperApi) {
      setMessage(t.eyedropperUnsupported);
      return;
    }

    try {
      const eyedropper = new eyedropperApi();
      const result = await eyedropper.open();
      setSelectedFromHex(result.sRGBHex, "screen");
      setPickedPoint(null);
    } catch {
      // User cancellation should not surface as an error.
    }
  }

  function clearImage() {
    const canvas = canvasRef.current;

    if (canvas) {
      const context = canvas.getContext("2d");
      context?.clearRect(0, 0, canvas.width, canvas.height);
      canvas.width = 0;
      canvas.height = 0;
    }

    if (imageUrlRef.current) {
      URL.revokeObjectURL(imageUrlRef.current);
      imageUrlRef.current = null;
    }

    setImageInfo(null);
    setPickedPoint(null);
  }

  function drawUploadedImage(file: File) {
    clearImage();

    const objectUrl = URL.createObjectURL(file);
    imageUrlRef.current = objectUrl;
    const image = new Image();

    image.onload = () => {
      const canvas = canvasRef.current;

      if (!canvas) {
        return;
      }

      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      const context = canvas.getContext("2d", { willReadFrequently: true });

      if (!context) {
        return;
      }

      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, 0, 0);
      setImageInfo({
        name: file.name,
        width: image.naturalWidth,
        height: image.naturalHeight,
      });
      setMessage("");
    };

    image.src = objectUrl;
  }

  function handleFileSelect(files: FileList | null) {
    const file = files?.[0];

    if (!file || !file.type.startsWith("image/")) {
      return;
    }

    drawUploadedImage(file);
  }

  function handleCanvasPointer(event: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d", { willReadFrequently: true });

    if (!context) {
      return;
    }

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = clamp(Math.floor((event.clientX - rect.left) * scaleX), 0, canvas.width - 1);
    const y = clamp(Math.floor((event.clientY - rect.top) * scaleY), 0, canvas.height - 1);
    const sampled = sampleAverageColor(context, x, y, canvas.width, canvas.height);

    setSelectedColor({
      hex: rgbToHex(sampled),
      rgb: sampled,
      source: "image",
    });
    setManualHex(rgbToHex(sampled));
    setPickedPoint({
      xPercent: ((event.clientX - rect.left) / rect.width) * 100,
      yPercent: ((event.clientY - rect.top) / rect.height) * 100,
    });
    setMessage("");
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
          {t.title}
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-500 md:text-base">{t.subtitle}</p>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
          <h2 className="text-lg font-semibold text-slate-900">{t.desktopTitle}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">{t.desktopDescription}</p>
          <button
            type="button"
            onClick={handleEyeDropper}
            className="mt-5 rounded-2xl bg-blue-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-600"
          >
            {t.eyedropper}
          </button>
          <p className="mt-3 text-xs leading-5 text-slate-400">{t.unsupportedHint}</p>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
          <h2 className="text-lg font-semibold text-slate-900">{t.manualTitle}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">{t.manualDescription}</p>
          <div className="mt-5 flex items-center gap-3">
            <input
              type="color"
              value={normalizeHex(manualHex) ?? "#2563EB"}
              onChange={(event) => {
                setSelectedFromHex(event.target.value, "manual");
                setPickedPoint(null);
              }}
              className="h-14 w-16 rounded-2xl border border-slate-200 bg-transparent p-1"
            />
            <input
              value={manualHex}
              onChange={(event) => handleManualHexChange(event.target.value)}
              placeholder="#2563EB"
              className="h-14 flex-1 rounded-2xl border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </section>
      </div>

      <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">{t.uploadTitle}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">{t.uploadDescription}</p>
          </div>
          <div className="flex gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => handleFileSelect(event.target.files)}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-800 transition hover:border-slate-300 hover:bg-slate-100"
            >
              {t.uploadButton}
            </button>
            {imageInfo ? (
              <button
                type="button"
                onClick={clearImage}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-500 transition hover:border-slate-300 hover:bg-slate-50"
              >
                {t.resetImage}
              </button>
            ) : null}
          </div>
        </div>

        <div className="mt-5">
          {imageInfo ? (
            <>
              <p className="text-xs text-slate-400">
                {imageInfo.name} · {imageInfo.width} x {imageInfo.height}
              </p>
              <p className="mt-1 text-xs text-slate-500">{t.tapHint}</p>
            </>
          ) : null}

          <div
            className={`relative mt-4 overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 ${
              imageInfo ? "" : "hidden"
            }`}
          >
            <canvas
              ref={canvasRef}
              onPointerDown={handleCanvasPointer}
              className="block h-auto w-full cursor-crosshair touch-manipulation"
            />
            {pickedPoint ? (
              <div
                className="pointer-events-none absolute h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-[0_0_0_2px_rgba(15,23,42,0.18)]"
                style={{
                  left: `${pickedPoint.xPercent}%`,
                  top: `${pickedPoint.yPercent}%`,
                }}
              />
            ) : null}
          </div>

          {!imageInfo ? (
          <div className="mt-5 rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-5 py-12 text-center text-sm text-slate-500">
            {t.noImage}
          </div>
          ) : null}
        </div>
      </section>

      <section className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm md:p-6">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-slate-900">{t.selectedTitle}</h2>
          {selectedColor ? (
            <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-500">
              {selectedColor.source === "screen"
                ? t.sourceScreen
                : selectedColor.source === "image"
                  ? t.sourceImage
                  : t.sourceManual}
            </span>
          ) : null}
        </div>

        {message ? (
          <p className="mt-4 rounded-2xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm text-orange-700">
            {message}
          </p>
        ) : null}

        {selectedColor && complementaryColor ? (
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <ColorCard
              title={t.originalColor}
              hex={selectedColor.hex}
              rgb={selectedColor.rgb}
              hexLabel={t.hexLabel}
              rgbLabel={t.rgbLabel}
              copy={t.copy}
              copied={t.copied}
              copiedKey={copiedKey}
              onCopy={handleCopy}
            />
            <ColorCard
              title={t.complementaryColor}
              hex={complementaryColor.hex}
              rgb={complementaryColor.rgb}
              hexLabel={t.hexLabel}
              rgbLabel={t.rgbLabel}
              copy={t.copy}
              copied={t.copied}
              copiedKey={copiedKey}
              onCopy={handleCopy}
            />
          </div>
        ) : (
          <div className="mt-5 rounded-3xl border border-dashed border-slate-300 bg-white px-5 py-12 text-center text-sm text-slate-500">
            {t.emptyState}
          </div>
        )}
      </section>

      <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
        <h2 className="text-lg font-semibold text-slate-900">{t.tipsTitle}</h2>
        <div className="mt-4 space-y-2 text-sm leading-6 text-slate-600">
          {t.tips.map((tip) => (
            <p key={tip} className="flex gap-2">
              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-slate-400" />
              <span>{tip}</span>
            </p>
          ))}
        </div>
      </section>
    </div>
  );
}
