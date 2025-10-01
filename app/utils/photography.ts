// Photography utility functions for dynamically loading country albums

export interface Photo {
  src: string;
  alt: string;
  w: number;
  h: number;
}

export interface PhotoGroup {
  id: string;
  title: string;
  thumbnail: string;
  photos: Photo[];
}

// Country folder mapping - maps folder names to display names
const COUNTRY_MAPPING: Record<string, string> = {
  'united_states': 'United States',
  'united_kingdom': 'United Kingdom',
  'czechia': 'Czech Republic',
  'san_marino': 'San Marino',
  'vatican': 'Vatican City',
};

// Photo data for countries that actually have photos
const COUNTRY_PHOTO_DATA: Record<string, { thumbnail: string; photos: Photo[] }> = {
  italy: {
    thumbnail: "/photography/italy/IDG_20250824_185102_092.jpg",
    photos: [
      { src: "/photography/italy/IDG_20250824_185102_092.jpg", alt: "Italy Photo 1", w: 1600, h: 1067 },
      { src: "/photography/italy/IDG_20250829_122537_374.jpg", alt: "Italy Photo 2", w: 1600, h: 1067 },
      { src: "/photography/italy/IDG_20250830_221239_740.jpg", alt: "Italy Photo 3", w: 1600, h: 1067 },
      { src: "/photography/italy/DSC_0086.JPG", alt: "Italy Photo 4", w: 1600, h: 1067 },
      { src: "/photography/italy/DSC_0091.JPG", alt: "Italy Photo 5", w: 1600, h: 1067 },
    ]
  },
  vietnam: {
    thumbnail: "/photography/vietnam/IMG_1896.JPG",
    photos: [
      { src: "/photography/vietnam/IMG_1896.JPG", alt: "Vietnam Photo 1", w: 1600, h: 1067 },
      { src: "/photography/vietnam/IMG_2056.JPG", alt: "Vietnam Photo 2", w: 1600, h: 1067 },
      { src: "/photography/vietnam/IMG_2216.JPG", alt: "Vietnam Photo 3", w: 1600, h: 1067 },
      { src: "/photography/vietnam/IMG_2217.JPG", alt: "Vietnam Photo 4", w: 1600, h: 1067 },
      { src: "/photography/vietnam/IMG_2219.JPG", alt: "Vietnam Photo 5", w: 1600, h: 1067 },
    ]
  },
  malta: {
    thumbnail: "/photography/malta/IMG-20170913-WA0004.jpg",
    photos: [
      { src: "/photography/malta/IMG-20170913-WA0004.jpg", alt: "Malta Photo 1", w: 1600, h: 1067 },
    ]
  },
  cambodia: {
    thumbnail: "/photography/cambodia/IMG_2320.JPG",
    photos: [
      { src: "/photography/cambodia/IMG_2320.JPG", alt: "Cambodia Photo 1", w: 1600, h: 1067 },
      { src: "/photography/cambodia/IMG_2556.JPG", alt: "Cambodia Photo 2", w: 1600, h: 1067 },
      { src: "/photography/cambodia/IMG_2562.JPG", alt: "Cambodia Photo 3", w: 1600, h: 1067 },
      { src: "/photography/cambodia/IMG_2588.JPG", alt: "Cambodia Photo 4", w: 1600, h: 1067 },
      { src: "/photography/cambodia/IMG_2593.JPG", alt: "Cambodia Photo 5", w: 1600, h: 1067 },
    ]
  },
  croatia: {
    thumbnail: "/photography/croatia/20220915_132731.jpg",
    photos: [
      { src: "/photography/croatia/20220915_132731.jpg", alt: "Croatia Photo 1", w: 1600, h: 1067 },
      { src: "/photography/croatia/20220916_144415~2.jpg", alt: "Croatia Photo 2", w: 1600, h: 1067 },
      { src: "/photography/croatia/20220916_151956.jpg", alt: "Croatia Photo 3", w: 1600, h: 1067 },
      { src: "/photography/croatia/20220916_152000.jpg", alt: "Croatia Photo 4", w: 1600, h: 1067 },
      { src: "/photography/croatia/20220916_165638.jpg", alt: "Croatia Photo 5", w: 1600, h: 1067 },
    ]
  },
  finland: {
    thumbnail: "/photography/finland/20170912_115705.jpg",
    photos: [
      { src: "/photography/finland/20170912_115705.jpg", alt: "Finland Photo 1", w: 1600, h: 1067 },
      { src: "/photography/finland/2022-12-05.jpg", alt: "Finland Photo 2", w: 1600, h: 1067 },
      { src: "/photography/finland/20220603_181231.jpg", alt: "Finland Photo 3", w: 1600, h: 1067 },
      { src: "/photography/finland/20220605_131018.jpg", alt: "Finland Photo 4", w: 1600, h: 1067 },
      { src: "/photography/finland/DSC_0378.JPEG", alt: "Finland Photo 5", w: 1600, h: 1067 },
    ]
  },
  greece: {
    thumbnail: "/photography/greece/DSC_0248.JPG",
    photos: [
      { src: "/photography/greece/DSC_0248.JPG", alt: "Greece Photo 1", w: 1600, h: 1067 },
      { src: "/photography/greece/DSC_0249.JPG", alt: "Greece Photo 2", w: 1600, h: 1067 },
      { src: "/photography/greece/DSC_0264.JPG", alt: "Greece Photo 3", w: 1600, h: 1067 },
      { src: "/photography/greece/DSC_0307.JPG", alt: "Greece Photo 4", w: 1600, h: 1067 },
      { src: "/photography/greece/DSC_0312.JPG", alt: "Greece Photo 5", w: 1600, h: 1067 },
    ]
  },
  ireland: {
    thumbnail: "/photography/ireland/20221014_123747.jpg",
    photos: [
      { src: "/photography/ireland/20221014_123747.jpg", alt: "Ireland Photo 1", w: 1600, h: 1067 },
      { src: "/photography/ireland/20221015_125831~2.jpg", alt: "Ireland Photo 2", w: 1600, h: 1067 },
      { src: "/photography/ireland/DSC_0835.JPG", alt: "Ireland Photo 3", w: 1600, h: 1067 },
      { src: "/photography/ireland/DSC_0888.JPG", alt: "Ireland Photo 4", w: 1600, h: 1067 },
      { src: "/photography/ireland/DSC_0891.JPG", alt: "Ireland Photo 5", w: 1600, h: 1067 },
    ]
  },
  china: {
    thumbnail: "/photography/china/PXL_20240120_113924985.MP.jpg",
    photos: [
      { src: "/photography/china/PXL_20240120_113924985.MP.jpg", alt: "China Photo 1", w: 1600, h: 1067 },
      { src: "/photography/china/PXL_20240120_164419340.jpg", alt: "China Photo 2", w: 1600, h: 1067 },
    ]
  },
  belgium: {
    thumbnail: "/photography/belgium/20180424_164424.jpg",
    photos: [
      { src: "/photography/belgium/20180424_164424.jpg", alt: "Belgium Photo 1", w: 1600, h: 1067 },
      { src: "/photography/belgium/DSC_0507.JPEG", alt: "Belgium Photo 2", w: 1600, h: 1067 },
      { src: "/photography/belgium/DSC_0509.JPEG", alt: "Belgium Photo 3", w: 1600, h: 1067 },
      { src: "/photography/belgium/DSC_0517.JPEG", alt: "Belgium Photo 4", w: 1600, h: 1067 },
    ]
  },
  netherlands: {
    thumbnail: "/photography/netherlands/20180420_171546.jpg",
    photos: [
      { src: "/photography/netherlands/20180420_171546.jpg", alt: "Netherlands Photo 1", w: 1600, h: 1067 },
      { src: "/photography/netherlands/20190730_162253.jpg", alt: "Netherlands Photo 2", w: 1600, h: 1067 },
      { src: "/photography/netherlands/20190730_195910.jpg", alt: "Netherlands Photo 3", w: 1600, h: 1067 },
      { src: "/photography/netherlands/20190730_205742.jpg", alt: "Netherlands Photo 4", w: 1600, h: 1067 },
      { src: "/photography/netherlands/DSC_0432.JPEG", alt: "Netherlands Photo 5", w: 1600, h: 1067 },
    ]
  },
  // Add more countries as needed...
};

// Generate photo groups based on countries that actually have photos
export function generatePhotoGroups(): PhotoGroup[] {
  return Object.keys(COUNTRY_PHOTO_DATA).map(country => {
    const displayName = COUNTRY_MAPPING[country] || country.charAt(0).toUpperCase() + country.slice(1).replace(/_/g, ' ');
    const photoData = COUNTRY_PHOTO_DATA[country];
    
    return {
      id: country,
      title: displayName,
      thumbnail: photoData.thumbnail,
      photos: photoData.photos
    };
  });
}

// Check if a country has photos
export function hasCountryPhotos(country: string): boolean {
  return country in COUNTRY_PHOTO_DATA;
}
