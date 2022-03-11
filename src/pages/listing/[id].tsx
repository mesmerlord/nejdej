import { useRouter } from 'next/router';
import { trpc } from 'utils/trpc';
import NextError from 'next/error';
import { NextPageWithLayout } from 'pages/_app';
import { Container, Text, Title } from '@mantine/core';
import { useCallback, useEffect, useState } from 'react';
import ImageBox from 'components/common/ImageBox';
import LinkText from 'components/common/LinkText';

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
            <ImageBox images={data.photos}></ImageBox>
            <Text>{data?.description}</Text>
            <Text>{data?.View?.dailyView}</Text>
            <Text>{JSON.stringify(data)}</Text>
            <LinkText href={`/user/${data.User?.id}`}>
              {data.User?.name}
            </LinkText>
          </Container>
        )}
      </Container>
    </>
  );
};

export default ListingViewPage;
