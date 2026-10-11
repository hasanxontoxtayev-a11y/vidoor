import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Vidoor — VidIQ Bepul Muqobili & YouTube Analitika',
    short_name: 'Vidoor',
    description: "YouTube kanallar daromadi, 7 kunlik ko'rishlari va eng maqbul video yuklash vaqtini tahlil qiluvchi 100% bepul platforma.",
    start_url: '/',
    display: 'standalone',
    background_color: '#0f172a',
    theme_color: '#10b981',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
