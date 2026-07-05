import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import pkg from '@prisma/client';
const { PrismaClient } = pkg;

const prisma = new PrismaClient({});
const postsDirectory = path.join(process.cwd(), 'posts');

async function main() {
  if (!fs.existsSync(postsDirectory)) {
    console.log('No /posts directory found.');
    return;
  }

  const fileNames = fs.readdirSync(postsDirectory);
  const markdownFiles = fileNames.filter(f => f.endsWith('.md'));

  for (const fileName of markdownFiles) {
    const id = fileName.replace(/\.md$/, '');
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    
    const matterResult = matter(fileContents);
    const data = matterResult.data;
    
    // Check if post exists
    const existing = await prisma.post.findUnique({ where: { id } });
    if (!existing) {
      await prisma.post.create({
        data: {
          id,
          title: data.title || 'Untitled',
          date: data.date || new Date().toISOString().split('T')[0],
          category: data.category || 'Uncategorized',
          coverImage: data.coverImage || '',
          excerpt: data.excerpt || '',
          content: matterResult.content
        }
      });
      console.log(`Migrated: ${id}`);
    } else {
      console.log(`Skipped existing: ${id}`);
    }
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
