import { NextRequest, NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';
import { verifyAdminRequest } from '@/lib/verify-admin-request';

export const POST = async (request: NextRequest) => {
  try {
    const authError = await verifyAdminRequest(request);
    if (authError) {
      return authError;
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const folder = formData.get('folder') as string | null;
    const publicId = formData.get('publicId') as string | null;

    if (!file || !folder || !publicId) {
      return NextResponse.json(
        { error: 'file, folder e publicId são obrigatórios' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await new Promise<{ secure_url: string; public_id: string }>(
      (resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder,
              public_id: publicId,
              overwrite: true,
              resource_type: 'image',
            },
            (error, result) => {
              if (error || !result) {
                reject(error ?? new Error('Upload falhou'));
              } else {
                resolve(result);
              }
            }
          )
          .end(buffer);
      }
    );

    return NextResponse.json({
      url: result.secure_url,
      publicId: result.public_id,
    });
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return NextResponse.json(
      { error: 'Erro ao fazer upload da imagem' },
      { status: 500 }
    );
  }
};
