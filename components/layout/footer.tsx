import { Gift, Instagram, LayoutDashboardIcon } from 'lucide-react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="fixed bottom-0 w-full shadow-lg p-3 bg-background">
      <div className="container mx-auto flex justify-around">
        <Link className="flex flex-col items-center text-pink-600" href={'/'}>
          <Gift size={20} />
          <span className="text-xs mt-1">Amigos</span>
        </Link>

        <Link className="flex flex-col items-center " href={'/dashboard'}>
          <LayoutDashboardIcon size={20} />
          <span className="text-xs mt-1">Dashboard</span>
        </Link>

        <button className="flex flex-col items-center ">
          <Instagram size={20} />
          <span className="text-xs mt-1">Social</span>
        </button>
      </div>
    </footer>
  );
};

export default Footer;
