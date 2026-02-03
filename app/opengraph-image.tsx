import { ImageResponse } from 'next/og';

export const alt = 'Luluzinha - O site das Lulus';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  const year = new Date().getFullYear();

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#fdfbf7',
          fontFamily: 'system-ui, sans-serif',
          border: '8px solid #e4312b',
          borderRadius: 24,
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 16,
            padding: 48,
          }}
        >
          <div
            style={{
              display: 'flex',
              fontSize: 88,
              fontWeight: 800,
              color: '#e4312b',
              letterSpacing: '-2px',
              textShadow: '2px 2px 0 rgba(0,0,0,0.06)',
            }}
          >
            Luluzinha
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: 42,
              color: '#111111',
              fontWeight: 600,
            }}
          >
            {year}
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: 28,
              color: '#6b6256',
              marginTop: 8,
            }}
          >
            O site das Lulus
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
