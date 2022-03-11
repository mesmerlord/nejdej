import { Button, Card, Group, Image, Text } from '@mantine/core';
import { inferQueryOutput } from 'utils/trpc';
import LinkText from './LinkText';

type Photo = {
  id?: string;
  url: string;
};

type SingleListing = {
  id: string;
  photos: Photo[];
  description: string | null;
  title: string;
};

interface ListingCardProps {
  listing: SingleListing;
}

const ListingCard = ({ listing }: ListingCardProps) => {
  return (
    <LinkText href={`/listing/${listing.id}`}>
      <Card shadow="sm" padding="lg">
        <Card.Section>
          <Image
            src={`${listing?.photos[0]?.url}?=${Math.floor(
              Math.random() * 1000,
            )}`}
            height={160}
          />
        </Card.Section>

        <Group position="apart" style={{ marginBottom: 5 }}>
          <Text weight={500}>{listing.title}</Text>
        </Group>

        <Text size="sm">{listing.description}</Text>

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
  );
};
export default ListingCard;
