import React from 'react';
import Header from '../Header';
import Hero from '../Hero';
import Services from '../Services';
import HowItWorks from '../HowItWorks';
import Testimonials from '../Testimonials';
import Footer from '../Footer';
import ThreeBackground from '../ThreeBackground';

function Home() {
  return (
    <div className="relative min-h-screen bg-dark-900 text-white overflow-hidden">
      <ThreeBackground />
      <div className="relative z-10">
        <Header />
        <main>
          <Hero />
          <div className="mt-32 mb-16">
            {/* <Services /> */}
            <HowItWorks />
            <Testimonials />
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default Home;