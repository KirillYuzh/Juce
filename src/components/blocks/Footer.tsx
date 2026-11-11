import styles from './Footer.module.css';
import { footerSections, type FooterSection } from '../../data/footer';
import { careerFooterLinks } from '../../data/career';
import { Chip } from '../ui/Display';
import { Icon } from '../ui/Icon';

const cx = (...values: Array<string | false | null | undefined>) =>
  values.filter(Boolean).join(' ');

const hrefFor = (label: string) => `https://www.tbank.ru/search/?query=${encodeURIComponent(label)}`;

export interface FooterProps {
  variant?: 'home' | 'career';
  sections?: FooterSection[];
  chips?: string[];
  className?: string;
}

export function Footer({ variant = 'home', sections = footerSections, chips = careerFooterLinks, className }: FooterProps) {
  if (variant === 'career') {
    return (
      <footer className={cx(styles.footer, styles.footerCareer, className)}>
        <div className="tb-container">
          <div className={styles.chips}>
            {chips.map((chip) => (
              <Chip key={chip} tone="dark">
                {chip}
              </Chip>
            ))}
          </div>

          <p className={styles.darkMeta}>
            Рейтинги: Future Today, Forbes, РБК, Forbes
          </p>

          <div className={styles.darkLegal}>
            <p>
              Информация на данной странице предоставлена исключительно в целях ознакомления с
              предложениями о сотрудничестве, но не гарантирует его. Термины, используемые на
              настоящей странице, не являются юридически значимыми, приведены исключительно для
              удобства навигации и не отражают характер/вид отношений, которые могут сложиться в
              рамках сотрудничества (трудовые отношения, гражданско-правовые отношения).
            </p>
            <p>
              <a href="https://www.tbank.ru/about/privacy/">Политика обработки персональных данных Т‑Банка</a>
            </p>
          </div>

          <div className={styles.darkBottom}>
            <span>
              © 2006—2026, АО «ТБанк», официальный сайт, универсальная лицензия ЦБ РФ № 2673
            </span>
            <div className={styles.socials}>
              <a href="https://t.me/tbank/" aria-label="Telegram">
                <Icon name="telegram" size={20} />
              </a>
              <a href="https://vk.com/tbank/" aria-label="ВКонтакте">
                <Icon name="vk" size={20} />
              </a>
              <a href="https://ok.ru/tbank/" aria-label="Одноклассники">
                <Icon name="ok" size={20} />
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
                section.columns.length === 1 && styles.section1,
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
                          <a className={styles.link} key={`${group.title}-${link}`} href={hrefFor(link)}>
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
            <a className={styles.phone} href="tel:88003333333">
              8 800 333-33-33
            </a>
            <span>Бесплатно для звонков по России</span>
            <span>999 — Короткий номер</span>
          </div>
          <div className={styles.legal}>
            <p>
              На информационном ресурсе применяются рекомендательные технологии. При применении
              информационных технологий предоставления информации осуществляется сбор,
              систематизация и анализ сведений, относящихся к предпочтениям пользователей сети
              «Интернет», находящихся на территории Российской Федерации.
            </p>
            <p>
              Пример расчета условий носит исключительно информационный характер, а также не
              является публичной офертой.
            </p>
            <span className={styles.copyright}>
              © 2006—2026, АО «ТБанк», официальный сайт, универсальная лицензия ЦБ РФ № 2673
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
