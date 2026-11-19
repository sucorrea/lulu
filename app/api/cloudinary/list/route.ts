import { NextResponse } from 'next/server';

import { listAllGalleryUrls } from '@/lib/cloudinary-gallery';

export const GET = async () => {
  try {
    const urls = await listAllGalleryUrls();

    return NextResponse.json({ urls });
  } catch (error) {
    console.error('Cloudinary list error:', error);
    return NextResponse.json(
      { error: 'Erro ao listar imagens da galeria' },
      { status: 500 }
    );
  }
};
