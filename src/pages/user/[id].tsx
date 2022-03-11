import { useRouter } from 'next/router';
import { trpc } from 'utils/trpc';
import NextError from 'next/error';
import { NextPageWithLayout } from 'pages/_app';
import ListingCard from 'components/common/ListingCard';
import { Col, Grid } from '@mantine/core';
import UserInfo from 'components/UserDetail/UserInfo';

const UserViewPage: NextPageWithLayout = () => {
  const id = useRouter().query.id as string;
  const postQuery = trpc.useQuery(['user.byId', { id }]);

  if (postQuery.error) {
    return (
      <>
        <NextError
          title={postQuery.error.message}
          statusCode={postQuery.error.data?.httpStatus ?? 500}
        />
      </>
    );
  }

  if (postQuery.status !== 'success') {
    return <>Loading...</>;
  }
  const { data } = postQuery;
  return (
    <>
      <UserInfo user={data}>
        <Grid>
          {data?.Listing?.map((listing) => (
            <Col span={12} sm={6} md={4} xs={6} xl={2} key={listing.id}>
              <ListingCard listing={listing} />
            </Col>
          ))}
        </Grid>{' '}
      </UserInfo>
    </>
  );
};

export default UserViewPage;
