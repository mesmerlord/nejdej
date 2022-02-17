import { useRouter } from 'next/router';
import { trpc } from 'utils/trpc';
import NextError from 'next/error';
import { NextPageWithLayout } from 'pages/_app';
import { Box, Col, Container, Grid, Image, Text, Title } from '@mantine/core';
import { useCallback, useEffect, useState } from 'react';
import Gallery from 'react-grid-gallery';
import ImageBox from 'components/common/ImageBox';

type ImageTypes = {
  id: string;
  url: string;
  src: string;
  thumbnail?: string;
  thumbnailWidth: number;
  thumbnailHeight: number;
};
const AdvertViewPage: NextPageWithLayout = () => {
  const id = useRouter().query.id as string;
  const advertQuery = trpc.useQuery(['advert.byId', { id }]);
  const { data } = advertQuery;

  if (advertQuery.error) {
    return (
      <>
        <NextError
          title={advertQuery.error.message}
          statusCode={advertQuery.error.data?.httpStatus ?? 500}
        />
      </>
    );
  }

  if (advertQuery.status !== 'success') {
    return <>Loading...</>;
  }
  // const { data: infiniteData } = advertInfiniteQuery;
  return (
    <>
      <Container>
        {data && data?.photos && (
          <Container>
            <Title>{data.title}</Title>
            <ImageBox images={data.photos}></ImageBox>
            <Text>{data?.description}</Text>
          </Container>
        )}
      </Container>
    </>
  );
};

export default AdvertViewPage;
