'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="text-center max-w-md">
        <div className="mb-6">
          <Image
            src="/404.png"
            alt="404 Not Found"
            className="w-32 h-32 mx-auto mb-4"
            width={320}
            height={320}
          />
        </div>

        <h1 className="font-pacifico text-4xl text-primary mb-2  text-rose-600">
          Oops!
        </h1>
        <p className="text-xl font-baloo mb-6 text-foreground ">
          A páagina não foi encontrada
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button className="font-baloo flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded hover:bg-rose-700 transition">
            <Link href="/">Voltar a Home</Link>
          </Button>
        </div>
      </div>

      {/* Background decorative elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-4 -left-4 w-20 h-20 rounded-full bg-primary/10"></div>
        <div className="absolute top-1/4 right-10 w-12 h-12 rounded-full bg-secondary/20"></div>
        <div className="absolute bottom-1/3 left-1/4 w-16 h-16 rounded-full bg-accent/15"></div>
        <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-primary/5"></div>
      </div>
    </div>
  );
}
