import { useRouter } from 'next/router';
import { trpc } from 'utils/trpc';
import NextError from 'next/error';
import { NextPageWithLayout } from 'pages/_app';

const AdvertViewPage: NextPageWithLayout = () => {
  const id = useRouter().query.id as string;
  const advertQuery = trpc.useQuery(['advert.byId', { id }]);

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
  return (
    <>
      <h1>{data.title}</h1>
      <em>Created {data.createdAt.toLocaleDateString()}</em>

      <p>{data.description}</p>

      <h2>Raw data:</h2>
      <pre>{JSON.stringify(data, null, 4)}</pre>
    </>
  );
};

export default AdvertViewPage;
