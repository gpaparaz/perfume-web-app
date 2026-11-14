import { useState } from "react";

interface BrandLogoProps {
  name: string;
  logoUrl: string | null | undefined;
  size?: "sm" | "lg";
}

// Brand logo on a light plate (Fragrantica logos are designed for a white
// background). Falls back to a serif monogram when there is no logo or the
// image fails to load.
export default function BrandLogo({ name, logoUrl, size = "sm" }: BrandLogoProps) {
  // Remember which URL failed, so a different logo for a recycled row
  // (virtualized list) gets its own chance to load.
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const showImage = !!logoUrl && failedUrl !== logoUrl;
  const initial = name.trim().charAt(0).toUpperCase() || "?";

  return (
    <span className={`brand-logo brand-logo-${size} ${showImage ? "has-image" : ""}`}>
      {showImage ? (
        <img
          src={logoUrl}
          alt=""
          loading="lazy"
          onError={() => setFailedUrl(logoUrl)}
        />
      ) : (
        <span aria-hidden="true">{initial}</span>
      )}
    </span>
  );
}
