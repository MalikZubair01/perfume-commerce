import { useRef, useState } from "react";

/**
 * Lightweight magnifier: on hover (desktop) shows a zoomed lens following the
 * cursor; on touch devices it simply displays the image since lens-style
 * zoom doesn't translate well to touch interactions.
 */
function ImageMagnifier({ src, alt, zoom = 2.2 }) {
  const containerRef = useRef(null);
  const [showZoom, setShowZoom] = useState(false);
  const [bgPos, setBgPos] = useState("0% 0%");

  const handleMouseMove = (e) => {
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setBgPos(`${x}% ${y}%`);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-square overflow-hidden rounded-2xl border border-gold/20 bg-black/60 cursor-zoom-in select-none"
      onMouseEnter={() => setShowZoom(true)}
      onMouseLeave={() => setShowZoom(false)}
      onMouseMove={handleMouseMove}
    >
      <img
        src={src}
        alt={alt}
        className="h-full w-full object-cover"
        draggable={false}
      />

      {showZoom && (
        <div
          className="hidden md:block absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `url(${src})`,
            backgroundPosition: bgPos,
            backgroundSize: `${zoom * 100}%`,
            backgroundRepeat: "no-repeat",
          }}
        />
      )}

      <span className="md:hidden absolute bottom-3 right-3 text-[10px] uppercase tracking-widest text-gold/70 bg-black/60 border border-gold/20 rounded-full px-2 py-1">
        Tap image to zoom
      </span>
    </div>
  );
}

export default ImageMagnifier;
