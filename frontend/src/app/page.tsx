import React from 'react';
import Navbar from '@/components/common/Navbar';
import HeroSection from '@/components/home/HeroSection';
import OfficeGrid from '@/components/office/OfficeGrid';
import Footer from '@/components/common/Footer';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <HeroSection />
      <OfficeGrid />
      <Footer />
    </div>
  );
}
