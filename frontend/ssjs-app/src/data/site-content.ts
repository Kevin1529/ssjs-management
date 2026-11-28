import { Heart, Sparkles, Users, type LucideIcon } from "lucide-react";

export interface SiteEvent {
  day: string;
  month: string;
  title: string;
  description: string;
  location: string;
  type: string;
}

export const EVENTS: SiteEvent[] = [
  {
    day: "06",
    month: "DEC",
    title: "The Sunday Table",
    description: "An easygoing afternoon of good food and new conversations.",
    location: "The Garden House",
    type: "COMMUNITY LUNCH",
  },
  {
    day: "13",
    month: "DEC",
    title: "Make Something Together",
    description:
      "A beginner-friendly creative session. Bring your curiosity; we’ll bring the supplies.",
    location: "Mosaic Studio",
    type: "CREATIVE WORKSHOP",
  },
  {
    day: "20",
    month: "DEC",
    title: "A Walk, Then Coffee",
    description:
      "A relaxed neighborhood walk with a warm drink and even warmer company.",
    location: "Riverside Meeting Point",
    type: "OUTDOOR MEETUP",
  },
];

export const HOME_FEATURES = [
  {
    title: "Meet your community",
    description: "Get to know people who share your curiosity and enthusiasm.",
  },
  {
    title: "Make time for experiences",
    description:
      "From relaxed get-togethers to new adventures, find something for you.",
  },
  {
    title: "Feel at home",
    description:
      "A welcoming space where every member can take part and belong.",
  },
] as const;

export interface AboutValue {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const ABOUT_VALUES: AboutValue[] = [
  {
    icon: Users,
    title: "Connection",
    description:
      "We create opportunities for people to meet, share ideas, and build genuine friendships.",
  },
  {
    icon: Heart,
    title: "Belonging",
    description:
      "Everyone deserves a welcoming place to show up as themselves and feel included.",
  },
  {
    icon: Sparkles,
    title: "Discovery",
    description:
      "We make it easy to try something new, learn from one another, and grow together.",
  },
];
