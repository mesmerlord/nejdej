import Link from 'next/link';
import { trpc } from '../utils/trpc';
import { NextPageWithLayout } from './_app';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import {
  Badge,
  Button,
  Container,
  Group,
  Image,
  Text,
  Title,
} from '@mantine/core';
import LinkText from 'components/common/LinkText';
import { Card } from '@mantine/core';

const IndexPage: NextPageWithLayout = () => {
  const utils = trpc.useContext();
  const router = useRouter();

  const categoriesQuery = trpc.useQuery([
    'category.all',
    { locale: router.locale },
  ]);

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
      {router.locale}
      <Container>
        <Title>Hello</Title>
        {categoriesQuery.data?.map((category) => (
          <LinkText href={`/categories/${category.id}`}>
            <Card shadow="sm" padding="lg">
              <Card.Section>
                <Image
                  src={category?.photo || ''}
                  height={160}
                  alt={
                    router.locale === 'en' ? category.enTitle : category.skTitle
                  }
                />
              </Card.Section>

              <Group position="apart" style={{ marginBottom: 5 }}>
                <Text weight={500}>
                  {router.locale === 'en' ? category.enTitle : category.skTitle}
                </Text>
              </Group>

              <Text size="sm">
                {router.locale === 'en' ? category.enTitle : category.skTitle}
              </Text>

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
