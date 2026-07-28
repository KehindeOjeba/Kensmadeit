export default function CornerDecorations() {
  return (
    <>
      {/* Top-left corner */}
      <div className="absolute top-20 left-8 w-px h-20 bg-gradient-to-b from-orange-500/50 to-transparent" />
      <div className="absolute top-20 left-8 h-px w-20 bg-gradient-to-r from-orange-500/50 to-transparent" />

      {/* Bottom-right corner */}
      <div className="absolute bottom-20 right-8 w-px h-20 bg-gradient-to-t from-orange-500/50 to-transparent" />
      <div className="absolute bottom-20 right-8 h-px w-20 bg-gradient-to-l from-orange-500/50 to-transparent" />
    </>
  );
}
