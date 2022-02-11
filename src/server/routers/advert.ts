/**
 *
 * This is an example router, you can delete this file and then update `../pages/api/trpc/[trpc].tsx`
 */

import { createRouter } from 'server/createRouter';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';

export const advertRouter = createRouter()
  // create
  .mutation('add', {
    input: z.object({
      title: z.string().min(1).max(100),
      text: z.string().min(1),
      subCategory: z.number().optional(),
      photos: z.string().url().optional(),
    }),
    async resolve({ ctx, input }) {
      const advert = await ctx.prisma.advert.create({
        data: input,
      });
      return advert;
    },
  })
  // read
  .query('infinite', {
    input: z.object({
      limit: z.number().min(1).max(100).nullish(),
      cursor: z.string().optional(), // <-- "cursor" needs to exist, but can be any type
    }),
    async resolve({ input, ctx }) {
      /**
       * For pagination you can have a look at this docs site
       * @link https://trpc.io/docs/useInfiniteQuery
       */

      const limit = input.limit ?? 50;
      const { cursor } = input;
      const items = await ctx.prisma.advert.findMany({
        take: limit + 1, // get an extra item at the end which we'll use as next cursor

        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          createdAt: 'asc',
        },
      });
      return items;
    },
  })
  .query('byId', {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      const { id } = input;
      const advert = await ctx.prisma.advert.findUnique({
        where: { id },
        select: {
          photos: {
            select: {
              url: true,
              id: true,
            },
          },
          id: true,
          title: true,
          description: true,
          status: true,
          subCategory: {
            select: {
              id: true,
              title: true,
              Category: {
                select: {
                  id: true,
                  title: true,
                },
              },
            },
          },
          createdAt: true,
          updatedAt: true,
          userId: true,
          View: true,
          viewId: true,
        },
      });
      if (!advert) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `No advert with id '${id}'`,
        });
      }
      return advert;
    },
  })
  // update
  .mutation('edit', {
    input: z.object({
      id: z.string().uuid(),
      data: z.object({
        title: z.string().min(1).max(32).optional(),
        text: z.string().min(1).optional(),
      }),
    }),
    async resolve({ ctx, input }) {
      const { id, data } = input;
      const advert = await ctx.prisma.advert.update({
        where: { id },
        data,
      });
      return advert;
    },
  })
  // delete
  .mutation('delete', {
    input: z.string().uuid(),
    async resolve({ input: id, ctx }) {
      await ctx.prisma.advert.delete({ where: { id } });
      return id;
    },
  });
