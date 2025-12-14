"use client";

import { Container } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

export default function IntroductionPage() {
  const { t } = useTranslation();

  return (
    <Container>
      <h1>{t('reactFurryError.title')}</h1>
      <h2>{t('reactFurryError.subtitle')}</h2>
      <h3>{t('reactFurryError.gettingStarted')}</h3>
      <h4>{t('reactFurryError.features')}</h4>
      <ul>
        <li>{t('reactFurryError.feature1')}</li>
        <li>{t('reactFurryError.feature2')}</li>
        <li>{t('reactFurryError.feature3')}</li>
      </ul>
    </Container>
  );
}