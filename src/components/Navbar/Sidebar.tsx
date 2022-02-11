import { Button, Drawer, Accordion, Title, Group } from '@mantine/core';
// import { useHistory } from "react-router-dom";
import { useRouter } from 'next/router';
import { routes } from '../utils/Routes';
import LinkText from '../common/LinkText';
import { useStore } from '../Store/StoreProvider';
import { useEffect } from 'react';
import React from 'react';
interface SidebarProps {
  opened: boolean;
  setOpened: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sidebar = ({ opened, setOpened }: SidebarProps) => {
  // const history = useHistory();
  const accessToken = useStore((state: any) => state.accessToken);
  const logOut = useStore((state: any) => state.logOut);
  const router = useRouter();
  useEffect(() => {
    router.events.on('routeChangeComplete', () => {
      setOpened(false);
    });
  }, [router]);
  return (
    <Drawer
      opened={opened}
      onClose={() => setOpened(false)}
      title="Menu"
      padding="md"
      size="sm"
      position="right"
      sx={{
        div: {
          marginBottom: '10px',
        },

        button: { marginTop: '15px' },
      }}
    >
      <Group>
        <LinkText href={routes.home}>
          <Title order={3}>🏠</Title>
        </LinkText>

        <LinkText href={routes.home}>
          <Title order={3}>Home</Title>
        </LinkText>
      </Group>
      <Accordion iconPosition="left" sx={{ h4: { marginBottom: '10px' } }}>
        <Accordion.Item label={<Title order={3}>Categories</Title>}>
          <LinkText href={`${routes.categories}`}>
            <Title order={4}>All</Title>
          </LinkText>
          <LinkText href={`${routes.category}romance`}>
            <Title order={4}>Romance</Title>
          </LinkText>
        </Accordion.Item>
        <Accordion.Item label={<Title order={3}>Tags</Title>}>
          <LinkText href={`${routes.tags}`}>
            <Title order={4}>All</Title>
          </LinkText>
          <LinkText href={`${routes.tag}game-elements`}>
            <Title order={4}>Game Elements</Title>
          </LinkText>
        </Accordion.Item>
        {accessToken && (
          <Accordion.Item label={<Title order={3}>Account</Title>}>
            <LinkText href={`${routes.profileView}`}>
              <Title order={4}>Profile</Title>
            </LinkText>

            <LinkText href={`${routes.settings}`}>
              <Title order={4}>Settings</Title>
            </LinkText>
          </Accordion.Item>
        )}
        <Accordion.Item label={<Title order={3}>Discuss</Title>}>
          <a href="https://discord.gg/NV4tVGpxPr">
            <Title order={4}>Join Discord</Title>
          </a>
        </Accordion.Item>
      </Accordion>
      <LinkText href={`${routes.search}`}>
        <Button
          size="md"
          // compact={true}
          fullWidth
        >
          Search
        </Button>
      </LinkText>
      {/* {!accessToken ? (
        <Button
          onClick={() => history.push(`${routes.login}`)}
          leftIcon={<LoginIcon />}
          fullWidth
          size="md"
        >
          Log In
        </Button>
      ) : (
        <Button
          onClick={() => logOut()}
          leftIcon={<LogoutIcon />}
          fullWidth
          size="md"
        >
          Log Out
        </Button>
      )} */}
    </Drawer>
  );
};
export default Sidebar;
