import { useEffect, useState } from "react";
import { StackedCarousel } from "../../components/StackedCarousel.js";
import { PhotoGroupSelector } from "../../components/PhotoGroupSelector.js";
import { generatePhotoGroups } from "../../utils/photography.js";
import { TravelWorldMap } from "../../components/TravelWorldMap.js";
import { Experience } from "../../components/Experience.js";
import { LanguageProgress } from "../../components/LanguageProgress.js";
import { experienceItems } from "../../content/experience.js";
import ashtonProfileVideo from "../../assets/ashton_profile.MOV";
import logoTechTacticsOy from "../../assets/logos/logoTechTacticsOy.png";
import jobcrawlsLogo from "../../assets/logos/jobcrawls_logo.png";
import jobcrawlsScreenshot from "../../assets/projects/jobcrawls_screenshot.png";
import conjugr8Logo from "../../assets/logos/conjugr8.svg";
import conjugr8Screenshot from "../../assets/projects/conjugr8_screenshot.png";
import travelAtlasLogo from "../../assets/projects/travel-atlas.png";
import travelAtlasScreenshot from "../../assets/projects/travel-atlas_screenshot.png";
import wanderLogo from "../../assets/logos/wander_logo.jpg";

type TimelineItem = {
  country: string;
  flag: string;
  period: string;
  description: string;
};

const timelineData: TimelineItem[] = [
  {
    country: "Canada",
    flag: "🇨🇦",
    period: "1995 - 2015",
    description: "Born and raised in Ontario, Canada. Originally from Toronto, but grew up in rural Ontario. Did my first trips post-secondary school."
  },
  {
    country: "Netherlands",
    flag: "🇳🇱",
    period: "2015-2019",
    description: "Moved to Groningen for my bachelor's degree and worked as a teaching assistant at the University of Groningen."
  },
  {
    country: "Malta",
    flag: "🇲🇹",
    period: "2017-2018",
    description: "Relocated to Malta for my Erasmus exchange program."
  },
  {
    country: "Switzerland",
    flag: "🇨🇭",
    period: "2019 - 2021",
    description: "Joined Homegate AG in Zurich, progressing from developer to engineering manager, then to Head of Engineering at SMG."
  },
  {
    country: "Finland",
    flag: "🇫🇮",
    period: "2021 - Present",
    description: "Currently based in Helsinki, continuing to lead engineering teams and build innovative products remotely."
  }
];

export default function Page() {
  const [photoGroups, setPhotoGroups] = useState<Array<{
    id: string;
    title: string;
    thumbnail: string;
    photos: Array<{ src: string; alt: string; w: number; h: number }>;
  }>>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<string>("");
  const [isTimelineExpanded, setIsTimelineExpanded] = useState(false);
  const [isWorkMode, setIsWorkMode] = useState(false);
  
  // Function to get current mode from URL parameter
  const getCurrentMode = () => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get('mode') === 'work';
    }
    return false;
  };
  
  // Function to toggle between modes
  const toggleMode = () => {
    const newMode = isWorkMode ? 'personal' : 'work';
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('mode', newMode);
      window.history.pushState({}, '', url.toString());
      setIsWorkMode(!isWorkMode);
      
      // Dispatch custom event to notify navbar of mode change
      window.dispatchEvent(new CustomEvent('modeChanged'));
    }
  };
  
  // Initialize mode from URL on component mount
  useEffect(() => {
    setIsWorkMode(getCurrentMode());
  }, []);

  useEffect(() => {
    const groups = generatePhotoGroups();
    setPhotoGroups(groups);
    setSelectedGroupId(groups[0]?.id || "");
  }, []);

  const selectedGroup = photoGroups.find(g => g.id === selectedGroupId);
  
  // Handle album progression when reaching the end of current album
  const handleAlbumEnd = () => {
    const currentIndex = photoGroups.findIndex(g => g.id === selectedGroupId);
    const nextIndex = (currentIndex + 1) % photoGroups.length;
    setSelectedGroupId(photoGroups[nextIndex]?.id || "");
  };
  
  // Handle album regression when reaching the start of current album
  const handleAlbumStart = () => {
    const currentIndex = photoGroups.findIndex(g => g.id === selectedGroupId);
    const prevIndex = currentIndex === 0 ? photoGroups.length - 1 : currentIndex - 1;
    setSelectedGroupId(photoGroups[prevIndex]?.id || "");
  };

  return (
    <div id="top" className={"max-w-3xl"}>
      <header className={"pb-8"}>
        <div className={"p-6 rounded-3xl border border-gray-200 dark:border-gray-800 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 shadow-sm"}>
          {/* Mobile Layout: Two columns for image and text on small screens */}
          <div className={"flex flex-col sm:flex-row sm:items-center gap-6"}>
            <div className={"shrink-0 w-32 h-32 sm:w-44 sm:h-44 md:w-56 md:h-56 rounded-3xl overflow-hidden bg-gray-200 dark:bg-gray-800 ring-1 ring-gray-200/70 dark:ring-gray-800/70 mx-auto sm:mx-0"}>
              <video
                src={ashtonProfileVideo}
                className={"w-full h-full object-cover"}
                autoPlay
                loop
                muted
                playsInline
                aria-label={"Portrait of Ashton Spina"}
              />
            </div>
            <div className={"flex-1 text-center sm:text-left"}>
              <h1 className={"font-semibold text-2xl sm:text-3xl md:text-4xl tracking-tight text-gray-900 dark:text-gray-100"}>Ashton Spina</h1>
              <p className={"text-gray-600 dark:text-gray-300 mt-2 leading-relaxed"}>
                Building thoughtful products. Exploring the world through code and photography.
              </p>
            </div>
          </div>
          
          {/* Links section - full width below image/text */}
          <div className={"mt-6 flex flex-wrap gap-2 justify-center sm:justify-start"}>
            <a href="mailto:hello@ashtonspina.com" className={"inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-sm hover:bg-gray-50 dark:hover:bg-gray-800"}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                <path d="M4 6h16v12H4z" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M4 6l8 6 8-6" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
              Email
            </a>
            <a href="https://www.linkedin.com/in/ashtonspina" target="_blank" rel="noreferrer" className={"inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-sm hover:bg-gray-50 dark:hover:bg-gray-800"}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM.5 8h4V24h-4V8zM8.5 8h3.8v2.2h.06c.53-1 1.84-2.2 3.78-2.2 4.04 0 4.78 2.66 4.78 6.12V24h-4v-7.06c0-1.68-.03-3.84-2.34-3.84-2.34 0-2.7 1.83-2.7 3.72V24h-4V8z"/>
              </svg>
              LinkedIn
            </a>
                <a href="https://github.com/spina-a-d" target="_blank" rel="noreferrer" className={"inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-sm hover:bg-gray-50 dark:hover:bg-gray-800"}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                <path fillRule="evenodd" clipRule="evenodd" d="M12 .5a11.5 11.5 0 00-3.64 22.41c.58.11.79-.25.79-.56v-2c-3.23.7-3.91-1.39-3.91-1.39-.53-1.34-1.29-1.7-1.29-1.7-1.06-.73.08-.72.08-.72 1.18.08 1.8 1.22 1.8 1.22 1.04 1.78 2.72 1.27 3.38.97.1-.76.41-1.27.74-1.56-2.58-.29-5.29-1.29-5.29-5.73 0-1.27.46-2.31 1.22-3.13-.12-.3-.53-1.5.12-3.13 0 0 .99-.32 3.25 1.2a11.23 11.23 0 015.92 0c2.26-1.52 3.25-1.2 3.25-1.2.65 1.63.24 2.83.12 3.13.76.82 1.22 1.86 1.22 3.13 0 4.45-2.71 5.44-5.3 5.72.42.37.79 1.1.79 2.22v3.29c0 .31.21.68.8.56A11.5 11.5 0 0012 .5z"/>
              </svg>
              GitHub
            </a>
          </div>
          
          {/* Social Media Links - Personal Mode Only */}
          {!isWorkMode && (
            <div className={"mt-4"}>
              <div className={"text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-3 text-center sm:text-left"}>Social</div>
              <div className={"flex flex-wrap gap-2 justify-center sm:justify-start"}>
                {/* Instagram */}
                <a href="https://instagram.com/ashtonspina" target="_blank" rel="noreferrer" className={"inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-pink-200 dark:border-pink-800 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 text-sm hover:from-pink-100 hover:to-purple-100 dark:hover:from-pink-900/30 dark:hover:to-purple-900/30 transition-all duration-200"}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className={"text-pink-600 dark:text-pink-400"}>
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                  Instagram
                </a>

                {/* TikTok */}
                <a href="https://tiktok.com/@ashtonspina" target="_blank" rel="noreferrer" className={"inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm hover:bg-gray-50 dark:hover:bg-gray-800"}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className={"text-gray-900 dark:text-gray-100"}>
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                  </svg>
                  TikTok
                </a>

                {/* VSCO */}
                <a href="https://vsco.co/spinaashton" target="_blank" rel="noreferrer" className={"inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm hover:bg-gray-50 dark:hover:bg-gray-800"}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className={"text-gray-900 dark:text-gray-100"}>
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                  VSCO
                </a>

                {/* Internations */}
                <a href="https://www.internations.org/profile/10803405" target="_blank" rel="noreferrer" className={"inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-blue-200 dark:border-blue-800 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 text-sm hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-900/30 dark:hover:to-indigo-900/30 transition-all duration-200"}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className={"text-blue-600 dark:text-blue-400"}>
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                  </svg>
                  Internations
                </a>

                {/* Facebook */}
                <a href="https://www.facebook.com/ashton.spina/" target="_blank" rel="noreferrer" className={"inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-blue-200 dark:border-blue-800 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 text-sm hover:from-blue-100 hover:to-blue-200 dark:hover:from-blue-900/30 dark:hover:to-blue-800/30 transition-all duration-200"}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className={"text-blue-600 dark:text-blue-400"}>
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  Facebook
                </a>

                {/* Apple Music */}
                <a href="https://music.apple.com/profile/ashtonspina" target="_blank" rel="noreferrer" className={"inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm hover:bg-gray-50 dark:hover:bg-gray-800"}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className={"text-gray-900 dark:text-gray-100"}>
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                  Apple Music
                </a>

                {/* Goodreads */}
                <a href="https://www.goodreads.com/user/show/ashtonspina" target="_blank" rel="noreferrer" className={"inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-amber-200 dark:border-amber-800 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 text-sm hover:from-amber-100 hover:to-orange-100 dark:hover:from-amber-900/30 dark:hover:to-orange-900/30 transition-all duration-200"}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className={"text-amber-600 dark:text-amber-400"}>
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                  Goodreads
                </a>
              </div>
            </div>
          )}

          {/* Company Information - Work Mode Only */}
          {isWorkMode && (
            <div className={"mt-4"}>
              <div className={"text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-3 text-center sm:text-left"}>Company</div>
              <div className={"flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 justify-center sm:justify-start"}>
                <img 
                  src={logoTechTacticsOy} 
                  alt="TechTactics Oy logo" 
                  className={"h-8 w-8 rounded object-contain"}
                />
                <div>
                  <div className={"font-medium text-gray-900 dark:text-gray-100"}>TechTactics Oy</div>
                  <div className={"text-sm text-gray-600 dark:text-gray-400"}>Technology Consulting & Development</div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Mode Toggle Button - Prominent at bottom of business card */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={toggleMode}
            className="inline-flex items-center gap-3 px-6 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-900/30 dark:hover:to-indigo-900/30 text-base font-medium text-gray-900 dark:text-gray-100 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" strokeWidth="2" fill="none"/>
            </svg>
            Switch to {isWorkMode ? 'Personal' : 'Work'} Mode
          </button>
        </div>
        
        {/* Timeline Section - Personal Mode Only */}
        {!isWorkMode && (
          <>
            <div className={`mt-6 transition-all duration-300 ease-in-out overflow-hidden ${isTimelineExpanded ? 'max-h-[600px] sm:max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
              <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">My Journey</h3>
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <span>Canada → Netherlands → Malta → Switzerland → Finland</span>
                  </div>
                </div>
                <div className="relative">
                  {/* Timeline line */}
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-green-500"></div>
                  
                  <div className="space-y-4">
                    {timelineData.map((item, index) => (
                      <div key={index} className="relative flex items-start gap-4">
                        {/* Timeline dot */}
                        <div className="relative z-10 flex items-center justify-center w-8 h-8 rounded-full bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700">
                          <span className="text-lg">{item.flag}</span>
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">{item.country}</h4>
                            <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">{item.period}</span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Timeline Toggle Button */}
            <div className="mt-4 flex justify-center">
              <button
                onClick={() => setIsTimelineExpanded(!isTimelineExpanded)}
                className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
              >
                <span>{isTimelineExpanded ? 'Hide' : 'Show'} Journey</span>
                <svg 
                  className={`w-3 h-3 transition-transform duration-200 ${isTimelineExpanded ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </>
        )}
      </header>

      {/* Projects Section - Both Modes */}
      <section id="projects" className={"pt-6"}>
        <h2 className={"text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2"}>Projects</h2>
        <div className={"grid grid-cols-1 sm:grid-cols-2 gap-4"}>
          {/* JobCrawls - blue theme */}
          <a href="https://jobcrawls.com" target="_blank" rel="noreferrer" className={"group block p-4 rounded-2xl border bg-blue-50/80 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 hover:bg-blue-100/80 dark:hover:bg-blue-900/30 transition-colors"}>
            <div className={"space-y-3"}>
              {/* Header with logo and title */}
              <div className={"flex items-center gap-3"}>
                <img src={jobcrawlsLogo} alt="JobCrawls logo" className={"h-10 w-10 rounded-lg object-contain border border-blue-200 dark:border-blue-800 bg-white"} />
                <div className={"font-medium text-blue-900 dark:text-blue-100"}>JobCrawls</div>
              </div>
              {/* Description */}
              <div className={"text-sm text-blue-800/80 dark:text-blue-200/80"}>Finland-focused job aggregator using AI to extract data features for robust searching and filtering.</div>
              {/* Screenshot */}
              <div className={"rounded-lg overflow-hidden border border-blue-200 dark:border-blue-800"}>
                <img src={jobcrawlsScreenshot} alt="JobCrawls screenshot" className={"w-full h-32 object-cover"} />
              </div>
            </div>
          </a>

          {/* Conjugr8 - indigo theme */}
          <a href="https://conjugr8.com" target="_blank" rel="noreferrer" className={"group block p-4 rounded-2xl border bg-indigo-50/80 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100/80 dark:hover:bg-indigo-900/30 transition-colors"}>
            <div className={"space-y-3"}>
              {/* Header with logo and title */}
              <div className={"flex items-center gap-3"}>
                <img src={conjugr8Logo} alt="Conjugr8 logo" className={"h-10 w-10 rounded-lg object-contain border border-indigo-200 dark:border-indigo-800 bg-white"} />
                <div className={"font-medium text-indigo-900 dark:text-indigo-100"}>Conjugr8</div>
              </div>
              {/* Description */}
              <div className={"text-sm text-indigo-800/80 dark:text-indigo-200/80"}>Speed-focused language learning toolset and tracker designed for fast progress without time-wasting gamification.</div>
              {/* Screenshot */}
              <div className={"rounded-lg overflow-hidden border border-indigo-200 dark:border-indigo-800"}>
                <img src={conjugr8Screenshot} alt="Conjugr8 screenshot" className={"w-full h-32 object-cover"} />
              </div>
            </div>
          </a>

          {/* Travel Atlas - teal theme */}
          <a href="https://travel-atlas.com" target="_blank" rel="noreferrer" className={"group block p-4 rounded-2xl border bg-teal-50/80 dark:bg-teal-900/20 border-teal-200 dark:border-teal-800 hover:bg-teal-100/80 dark:hover:bg-teal-900/30 transition-colors"}>
            <div className={"space-y-3"}>
              {/* Header with logo and title */}
              <div className={"flex items-center gap-3"}>
                <img src={travelAtlasLogo} alt="Travel Atlas" className={"h-10 w-10 rounded-lg object-cover border border-teal-200 dark:border-teal-800 bg-white"} />
                <div className={"font-medium text-teal-900 dark:text-teal-100"}>Travel Atlas</div>
              </div>
              {/* Description */}
              <div className={"text-sm text-teal-800/80 dark:text-teal-200/80"}>My first attempt at solving a personal problem by creating a trip planner for travel. No longer maintained.</div>
              {/* Screenshot */}
              <div className={"rounded-lg overflow-hidden border border-teal-200 dark:border-teal-800"}>
                <img src={travelAtlasScreenshot} alt="Travel Atlas screenshot" className={"w-full h-32 object-cover"} />
              </div>
            </div>
          </a>

          {/* Wander - purple theme */}
          <a href="https://github.com/RUGSoftEng/2017-Cognitive-Sensors" target="_blank" rel="noreferrer" className={"group block p-4 rounded-2xl border bg-purple-50/80 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800 hover:bg-purple-100/80 dark:hover:bg-purple-900/30 transition-colors"}>
            <div className={"space-y-3"}>
              {/* Header with logo and title */}
              <div className={"flex items-center gap-3"}>
                <img src={wanderLogo} alt="Wander logo" className={"h-10 w-10 rounded-lg object-cover border border-purple-200 dark:border-purple-800 bg-white"} />
                <div className={"font-medium text-purple-900 dark:text-purple-100"}>Wander (Cognitive Sensors)</div>
              </div>
              {/* Description */}
              <div className={"text-sm text-purple-800/80 dark:text-purple-200/80"}>
                Android research app for cognitive testing and mind‑wandering data.
                <a className={"ml-1 underline"} href="https://ashtonspina.com/content/wander" target="_blank" rel="noreferrer">Read more</a>
              </div>
            </div>
          </a>
        </div>
        
        {/* Projects Link */}
        <div className={"mt-4 flex justify-center sm:justify-start"}>
          <a href="/archive" className={"inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <path d="M3 6h18l-2 13H5L3 6z" stroke="currentColor" strokeWidth="2" fill="none"/>
              <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="2" fill="none"/>
            </svg>
            See All Projects
          </a>
        </div>
      </section>


      {/* Experience Section - Work Mode Only */}
      {isWorkMode && (
        <section id="experience" className={"pt-8"}>
          <h2 className={"text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2"}>Experience</h2>
          <Experience items={experienceItems} />
        </section>
      )}


      {/* Content Section - Work Mode Only */}
      {isWorkMode && (
        <section id="content" className={"pt-8"}>
          <h2 className={"text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2"}>Content</h2>
          <div className={"grid grid-cols-1 sm:grid-cols-2 gap-4"}>
            <div className={"p-3 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/50"}>
              <div className={"text-sm font-medium text-gray-900 dark:text-gray-100 mb-2"}>Latest Podcast</div>
              <ul className={"space-y-2 text-sm text-blue-600 dark:text-blue-400"}>
                <li><a className={"underline"} href="https://example.com/podcast/episode-1" target="_blank" rel="noreferrer">Building Modern Web Applications</a></li>
              </ul>
            </div>
            <div className={"p-3 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/50"}>
              <div className={"text-sm font-medium text-gray-900 dark:text-gray-100 mb-2"}>Latest Article</div>
              <ul className={"space-y-2 text-sm text-blue-600 dark:text-blue-400"}>
                <li><a className={"underline"} href="/media/ontario-city-problem">Ontario's City Problem</a></li>
              </ul>
            </div>
          </div>
          
          {/* Content Links */}
          <div className={"mt-4 flex flex-wrap gap-3 justify-center sm:justify-start"}>
            <a href="/media" className={"inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                <path d="M14.828 14.828a4 4 0 0 1-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" stroke="currentColor" strokeWidth="2" fill="none"/>
              </svg>
              See More Content
            </a>
            <a href="/media" className={"inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-blue-200 dark:border-blue-800 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 text-sm hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-900/30 dark:hover:to-indigo-900/30 transition-all duration-200"}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                <path d="M14.828 14.828a4 4 0 0 1-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" stroke="currentColor" strokeWidth="2" fill="none"/>
              </svg>
              Media
            </a>
          </div>
        </section>
      )}

      {/* Photography Section - Personal Mode Only */}
      {!isWorkMode && (
        <section id="photos" className={"pt-8"}>
          <h2 className={"text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2"}>Photography</h2>
          <StackedCarousel 
            photos={selectedGroup?.photos || []} 
            onAlbumEnd={handleAlbumEnd}
            onAlbumStart={handleAlbumStart}
            resetKey={selectedGroupId}
          />
          <div className={"mt-6"}>
            <PhotoGroupSelector
              groups={photoGroups}
              selectedId={selectedGroupId}
              onSelect={setSelectedGroupId}
            />
          </div>
        </section>
      )}

      {/* Travel Map Section - Personal Mode Only */}
      {!isWorkMode && (
        <section id="travel-map" className={"pt-8"}>
          <h2 className={"text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2"}>Travel Map</h2>
          <div className={"rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/50 p-6"}>
            <div className={"mb-4"}>
              <h3 className={"text-sm font-medium text-gray-900 dark:text-gray-100 mb-2"}>Interactive World Map</h3>
              <p className={"text-sm text-gray-600 dark:text-gray-400"}>Click on countries to view photos from my travels.</p>
            </div>
            
            {/* Interactive Map */}
            <TravelWorldMap 
              selectedCountry={selectedGroupId}
              onCountryClick={(country) => {
                // Map country names to photo group IDs
                const countryToGroupId: Record<string, string> = {
                  'Canada': 'canada',
                  'United States of America': 'usa',
                  'United Kingdom': 'uk',
                  'Ireland': 'ireland',
                  'Norway': 'norway',
                  'Sweden': 'sweden',
                  'Finland': 'finland',
                  'Netherlands': 'netherlands',
                  'Belgium': 'belgium',
                  'France': 'france',
                  'Spain': 'spain',
                  'Portugal': 'portugal',
                  'Italy': 'italy',
                  'Vatican City': 'vatican',
                  'San Marino': 'san-marino',
                  'Switzerland': 'switzerland',
                  'Austria': 'austria',
                  'Germany': 'germany',
                  'Poland': 'poland',
                  'Czech Republic': 'czech-republic',
                  'Croatia': 'croatia',
                  'Hungary': 'hungary',
                  'Serbia': 'serbia',
                  'Greece': 'greece',
                  'Turkey': 'turkey',
                  'Cambodia': 'cambodia',
                  'Vietnam': 'vietnam',
                  'China': 'china',
                  'Singapore': 'singapore',
                  'Thailand': 'thailand'
                };
                const groupId = countryToGroupId[country];
                if (groupId) {
                  setSelectedGroupId(groupId);
                }
              }}
            />
            
            {/* Selected Country Info */}
            {selectedGroup && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">
                    {selectedGroup.id === 'italy' && '🇮🇹'}
                    {selectedGroup.id === 'vietnam' && '🇻🇳'}
                    {selectedGroup.id === 'spain' && '🇪🇸'}
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-900 dark:text-blue-100">{selectedGroup.title}</h4>
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      {selectedGroup.photos.length} photo{selectedGroup.photos.length !== 1 ? 's' : ''} from my travels
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Listening Section - Personal Mode Only */}
      {!isWorkMode && (
        <section id="listening" className={"pt-8"}>
          <h2 className={"text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2"}>Listening to</h2>
          <div className={"rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/50 p-3"}>
            <iframe
              allow="autoplay *; encrypted-media *;"
              frameBorder="0"
              height="450"
              style={{ width: "100%", maxWidth: "660px", overflow: "hidden", background: "transparent" }}
              sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation"
              src="https://embed.music.apple.com/fi/playlist/chill-tunes/pl.u-PDb4zEEueKZNELM"
              title="Apple Music Embed"
            />
          </div>
        </section>
      )}

      {/* Recommendations Section - Personal Mode Only */}
      {!isWorkMode && (
        <section id="recommendations" className={"pt-8"}>
          <h2 className={"text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2"}>Recommendations</h2>
          <p className={"text-sm text-gray-600 dark:text-gray-400 mb-6"}>A curated selection of my favorite experiences across different categories.</p>
          
          <div className={"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"}>
            {/* Travel */}
            <div className={"p-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/50"}>
              <div className={"flex items-center gap-2 mb-3"}>
                <span className={"w-2 h-2 bg-blue-500 rounded-full"}></span>
                <h3 className={"text-sm font-semibold text-gray-900 dark:text-gray-100"}>Travel</h3>
              </div>
              <ul className={"space-y-2 text-sm"}>
                <li className={"text-gray-700 dark:text-gray-300"}>Cinque Terre, Italy</li>
                <li className={"text-gray-700 dark:text-gray-300"}>Hoi An, Vietnam</li>
                <li className={"text-gray-700 dark:text-gray-300"}>Santorini, Greece</li>
              </ul>
            </div>

            {/* Film & TV */}
            <div className={"p-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/50"}>
              <div className={"flex items-center gap-2 mb-3"}>
                <span className={"w-2 h-2 bg-purple-500 rounded-full"}></span>
                <h3 className={"text-sm font-semibold text-gray-900 dark:text-gray-100"}>Film & TV</h3>
              </div>
              <ul className={"space-y-2 text-sm"}>
                <li className={"text-gray-700 dark:text-gray-300"}>The Bear</li>
                <li className={"text-gray-700 dark:text-gray-300"}>Succession</li>
                <li className={"text-gray-700 dark:text-gray-300"}>Everything Everywhere All at Once</li>
              </ul>
            </div>

            {/* Restaurants */}
            <div className={"p-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/50"}>
              <div className={"flex items-center gap-2 mb-3"}>
                <span className={"w-2 h-2 bg-red-500 rounded-full"}></span>
                <h3 className={"text-sm font-semibold text-gray-900 dark:text-gray-100"}>Restaurants</h3>
              </div>
              <ul className={"space-y-2 text-sm"}>
                <li className={"text-gray-700 dark:text-gray-300"}>Osteria Francescana</li>
                <li className={"text-gray-700 dark:text-gray-300"}>Noma</li>
                <li className={"text-gray-700 dark:text-gray-300"}>Sukiyabashi Jiro</li>
              </ul>
            </div>

            {/* Books */}
            <div className={"p-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/50"}>
              <div className={"flex items-center gap-2 mb-3"}>
                <span className={"w-2 h-2 bg-green-500 rounded-full"}></span>
                <h3 className={"text-sm font-semibold text-gray-900 dark:text-gray-100"}>Books</h3>
              </div>
              <ul className={"space-y-2 text-sm"}>
                <li className={"text-gray-700 dark:text-gray-300"}>The Seven Moons of Maali Almeida</li>
                <li className={"text-gray-700 dark:text-gray-300"}>Klara and the Sun</li>
                <li className={"text-gray-700 dark:text-gray-300"}>Project Hail Mary</li>
              </ul>
            </div>

            {/* Albums */}
            <div className={"p-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/50"}>
              <div className={"flex items-center gap-2 mb-3"}>
                <span className={"w-2 h-2 bg-yellow-500 rounded-full"}></span>
                <h3 className={"text-sm font-semibold text-gray-900 dark:text-gray-100"}>Albums</h3>
              </div>
              <ul className={"space-y-2 text-sm"}>
                <li className={"text-gray-700 dark:text-gray-300"}>Midnights</li>
                <li className={"text-gray-700 dark:text-gray-300"}>Renaissance</li>
                <li className={"text-gray-700 dark:text-gray-300"}>Dawn FM</li>
              </ul>
            </div>

            {/* View All Link */}
            <div className={"p-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900"}>
              <div className={"flex items-center justify-center h-full"}>
                <a 
                  href={"/recommendations"} 
                  className={"text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"}
                >
                  View All Recommendations →
                </a>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Languages Section - Both Modes */}
      <section id="languages" className={"pt-8"}>
        <h2 className={"text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2"}>Languages</h2>
        <LanguageProgress />
      </section>

    </div>
  );
}
