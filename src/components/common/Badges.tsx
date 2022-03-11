import { Badge } from '@mantine/core';
import LinkText from './LinkText';

type Item = {
  id: string;
  // url: string;
  name: string;
};

interface BadgesProps {
  items: Item[];
}

const Badges = ({ items }: BadgesProps) => {
  return (
    <>
      {items?.map((item) => (
        <LinkText key={item.id} href={``}>
          <Badge
            variant="dot"
            size="md"
            color="blue"
            sx={{ cursor: 'pointer', margin: '2px' }}
          >
            {item.name}
          </Badge>
        </LinkText>
      ))}
    </>
  );
};
export default Badges;
