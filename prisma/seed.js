const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('admin', 10);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@saasreview.co' },
    update: {},
    create: {
      email: 'admin@saasreview.co',
      username: 'admin',
      passwordHash: passwordHash,
      role: 'ADMIN',
    },
  });

  console.log('Admin user created:', admin);

  const categories = [
    { name: 'A.I.', slug: 'a-i' },
    { name: 'Cloud', slug: 'cloud' },
    { name: 'Management', slug: 'management' },
    { name: 'Marketing & Advertising', slug: 'marketing-advertising' },
    { name: 'Sales & Support', slug: 'sales-support' },
    { name: 'Social Media', slug: 'social-media' }
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }

  console.log('Categories created.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
