export type ExternalLink = {
  label: string;
  href: string;
};

export const EMAIL = "hello@ashtonspina.com";

export const contactLinks: ExternalLink[] = [
  { label: "Email", href: `mailto:${EMAIL}` },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/ashtonspina" },
  { label: "GitHub", href: "https://github.com/spina-a-d" },
];

export const socialLinks: ExternalLink[] = [
  { label: "Instagram", href: "https://instagram.com/ashtonspina" },
  { label: "TikTok", href: "https://tiktok.com/@ashtonspina" },
  { label: "VSCO", href: "https://vsco.co/spinaashton" },
  { label: "Goodreads", href: "https://www.goodreads.com/user/show/ashtonspina" },
  { label: "Apple Music", href: "https://music.apple.com/profile/ashtonspina" },
  { label: "Facebook", href: "https://www.facebook.com/ashton.spina/" },
  { label: "InterNations", href: "https://www.internations.org/profile/10803405" },
];
