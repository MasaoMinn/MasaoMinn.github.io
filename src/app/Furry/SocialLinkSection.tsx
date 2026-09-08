import Image from "next/image";
import styles from "./page.module.css";

interface SocialLinkSectionProps {
  url: string;
  ariaLabel: string;
  iconSrc: string;
  iconAlt: string;
  tooltipText: string;
}

export default function SocialLinkSection({
  url,
  ariaLabel,
  iconSrc,
  iconAlt,
  tooltipText,
}: SocialLinkSectionProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      className={styles.socialLink}
    >
      <Image
        src={iconSrc}
        alt={iconAlt}
        width={32}
        height={32}
        className={styles.socialIcon}
      />
      <span role="tooltip" className={styles.socialTooltip}>
        {tooltipText}
      </span>
    </a>
  );
}
