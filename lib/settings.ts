import { prisma } from './prisma';
import { getCache, setCache, deleteCache } from './redis';

export interface SiteSettings {
  site_name: string;
  site_description: string;
  posts_per_page: string;
}

const SETTINGS_CACHE_KEY = 'site:settings';
const CACHE_TTL = 5 * 60; // 5 minutes

export async function getSiteSettings(): Promise<SiteSettings> {
  // Try Redis cache first
  const cached = await getCache<SiteSettings>(SETTINGS_CACHE_KEY);
  if (cached) {
    return cached;
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

    const result = settingsObj as SiteSettings;
    
    // Cache in Redis
    await setCache(SETTINGS_CACHE_KEY, result, CACHE_TTL);

    return result;
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

export async function clearSettingsCache() {
  await deleteCache(SETTINGS_CACHE_KEY);
}
