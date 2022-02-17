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
const SubCategoryViewPage: NextPageWithLayout = () => {
  const id = useRouter().query.id as string;
  const locale = useRouter().locale;

  const subCategoryQuery = trpc.useQuery([
    'subCategory.advertsById',
    { id, locale },
  ]);
  if (subCategoryQuery.error) {
    return (
      <>
        <NextError
          title={subCategoryQuery.error.message}
          statusCode={subCategoryQuery.error.data?.httpStatus ?? 500}
        />
      </>
    );
  }

  if (subCategoryQuery.status !== 'success') {
    return <>Loading...</>;
  }
  const { data } = subCategoryQuery;

  return (
    <>
      <Box sx={{ margin: '30px' }}>
        <Grid>
          <Col span={12}>
            <Grid>
              {data.map((advert) => (
                <Col span={12} sm={6} md={4} xs={6} xl={2} key={advert.id}>
                  <LinkText href={`/adverts/${advert.id}`}>
                    <Card shadow="sm" padding="lg">
                      <Card.Section>
                        <Image
                          src={`${advert?.photos[0]?.url}?=${Math.floor(
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

export default SubCategoryViewPage;
