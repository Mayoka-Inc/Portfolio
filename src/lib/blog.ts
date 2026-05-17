import fs from 'fs';
import path from 'path';

import matter from 'gray-matter';
import readingTime from 'reading-time';

import { BlogPostSchema, type BlogPost } from './types';

function getMDXFiles(dir: string) {
  return fs.readdirSync(dir).filter((file) => path.extname(file) === '.mdx');
}

function readMDXFile(filePath: string) {
  const rawContent = fs.readFileSync(filePath, 'utf-8');

  return matter(rawContent);
}

function getMDXData(dir: string): BlogPost[] {
  const mdxFiles = getMDXFiles(dir);

  return mdxFiles.map((file) => {
    const { data, content } = readMDXFile(path.join(dir, file));
    const slug = path.basename(file, path.extname(file));

    const validatedData = BlogPostSchema.parse({
      content,
      slug,
      title: data.title,
      translation: data.translation,
      publishedAt: data.publishedAt,
      summary: data.summary,
      language: data.language,
      tags: data.tags,
      readingTime: Math.round(readingTime(content).minutes),
    });

    return validatedData;
  });
}

export function getBlogPosts() {
  return getMDXData(path.join(process.cwd(), 'src/content'));
}
