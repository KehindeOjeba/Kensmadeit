"use client";

import Image from "next/image";
import dynamic from 'next/dynamic'

const AnimatedCart = dynamic(
  () => import('./AnimatedCart'),
  { ssr: false }
)

interface HeaderProps {
  cartCount: number;
  onCartClick: () => void;
}

export default function Header({ cartCount, onCartClick }: HeaderProps) {
  return (
    <header className="absolute top-0 left-0 right-0 z-20 px-8 py-6">
      <nav className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <Image
            src="/kensmadeit-logo.png"
            alt="Kensmadeit"
            width={50}
            height={50}
          />
          <span className="text-white font-bold text-xl tracking-tight">
            KensMadeIt
          </span>
        </div>
        <div className="flex items-center gap-6">
          <button className="text-white/70 hover:text-orange-400 transition-colors"></button>
          <AnimatedCart itemCount={cartCount} onClick={onCartClick} />
        </div>
      </nav>
    </header>
  );
}
