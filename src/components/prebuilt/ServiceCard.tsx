import type { ReactNode } from 'react';
import styles from './Prebuilt.module.css';
import { TextLink } from '../ui/Button';
import { DetailCard } from './DetailCard';

export interface ServiceCardProps {
  title: ReactNode;
  description?: ReactNode;
  link: { label: string; href: string };
  className?: string;
}

export function ServiceCard({ title, description, link, className }: ServiceCardProps) {
  return (
    <DetailCard title={title} description={description} className={className}>
      <div className={styles.cardLink}>
        <TextLink href={link.href}>{link.label}</TextLink>
      </div>
    </DetailCard>
  );
}
