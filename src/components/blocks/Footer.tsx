import styles from './Footer.module.css';
import { footerSections, type FooterSection } from '../../data/footer';
import { researcherFooterLinks } from '../../data/researchers';
import { Chip } from '../ui/Display';
import { Icon } from '../ui/Icon';

const cx = (...values: Array<string | false | null | undefined>) =>
  values.filter(Boolean).join(' ');

export interface FooterProps {
  variant?: 'light' | 'dark';
  sections?: FooterSection[];
  chips?: string[];
  className?: string;
}

export function Footer({
  variant = 'light',
  sections = footerSections,
  chips = researcherFooterLinks,
  className,
}: FooterProps) {
  if (variant === 'dark') {
    return (
      <footer className={cx(styles.footer, styles.footerDark, className)}>
        <div className="tb-container">
          <div className={styles.chips}>
            {chips.map((chip) => (
              <Chip key={chip} tone="dark">
                {chip}
              </Chip>
            ))}
          </div>

          <p className={styles.darkMeta}>
            Открытый код, воспроизводимость и честная атрибуция — принципы, на которых работает
            платформа
          </p>

          <div className={styles.darkLegal}>
            <p>
              Материалы платформы носят информационный характер и не заменяют ревью наставника.
              Ассистент может ошибаться — проверяйте код и выкладки по первоисточникам.
            </p>
            <p>
              <a href="#">Политика обработки персональных данных</a>
            </p>
          </div>

          <div className={styles.darkBottom}>
            <span>© 2026, Джус — платформа для разработчиков</span>
            <div className={styles.socials}>
              <a href="#" aria-label="Telegram">
                <Icon name="telegram" size={20} />
              </a>
              <a href="#" aria-label="ВКонтакте">
                <Icon name="vk" size={20} />
              </a>
              <a href="#" aria-label="Почта">
                <Icon name="mail" size={20} />
              </a>
            </div>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className={cx(styles.footer, className)}>
      <div className="tb-container">
        <div className={styles.grid}>
          {sections.map((section) => (
            <div
              key={section.heading}
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
                    {column.map((group) => (
                      <div className={styles.group} key={group.title}>
                        <span className={styles.groupTitle}>{group.title}</span>
                        {group.links.map((link) => (
                          <a className={styles.link} key={`${group.title}-${link}`} href="#">
                            {link}
                          </a>
                        ))}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className={styles.bottom}>
          <div className={styles.phoneBlock}>
            <a className={styles.phone} href="mailto:support@juce.edu">
              support@juce.edu
            </a>
            <span>Ответим в течение рабочего дня</span>
            <span>Пн–Пт, 9:00–19:00</span>
          </div>
          <div className={styles.legal}>
            <p>
              Джус помогает разбирать код и задачи, но не принимает решений за разработчика.
              Проверяйте примеры и выкладки перед публикацией.
            </p>
            <span className={styles.copyright}>© 2026, Джус — платформа для разработчиков</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
