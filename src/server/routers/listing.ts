/**
 *
 * This is an example router, you can delete this file and then update `../pages/api/trpc/[trpc].tsx`
 */

import { createRouter } from 'server/createRouter';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { getSession } from 'next-auth/react';

export const listingRouter = createRouter()
  // create
  .mutation('add', {
    input: z.object({
      title: z.string().min(1).max(100),
      description: z.string().min(1),
      subCategory: z.string().optional(),
      photos: z
        .array(z.object({ url: z.string().url(), name: z.string() }))
        .optional(),
      price: z.number().optional(),
    }),
    async resolve({ ctx, input }) {
      const { photos, title, description, subCategory, price } = input;
      const session = await getSession(ctx);
      if (!session?.user?.email) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }
      const listing = await ctx.prisma.listing.create({
        data: {
          photos: photos
            ? {
                createMany: { data: photos },
              }
            : undefined,
          title,
          description,
          subCategory: { connect: { id: subCategory } },
          price,
          View: { create: {} },
          User: { connect: { email: session?.user?.email } },
        },
        select: {
          title: true,
          description: true,
          subCategory: true,
          price: true,
          photos: true,
          id: true,
          View: {},
        },
      });
      const listingView = ctx.prisma.view.create({
        data: { Listing: { connect: { id: listing.id } } },
      });
      return listing;
    },
  })

  // read
  .query('infinite', {
    input: z.object({
      limit: z.number().min(1).max(100).nullish(),
      cursor: z.string().optional(),
      subCategory: z.string().optional(), // <-- "cursor" needs to exist, but can be any type
    }),
    async resolve({ input, ctx }) {
      /**
       * For pagination you can have a look at this docs site
       * @link https://trpc.io/docs/useInfiniteQuery
       */

      const limit = input.limit ?? 50;
      const { cursor, subCategory } = input;
      const items = await ctx.prisma.listing.findMany({
        take: limit + 1, // get an extra item at the end which we'll use as next cursor
        where: subCategory
          ? { subCategory: { some: { id: subCategory } } }
          : undefined,
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
      const listing = await ctx.prisma.listing.findUnique({
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
              enTitle: true,
              Category: {
                select: {
                  id: true,
                  enTitle: true,
                },
              },
            },
          },
          createdAt: true,
          updatedAt: true,
          User: {
            select: { id: true, name: true, email: true, image: true },
          },
          View: true,
          viewId: true,
        },
      });
      if (!listing) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `No listing with id '${id}'`,
        });
      }
      if (listing?.View) {
        listing.View.dailyView = listing.View?.dailyView + 1;
        listing.View.monthlyView = listing.View.monthlyView + 1;
        listing.View.totalView = listing.View.totalView + 1;
        listing.View.weeklyView = listing.View.weeklyView + 1;
        listing.View.yearlyView = listing.View.yearlyView + 1;
        const newView = listing.View;
        ctx.prisma.view
          .update({
            where: { id: newView.id },
            data: { ...newView },
          })
          .then();
      }

      return listing;
    },
  })
  // update

  // delete
  .mutation('delete', {
    input: z.string().uuid(),
    async resolve({ input: id, ctx }) {
      await ctx.prisma.listing.delete({ where: { id } });
      return id;
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
        return next();
      })
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
          const listing = await ctx.prisma.listing.update({
            where: { id },
            data,
          });
          return listing;
        },
      })
      .query('infinite', {
        input: z.object({
          limit: z.number().min(1).max(100).nullish(),
          cursor: z.string().optional(),
          subCategory: z.string().optional(), // <-- "cursor" needs to exist, but can be any type
        }),
        async resolve({ input, ctx }) {
          /**
           * For pagination you can have a look at this docs site
           * @link https://trpc.io/docs/useInfiniteQuery
           */

          const limit = input.limit ?? 50;
          const { cursor, subCategory } = input;
          const items = await ctx.prisma.listing.findMany({
            take: limit + 1, // get an extra item at the end which we'll use as next cursor
            where: subCategory
              ? { subCategory: { some: { id: subCategory } } }
              : undefined,
            cursor: cursor ? { id: cursor } : undefined,
            orderBy: {
              createdAt: 'asc',
            },
          });
          return items;
        },
      }),
  );
