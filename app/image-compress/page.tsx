"use client";

import { useState, useRef } from "react";
import { useLanguage } from "../language-context";

const T = {
  ko: {
    title: "이미지 압축기",
    sub: "이미지를 브라우저에서 바로 압축해드려요. 서버 전송 없음.",
    qualityLabel: "압축 품질",
    qualityMin: "최대 압축", qualityMax: "원본 품질",
    maxWidthLabel: "최대 가로폭",
    dropTitle: "이미지를 드래그하거나 클릭해서 업로드",
    dropSub: "JPG, PNG, WebP, GIF 지원 · 여러 파일 동시 가능",
    loading: "압축 중...",
    saved: "절약",
    images: "개 이미지",
    downloadAll: "전체 다운로드",
    reset: "초기화",
    download: "다운로드",
    delete: "삭제",
    privacy: "모든 처리는 브라우저 내에서 이루어지며, 이미지가 서버로 전송되지 않습니다.",
  },
  en: {
    title: "Image Compressor",
    sub: "Compress images right in your browser. No server upload.",
    qualityLabel: "Quality",
    qualityMin: "Max compression", qualityMax: "Original quality",
    maxWidthLabel: "Max width",
    dropTitle: "Drag & drop or click to upload images",
    dropSub: "Supports JPG, PNG, WebP, GIF · Multiple files at once",
    loading: "Compressing...",
    saved: "saved",
    images: " images",
    downloadAll: "Download all",
    reset: "Reset",
    download: "Download",
    delete: "Remove",
    privacy: "All processing happens in your browser. No images are sent to any server.",
  },
};

interface CompressedImage {
  id: number; name: string; originalSize: number; compressedSize: number;
  originalUrl: string; compressedUrl: string; width: number; height: number;
}

function formatSize(bytes: number) {
  if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  return `${(bytes / 1024).toFixed(1)} KB`;
}

function compressImage(file: File, quality: number, maxWidth: number): Promise<CompressedImage> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let { width, height } = img;
        if (width > maxWidth) { height = Math.round((height * maxWidth) / width); width = maxWidth; }
        canvas.width = width; canvas.height = height;
        canvas.getContext("2d")!.drawImage(img, 0, 0, width, height);
        const mimeType = file.type === "image/png" ? "image/png" : "image/jpeg";
        canvas.toBlob((blob) => {
          if (!blob) { reject(new Error("Compression failed")); return; }
          resolve({ id: Date.now() + Math.random(), name: file.name, originalSize: file.size, compressedSize: blob.size, originalUrl: URL.createObjectURL(file), compressedUrl: URL.createObjectURL(blob), width, height });
        }, mimeType, quality / 100);
      };
      img.onerror = reject;
      img.src = e.target!.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function ImageCompressPage() {
  const { lang } = useLanguage();
  const t = T[lang];
  const [quality, setQuality] = useState(80);
  const [maxWidth, setMaxWidth] = useState(1920);
  const [images, setImages] = useState<CompressedImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function processFiles(files: FileList | File[]) {
    const imageFiles = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (imageFiles.length === 0) return;
    setLoading(true);
    try {
      const results = await Promise.all(imageFiles.map((f) => compressImage(f, quality, maxWidth)));
      setImages((prev) => [...results, ...prev]);
    } catch (e) { console.error(e); }
    setLoading(false);
  }

  function downloadAll() {
    images.forEach((img) => {
      const a = document.createElement("a");
      a.href = img.compressedUrl;
      const ext = img.name.split(".").pop();
      a.download = img.name.replace(`.${ext}`, `_compressed.${ext}`);
      a.click();
    });
  }

  const totalSaved = images.reduce((sum, img) => sum + (img.originalSize - img.compressedSize), 0);
  const totalOriginal = images.reduce((sum, img) => sum + img.originalSize, 0);

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 space-y-6">
      <div className="text-center mb-2">
        <h1 className="text-2xl font-bold text-slate-800">{t.title}</h1>
        <p className="text-slate-500 text-sm mt-1">{t.sub}</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-5">
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-medium text-slate-600">{t.qualityLabel}</label>
            <span className="text-sm font-bold text-blue-500">{quality}%</span>
          </div>
          <input type="range" min={10} max={100} value={quality} onChange={(e) => setQuality(parseInt(e.target.value))} className="w-full accent-blue-500" />
          <div className="flex justify-between text-xs text-slate-400 mt-1">
            <span>{t.qualityMin}</span><span>{t.qualityMax}</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">{t.maxWidthLabel}</label>
          <div className="flex gap-2 flex-wrap">
            {[800, 1280, 1920, 2560].map((w) => (
              <button key={w} onClick={() => setMaxWidth(w)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${maxWidth === w ? "bg-blue-500 text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}>
                {w}px
              </button>
            ))}
            <div className="relative flex items-center">
              <input type="number" value={maxWidth} onChange={(e) => setMaxWidth(parseInt(e.target.value) || 1920)}
                className="w-24 border border-slate-300 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-400 pr-8" />
              <span className="absolute right-2 text-xs text-slate-400">px</span>
            </div>
          </div>
        </div>
      </div>

      <div onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); processFiles(e.dataTransfer.files); }}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-colors ${dragging ? "border-blue-400 bg-blue-50" : "border-slate-300 hover:border-blue-300 hover:bg-slate-50"}`}>
        <input ref={inputRef} type="file" accept="image/*" multiple className="hidden"
          onChange={(e) => e.target.files && processFiles(e.target.files)} />
        <div className="text-4xl mb-3">{loading ? "⏳" : "🖼️"}</div>
        {loading ? (
          <p className="text-slate-500 font-medium">{t.loading}</p>
        ) : (
          <>
            <p className="text-slate-600 font-medium">{t.dropTitle}</p>
            <p className="text-slate-400 text-sm mt-1">{t.dropSub}</p>
          </>
        )}
      </div>

      {images.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs text-slate-400">{t.images.startsWith(" ") ? `${images.length}${t.images}` : `${images.length} ${t.images}`}</p>
              <p className="text-lg font-bold text-green-500">
                {formatSize(totalSaved)} {t.saved} ({totalOriginal > 0 ? Math.round((totalSaved / totalOriginal) * 100) : 0}%)
              </p>
            </div>
            <div className="flex gap-2">
              <button onClick={downloadAll} className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">{t.downloadAll}</button>
              <button onClick={() => setImages([])} className="bg-slate-100 hover:bg-slate-200 text-slate-500 text-sm font-medium px-3 py-2 rounded-lg transition-colors">{t.reset}</button>
            </div>
          </div>

          <div className="space-y-3">
            {images.map((img) => {
              const savings = img.originalSize - img.compressedSize;
              const pct = Math.round((savings / img.originalSize) * 100);
              return (
                <div key={img.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                  <img src={img.compressedUrl} alt={img.name} className="w-14 h-14 object-cover rounded-lg flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-700 truncate">{img.name}</p>
                    <p className="text-xs text-slate-400">{img.width} × {img.height}px</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-slate-400 line-through">{formatSize(img.originalSize)}</span>
                      <span className="text-xs">→</span>
                      <span className="text-xs text-slate-600 font-medium">{formatSize(img.compressedSize)}</span>
                      <span className="text-xs text-green-500 font-semibold">(-{pct}%)</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 flex-shrink-0">
                    <a href={img.compressedUrl} download={img.name.replace(/(\.[^.]+)$/, "_compressed$1")}
                      className="text-xs text-blue-500 hover:text-blue-700 font-medium text-right">{t.download}</a>
                    <button onClick={() => setImages((prev) => prev.filter((i) => i.id !== img.id))}
                      className="text-xs text-slate-300 hover:text-red-400 text-right">{t.delete}</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="text-center text-xs text-slate-400">{t.privacy}</div>
    </div>
  );
}
