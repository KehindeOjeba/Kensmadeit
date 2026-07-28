"use client";
import { useState } from "react";
import BackgroundEffects from "@/components/home/BackgroundEffects";
import Header from "@/components/home/Header";
import LogoCircle from "@/components/home/LogoCircle";
import HeroCard from "@/components/home/HeroCard";
import FooterText from "@/components/home/FooterText";
import CornerDecorations from "@/components/home/CornerDecorations";

export default function HomePage() {
  const [isHovered, setIsHovered] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);

  // const addToCart = (product: (typeof products)[0]) => {
  //   // TODO: Implement cart functionality when needed
  // };

  const removeFromCart = (productId: string | number) => {
    // TODO: Implement cart functionality when needed
  };

  const updateQuantity = (productId: string | number, quantity: number) => {
    // TODO: Implement cart functionality when needed
  };

  const handleStartShopping = () => {
    // TODO: Implement when cart modal is needed
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-black via-gray-900 to-orange-900 flex flex-col items-center justify-center relative overflow-hidden">
      <BackgroundEffects />

      <Header cartCount={0} onCartClick={() => {}} />

      <div className="relative z-10 flex items-center justify-center">
        <LogoCircle
          isHovered={isHovered}
          onMouseEnter={() => setIsHovered(true)}
        />

        <HeroCard
          isHovered={isHovered}
          isButtonHovered={isButtonHovered}
          onMouseLeave={() => setIsHovered(false)}
          onButtonEnter={() => setIsButtonHovered(true)}
          onButtonLeave={() => setIsButtonHovered(false)}
        />
      </div>


      <FooterText />


      <CornerDecorations />
    </div>
  );
}
