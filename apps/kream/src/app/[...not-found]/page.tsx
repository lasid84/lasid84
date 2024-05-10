'use client'

import { useTranslation } from "react-i18next";

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <div>
      <div className="flex items-center justify-center flex-grow min-h-screen bg-gray-50">
        <div className="p-8 text-center bg-white rounded-lg shadow-xl">
          <h1 className="mb-4 text-4xl font-bold">404</h1>
          <p className="text-gray-600">{t('not_found')}</p>
          <a href="/dashboard" className="inline-block px-4 py-2 mt-4 font-semibold text-white bg-blue-500 rounded hover:bg-blue-600">{t('not_found_btn')}</a>
        </div>
      </div>
    </div>
  )
}