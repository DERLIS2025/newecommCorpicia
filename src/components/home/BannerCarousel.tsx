'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { getWhatsAppUrl } from '@/lib/utils';

type Banner = {
  id?: string;
  title: string | null;
  subtitle: string | null;
  imageDesktop?: string;
  imageMobile?: string;
  image_desktop?: string;
  image_mobile?: string;
  cta_text?: string | null;
  cta_link?: string | null;
  CTA?: string | null;
  link?: string | null;
};

type BannerCarouselProps = {
  banners: Banner[];
  aspect?: 'hero' | 'secondary';
};

export function BannerCarousel({ banners, aspect = 'hero' }: BannerCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const isHero = aspect === 'hero';
  // Aspect ratio classes for responsive design
  // Hero: Tall on mobile, panoramic on desktop
  // Secondary: Wide on both
  const aspectClass = isHero 
    ? 'aspect-[4/5] sm:aspect-[16/9] lg:aspect-[21/9] lg:h-[500px]'
    : 'aspect-[16/9] lg:h-[380px]';

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  useEffect(() => {
    resetTimeout();
    // Only auto-play if there's more than 1 banner and not hovered
    if (banners.length > 1 && !isHovered) {
      timeoutRef.current = setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex === banners.length - 1 ? 0 : prevIndex + 1));
      }, 5000);
    }
    return () => resetTimeout();
  }, [currentIndex, banners.length, isHovered]);

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === banners.length - 1 ? 0 : prevIndex + 1));
  };

  const goToPrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? banners.length - 1 : prevIndex - 1));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) goToNext();
    if (isRightSwipe) goToPrev();

    setTouchStart(0);
    setTouchEnd(0);
  };

  if (!banners || banners.length === 0) {
    return null;
  }

  // Handle single banner
  if (banners.length === 1) {
    const banner = banners[0];
    const desktopImg = banner.image_desktop || banner.imageDesktop;
    const mobileImg = banner.image_mobile || banner.imageMobile || desktopImg;
    const linkUrl = banner.cta_link || banner.link || getWhatsAppUrl();

    return (
      <Link href={linkUrl} className="block relative w-full overflow-hidden rounded-xl bg-[#f5fbf6] shadow-sm group">
        <div className={`relative w-full ${aspectClass}`}>
          {/* Mobile Image */}
          <div className="block sm:hidden w-full h-full relative">
            <Image src={mobileImg as string} alt={banner.title || 'Banner Corpicia'} fill className="object-cover transition-transform duration-700 group-hover:scale-105" priority />
          </div>
          {/* Desktop Image */}
          <div className="hidden sm:block w-full h-full relative">
            <Image src={desktopImg as string} alt={banner.title || 'Banner Corpicia'} fill className="object-cover transition-transform duration-700 group-hover:scale-105" priority />
          </div>
          {/* Overlay gradient for text readability if title exists */}
          {banner.title && (
             <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex flex-col justify-end p-6 sm:p-10">
               <h2 className="text-white text-2xl sm:text-4xl font-bold mb-2 max-w-2xl drop-shadow-md">{banner.title}</h2>
               {banner.subtitle && <p className="text-white/90 text-sm sm:text-lg max-w-xl drop-shadow">{banner.subtitle}</p>}
               {(banner.cta_text || banner.CTA) && (
                 <div className="mt-4">
                   <span className="inline-block bg-corpicia-green text-white px-6 py-2.5 rounded-lg font-medium shadow-lg transform transition hover:-translate-y-1">
                     {banner.cta_text || banner.CTA}
                   </span>
                 </div>
               )}
             </div>
          )}
        </div>
      </Link>
    );
  }

  return (
    <div 
      className="relative w-full overflow-hidden rounded-xl bg-[#f5fbf6] shadow-sm group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div 
        className="flex transition-transform duration-500 ease-in-out h-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {banners.map((banner, index) => {
          const desktopImg = banner.image_desktop || banner.imageDesktop;
          const mobileImg = banner.image_mobile || banner.imageMobile || desktopImg;
          const linkUrl = banner.cta_link || banner.link || getWhatsAppUrl();

          return (
            <div key={banner.id || index} className="w-full flex-shrink-0 relative">
              <Link href={linkUrl} className="block w-full h-full">
                <div className={`relative w-full ${aspectClass}`}>
                  {/* Mobile Image */}
                  <div className="block sm:hidden w-full h-full relative">
                    <Image src={mobileImg as string} alt={banner.title || `Banner ${index + 1}`} fill className="object-cover" priority={index === 0} />
                  </div>
                  {/* Desktop Image */}
                  <div className="hidden sm:block w-full h-full relative">
                    <Image src={desktopImg as string} alt={banner.title || `Banner ${index + 1}`} fill className="object-cover" priority={index === 0} />
                  </div>
                  
                  {/* Text Overlay */}
                  {banner.title && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex flex-col justify-end p-6 sm:p-10 opacity-100 transition-opacity">
                      <h2 className="text-white text-2xl sm:text-4xl font-bold mb-2 max-w-2xl drop-shadow-md transform translate-y-0 transition-transform duration-500">{banner.title}</h2>
                      {banner.subtitle && <p className="text-white/90 text-sm sm:text-lg max-w-xl drop-shadow">{banner.subtitle}</p>}
                      {(banner.cta_text || banner.CTA) && (
                        <div className="mt-4">
                          <span className="inline-block bg-corpicia-green text-white px-6 py-2.5 rounded-lg font-medium shadow-lg hover:bg-green-600 transition-colors">
                            {banner.cta_text || banner.CTA}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </Link>
            </div>
          );
        })}
      </div>

      {/* Navigation Arrows */}
      <button 
        onClick={(e) => { e.preventDefault(); goToPrev(); }}
        className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 text-gray-800 flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-white transition-all shadow-md z-10 hidden sm:flex"
        aria-label="Anterior"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button 
        onClick={(e) => { e.preventDefault(); goToNext(); }}
        className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 text-gray-800 flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-white transition-all shadow-md z-10 hidden sm:flex"
        aria-label="Siguiente"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              currentIndex === index 
                ? 'bg-white w-6 shadow-sm' 
                : 'bg-white/50 hover:bg-white/80'
            }`}
            aria-label={`Ir al banner ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
