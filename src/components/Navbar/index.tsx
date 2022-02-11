import { useState, useEffect, Suspense, lazy } from 'react';
import { Burger, Button, NativeSelect, Progress } from '@mantine/core';
import { Container } from '@mantine/core';
import { Group } from '@mantine/core';
import { Title } from '@mantine/core';
import { ActionIcon } from '@mantine/core';
import { Divider, Paper } from '@mantine/core';
import ReactGA from 'react-ga';
import { useStore } from '../Store/StoreProvider';
import LinkText from '../common/LinkText';
import Sidebar from './Sidebar';
import { useNProgress } from '@tanem/react-nprogress';
import { routes } from 'components/utils/Routes';
import { useRouter } from 'next/router';

interface NavbarState {
  locale: string;
}

const Navbar = () => {
  const [opened, setOpened] = useState(false);
  const siteName = useStore((state: any) => state.siteName);
  const darkMode = useStore((state: any) => state.darkMode);
  const { animationDuration, isFinished, progress } = useNProgress({
    isAnimating: true,
  });
  const router = useRouter();
  const { pathname, asPath, query } = router;

  const [navBarState, setNavBarState] = useState<NavbarState>({
    locale: router.locale || 'sk',
  });
  useEffect(() => {
    router.push({ pathname, query }, asPath, { locale: navBarState.locale });
  }, [navBarState]);
  return (
    <>
      <Paper
        padding="xl"
        shadow="md"
        radius={0}
        sx={(theme) => ({
          backgroundColor:
            theme.colorScheme == 'light'
              ? theme.colors.gray[1]
              : theme.colors.dark[4],
        })}
      >
        <Container padding="xs">
          <Group position="apart">
            <LinkText href={routes.home}>
              <Group position="apart">
                <ActionIcon sx={{ fontSize: '35px' }}>🏬</ActionIcon>
                <Title order={4}> {siteName} </Title>
              </Group>
            </LinkText>
            <Divider orientation="vertical" />
            <Group>
              <NativeSelect
                data={[
                  { value: 'en', label: 'EN' },
                  { value: 'sk', label: 'SK' },
                ]}
                required
                onChange={(e) => {
                  setNavBarState({ locale: e.target.value });
                }}
                value={navBarState.locale}
              />
              <Burger
                opened={opened}
                onClick={() => setOpened((o) => !o)}
                aria-label="Toggle Menu"
              />
              <Sidebar opened={opened} setOpened={setOpened} />
            </Group>
          </Group>
        </Container>
      </Paper>
    </>
  );
};

export default Navbar;
