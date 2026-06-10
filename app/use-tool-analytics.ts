"use client";

import { useRef } from "react";
import { type AnalyticsParams, trackEvent } from "./analytics";

type SupportedLanguage = "ko" | "en";

export function useToolAnalytics(tool: string, lang: SupportedLanguage) {
  const startedRef = useRef(false);

  function markStart(params: AnalyticsParams = {}) {
    if (startedRef.current) {
      return;
    }

    startedRef.current = true;
    trackEvent("tool_start", { tool, lang, ...params });
  }

  function trackComplete(params: AnalyticsParams = {}) {
    markStart();
    trackEvent("tool_complete", { tool, lang, ...params });
  }

  function trackCopyResult(params: AnalyticsParams = {}) {
    markStart();
    trackEvent("tool_copy_result", { tool, lang, ...params });
  }

  return {
    markStart,
    trackComplete,
    trackCopyResult,
  };
}
