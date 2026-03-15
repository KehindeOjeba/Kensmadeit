// "use client"

// import { useState } from 'react';
// import { Heart, ArrowRight } from 'lucide-react';
// import Image from 'next/image';

// // Mock components - these will need to be created
// const AnimatedCart = ({ itemCount, onClick }: { itemCount: number; onClick: () => void }) => (
//   <button onClick={onClick} className="text-white/70 hover:text-orange-400 transition-colors relative">
//     <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
//     </svg>
//     {itemCount > 0 && (
//       <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
//         {itemCount}
//       </span>
//     )}
//   </button>
// );

// const ProductsPage = ({ onClose, onAddToCart, cartCount }: { onClose: () => void; onAddToCart: (product: typeof products[0]) => void; cartCount: number }) => (
//   <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
//     <div className="bg-gray-900 rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-2xl font-bold text-white">Products</h2>
//         <button onClick={onClose} className="text-white/70 hover:text-white">
//           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//           </svg>
//         </button>
//       </div>
//       <p className="text-white/70">Products page coming soon...</p>
//     </div>
//   </div>
// );

// const CartPage = ({ items, onClose, onRemoveItem, onUpdateQuantity, onStartShopping }: { 
//   items: CartItem[]; 
//   onClose: () => void; 
//   onRemoveItem: (id: number) => void; 
//   onUpdateQuantity: (id: number, quantity: number) => void; 
//   onStartShopping: () => void; 
// }) => (
//   <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
//     <div className="bg-gray-900 rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-2xl font-bold text-white">Cart ({items.length})</h2>
//         <button onClick={onClose} className="text-white/70 hover:text-white">
//           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//           </svg>
//         </button>
//       </div>
//       <p className="text-white/70">Cart page coming soon...</p>
//       <button onClick={onStartShopping} className="mt-4 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-full">
//         Continue Shopping
//       </button>
//     </div>
//   </div>
// );

// // Mock products data
// const products = [
//   { id: 1, name: "Premium Leather Shoe", price: 299.99, image: "/hero-shoe.png" },
//   { id: 2, name: "Classic Oxford", price: 249.99, image: "/hero-shoe.png" },
// ];

// type CartItem = typeof products[0] & { quantity: number };

// export default function HomePage() {
//   const [isHovered, setIsHovered] = useState(false);
//   const [isButtonHovered, setIsButtonHovered] = useState(false);
//   const [showProducts, setShowProducts] = useState(false);
//   const [showCart, setShowCart] = useState(false);
//   const [cart, setCart] = useState<CartItem[]>([]);

//   const addToCart = (product: typeof products[0]) => {
//     setCart((prevCart) => {
//       const existingItem = prevCart.find((item) => item.id === product.id);

//       if (existingItem) {
//         return prevCart.map((item) =>
//           item.id === product.id
//             ? { ...item, quantity: item.quantity + 1 }
//             : item
//         );
//       }

//       return [...prevCart, { ...product, quantity: 1 }];
//     });
//   };

//   const removeFromCart = (productId: number) => {
//     setCart((prevCart) =>
//       prevCart.filter((item) => item.id !== productId)
//     );
//   };

//   const updateQuantity = (productId: number, quantity: number) => {
//     if (quantity <= 0) {
//       removeFromCart(productId);
//       return;
//     }

//     setCart((prevCart) =>
//       prevCart.map((item) =>
//         item.id === productId ? { ...item, quantity } : item
//       )
//     );
//   };

//   const handleStartShopping = () => {
//     setShowProducts(true);
//     setShowCart(false);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-orange-900 flex flex-col items-center justify-center relative overflow-hidden">
//       {/* Background Effects */}
//       <div className="absolute inset-0 overflow-hidden">
//         {/* Gradient orbs */}
//         <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-[100px] animate-pulse" />
//         <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-orange-600/10 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '1s' }} />
        
//         {/* Grid pattern */}
//         <div 
//           className="absolute inset-0 opacity-[0.03]"
//           style={{
//             backgroundImage: `
//               linear-gradient(rgba(249, 115, 22, 0.3) 1px, transparent 1px),
//               linear-gradient(90deg, rgba(249, 115, 22, 0.3) 1px, transparent 1px)
//             `,
//             backgroundSize: '50px 50px'
//           }}
//         />
//       </div>

//       {/* Header */}
//       <header className="absolute top-0 left-0 right-0 z-20 px-8 py-6">
//         <nav className="flex items-center justify-between max-w-7xl mx-auto">
//           <div className="flex items-center gap-2">
//             <Image 
//               src="/kensmadeit-logo.png" 
//               alt="Kensmadeit" 
//               width={40}
//               height={40}
//               className="object-contain"
//             />
//             <span className="text-white font-bold text-xl tracking-tight">KensMadeIt</span>
//           </div>
//           <div className="flex items-center gap-6">
//             <button className="text-white/70 hover:text-orange-400 transition-colors">
//               <Heart className="w-6 h-6" />
//             </button>
//             <AnimatedCart 
//               itemCount={cart.length} 
//               onClick={() => setShowCart(true)}
//             />
//           </div>
//         </nav>
//       </header>

//       {/* Main Animation Container */}
//       <div className="relative z-10 flex items-center justify-center">
        
//         {/* Logo Circle - Always visible, hover target */}
//        <div 
//           className={`
//             relative w-[200px] h-[200px] flex items-center justify-center cursor-pointer
//             transition-all duration-500 ease-out
//             ${isHovered ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100'}
//           `}
//           onMouseEnter={() => setIsHovered(true)}
//         >
//           {/* Glowing border rings */}
//           <div className="absolute inset-0 rounded-full border-2 border-orange-500/30 animate-glow-pulse" />
//           <div className="absolute inset-2 rounded-full border border-orange-500/20" />
//           <div className="absolute inset-4 rounded-full border border-orange-500/10" />
          
//           {/* Rotating gradient border */}
//           <div className="absolute inset-0 rounded-full overflow-hidden">
//             <div 
//               className="absolute inset-[-50%] animate-border-rotate"
//               style={{
//                 background: 'conic-gradient(from 0deg, transparent, rgba(249, 115, 22, 0.5), transparent, rgba(249, 115, 22, 0.5), transparent)',
//               }}
//             />
//           </div>
          
//           {/* Inner circle with logo */}
//           <div className="absolute inset-[3px] rounded-full bg-black flex items-center justify-center overflow-hidden">
//             <Image 
//               src="/kensmadeit-logo.png" 
//               alt="Kensmadeit Logo" 
//               fill
//               className="object-cover animate-float"
//             />
//           </div>
          
//           {/* Hover hint text */}
//           <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap">
//             <span className="text-orange-500/60 text-sm tracking-wider uppercase">Hover to explore</span>
//           </div>
//         </div>

//         {/* Card - Appears on hover */}
//         <div 
//           className={`
//             absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
//             overflow-hidden cursor-default
//             transition-all duration-500 ease-out
//             ${isHovered 
//               ? 'w-[320px] sm:w-[500px] md:w-[600px] h-[400px] sm:h-[350px] rounded-3xl opacity-100 scale-100' 
//               : 'w-[200px] h-[200px] rounded-full opacity-0 scale-90 pointer-events-none'
//             }
//           `}
//           style={{
//             background: 'linear-gradient(135deg, rgba(20, 20, 20, 0.95) 0%, rgba(10, 10, 10, 0.98) 100%)',
//             boxShadow: '0 0 40px rgba(249, 115, 22, 0.3), 0 0 80px rgba(249, 115, 22, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
//           }}
//           onMouseLeave={() => setIsHovered(false)}
//         >
//           {/* Card border glow */}
//           <div className="absolute inset-0 rounded-3xl border border-orange-500/30" />
          
//           {/* Content Container */}
//           <div className="relative h-full flex flex-col sm:flex-row items-center justify-between p-6 sm:p-10">
//             {/* Left side - Text Content */}
//             <div className="flex flex-col items-start gap-4 sm:gap-6 max-w-[280px] z-10">
//               <h2 
//                 className={`
//                   text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight
//                   transition-all duration-500
//                   ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
//                 `}
//                 style={{
//                   textShadow: '0 0 30px rgba(249, 115, 22, 0.5)',
//                   transitionDelay: isHovered ? '100ms' : '0ms',
//                 }}
//               >
//                 <span className="text-orange-500">KENS</span>MADEIT
//               </h2>
              
//               <p 
//                 className={`
//                   text-sm sm:text-base text-white/70 leading-relaxed
//                   transition-all duration-500
//                   ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
//                 `}
//                 style={{ transitionDelay: isHovered ? '200ms' : '0ms' }}
//               >
//                 Handcrafted with precision. Our premium leather shoes blend timeless elegance with modern comfort. Each pair tells a story of artisan craftsmanship.
//               </p>
              
//               <button 
//                 className={`
//                   group flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 
//                   text-white font-semibold rounded-full transition-all duration-300
//                   hover:shadow-glow-lg hover:scale-105 active:scale-95
//                   ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
//                 `}
//                 style={{ transitionDelay: isHovered ? '300ms' : '0ms' }}
//                 onMouseEnter={() => setIsButtonHovered(true)}
//                 onMouseLeave={() => setIsButtonHovered(false)}
//                 onClick={() => setShowProducts(true)}
//               >
//                Click to Shop your favs
//                 <ArrowRight 
//                   className={`
//                     w-4 h-4 transition-transform duration-300
//                     ${isButtonHovered ? 'translate-x-1' : ''}
//                   `} 
//                 />
//               </button>
//             </div>

//             {/* Right side - Shoe Image */}
//             <div 
//               className={`
//                 absolute sm:relative right-0 top-1/2 sm:top-auto -translate-y-1/2 sm:translate-y-0
//                 transition-all duration-700 ease-out
//                 ${isHovered 
//                   ? 'translate-x-0 sm:translate-x-0 opacity-100' 
//                   : 'translate-x-[100px] sm:translate-x-[100px] opacity-0'
//                 }
//               `}
//               style={{ transitionDelay: isHovered ? '150ms' : '0ms' }}
//             >
//               <Image 
//                 src="/hero-shoe.png" 
//                 alt="Handmade Leather Shoe" 
//                 width={300}
//                 height={300}
//                 className="object-contain drop-shadow-2xl"
//                 style={{
//                   filter: 'drop-shadow(0 20px 40px rgba(139, 69, 19, 0.4))',
//                   transform: 'rotate(-15deg)',
//                 }}
//               />
//             </div>
//           </div>

//           {/* Decorative elements */}
//           <div className="absolute top-4 right-4 w-20 h-20 border border-orange-500/20 rounded-full" />
//           <div className="absolute bottom-4 left-4 w-12 h-12 border border-orange-500/10 rounded-full" />
//         </div>
//       </div>

//       {/* Footer text */}
//       <div className="absolute bottom-8 left-0 right-0 text-center z-10">
//         <p className="text-white/40 text-sm tracking-widest uppercase">
//           Handmade Leather Footwear
//         </p>
//       </div>

//       {/* Corner decorations */}
//       <div className="absolute top-20 left-8 w-px h-20 bg-gradient-to-b from-orange-500/50 to-transparent" />
//       <div className="absolute top-20 left-8 h-px w-20 bg-gradient-to-r from-orange-500/50 to-transparent" />
//       <div className="absolute bottom-20 right-8 w-px h-20 bg-gradient-to-t from-orange-500/50 to-transparent" />
//       <div className="absolute bottom-20 right-8 h-px w-20 bg-gradient-to-l from-orange-500/50 to-transparent" />

//       {/* Products Page */}
//       {showProducts && (
//         <ProductsPage
//           onClose={() => setShowProducts(false)}
//           onAddToCart={addToCart}
//           cartCount={cart.length}
//         />
//       )}

//       {/* Cart Page */}
//       {showCart && (
//         <CartPage
//           items={cart}
//           onClose={() => setShowCart(false)}
//           onRemoveItem={removeFromCart}
//           onUpdateQuantity={updateQuantity}
//           onStartShopping={handleStartShopping}
//         />
//       )}
//     </div>
//   );
// }
import React from 'react'

const Homepage = () => {
  return (
    <div>Homepage</div>
  )
}

export default Homepage