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
const CategoryViewPage: NextPageWithLayout = () => {
  const id = useRouter().query.id as string;
  const locale = useRouter().locale;

  const categoryQuery = trpc.useQuery([
    'category.byIdGetAdvertsInfinite',
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
              {data.map((advert) => (
                <Col span={12} sm={6} md={4} xs={6} xl={3} key={advert.id}>
                  <LinkText href={`/adverts/${advert.id}`}>
                    <Card shadow="sm" padding="lg">
                      <Card.Section>
                        <Image
                          src={`${advert?.photos[0].url}?=${Math.floor(
                            Math.random() * 1000,
                          )}`}
                          height={160}
                        />
                      </Card.Section>

                      <Group position="apart" style={{ marginBottom: 5 }}>
                        <Text weight={500}>{advert.title}</Text>
                      </Group>

                      <Text size="sm">{advert.description}</Text>

                      <Button
                        variant="light"
                        color="blue"
                        fullWidth
                        style={{ marginTop: 14 }}
                      >
                        Book classic tour now
                      </Button>
                    </Card>
                  </LinkText>
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
