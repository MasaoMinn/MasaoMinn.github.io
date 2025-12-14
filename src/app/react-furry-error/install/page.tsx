"use client";

import { useTranslation } from 'react-i18next';

export default function InstallPage() {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t('reactFurryError.install')}</h1>
      <div>{t('reactFurryError.installContent')}</div>
    </div>
  );
}