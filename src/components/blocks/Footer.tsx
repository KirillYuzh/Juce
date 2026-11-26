import styles from './Footer.module.css';
import type { ReactNode } from 'react';
import { footerSections, type FooterSection } from '../../data/footer';
import { cx } from '../../lib/cx';

export interface FooterProps {
  sections?: FooterSection[];
  className?: string;
  brand?: string;
  email?: string;
  year?: number;
  legal?: ReactNode;
  copyright?: string;
}

export function Footer({
  sections = footerSections,
  className,
  brand = 'Джус',
  email = 'support@juce.edu',
  year = new Date().getFullYear(),
  legal,
  copyright,
}: FooterProps) {
  return (
    <footer className={cx(styles.footer, className)}>
      <div className="tb-container">
        <div className={styles.grid}>
          {sections.map((section, sectionIndex) => (
            <div
              key={`${section.heading}-${sectionIndex}`}
              className={cx(
                styles.section,
                section.columns.length === 3 && styles.section3,
                section.columns.length === 2 && styles.section2,
                section.columns.length === 1 && styles.section1
              )}
            >
              <span className={styles.heading}>{section.heading}</span>
              <div className={styles.sectionColumns}>
                {section.columns.map((column, columnIndex) => (
                  <div className={styles.column} key={`${section.heading}-${columnIndex}`}>
                    {column.map((group, groupIndex) => (
                      <div className={styles.group} key={`${group.title}-${groupIndex}`}>
                        <span className={styles.groupTitle}>{group.title}</span>
                        {group.links.map((link, linkIndex) => {
                          const title = typeof link === 'string' ? link : link.title;
                          const linkHref = typeof link === 'string' ? undefined : link.href;
                          return (
                            <a
                              className={styles.link}
                              key={`${linkHref ?? '#'}-${title}-${linkIndex}`}
                              href={linkHref ?? '#'}
                            >
                              {title}
                            </a>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className={styles.bottom}>
          {email ? (
            <div className={styles.phoneBlock}>
              <a className={styles.phone} href={`mailto:${email}`}>
                {email}
              </a>
              <span>Ответим в течение рабочего дня</span>
              <span>Пн–Пт, 9:00–19:00</span>
            </div>
          ) : null}
          <div className={styles.legal}>
            <p>
              {legal ??
                `${brand} помогает разбирать код и задачи, но не принимает решений за разработчика. Проверяйте примеры и выкладки перед публикацией.`}
            </p>
            <span className={styles.copyright}>{copyright ?? `© ${year}, ${brand}`}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
