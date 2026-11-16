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
  specs?: {
    platforms: string;
    latency: string;
    audioEngine: string;
    bitrateControl: string;
  };
}

export const PRODUCTS: ProductItem[] = [
  {
    id: 'abrimax-studio',
    name: 'Abrimax Studio',
    category: 'Mobile Broadcasting',
    availability: 'Available Now',
    isAvailable: true,
    summary:
      'Turn any flagship smartphone into a multi-camera live broadcast desk. Engineered with adaptive bitrate encoding for resilient high-definition streaming across African mobile networks.',
    imageSrc: '/src/assets/images/product_abrimax_studio_1794833072922.jpg',
    imageAlt:
      'Smartphone mounted in a dark anodized broadcast rig displaying Abrimax Studio multi-camera feeds and audio waveforms',
    highlights: [
      'Multi-camera NDI and RTMP switching directly from mobile',
      'Adaptive cellular bonding for uninterrupted field reporting',
      'Real-time 24-bit audio leveling and dual-channel metering',
    ],
    actionLabel: 'Download App',
    specs: {
      platforms: 'iOS 17+ · Android 13+',
      latency: 'Sub-800ms Glass-to-Glass',
      audioEngine: '48kHz / 24-bit Broadcast Mixer',
      bitrateControl: 'Dynamic Cellular Packet Recovery',
    },
  },
  {
    id: 'afrinode-pulse',
    name: 'Afrinode Pulse',
    category: 'Future App Placeholder',
    availability: 'In Development · 2027',
    isAvailable: false,
    summary:
      'Placeholder for our upcoming sovereign edge-routing and low-latency telemetry application designed for regional enterprise networks, logistics fleets, and telecom operators.',
    imageSrc: '/src/assets/images/product_future_cloud_1794833073036.jpg',
    imageAlt:
      'Dark obsidian modular edge computing hardware blades with brushed gold trim',
    highlights: [
      'Unified multi-region node health and bandwidth orchestration',
      'Automated failover across terrestrial fiber and satellite links',
      'Zero-trust hardware attestation for critical enterprise workloads',
    ],
    actionLabel: 'Join Waitlist',
  },
  {
    id: 'afrinode-core-ai',
    name: 'Afrinode Core AI',
    category: 'Future App Placeholder',
    availability: 'In Development · 2027',
    isAvailable: false,
    summary:
      'Placeholder for our upcoming applied intelligence suite enabling multilingual voice transcription, broadcast captioning, and sovereign enterprise workflow automation across the continent.',
    imageSrc: '/src/assets/images/product_future_ai_1794833073308.jpg',
    imageAlt:
      'Matte black silicon neural processor wafer with intricate gold micro-circuit pathways',
    highlights: [
      'Real-time speech recognition across major African languages',
      'On-device inference optimized for edge and mobile processors',
      'Enterprise data residency with strict audit governance',
    ],
    actionLabel: 'Join Waitlist',
  },
];

export interface CapabilityItem {
  number: string;
  title: string;
  description: string;
  metricValue: string;
  metricContext: string;
}

export const CAPABILITIES: CapabilityItem[] = [
  {
    number: '01.',
    title: 'Resilient Mobile Broadcast Engineering',
    description:
      'Traditional production vans lock journalism and live media behind heavy capital costs. Abrimax Studio brings multi-camera switching, broadcast audio, and adaptive packet recovery to field teams carrying standard smartphones.',
    metricValue: '99.4%',
    metricContext: 'Stream continuity on variable 4G uplinks across 14 cities',
  },
  {
    number: '02.',
    title: 'Continental Edge Infrastructure',
    description:
      'Our distributed relay architecture routes regional media and enterprise traffic through localized African interconnect nodes rather than round-tripping data across external continents.',
    metricValue: '28 ms',
    metricContext: 'Median regional relay latency within West and East African hubs',
  },
  {
    number: '03.',
    title: 'Applied Sovereign Intelligence',
    description:
      'We develop compact, domain-tuned software systems built for real operating environments—preserving data sovereignty, offline continuity, and institutional compliance from day one.',
    metricValue: '100%',
    metricContext: 'End-to-end encrypted transport with regional key custody',
  },
];

export interface ScaleMetric {
  label: string;
  value: string;
  detail: string;
}

export const SCALE_METRICS: ScaleMetric[] = [
  {
    label: 'Broadcast Hubs',
    value: '14 Cities',
    detail: 'Lagos, Nairobi, Accra, Johannesburg & regional corridors',
  },
  {
    label: 'Transport Uptime',
    value: '99.95%',
    detail: 'Measured across multi-path regional relay nodes in 2026',
  },
  {
    label: 'Field Deployment',
    value: 'Under 3 min',
    detail: 'Cold launch to live multi-cam broadcast on Abrimax Studio',
  },
  {
    label: 'Network Savings',
    value: '42% Lower',
    detail: 'Cellular bandwidth overhead via adaptive frame compression',
  },
];
