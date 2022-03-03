import { useRouter } from 'next/router';
import { trpc } from 'utils/trpc';
import NextError from 'next/error';
import { NextPageWithLayout } from 'pages/_app';

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
      <h1>{data.name}</h1>
      <em>Created {data.createdAt.toLocaleDateString()}</em>

      <h2>Raw data:</h2>
      <pre>{JSON.stringify(data, null, 4)}</pre>
    </>
  );
};

export default UserViewPage;
