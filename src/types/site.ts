export interface ProductSpecs {
  platforms: string;
  latency: string;
  audioEngine: string;
  bitrateControl: string;
}

export interface ProductItem {
  id: string;
  name: string;
  category: string;
  availability: string;
  isAvailable: boolean;
  summary: string;
  imageSrc: string;
  imageAlt: string;
  highlights: string[];
  actionLabel: string;
  specs?: ProductSpecs;
}

export interface PageRecord {
  id: string;
  title: string;
  slug: string;
  content: string;
  createdAt: string;
}

export interface NavigationLink {
  id: string;
  label: string;
  url: string;
  order: number;
}

export interface MediaImage {
  id: string;
  title: string;
  caption: string;
  url: string;
  createdAt: string;
}

export interface VideoRecord {
  id: string;
  name: string;
  fileUrl: string;
  showOnSite: boolean;
  createdAt: string;
}

export interface SiteSettings {
  brandName: string;
  tagline: string;
  heroEyebrow: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImageUrl: string;
  logoUrl: string;
  aboutTitle: string;
  aboutText: string;
  corridorsText: string;
  contactEmail: string;
  regionalHubs: string;
}

export interface SiteData {
  settings: SiteSettings;
  products: ProductItem[];
  pages: PageRecord[];
  navigation: NavigationLink[];
  images: MediaImage[];
  videos: VideoRecord[];
  updatedAt: string;
}
