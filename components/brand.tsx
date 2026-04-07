import Image from "next/image";
import Link from "next/link";

type BrandProps = {
  compact?: boolean;
};

export function Brand({ compact = false }: BrandProps) {
  return (
    <Link className="brand" href="/">
      <span className="brand-mark">
        <Image
          src="/logo.png"
          alt="Klio"
          width={compact ? 36 : 44}
          height={compact ? 36 : 44}
          priority
          style={{ borderRadius: 12 }}
        />
      </span>
      <span>
        <span className="logo">Klio</span>
        {!compact ? <span className="brand-subtitle">conversational automation layer</span> : null}
      </span>
    </Link>
  );
}
