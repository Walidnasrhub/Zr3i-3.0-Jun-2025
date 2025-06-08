import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

function HomePage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-green-600 to-blue-600 text-white py-20 px-4">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 text-center md:text-left mb-8 md:mb-0">
            <h1 className="text-5xl font-bold mb-4">{t('home.hero.title')}</h1>
            <p className="text-xl mb-6">{t('home.hero.subtitle')}</p>
            <Link to="/register" className="bg-white text-green-600 px-8 py-3 rounded-full text-lg font-semibold hover:bg-gray-200 transition duration-300">
              {t('home.hero.cta')}
            </Link>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <img src="/home/ubuntu/upload/1000025677.jpg" alt="Digital Twin for Your Farm" className="rounded-lg shadow-lg max-w-full h-auto" style={{ maxHeight: '400px' }} />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-12">{t('home.features.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="flex flex-col items-center p-6 bg-gray-50 rounded-lg shadow-md">
              <img src="/home/ubuntu/upload/1000025675.jpg" alt="Democratising Intelligence" className="w-full h-48 object-cover rounded-md mb-4" />
              <h3 className="text-2xl font-semibold text-green-700 mb-3">{t('home.features.feature1.title')}</h3>
              <p className="text-gray-600">{t('home.features.feature1.description')}</p>
            </div>
            <div className="flex flex-col items-center p-6 bg-gray-50 rounded-lg shadow-md">
              <img src="/home/ubuntu/upload/1000024657.jpg" alt="Uberizing Agriculture" className="w-full h-48 object-cover rounded-md mb-4" />
              <h3 className="text-2xl font-semibold text-green-700 mb-3">{t('home.features.feature2.title')}</h3>
              <p className="text-gray-600">{t('home.features.feature2.description')}</p>
            </div>
            <div className="flex flex-col items-center p-6 bg-gray-50 rounded-lg shadow-md">
              <img src="/home/ubuntu/upload/1000024655.jpg" alt="Mobile Monitoring" className="w-full h-48 object-cover rounded-md mb-4" />
              <h3 className="text-2xl font-semibold text-green-700 mb-3">{t('home.features.feature3.title')}</h3>
              <p className="text-gray-600">{t('home.features.feature3.description')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 px-4 bg-gray-200">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-8">{t('home.about.title')}</h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            {t('home.about.paragraph1')}
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            {t('home.about.paragraph2')}
          </p>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 px-4 bg-green-700 text-white text-center">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold mb-6">{t('home.cta.title')}</h2>
          <p className="text-xl mb-8">{t('home.cta.subtitle')}</p>
          <Link to="/contact" className="bg-white text-green-700 px-10 py-4 rounded-full text-xl font-semibold hover:bg-gray-200 transition duration-300">
            {t('home.cta.button')}
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 px-4">
        <div className="container mx-auto text-center">
          <p>&copy; {new Date().getFullYear()} Zr3i 3.0. {t('common.allRightsReserved')}</p>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;


