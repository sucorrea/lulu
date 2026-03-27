import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';
import cloudinary from '@/lib/cloudinary';

export const POST = async (request: NextRequest) => {
  try {
    const authHeader = request.headers.get('authorization');

    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const idToken = authHeader.split('Bearer ')[1];

    let decodedToken;
    try {
      decodedToken = await adminAuth.verifyIdToken(idToken);
    } catch {
      return NextResponse.json(
        { error: 'Token inválido ou expirado' },
        { status: 401 }
      );
    }

    const callerUser = await adminAuth.getUser(decodedToken.uid);
    const callerClaims =
      (callerUser.customClaims as Record<string, unknown>) ?? {};
    if (callerClaims.admin !== true) {
      return NextResponse.json(
        { error: 'Acesso restrito a administradores' },
        { status: 403 }
      );
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
