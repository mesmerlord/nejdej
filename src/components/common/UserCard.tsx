import React from 'react';
import { createStyles, Card, Avatar, Text, Group, Button } from '@mantine/core';
import LinkText from './LinkText';

const useStyles = createStyles((theme) => ({
  card: {
    backgroundColor:
      theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
  },

  avatar: {
    border: `2px solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white
    }`,
  },
}));

interface UserCardImageProps {
  avatar: string;
  name: string;
  id: string;
}

export function UserCard({ avatar, name, id }: UserCardImageProps) {
  const { classes, theme } = useStyles();

  return (
    <Card withBorder padding="xl" radius="md" className={classes.card}>
      {/* <Card.Section sx={{ backgroundImage: `url(${image})`, height: 140 }} /> */}
      <Avatar
        src={avatar}
        size={80}
        radius={80}
        mx="auto"
        mt={-30}
        className={classes.avatar}
      />
      <Text align="center" size="lg" weight={500} mt="sm">
        {name}
      </Text>

      <LinkText href={`/user/${id}`}>
        <Button
          fullWidth
          radius="md"
          mt="xl"
          size="md"
          color={theme.colorScheme === 'dark' ? undefined : 'dark'}
        >
          View Profile
        </Button>
      </LinkText>
    </Card>
  );
}
