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
const SubCategoryViewPage: NextPageWithLayout = () => {
  const id = useRouter().query.id as string;
  const locale = useRouter().locale;

  const subCategoryQuery = trpc.useQuery([
    'subCategory.listingsById',
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
              {data.map((listing) => (
                <Col span={12} sm={6} md={4} xs={6} xl={2} key={listing.id}>
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

export default SubCategoryViewPage;
