import { prisma } from './prisma';

export interface SiteSettings {
  site_name: string;
  site_description: string;
  posts_per_page: string;
}

let cachedSettings: SiteSettings | null = null;
let cacheTime: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function getSiteSettings(): Promise<SiteSettings> {
  // Return cached settings if still valid
  if (cachedSettings && Date.now() - cacheTime < CACHE_DURATION) {
    return cachedSettings;
  }

  try {
    const settings = await prisma.siteSetting.findMany();
    
    const settingsObj: any = {
      site_name: 'My Blog',
      site_description: 'A personal blog featuring technical articles, tutorials, and thoughts on software development.',
      posts_per_page: '10',
    };

    settings.forEach((setting: { key: string; value: string }) => {
      settingsObj[setting.key] = setting.value;
    });

    cachedSettings = settingsObj;
    cacheTime = Date.now();

    return settingsObj as SiteSettings;
  } catch (error) {
    console.error('Failed to fetch site settings:', error);
    
    // Return default values if database fetch fails
    return {
      site_name: 'My Blog',
      site_description: 'A personal blog featuring technical articles, tutorials, and thoughts on software development.',
      posts_per_page: '10',
    };
  }
}

export function clearSettingsCache() {
  cachedSettings = null;
  cacheTime = 0;
}
