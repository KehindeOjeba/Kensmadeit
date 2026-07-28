"use client";

import Image from "next/image";
import Logo from "@/public/kensmadeitlogo.png";

interface LogoCircleProps {
  isHovered: boolean;
  onMouseEnter: () => void;
}

export default function LogoCircle({ isHovered, onMouseEnter }: LogoCircleProps) {
  return (
    <div
      className={`
        relative w-[200px] h-[200px] flex items-center justify-center cursor-pointer
        transition-all duration-500 ease-out
        ${isHovered ? "scale-0 opacity-0 pointer-events-none" : "scale-100 opacity-100"}
      `}
      onMouseEnter={onMouseEnter}
    >
    
      <div className="absolute inset-0 rounded-full border-2 border-orange-500/30 animate-glow-pulse" />
      <div className="absolute inset-2 rounded-full border border-orange-500/20" />
      <div className="absolute inset-4 rounded-full border border-orange-500/10" />

     
      <div className="absolute inset-0 rounded-full overflow-hidden">
        <div
          className="absolute inset-[-50%] animate-border-rotate"
          style={{
            background:
              "conic-gradient(from 0deg, transparent, rgba(249, 115, 22, 0.5), transparent, rgba(249, 115, 22, 0.5), transparent)",
          }}
        />
      </div>

    
      <div className="absolute inset-[3px] rounded-full bg-black flex items-center justify-center overflow-hidden">
        <Image src={Logo} alt="Logo" width={200} height={200} />
      </div>

    
      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap">
        <span className="text-orange-500/60 text-sm tracking-wider uppercase">
          Hover to explore
        </span>
      </div>
    </div>
  );
}
