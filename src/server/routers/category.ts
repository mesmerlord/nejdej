/**
 *
 * This is an example router, you can delete this file and then update `../pages/api/trpc/[trpc].tsx`
 */

import { createRouter } from 'server/createRouter';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { getSession } from 'next-auth/react';

export const categoryRouter = createRouter()
  .query('all', {
    async resolve({ ctx }) {
      /**
       * For pagination you can have a look at this docs site
       * @link https://trpc.io/docs/useInfiniteQuery
       */

      return ctx.prisma.category.findMany({
        select: {
          id: true,
          enTitle: true,
          enDescription: true,
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
          enTitle: true,
          enDescription: true,
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
  .merge(
    'admin.',
    createRouter()
      .middleware(async ({ ctx, next }) => {
        const session = await getSession(ctx);
        const user = session?.user;
        if (!session?.user || !user?.email) {
          throw new TRPCError({ code: 'UNAUTHORIZED' });
        }
        const user_role = await ctx.prisma.user.findUnique({
          where: {
            email: user.email,
          },
          select: { role: true },
        });
        if (user_role?.role?.name !== 'admin') {
          throw new TRPCError({ code: 'UNAUTHORIZED' });
        }
        return next();
      })
      .mutation('add', {
        input: z.object({
          enTitle: z.string().min(1).max(100),
          skTitle: z.string().min(1).max(100),

          description: z.string().optional(),
        }),
        async resolve({ ctx, input }) {
          const category = await ctx.prisma.category.create({
            data: input,
          });
          return category;
        },
      })
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
      }),
  );
