"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

interface HeroCardProps {
  isHovered: boolean;
  isButtonHovered: boolean;
  onMouseLeave: () => void;
  onButtonEnter: () => void;
  onButtonLeave: () => void;
}

export default function HeroCard({
  isHovered,
  isButtonHovered,
  onMouseLeave,
  onButtonEnter,
  onButtonLeave,
}: HeroCardProps) {
  const router = useRouter();

  const handleShopClick = () => {
    router.push('/shop');
  };
  return (
    <div
      className={`
        absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
        overflow-hidden cursor-default
        transition-all duration-500 ease-out
        ${
          isHovered
            ? "w-[320px] sm:w-[500px] md:w-[600px] h-[400px] sm:h-[350px] rounded-3xl opacity-100 scale-100"
            : "w-[200px] h-[200px] rounded-full opacity-0 scale-90 pointer-events-none"
        }
      `}
      style={{
        background:
          "linear-gradient(135deg, rgba(20, 20, 20, 0.95) 0%, rgba(10, 10, 10, 0.98) 100%)",
        boxShadow:
          "0 0 40px rgba(249, 115, 22, 0.3), 0 0 80px rgba(249, 115, 22, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
      }}
      onMouseLeave={onMouseLeave}
    >
   
      <div className="absolute inset-0 rounded-3xl border border-orange-500/30" />

   
      <div className="relative h-full flex flex-col sm:flex-row items-center justify-between p-6 sm:p-10">
      
        <div className="flex flex-col items-start gap-4 sm:gap-6 max-w-[280px] z-10">
          <h2
            className={`
              text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight
              transition-all duration-500
              ${isHovered ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}
            `}
            style={{
              textShadow: "0 0 30px rgba(249, 115, 22, 0.5)",
              transitionDelay: isHovered ? "100ms" : "0ms",
            }}
          >
            <span className="text-orange-500">KENS</span>MADEIT
          </h2>

          <p
            className={`
              text-sm sm:text-base text-white/70 leading-relaxed
              transition-all duration-500
              ${isHovered ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}
            `}
            style={{ transitionDelay: isHovered ? "200ms" : "0ms" }}
          >
            Handcrafted with precision. Our premium leather shoes blend timeless
            elegance with modern comfort. Each pair tells a story of artisan
            craftsmanship.
          </p>

          <button
            className={`
              group flex items-center cursor-pointer gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 
              text-white font-semibold rounded-full transition-all duration-300
              hover:shadow-glow-lg hover:scale-105 active:scale-95
              ${isHovered ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}
            `}
            style={{ transitionDelay: isHovered ? "300ms" : "0ms" }}
            onMouseEnter={onButtonEnter}
            onMouseLeave={onButtonLeave}
            onClick={handleShopClick}
          >
            Click to Shop 
            <ArrowRight
              className={`
                w-4 h-4 transition-transform duration-300
                ${isButtonHovered ? "translate-x-1" : ""}
              `}
            />
          </button>
        </div>

       
        <div
          className={`
            absolute sm:relative right-0 top-1/2 sm:top-auto -translate-y-1/2 sm:translate-y-0
            transition-all duration-700 ease-out
            ${
              isHovered
                ? "translate-x-0 sm:translate-x-0 opacity-100"
                : "translate-x-[100px] sm:translate-x-[100px] opacity-0"
            }
          `}
          style={{ transitionDelay: isHovered ? "150ms" : "0ms" }}
        >
          <Image
            src="/hero-shoe.png"
            alt="Handmade Leather Shoe"
            width={300}
            height={300}
            className="object-contain drop-shadow-2xl"
            style={{
              filter: "drop-shadow(0 20px 40px rgba(139, 69, 19, 0.4))",
              transform: "rotate(-15deg)",
            }}
          />
        </div>
      </div>

     
      <div className="absolute top-4 right-4 w-20 h-20 border border-orange-500/20 rounded-full" />
      <div className="absolute bottom-4 left-4 w-12 h-12 border border-orange-500/10 rounded-full" />
    </div>
  );
}
