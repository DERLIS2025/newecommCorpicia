'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { getWhatsAppUrl } from '@/lib/utils';
import { trackBannerClick } from '@/lib/tracking';

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
  variant?: 'hero-grid' | 'single';
};

function getBannerLinks(banner: Banner) {
  const desktopImg = banner.image_desktop || banner.imageDesktop || '';
  const mobileImg = banner.image_mobile || banner.imageMobile || desktopImg;
  const linkUrl = banner.cta_link || banner.link || getWhatsAppUrl();
  return { desktopImg, mobileImg, linkUrl };
}

export function BannerCarousel({ banners, variant = 'single' }: BannerCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Determine chunk size
  const chunkSize = variant === 'hero-grid' ? 3 : 1;
  
  // Create chunks
  const chunks = [];
  for (let i = 0; i < banners.length; i += chunkSize) {
    chunks.push(banners.slice(i, i + chunkSize));
  }

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  useEffect(() => {
    resetTimeout();
    // Only auto-play if there's more than 1 chunk and not hovered
    if (chunks.length > 1 && !isHovered) {
      timeoutRef.current = setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex === chunks.length - 1 ? 0 : prevIndex + 1));
      }, 5000);
    }
    return () => resetTimeout();
  }, [currentIndex, chunks.length, isHovered]);

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === chunks.length - 1 ? 0 : prevIndex + 1));
  };

  const goToPrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? chunks.length - 1 : prevIndex - 1));
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

  // If there is only 1 chunk, we render it statically without carousel wrappers
  if (chunks.length === 1) {
    if (variant === 'hero-grid') {
      return <HeroGridChunk chunk={chunks[0]} />;
    } else {
      return <SingleChunk chunk={chunks[0]} />;
    }
  }

  return (
    <div 
      className="relative w-full overflow-hidden group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div 
        className="flex transition-transform duration-500 ease-in-out w-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {chunks.map((chunk, index) => (
          <div key={index} className="w-full flex-shrink-0">
            {variant === 'hero-grid' ? (
              <HeroGridChunk chunk={chunk} />
            ) : (
              <SingleChunk chunk={chunk} />
            )}
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button 
        onClick={(e) => { e.preventDefault(); goToPrev(); }}
        className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 text-gray-800 flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-white transition-all shadow-md z-10 hidden md:flex"
        aria-label="Anterior"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button 
        onClick={(e) => { e.preventDefault(); goToNext(); }}
        className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 text-gray-800 flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-white transition-all shadow-md z-10 hidden md:flex"
        aria-label="Siguiente"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
        {chunks.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2.5 h-2.5 rounded-full transition-all shadow-sm ${
              currentIndex === index 
                ? 'bg-corpicia-green w-6' 
                : 'bg-white hover:bg-gray-200'
            }`}
            aria-label={`Ir al grupo ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

// --------------------------------------------------------
// Subcomponents to render specific layouts
// --------------------------------------------------------

function SingleChunk({ chunk }: { chunk: Banner[] }) {
  if (!chunk[0]) return null;
  const banner = chunk[0];
  const { desktopImg, mobileImg, linkUrl } = getBannerLinks(banner);

  return (
    <Link 
      href={linkUrl} 
      className="block w-full"
      onClick={() => trackBannerClick(banner.id || banner.title || 'unknown', 'hero', { title: banner.title, destination_url: linkUrl })}
    >
      <div className="relative w-full aspect-[16/9] lg:h-[380px] rounded-xl overflow-hidden bg-[#f5fbf6]">
        {/* Mobile Image */}
        <div className="block sm:hidden w-full h-full relative">
          <Image src={mobileImg as string} alt={banner.title || 'Banner Corpicia'} fill className="object-contain" priority />
        </div>
        {/* Desktop Image */}
        <div className="hidden sm:block w-full h-full relative">
          <Image src={desktopImg as string} alt={banner.title || 'Banner Corpicia'} fill className="object-contain" priority />
        </div>
      </div>
    </Link>
  );
}

function HeroGridChunk({ chunk }: { chunk: Banner[] }) {
  const mainBanner = chunk[0];
  const sideBanner1 = chunk[1];
  const sideBanner2 = chunk[2];

  const mainLinks = mainBanner ? getBannerLinks(mainBanner) : null;
  const side1Links = sideBanner1 ? getBannerLinks(sideBanner1) : null;
  const side2Links = sideBanner2 ? getBannerLinks(sideBanner2) : null;

  return (
    <div className="w-full">
      {/* Mobile: Solo banner principal, laterales en scroll horizontal */}
      <div className="block md:hidden space-y-3">
        {mainBanner && mainLinks && (
          <Link 
            href={mainLinks.linkUrl} 
            className="block"
            onClick={() => trackBannerClick(mainBanner.id || mainBanner.title || 'unknown', 'hero', { title: mainBanner.title, destination_url: mainLinks.linkUrl, position: 'main' })}
          >
            <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-[#f5fbf6]">
              <Image src={mainLinks.mobileImg as string} alt={mainBanner.title || 'Banner principal'} fill className="object-cover" priority />
            </div>
          </Link>
        )}

        {(sideBanner1 || sideBanner2) && (
          <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide">
            {sideBanner1 && side1Links && (
              <Link 
                href={side1Links.linkUrl} 
                className="block flex-shrink-0 w-[85%] snap-start"
                onClick={() => trackBannerClick(sideBanner1.id || sideBanner1.title || 'unknown', 'secondary', { title: sideBanner1.title, destination_url: side1Links.linkUrl, position: 'side1' })}
              >
                <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden bg-[#f5fbf6]">
                  <Image src={side1Links.mobileImg as string} alt={sideBanner1.title || 'Banner lateral'} fill className="object-cover" />
                </div>
              </Link>
            )}
            {sideBanner2 && side2Links && (
              <Link 
                href={side2Links.linkUrl} 
                className="block flex-shrink-0 w-[85%] snap-start"
                onClick={() => trackBannerClick(sideBanner2.id || sideBanner2.title || 'unknown', 'secondary', { title: sideBanner2.title, destination_url: side2Links.linkUrl, position: 'side2' })}
              >
                <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden bg-[#f5fbf6]">
                  <Image src={side2Links.mobileImg as string} alt={sideBanner2.title || 'Banner lateral'} fill className="object-cover" />
                </div>
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Desktop: Layout original de 2 columnas */}
      <div className="hidden md:grid gap-4 lg:grid-cols-[2fr_1fr]">
        {mainBanner && mainLinks ? (
          <Link 
            href={mainLinks.linkUrl} 
            className="block"
            onClick={() => trackBannerClick(mainBanner.id || mainBanner.title || 'unknown', 'hero', { title: mainBanner.title, destination_url: mainLinks.linkUrl, position: 'main' })}
          >
            <div className="relative w-full aspect-[16/9] lg:h-[500px] rounded-xl overflow-hidden bg-[#f5fbf6]">
              <Image src={mainLinks.desktopImg as string} alt={mainBanner.title || 'Banner principal'} fill className="object-contain" priority />
            </div>
          </Link>
        ) : (
          <div className="relative w-full aspect-[16/9] lg:h-[500px] rounded-xl bg-gray-100" />
        )}

        <div className="grid gap-4">
          {sideBanner1 && side1Links ? (
            <Link 
              href={side1Links.linkUrl} 
              className="block h-full"
              onClick={() => trackBannerClick(sideBanner1.id || sideBanner1.title || 'unknown', 'secondary', { title: sideBanner1.title, destination_url: side1Links.linkUrl, position: 'side1' })}
            >
              <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden bg-[#f5fbf6] h-full">
                <Image src={side1Links.desktopImg as string} alt={sideBanner1.title || 'Banner lateral'} fill className="object-contain" />
              </div>
            </Link>
          ) : (
            <div className="relative w-full aspect-[16/9] rounded-xl bg-gray-50" />
          )}

          {sideBanner2 && side2Links ? (
            <Link 
              href={side2Links.linkUrl} 
              className="block h-full"
              onClick={() => trackBannerClick(sideBanner2.id || sideBanner2.title || 'unknown', 'secondary', { title: sideBanner2.title, destination_url: side2Links.linkUrl, position: 'side2' })}
            >
              <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden bg-[#f5fbf6] h-full">
                <Image src={side2Links.desktopImg as string} alt={sideBanner2.title || 'Banner lateral'} fill className="object-contain" />
              </div>
            </Link>
          ) : (
            <div className="relative w-full aspect-[16/9] rounded-xl bg-gray-50" />
          )}
        </div>
      </div>
    </div>
  );
}
