import {
  createLegacyGoneHeadResponse,
  createLegacyGoneResponse,
} from "../../legacy-gone-response";

export function GET() {
  return createLegacyGoneResponse();
}

export function HEAD() {
  return createLegacyGoneHeadResponse();
}
