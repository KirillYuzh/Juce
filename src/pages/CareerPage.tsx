import { Header } from '../components/blocks/Header';
import { Footer } from '../components/blocks/Footer';
import { Alert, CookieNotice } from '../components/ui/Feedback';
import { Button } from '../components/ui/Button';
import { Hero } from '../sections/HomeSections';
import {
  AwardsSection,
  CareerStartSection,
  DirectionsSection,
  VacancyCtaSection,
  ValuesSection,
} from '../sections/CareerSections';
import {
  careerAwards,
  careerDirections,
  careerNav,
  careerStart,
  careerValues,
} from '../data/career';

export function CareerPage() {
  return (
    <>
      <Header nav={careerNav} variant="career" />

      <main>
        <div className="tb-container" style={{ paddingTop: 24 }}>
          <Alert
            action={
              <Button variant="secondary" size="s" href="https://www.tbank.ru/about/certificates/">
                Как это сделать?
              </Button>
            }
          >
            Установите сертификаты безопасности Минцифры, чтобы сохранить доступ к сервисам и
            услугам Т-Банка
          </Alert>
        </div>

        <Hero
          title="Работа в Т-Банке"
          text="Развивайте продукты, двигайте технологии вперед и помогайте клиентам. У нас можно видеть результат своей работы и расти вместе с Т-Командой"
          cta="Выбрать вакансию"
          href="https://www.tbank.ru/career/vacancies/"
        />

        <DirectionsSection directions={careerDirections} />

        <ValuesSection title="У нас разные роли — и общий подход к работе" values={careerValues} />

        <AwardsSection
          title="Т-Банк — среди лучших работодателей"
          awards={careerAwards}
          heroImage="/images/tbank/career/awards-hero.png"
          bannerImage="/images/tbank/career/award-forbes.png"
        />

        <CareerStartSection title="Начните карьеру в Т-Банке" cards={careerStart} />

        <VacancyCtaSection
          title="Найдите ту самую вакансию"
          cta="Выбрать вакансию"
          href="https://www.tbank.ru/career/vacancies/"
        />
      </main>

      <Footer variant="career" />
      <CookieNotice />
    </>
  );
}
