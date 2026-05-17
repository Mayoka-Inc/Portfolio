import { describe, expect, it } from 'vitest';
import { BlogPostSchema } from '../src/lib/types';

describe('BlogPostSchema', () => {
  it('should validate a correct blog post object', () => {
    const validPost = {
      content: 'Hello World',
      title: 'My First Post',
      publishedAt: '2024-05-17',
      summary: 'An introductory post',
      language: 'en',
      tags: ['intro', 'personal'],
      slug: 'my-first-post',
      readingTime: 5,
    };

    const result = BlogPostSchema.safeParse(validPost);
    expect(result.success).toBe(true);
  });

  it('should allow optional translation field', () => {
    const postWithTranslation = {
      content: 'Hello World',
      title: 'My First Post',
      publishedAt: '2024-05-17',
      summary: 'An introductory post',
      language: 'en',
      tags: ['intro'],
      slug: 'my-first-post',
      readingTime: 5,
      translation: 'mein-erster-beitrag',
    };

    const result = BlogPostSchema.safeParse(postWithTranslation);
    expect(result.success).toBe(true);
  });

  it('should fail if required fields are missing', () => {
    const invalidPost = {
      title: 'Incomplete Post',
    };

    const result = BlogPostSchema.safeParse(invalidPost);
    expect(result.success).toBe(false);
  });
});
