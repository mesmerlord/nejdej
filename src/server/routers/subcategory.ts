import { createRouter } from 'server/createRouter';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { getSession } from 'next-auth/react';
import { prisma } from '@prisma/client';

export const subCategoryRouter = createRouter()
  .query('byCategoryId', {
    input: z.object({
      locale: z.string().length(2).optional(),
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      const { locale, id } = input;
      const subCategories = await ctx.prisma.subCategory.findMany({
        where: { categoryId: id },
        select: {
          id: true,
          enTitle: locale === 'en' ? true : false,
          skTitle: locale === 'sk' ? true : false,
          enDescription: locale === 'en' ? true : false,
          skDescription: locale === 'sk' ? true : false,
          photo: true,
        },
      });
      return subCategories;
    },
  })
  .query('advertsById', {
    input: z.object({
      locale: z.string().length(2).optional(),
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      const { locale, id } = input;
      const advertBySubcategories = await ctx.prisma.advert.findMany({
        where: { subCategory: { every: { id } } },
        select: {
          id: true,
          title: true,
          description: true,
          photos: { select: { url: true } },
          subCategory: {
            select: {
              enTitle: locale === 'en' ? true : false,
              skTitle: locale === 'sk' ? true : false,
              enDescription: locale === 'en' ? true : false,
              skDescription: locale === 'sk' ? true : false,
            },
          },
        },
      });
      return advertBySubcategories;
    },
  })
  .query('allWithCategory', {
    input: z.object({
      locale: z.string().length(2).optional(),
    }),
    async resolve({ ctx, input }) {
      const { locale } = input;

      const categoriesWithSubCategories = await ctx.prisma.category.findMany({
        select: {
          id: true,
          enTitle: locale === 'en' ? true : false,
          skTitle: locale === 'sk' ? true : false,
          enDescription: locale === 'en' ? true : false,
          skDescription: locale === 'sk' ? true : false,
          subCategory: {
            select: {
              id: true,
              enTitle: locale === 'en' ? true : false,
              skTitle: locale === 'sk' ? true : false,
              enDescription: locale === 'en' ? true : false,
              skDescription: locale === 'sk' ? true : false,
            },
          },
        },
      });
      return categoriesWithSubCategories;
    },
  });
