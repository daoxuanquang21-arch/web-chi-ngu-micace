import { PrismaClient } from '@prisma/client';
import { remark } from 'remark';
import html from 'remark-html';

const prisma = new PrismaClient();

export async function getSortedPostsData() {
  const posts = await prisma.post.findMany({
    where: { status: 'PUBLISHED' },
    include: { category: true, author: true },
    orderBy: {
      date: 'desc'
    }
  });
  return posts;
}

export async function getCategories() {
  const categories = await prisma.category.findMany();
  return categories;
}

export async function getAllPostIds() {
  const posts = await prisma.post.findMany({
    where: { status: 'PUBLISHED' },
    select: { id: true }
  });
  return posts.map(post => {
    return {
      params: {
        slug: post.id
      }
    };
  });
}

export async function getPostData(id) {
  const post = await prisma.post.findUnique({
    where: { id },
    include: { category: true, author: true }
  });

  if (!post) return null;

  let contentHtml = post.content;
  if (!contentHtml.trim().startsWith('<')) {
    const processedContent = await remark()
      .use(html)
      .process(post.content);
    contentHtml = processedContent.toString();
  }

  return {
    ...post,
    contentHtml,
  };
}
