/**
 * Adds seed data to your db
 *
 * @link https://www.prisma.io/docs/guides/database/seed-database
 */

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const { faker } = require('@faker-js/faker');
var fs = require('fs');

type Category = {
  enTitle: string;
  skTitle: string;
  subCategory: SubCategory[];
};

type SubCategory = {
  enTitle: string;
  skTitle: string;
};

async function main() {
  const json_obj = JSON.parse(fs.readFileSync('prisma/seed_file.json', 'utf8'));
  await json_obj.categories.map(async (category: Category) => {
    await prisma.category.create({
      data: {
        photo: `https://fakeimg.pl/400x400/?text=${category.enTitle}&font=lobster?retina=1`,
        enTitle: category.enTitle,
        skTitle: category.skTitle,
        enDescription: `Its about ${category.enTitle}`,
        skDescription: `To je ${category.skTitle}`,
        subCategory: {
          create: category.subCategory.map((subCategory: SubCategory) => {
            return {
              photo: `https://fakeimg.pl/400x400/?text=${subCategory.enTitle}&font=lobster?retina=1`,
              enDescription: `Its about ${subCategory.enTitle}`,
              skDescription: `To je ${subCategory.skTitle}`,
              ...subCategory,
            };
          }),
        },
      },
    });
  });
  const subCategories = await prisma.subCategory.findMany({
    select: {
      id: true,
    },
  });
  subCategories.map(async (subCategory) => {
    Array.from(Array(5).keys()).map(async (_) => {
      const listing = {
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        subCategory: { connect: { id: subCategory.id } },
        photos: {
          create: Array.from(Array(3).keys()).map((_) => {
            return {
              url: faker.image.technics(),
            };
          }),
        },
        price: Number(faker.commerce.price()),
      };
      await prisma.listing
        .create({
          data: { ...listing },
        })
        .then((result) => {})
        .catch((e) => {
          console.log(e);
        });
    });
  });
}

main()
  .catch((e) => {
    console.log(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
