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
} from '../sections/ResearcherSections';
import {
  researcherAwards,
  researcherDirections,
  researcherLearning,
  researcherNav,
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
            Джупсик разбирает stack trace и подсказывает, где в цепочке вызовов на самом деле
            ломается код
          </Alert>
        </div>

        <Hero
          title="Разработчикам"
          text="Джус собирает в одном месте разборы, задачи и конспекты по Java, Go и математике. Рядом работает Джупсик — встроенный ассистент: объяснит код, проверит доказательство и поможет подготовиться к собеседованию"
          cta="Начать разбор"
          href="#/researchers"
          image="/image.png"
        />

        <DirectionsSection title="Кому помогает платформа" directions={researcherDirections} />

        <RecognitionSection
          title="Признание в сообществе"
          items={researcherAwards}
          heroImage="/image.png"
          bannerImage="/image.png"
          bannerTitle="Открытый код"
        />

        <LearningSection title="Обучение и стажировки" cards={researcherLearning} />

        <FinalCtaSection
          title="Начните разбор на платформе Джус"
          text="Заведите проект, позовите команду и подключите Джупсика — он разберётся с кодом и формулами, пока вы формулируете задачу"
          cta="Создать проект"
          href="#/researchers"
        />
      </main>

      <Footer variant="dark" />
      <CookieNotice />
    </>
  );
}
