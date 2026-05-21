import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			heroImage: z.optional(image()),
			tags: z.array(z.string()).default([]),
		}),
});

const projects = defineCollection({
	loader: glob({ base: './src/content/projects', pattern: '**/*.{md,mdx}' }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			pubDate: z.coerce.date(),
			heroImage: z.optional(image()),
			tags: z.array(z.string()).default([]),
			repoUrl: z.url().optional(),
			demoUrl: z.url().optional(),
			featured: z.boolean().default(false),
		}),
});

const books = defineCollection({
	loader: glob({ base: './src/content/books', pattern: '**/*.{md,mdx}' }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			author: z.string(),
			description: z.string(),
			cover: z.optional(image()),
			status: z.enum(['reading', 'read', 'wantToRead']).default('read'),
			rating: z.number().min(1).max(5).optional(),
			dateRead: z.coerce.date().optional(),
			tags: z.array(z.string()).default([]),
			links: z
				.array(
					z.object({
						label: z.string(),
						url: z.url(),
					}),
				)
				.default([]),
			featured: z.boolean().default(false),
		}),
});

export const collections = { blog, projects, books };
