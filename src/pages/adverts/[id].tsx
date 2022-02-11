import { useRouter } from 'next/router';
import { trpc } from 'utils/trpc';
import NextError from 'next/error';
import { NextPageWithLayout } from 'pages/_app';

const AdvertViewPage: NextPageWithLayout = () => {
  const id = useRouter().query.id as string;
  // const subCategory = useRouter().query.id as string;
  const advertQuery = trpc.useQuery(['advert.byId', { id }]);
  const advertInfiniteQuery = trpc.useQuery([
    'advert.infinite',
    { subCategory: '6d492eb6-aefb-473b-b6e1-3a177b26d11a' },
  ]);
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
  const { data } = advertQuery;
  const { data: infiniteData } = advertInfiniteQuery;

  return (
    <>
      <h1>{data.title}</h1>
      <em>Created {data.createdAt.toLocaleDateString()}</em>
      <p>{data.description}</p>
      <pre>{JSON.stringify(infiniteData, null, 4)}</pre>

      <h2>Raw data:</h2>
      <pre>{JSON.stringify(data, null, 4)}</pre>
    </>
  );
};

export default AdvertViewPage;
