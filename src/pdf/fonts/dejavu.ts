import type { jsPDF } from 'jspdf';
// Vite отдаёт URL ассета; шрифт грузим в рантайме и кэшируем как base64.
import fontUrl from './DejaVuSans.ttf?url';

// Встроенные шрифты jsPDF не содержат кириллицу, поэтому регистрируем Unicode-шрифт
// (DejaVu Sans с полным набором кириллических глифов).
export const FONT_NAME = 'DejaVuSans';

let cachedBase64: string | null = null;

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  const chunk = 0x8000; // по частям, чтобы не упереться в лимит аргументов apply
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

async function loadFontBase64(): Promise<string> {
  if (cachedBase64) return cachedBase64;
  const buffer = await fetch(fontUrl).then((r) => r.arrayBuffer());
  cachedBase64 = arrayBufferToBase64(buffer);
  return cachedBase64;
}

// Регистрирует кириллический шрифт в документе и делает его активным.
export async function registerCyrillicFont(doc: jsPDF): Promise<void> {
  const base64 = await loadFontBase64();
  doc.addFileToVFS('DejaVuSans.ttf', base64);
  doc.addFont('DejaVuSans.ttf', FONT_NAME, 'normal');
  doc.setFont(FONT_NAME, 'normal');
}
