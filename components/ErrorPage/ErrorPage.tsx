import Button from '@/components/Button/Button';
import styles from './ErrorPage.module.css';

interface ErrorPageProps {
  icon?: string;
  title: string;
  description: string;
  primaryAction?: {
    label: string;
    href: string;
  };
  secondaryAction?: {
    label: string;
    href: string;
  };
}

export default function ErrorPage({
  icon = '😢',
  title,
  description,
  primaryAction,
  secondaryAction,
}: ErrorPageProps) {
  return (
    <div className={styles.errorPage}>
      <div className={styles.icon}>{icon}</div>
      <h1 className={styles.title}>{title}</h1>
      <p className={styles.description}>{description}</p>
      
      <div className={styles.actions}>
        {primaryAction && (
          <Button href={primaryAction.href} variant="primary">
            {primaryAction.label}
          </Button>
        )}
        {secondaryAction && (
          <Button href={secondaryAction.href} variant="outline">
            {secondaryAction.label}
          </Button>
        )}
      </div>
    </div>
  );
}
