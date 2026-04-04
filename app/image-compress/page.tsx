"use client";

import { useState, useRef, useCallback } from "react";

interface CompressedImage {
  id: number;
  name: string;
  originalSize: number;
  compressedSize: number;
  originalUrl: string;
  compressedUrl: string;
  width: number;
  height: number;
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

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0, width, height);

        const mimeType = file.type === "image/png" ? "image/png" : "image/jpeg";
        canvas.toBlob(
          (blob) => {
            if (!blob) { reject(new Error("압축 실패")); return; }
            const compressedUrl = URL.createObjectURL(blob);
            resolve({
              id: Date.now() + Math.random(),
              name: file.name,
              originalSize: file.size,
              compressedSize: blob.size,
              originalUrl: URL.createObjectURL(file),
              compressedUrl,
              width,
              height,
            });
          },
          mimeType,
          quality / 100
        );
      };
      img.onerror = reject;
      img.src = e.target!.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function ImageCompressPage() {
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
      const results = await Promise.all(
        imageFiles.map((f) => compressImage(f, quality, maxWidth))
      );
      setImages((prev) => [...results, ...prev]);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    processFiles(e.dataTransfer.files);
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

  function removeImage(id: number) {
    setImages((prev) => prev.filter((img) => img.id !== id));
  }

  const totalSaved = images.reduce((sum, img) => sum + (img.originalSize - img.compressedSize), 0);
  const totalOriginal = images.reduce((sum, img) => sum + img.originalSize, 0);

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 space-y-6">
      <div className="text-center mb-2">
        <h1 className="text-2xl font-bold text-slate-800">이미지 압축기</h1>
        <p className="text-slate-500 text-sm mt-1">이미지를 브라우저에서 바로 압축해드려요. 서버 전송 없음.</p>
      </div>

      {/* 설정 */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-5">
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-medium text-slate-600">압축 품질</label>
            <span className="text-sm font-bold text-blue-500">{quality}%</span>
          </div>
          <input
            type="range"
            min={10}
            max={100}
            value={quality}
            onChange={(e) => setQuality(parseInt(e.target.value))}
            className="w-full accent-blue-500"
          />
          <div className="flex justify-between text-xs text-slate-400 mt-1">
            <span>최대 압축</span>
            <span>원본 품질</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">최대 가로폭</label>
          <div className="flex gap-2 flex-wrap">
            {[800, 1280, 1920, 2560].map((w) => (
              <button
                key={w}
                onClick={() => setMaxWidth(w)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  maxWidth === w ? "bg-blue-500 text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                }`}
              >
                {w}px
              </button>
            ))}
            <div className="relative flex items-center">
              <input
                type="number"
                value={maxWidth}
                onChange={(e) => setMaxWidth(parseInt(e.target.value) || 1920)}
                className="w-24 border border-slate-300 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-400 pr-8"
              />
              <span className="absolute right-2 text-xs text-slate-400">px</span>
            </div>
          </div>
        </div>
      </div>

      {/* 드롭 존 */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-colors ${
          dragging ? "border-blue-400 bg-blue-50" : "border-slate-300 hover:border-blue-300 hover:bg-slate-50"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && processFiles(e.target.files)}
        />
        <div className="text-4xl mb-3">{loading ? "⏳" : "🖼️"}</div>
        {loading ? (
          <p className="text-slate-500 font-medium">압축 중...</p>
        ) : (
          <>
            <p className="text-slate-600 font-medium">이미지를 드래그하거나 클릭해서 업로드</p>
            <p className="text-slate-400 text-sm mt-1">JPG, PNG, WebP, GIF 지원 · 여러 파일 동시 가능</p>
          </>
        )}
      </div>

      {/* 결과 요약 */}
      {images.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs text-slate-400">총 {images.length}개 이미지</p>
              <p className="text-lg font-bold text-green-500">
                {formatSize(totalSaved)} 절약 ({totalOriginal > 0 ? Math.round((totalSaved / totalOriginal) * 100) : 0}%)
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={downloadAll}
                className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
              >
                전체 다운로드
              </button>
              <button
                onClick={() => setImages([])}
                className="bg-slate-100 hover:bg-slate-200 text-slate-500 text-sm font-medium px-3 py-2 rounded-lg transition-colors"
              >
                초기화
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {images.map((img) => {
              const savings = img.originalSize - img.compressedSize;
              const pct = Math.round((savings / img.originalSize) * 100);
              return (
                <div key={img.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                  {/* 썸네일 */}
                  <img
                    src={img.compressedUrl}
                    alt={img.name}
                    className="w-14 h-14 object-cover rounded-lg flex-shrink-0"
                  />
                  {/* 정보 */}
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
                  {/* 액션 */}
                  <div className="flex flex-col gap-1 flex-shrink-0">
                    <a
                      href={img.compressedUrl}
                      download={img.name.replace(/(\.[^.]+)$/, "_compressed$1")}
                      className="text-xs text-blue-500 hover:text-blue-700 font-medium text-right"
                    >
                      다운로드
                    </a>
                    <button
                      onClick={() => removeImage(img.id)}
                      className="text-xs text-slate-300 hover:text-red-400 text-right"
                    >
                      삭제
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="text-center text-xs text-slate-400">
        모든 처리는 브라우저 내에서 이루어지며, 이미지가 서버로 전송되지 않습니다.
      </div>
    </div>
  );
}
