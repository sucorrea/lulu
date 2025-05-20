import { useState, useRef } from 'react';
import { Camera } from 'lucide-react';
import Image from 'next/image';

const PhotoCameraUploader = () => {
  const [photo, setPhoto] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const openCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });

      if (videoRef.current) {
        setShowCamera(true);
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
    } catch (err) {
      console.error('Erro ao acessar a câmera:', err);
      alert(
        'Não foi possível acessar a câmera. Verifique as permissões do navegador.'
      );
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const photoData = canvas.toDataURL('image/jpeg');
        setPhoto(photoData);
        closeCamera();
      }
    }
  };

  const closeCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setShowCamera(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhoto(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {photo ? (
        <div className="relative">
          <Image
            src={photo}
            alt="Foto do usuário"
            className="w-full h-auto rounded-lg"
            width={500}
            height={500}
          />
          <div className="absolute bottom-2 right-2 flex gap-2">
            <button
              onClick={() => setPhoto(null)}
              className="bg-red-500 text-white p-2 rounded-full"
            >
              Remover
            </button>
          </div>
        </div>
      ) : showCamera ? (
        <div className="relative">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-auto rounded-lg"
          />
          <div className="absolute bottom-2 right-2 flex gap-2">
            <button
              onClick={capturePhoto}
              className="bg-green-500 text-white p-2 rounded-full"
            >
              Capturar
            </button>
            <button
              onClick={closeCamera}
              className="bg-red-500 text-white p-2 rounded-full"
            >
              Cancelar
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <p className="text-gray-500 mb-4">
              Selecione uma foto ou use a câmera
            </p>
            <div className="flex justify-center gap-4">
              <label className="bg-primary text-white px-4 py-2 rounded-md cursor-pointer hover:bg-primary/90 transition-colors">
                Upload
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
              <button
                onClick={openCamera}
                className="bg-secondary text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-secondary/90 transition-colors"
              >
                <Camera size={18} />
                Câmera
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoCameraUploader;
