import {
  Button,
  Card,
  Container,
  Group,
  Image,
  Spoiler,
  Tab,
  Tabs,
  Text,
  Title,
} from '@mantine/core';
import Badges from 'components/common/Badges';
import { useState } from 'react';
import { inferQueryOutput } from 'utils/trpc';

type UserValues = inferQueryOutput<'user.byId'>;

interface UserInfoProps {
  user: UserValues;
  children?: React.ReactNode;
}
const UserInfo = ({ user, children }: UserInfoProps) => {
  const [activeTab, setActiveTab] = useState(0);
  return (
    <Container>
      <Card>
        <Group direction="column" spacing="lg" grow>
          <Group
            noWrap={true}
            sx={{
              '>div': { padding: '8px' },
            }}
            position="apart"
            spacing={10}
          >
            <Container sx={{ maxWidth: '200px' }}>
              <Image
                src={user.image || undefined}
                width={'150px'}
                height={'100%'}
                radius="md"
              />
            </Container>
            <Group direction="column">
              <Group direction="column" spacing="xs">
                <Title order={5} style={{ fontSize: 16 }}>
                  {user?.name}
                </Title>
                <Text size="sm">By {user.name}</Text>
              </Group>

              {/* <Group sx={{ marginTop: 20 }}>
              <Text size="xs">
                {!novelData?.novelStatus ? 'Ongoing' : 'Completed'}
              </Text>
              <Text size="xs">{novelData?.views} Views</Text>
            </Group> */}
            </Group>
          </Group>
          {/* <NewCard>
          <Group position="apart">
            <Text size="sm" weight={500}>
              {novelData?.chapters} Chapters
            </Text>
            <Text size="sm" weight={500}>
              ⭐{novelData?.rating}
            </Text>
            <Text size="sm" weight={500}>
              {novelData?.review_count} Reviews
            </Text>
          </Group>
        </NewCard> */}

          <Tabs
            orientation={'horizontal'}
            grow
            position="center"
            active={activeTab}
            onTabChange={setActiveTab}
            styles={{ body: { width: '100%' } }}
          >
            <Tab label={<Title order={3}>Description</Title>}>
              {user?.name}
              {/* <Description height={200} text={novelData?.description} /> */}
            </Tab>
            <Tab label={<Title order={3}>Reviews</Title>}></Tab>
          </Tabs>

          <Group direction="column">
            <Title align="left" order={5}>
              Tags
            </Title>

            <Container>
              <Spoiler
                maxHeight={55}
                showLabel={<Button variant="outline">^</Button>}
                hideLabel={<Button variant="outline">˅</Button>}
              >
                {/* <Badges items={user.Listing} /> */}
              </Spoiler>
            </Container>
          </Group>
        </Group>
        {children}
      </Card>
    </Container>
  );
};

export default UserInfo;
