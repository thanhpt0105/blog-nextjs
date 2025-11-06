import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../lib/auth';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create admin user
  const adminEmail = 'admin@example.com';
  const adminPassword = await hashPassword('admin123');

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: 'Admin User',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  console.log(`✅ Admin user created: ${admin.email}`);

  // Create some default site settings
  const settings = await prisma.siteSetting.createMany({
    data: [
      {
        key: 'site_name',
        value: 'My Blog',
        description: 'The name of the blog',
      },
      {
        key: 'site_description',
        value: 'A personal blog built with Next.js',
        description: 'Short description of the blog',
      },
      {
        key: 'posts_per_page',
        value: '10',
        description: 'Number of posts to display per page',
      },
    ],
    skipDuplicates: true,
  });

  console.log(`✅ Created ${settings.count} site settings`);

  // Create some default social links
  const socialLinks = await prisma.socialLink.createMany({
    data: [
      {
        platform: 'github',
        url: 'https://github.com',
        icon: 'GitHubIcon',
        order: 1,
        visible: true,
      },
      {
        platform: 'twitter',
        url: 'https://twitter.com',
        icon: 'TwitterIcon',
        order: 2,
        visible: true,
      },
      {
        platform: 'linkedin',
        url: 'https://linkedin.com',
        icon: 'LinkedInIcon',
        order: 3,
        visible: true,
      },
    ],
    skipDuplicates: true,
  });

  console.log(`✅ Created ${socialLinks.count} social links`);

  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
