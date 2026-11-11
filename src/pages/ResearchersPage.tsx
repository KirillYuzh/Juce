import { Header } from '../components/blocks/Header';
import { Footer } from '../components/blocks/Footer';
import { Alert, CookieNotice } from '../components/ui/Feedback';
import { Button } from '../components/ui/Button';
import { Hero } from '../sections/HomeSections';
import {
  DirectionsSection,
  FinalCtaSection,
  LearningSection,
  RecognitionSection,
  VacanciesSection,
  ValuesSection,
} from '../sections/ResearcherSections';
import {
  researcherAwards,
  researcherDirections,
  researcherLearning,
  researcherNav,
  researcherVacancies,
  researcherValues,
} from '../data/researchers';

export function ResearchersPage() {
  return (
    <>
      <Header nav={researcherNav} variant="researchers" />

      <main>
        <div className="tb-container" style={{ paddingTop: 24 }}>
          <Alert
            action={
              <Button variant="secondary" size="s" href="#/researchers">
                Что умеет Джупсик
              </Button>
            }
          >
            Джупсик сверяет список литературы с открытыми базами и подсказывает, где не хватает
            ссылки на данные
          </Alert>
        </div>

        <Hero
          title="Исследователям"
          text="Джус собирает в одном месте датасеты, препринты, рецензии и лабораторные журналы. Рядом работает Джупсик — встроенный ассистент: найдёт статьи по теме, проверит ссылки и поможет собрать черновик"
          cta="Начать исследование"
          href="#/researchers"
          image="/images/juce/researchers-hero.png"
        />

        <DirectionsSection title="Кому помогает платформа" directions={researcherDirections} />

        <ValuesSection title="Как мы работаем с данными и результатами" values={researcherValues} />

        <LearningSection title="Обучение и стажировки" cards={researcherLearning} />

        <RecognitionSection
          title="Признание в научном сообществе"
          items={researcherAwards}
          heroImage="/images/juce/researchers-2.png"
          bannerImage="/images/juce/researchers-3.png"
          bannerTitle="Открытая наука"
        />

        <VacanciesSection title="Открытые позиции" vacancies={researcherVacancies} />

        <FinalCtaSection
          title="Начните исследование на платформе Джус"
          text="Заведите проект, пригласите группу и позовите Джупсика — он разберётся с литературой, пока вы формулируете гипотезу"
          cta="Создать проект"
          href="#/researchers"
        />
      </main>

      <Footer variant="dark" />
      <CookieNotice />
    </>
  );
}
