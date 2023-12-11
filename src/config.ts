import type { Site, SocialObjects } from "./types";

export const SITE: Site = {
  website: "https://tadaspetra.com", // replace this with your deployed domain
  author: "Tadas",
  desc: "A minimal, responsive and SEO-friendly Astro blog theme.",
  title: "Tadas Petra",
  ogImage: "astropaper-og.jpg",
  lightAndDarkMode: true,
  postPerPage: 10,
};

export const LOCALE = ["en-EN"]; // set to [] to use the environment default

export const LOGO_IMAGE = {
  enable: false,
  svg: true,
  width: 216,
  height: 46,
};

export const SOCIALS: SocialObjects = [

  {
    name: "YouTube",
    href: "https://youtube.com/@tadaspetra",
    linkTitle: `${SITE.title} on YouTube`,
    active: true,
  },
  {
    name: "Github",
    href: "https://github.com/tadaspetra",
    linkTitle: ` ${SITE.title} on Github`,
    active: true,
  },
  {
    name: "LinkedIn",
    href: "https://github.com/satnaing/astro-paper",
    linkTitle: `${SITE.title} on LinkedIn`,
    active: false,
  },
  {
    name: "Mail",
    href: "tadas@tadaspetra.com",
    linkTitle: `Send an email to ${SITE.title}`,
    active: true,
  },
  {
    name: "Twitter",
    href: "https://x.com/@tadaspetra",
    linkTitle: `${SITE.title} on Twitter`,
    active: true,
  },
  {
    name: "Twitch",
    href: "https://twitch.tv/tadaspetra",
    linkTitle: `${SITE.title} on Twitch`,
    active: false,
  },
  {
    name: "TikTok",
    href: "https://github.com/satnaing/astro-paper",
    linkTitle: `${SITE.title} on TikTok`,
    active: false,
  },
  {
    name: "CodePen",
    href: "https://github.com/satnaing/astro-paper",
    linkTitle: `${SITE.title} on CodePen`,
    active: false,
  },
  {
    name: "Discord",
    href: "https://discord.gg/nz8kFDm7gN",
    linkTitle: `${SITE.title} on Discord`,
    active: true,
  },
  {
    name: "Steam",
    href: "https://github.com/satnaing/astro-paper",
    linkTitle: `${SITE.title} on Steam`,
    active: false,
  },
  {
    name: "Telegram",
    href: "https://github.com/satnaing/astro-paper",
    linkTitle: `${SITE.title} on Telegram`,
    active: false,
  },
  {
    name: "Mastodon",
    href: "https://github.com/satnaing/astro-paper",
    linkTitle: `${SITE.title} on Mastodon`,
    active: false,
  },
];
