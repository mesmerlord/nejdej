import { useRouter } from 'next/router';
import { trpc } from 'utils/trpc';
import NextError from 'next/error';
import { NextPageWithLayout } from 'pages/_app';
import {
  Badge,
  Box,
  Button,
  Col,
  Container,
  Grid,
  Group,
  Image,
  Text,
  Title,
  Card,
} from '@mantine/core';
import LinkText from 'components/common/LinkText';
import ListingCard from 'components/common/ListingCard';
const CategoryViewPage: NextPageWithLayout = () => {
  const id = useRouter().query.id as string;
  const locale = useRouter().locale;

  const categoryQuery = trpc.useQuery([
    'category.byIdGetListingsInfinite',
    { id },
  ]);
  const subCategoryQuery = trpc.useQuery([
    'subCategory.byCategoryId',
    { id, locale },
  ]);
  if (categoryQuery.error) {
    return (
      <>
        <NextError
          title={categoryQuery.error.message}
          statusCode={categoryQuery.error.data?.httpStatus ?? 500}
        />
      </>
    );
  }

  if (categoryQuery.status !== 'success') {
    return <>Loading...</>;
  }
  const { data } = categoryQuery;
  const { data: subCategories } = subCategoryQuery;

  return (
    <>
      <Box sx={{ margin: '20px' }}>
        <Grid>
          <Col span={3}>
            {subCategories?.map((subcategory) => (
              <LinkText href={`/subcategories/${subcategory.id}`}>
                <Card shadow="sm" padding="lg" sx={{ marginBottom: '10px' }}>
                  <Card.Section>
                    <Image src={`${subcategory?.photo}`} height={50} />
                  </Card.Section>
                </Card>
              </LinkText>
            ))}
          </Col>
          <Col span={9}>
            <Grid>
              {data.map((listing) => (
                <Col span={12} sm={6} md={4} xs={6} xl={3} key={listing.id}>
                  <ListingCard listing={listing} />
                </Col>
              ))}
            </Grid>
          </Col>
        </Grid>
      </Box>
    </>
  );
};

export default CategoryViewPage;
