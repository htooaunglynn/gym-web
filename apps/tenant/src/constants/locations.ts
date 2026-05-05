export const CITIES = {
  YANGON: 'Yangon',
  MANDALAY: 'Mandalay',
} as const;

export type City = typeof CITIES[keyof typeof CITIES];

export const TOWNSHIPS: Record<City, string[]> = {
  [CITIES.YANGON]: [
    'Lanmadaw', 'Latha', 'Kyauktada', 'Pabedan', 'Pazundaung', 'Botataung',
    'Ahlone', 'Kyeemyindaine', 'Sanchaung',
    'Bahan', 'Cocokyun', 'Dagon', 'Dagon Seikkan',
    'Dawbon', 'East Dagon', 'Hlaing', 'Hlaingthaya', 'Insein', 'Kamayut',
    'Kawhmu', 'Kayan', 'Kungyangon', 'Kyauktan',
    'Mayangone', 'Mingaladon', 'Mingala Taungnyunt',
    'North Dagon', 'North Okkalapa',
    'Seikkan', 'Seikkyi Kanaungto', 'Shwepyithar', 'South Dagon',
    'South Okkalapa', 'Tarmwe', 'Thaketa', 'Thanlyin', 'Thingangyun',
    'Thongwa', 'Twantay', 'Yankin'
  ],
  [CITIES.MANDALAY]: [
    'Amarapura', 'Aungmyethazan', 'Chanayethazan', 'Chanmyathazi',
    'Maha Aungmye', 'Patheingyi', 'Pyigyidagun'
  ]
};
