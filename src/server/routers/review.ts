/**
 *
 * This is an example router, you can delete this file and then update `../pages/api/trpc/[trpc].tsx`
 */

import { createRouter } from 'server/createRouter';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';

export const categoryRouter = createRouter()
  // create
  .mutation('add', {
    input: z.object({
      title: z.string().min(1).max(100),
      description: z.string().optional(),
    }),
    async resolve({ ctx, input }) {
      const category = await ctx.prisma.category.create({
        data: input,
      });
      return category;
    },
  })
  // read
  .query('all', {
    async resolve({ ctx }) {
      /**
       * For pagination you can have a look at this docs site
       * @link https://trpc.io/docs/useInfiniteQuery
       */

      return ctx.prisma.category.findMany({
        select: {
          id: true,
          title: true,
          description: true,
        },
      });
    },
  })
  .query('byId', {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      const { id } = input;
      const category = await ctx.prisma.category.findUnique({
        where: { id },
        select: {
          id: true,
          title: true,
          description: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      if (!category) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `No category with id '${id}'`,
        });
      }
      return category;
    },
  })
  // update
  .mutation('edit', {
    input: z.object({
      id: z.string().uuid(),
      data: z.object({
        title: z.string().min(1).max(100).optional(),
        description: z.string().min(1).optional(),
      }),
    }),
    async resolve({ ctx, input }) {
      const { id, data } = input;
      const category = await ctx.prisma.category.update({
        where: { id },
        data,
      });
      return category;
    },
  })
  // delete
  .mutation('delete', {
    input: z.string().uuid(),
    async resolve({ input: id, ctx }) {
      await ctx.prisma.category.delete({ where: { id } });
      return id;
    },
  });
