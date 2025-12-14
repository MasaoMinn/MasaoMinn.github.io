"use client";

import { useTranslation } from 'react-i18next';

export default function MechanismPage() {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t('reactFurryError.mechanism')}</h1>
      <div>{t('reactFurryError.mechanismContent')}</div>
    </div>
  );
}