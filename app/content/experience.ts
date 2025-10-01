import smgLogo from "../assets/logos/smg_logo.png";
import smgCover from "../assets/covers/smg_cover.jpg";
import belsimpelLogo from "../assets/logos/belsimpel_logo.png";
import belsimpelCover from "../assets/covers/belsimpel_cover.jpg";
import universityLogo from "../assets/logos/university_of_groningen.png";
import universityCover from "../assets/covers/university_of_groningen_cover.jpg";

export type ExperienceItem = {
  company: string;
  role: string;
  start: string;
  end: string;
  logo?: string;
  brandColor?: string;
  highlights?: string[];
  link?: string;
  cover?: string;
};

export const experienceItems: ExperienceItem[] = [
  {
    company: "SMG Swiss Marketplace Group",
    role: "Head of Engineering · Real Estate (B2B)",
    start: "May 2022",
    end: "Present",
    logo: smgLogo,
    brandColor: "#000000",
    cover: smgCover,
    highlights: [
      "Lead engineering for Real Estate B2B, contributing ~40% of SMG revenue.",
      "Drove merger of immoscout24.ch and homegate.ch; org/process integration.",
      "Coach Engineering Managers; establish feedback, ownership and delivery practices.",
      "Partner cross-functionally (Sales, Product, Monetization, Marketing) for value delivery.",
    ],
    link: "https://www.linkedin.com/company/smg-marketplace/",
  },
  {
    company: "Homegate AG (→ SMG Swiss Marketplace Group)",
    role: "Engineering Manager",
    start: "Jul 2020",
    end: "May 2022",
    logo: smgLogo,
    brandColor: "#000000",
    highlights: [
      "Scaled team from 2 → 6; transitioned onsite → remote working.",
      "Built modern AuthN/AuthZ with AWS Cognito; higher conversion, de-risked legacy.",
      "Expanded product ladder and targeted 3rd‑party services; increased revenue.",
      "Centralized customer data; retired legacy; improved security and accessibility.",
    ],
    link: "https://www.linkedin.com/company/smg-marketplace/",
  },
  {
    company: "Homegate AG",
    role: "Full‑Stack Software Engineer",
    start: "Nov 2019",
    end: "Jul 2020",
    logo: smgLogo,
    brandColor: "#000000",
    highlights: [
      "Built analytics & reporting dashboards to improve customer trust.",
      "Rebuilt transaction service for more efficient billing delivery.",
    ],
    link: "https://www.linkedin.com/company/homegate/",
  },
  {
    company: "Belsimpel (Gomibo)",
    role: "Technical Lead (Part‑time)",
    start: "May 2019",
    end: "Sep 2019",
    logo: belsimpelLogo,
    brandColor: "#00AEEF",
    cover: belsimpelCover,
    highlights: [
      "Rebuilt claims flow for richer data; reduced time‑to‑repair & manual processing.",
      "Added claim risk monitoring to lower fraud and improve margins.",
      "Drove code standards and internal libraries to reduce dev time.",
    ],
    link: "https://www.linkedin.com/company/belsimpel/",
  },
  {
    company: "Belsimpel (Gomibo)",
    role: "Full‑Stack Developer (Laravel, Vue)",
    start: "Sep 2018",
    end: "Sep 2019",
    logo: belsimpelLogo,
    brandColor: "#00AEEF",
    highlights: [
      "Built auxiliary SaaS to integrate systems and accelerate feature development.",
      "Implemented dynamic device‑based pricing for accurate costs.",
      "Designed reseller portal; internationalized features for DE/BE expansion.",
    ],
    link: "https://www.linkedin.com/company/belsimpel/",
  },
  {
    company: "Belsimpel (Gomibo)",
    role: "Back‑End Developer (PHP, DHTML, MariaDB)",
    start: "Apr 2018",
    end: "Sep 2018",
    logo: belsimpelLogo,
    brandColor: "#00AEEF",
    highlights: [
      "Expanded finance systems for richer reporting and data presentation.",
    ],
    link: "https://www.linkedin.com/company/belsimpel/",
  },
  {
    company: "University of Groningen",
    role: "Teaching Assistant",
    start: "2017",
    end: "2018",
    logo: universityLogo,
    brandColor: "#CC0000",
    cover: universityCover,
    highlights: [
      "Assisted in teaching and grading; supported student projects and labs.",
    ],
    link: "https://www.linkedin.com/school/university-of-groningen/",
  },
];
