import Link from 'next/link';
import { trpc } from '../utils/trpc';
import { NextPageWithLayout } from './_app';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import { Container, Title } from '@mantine/core';

const IndexPage: NextPageWithLayout = () => {
  const utils = trpc.useContext();
  const advertsQuery = trpc.useQuery(['advert.infinite', { limit: 50 }]);

  const router = useRouter();
  const { data: session, status } = useSession();
  const { t, lang } = useTranslation('common');
  const example = t('title');

  // prefetch all posts for instant navigation
  // useEffect(() => {
  //   for (const { id } of postsQuery.data ?? []) {
  //     utils.prefetchQuery(['post.byId', { id }]);
  //   }
  // }, [postsQuery.data, utils]);

  return (
    <>
      <Container>
        <Title>Hello</Title>
        {advertsQuery.data?.map((advert) => (
          <article key={advert.id}>
            <h3>{advert.title}</h3>
            <Link href={`/advert/${advert.id}`}>
              <a>View more</a>
            </Link>
          </article>
        ))}
      </Container>
    </>
  );
};

export default IndexPage;

/**
 * If you want to statically render this page
 * - Export `appRouter` & `createContext` from [trpc].ts
 * - Make the `opts` object optional on `createContext()`
 *
 * @link https://trpc.io/docs/ssg
 */
// export const getStaticProps = async (
//   context: GetStaticPropsContext<{ filter: string }>,
// ) => {
//   const ssg = createSSGHelpers({
//     router: appRouter,
//     ctx: await createContext(),
//   });
//
//   await ssg.fetchQuery('post.all');
//
//   return {
//     props: {
//       trpcState: ssg.dehydrate(),
//       filter: context.params?.filter ?? 'all',
//     },
//     revalidate: 1,
//   };
// };
