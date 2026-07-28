export default function BackgroundEffects() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-[100px] animate-pulse" />
      <div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-orange-600/10 rounded-full blur-[80px] animate-pulse"
        style={{ animationDelay: '1s' }}
      />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(249, 115, 22, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(249, 115, 22, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />
    </div>
  );
}
