"use client";

import { useTranslation } from 'react-i18next';

export default function GalleryPage() {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t('reactFurryError.gallery')}</h1>
      <div>{t('reactFurryError.galleryContent')}</div>
    </div>
  );
}