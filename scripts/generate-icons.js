import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// 1. Generate SVG Upstox icon
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#7b2cbf" />
      <stop offset="40%" stop-color="#5c2494" />
      <stop offset="100%" stop-color="#3c1361" />
    </linearGradient>
    <linearGradient id="tickGrad" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#10b981" />
      <stop offset="100%" stop-color="#34d399" />
    </linearGradient>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#000000" flood-opacity="0.35" />
    </filter>
  </defs>

  <!-- Background Squircle -->
  <rect width="512" height="512" rx="112" fill="url(#bgGrad)" />

  <!-- Inner subtle ambient ring -->
  <rect x="12" y="12" width="488" height="488" rx="100" fill="none" stroke="#ffffff" stroke-width="2" stroke-opacity="0.12" />

  <!-- Upstox Stylized 'U' Emblem -->
  <g filter="url(#shadow)">
    <!-- Left U stem -->
    <path d="M 148 140
             L 148 270
             C 148 340 192 376 256 376
             C 320 376 364 340 364 270
             L 364 210
             C 364 196 352 184 338 184
             C 324 184 312 196 312 210
             L 312 270
             C 312 312 288 330 256 330
             C 224 330 200 312 200 270
             L 200 140
             C 200 126 188 114 174 114
             C 160 114 148 126 148 140 Z"
          fill="#ffffff" />

    <!-- Upstox signature upward dynamic growth arrow / accent -->
    <path d="M 338 124
             L 396 182
             C 404 190 404 202 396 210
             C 388 218 376 218 368 210
             L 340 182
             L 340 240
             C 340 254 328 266 314 266
             C 300 266 288 254 288 240
             L 288 152
             C 288 136 300 124 316 124
             L 338 124 Z"
          fill="url(#tickGrad)" />
  </g>

  <!-- Small Upstox trademark dot -->
  <circle cx="368" cy="140" r="10" fill="#34d399" />
</svg>`;

fs.writeFileSync(path.join(publicDir, 'icon.svg'), svgContent, 'utf-8');

// Function to generate raw PNG file without external dependencies using pure Node.js zlib
function generateUpstoxPng(size, isMaskable = false) {
  // RGBA buffer
  const width = size;
  const height = size;
  const buffer = Buffer.alloc(width * height * 4);

  // Center & Radius calculation
  const cx = width / 2;
  const cy = height / 2;
  const squircleRadius = isMaskable ? width * 0.5 : width * 0.22;

  // Render pixels
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;

      // Distance from center
      const dx = x - cx;
      const dy = y - cy;
      const distFromCenter = Math.sqrt(dx * dx + dy * dy);

      // Check if inside squircle or full canvas for maskable
      let inBackground = false;
      if (isMaskable) {
        inBackground = true;
      } else {
        // Rounded rectangle check
        const halfW = width * 0.46;
        const halfH = height * 0.46;
        const cornerR = squircleRadius;
        const qx = Math.abs(dx) - (halfW - cornerR);
        const qy = Math.abs(dy) - (halfH - cornerR);
        if (qx <= 0 || qy <= 0) {
          inBackground = (Math.abs(dx) <= halfW && Math.abs(dy) <= halfH);
        } else {
          inBackground = (qx * qx + qy * qy <= cornerR * cornerR);
        }
      }

      if (!inBackground) {
        // Transparent
        buffer[idx] = 0;
        buffer[idx + 1] = 0;
        buffer[idx + 2] = 0;
        buffer[idx + 3] = 0;
        continue;
      }

      // Upstox Royal Purple Gradient: from #7b2cbf (top left) to #3c1361 (bottom right)
      const gradT = (x / width) * 0.5 + (y / height) * 0.5;
      let r = Math.round(123 - gradT * 63); // 123 -> 60
      let g = Math.round(44 - gradT * 25);  // 44 -> 19
      let b = Math.round(191 - gradT * 94); // 191 -> 97
      let a = 255;

      // Safe zone scaling factor for emblem
      const scale = isMaskable ? 0.72 : 0.88;
      const normX = (dx / (cx * scale)); // -1 to 1 approx
      const normY = (dy / (cy * scale)); // -1 to 1 approx

      // Draw stylized Upstox 'u' shape
      // Left arm: x in [-0.48, -0.22], y in [-0.5, 0.1]
      // Bottom curve: center at (0, 0.1), inner radius 0.22, outer radius 0.48
      // Right arm: x in [0.22, 0.48], y in [-0.2, 0.1]
      const distCurve = Math.sqrt(normX * normX + Math.pow(normY - 0.1, 2));

      const inLeftArm = (normX >= -0.46 && normX <= -0.22 && normY >= -0.52 && normY <= 0.12);
      const inBottomCurve = (normY >= 0.1 && distCurve >= 0.22 && distCurve <= 0.46);
      const inRightArm = (normX >= 0.22 && normX <= 0.46 && normY >= -0.22 && normY <= 0.12);

      // Green dynamic tick arrow on top right
      // Line from (0.28, -0.1) pointing to (0.54, -0.48)
      const inGreenArrow = (
        normX >= 0.20 && normX <= 0.58 &&
        normY >= -0.55 && normY <= -0.15 &&
        Math.abs(normX - normY - 0.75) <= 0.18
      ) || (normX >= 0.44 && normX <= 0.58 && normY >= -0.54 && normY <= -0.38) ||
      (normX >= 0.32 && normX <= 0.58 && normY >= -0.54 && normY <= -0.42);

      if (inLeftArm || inBottomCurve || inRightArm) {
        // Pure White U-stem
        r = 255;
        g = 255;
        b = 255;
      } else if (inGreenArrow) {
        // Vibrant Upstox Green
        r = 16;
        g = 185;
        b = 129;
      }

      buffer[idx] = r;
      buffer[idx + 1] = g;
      buffer[idx + 2] = b;
      buffer[idx + 3] = a;
    }
  }

  // Construct PNG file from RGBA buffer
  return createPngBuffer(width, height, buffer);
}

function createPngBuffer(width, height, rgbaBuffer) {
  // PNG signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr.writeUInt8(8, 8); // bit depth 8
  ihdr.writeUInt8(6, 9); // color type 6 (RGBA)
  ihdr.writeUInt8(0, 10); // compression
  ihdr.writeUInt8(0, 11); // filter
  ihdr.writeUInt8(0, 12); // interlace

  const ihdrChunk = createChunk('IHDR', ihdr);

  // Scanline data (filter byte 0 prefix for each row)
  const scanlines = Buffer.alloc(height * (width * 4 + 1));
  let srcOffset = 0;
  let dstOffset = 0;
  for (let y = 0; y < height; y++) {
    scanlines[dstOffset++] = 0; // Filter: None
    rgbaBuffer.copy(scanlines, dstOffset, srcOffset, srcOffset + width * 4);
    dstOffset += width * 4;
    srcOffset += width * 4;
  }

  // Deflate compressed data
  const compressedData = zlib.deflateSync(scanlines, { level: 9 });
  const idatChunk = createChunk('IDAT', compressedData);

  // IEND chunk
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

// CRC32 table
const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    if (c & 1) c = 0xedb88320 ^ (c >>> 1);
    else c = c >>> 1;
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function createChunk(type, data) {
  const len = data.length;
  const chunk = Buffer.alloc(len + 12);
  chunk.writeUInt32BE(len, 0);
  chunk.write(type, 4, 4, 'ascii');
  data.copy(chunk, 8);

  const crcTarget = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crcVal = crc32(crcTarget);
  chunk.writeUInt32BE(crcVal, len + 8);
  return chunk;
}

// Generate the required files:
console.log('Generating 192x192 icon...');
const png192 = generateUpstoxPng(192, false);
fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), png192);

console.log('Generating 512x512 icon...');
const png512 = generateUpstoxPng(512, false);
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), png512);

console.log('Generating 512x512 maskable icon...');
const pngMaskable = generateUpstoxPng(512, true);
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), pngMaskable);

console.log('Generating 180x180 apple touch icon...');
const pngApple = generateUpstoxPng(180, false);
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), pngApple);

// Favicon 32x32
const png32 = generateUpstoxPng(32, false);
fs.writeFileSync(path.join(publicDir, 'favicon.ico'), png32);

console.log('All Upstox PWA icons successfully generated in /public!');
