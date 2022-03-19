import { useRouter } from 'next/router';
import { trpc } from 'utils/trpc';
import NextError from 'next/error';
import { NextPageWithLayout } from 'pages/_app';
import { Col, Container, Grid, Group, Text, Title } from '@mantine/core';
import ImageBox from 'components/common/ImageBox';
import LinkText from 'components/common/LinkText';
import { UserCard } from 'components/common/UserCard';

type ImageTypes = {
  id: string;
  url: string;
  src: string;
  thumbnail?: string;
  thumbnailWidth: number;
  thumbnailHeight: number;
};
const ListingViewPage: NextPageWithLayout = () => {
  const id = useRouter().query.id as string;
  const listingQuery = trpc.useQuery(['listing.byId', { id }]);
  const { data } = listingQuery;

  if (listingQuery.error) {
    return (
      <>
        <NextError
          title={listingQuery.error.message}
          statusCode={listingQuery.error.data?.httpStatus ?? 500}
        />
      </>
    );
  }

  if (listingQuery.status !== 'success') {
    return <>Loading...</>;
  }
  return (
    <>
      <Container>
        {data && data?.photos && (
          <Container>
            <Title>{data.title}</Title>
            <ImageBox images={data.photos} />
            <Grid sx={{ marginTop: '10px' }}>
              <Col span={9}>
                <Text>{data.description}</Text>
              </Col>
              <Col span={3}>
                {data.User && (
                  <UserCard
                    avatar={data.User.image || ''}
                    name={data.User.name || 'NA'}
                    id={data.User.id}
                  />
                )}
              </Col>
            </Grid>
            <Text>{data?.View?.dailyView}</Text>
          </Container>
        )}
      </Container>
    </>
  );
};

export default ListingViewPage;
