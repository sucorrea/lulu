import { NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';

export const GET = async () => {
  try {
    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: 'gallery/',
      max_results: 500,
      resource_type: 'image',
    });

    const urls: string[] = result.resources.map(
      (resource: { secure_url: string }) => resource.secure_url
    );

    return NextResponse.json({ urls });
  } catch (error) {
    console.error('Cloudinary list error:', error);
    return NextResponse.json(
      { error: 'Erro ao listar imagens da galeria' },
      { status: 500 }
    );
  }
};
