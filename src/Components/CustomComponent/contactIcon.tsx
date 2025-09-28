import { IconAt, IconMapPin, IconPhone, IconSun } from '@tabler/icons-react';
import { Box, Stack, Text } from '@mantine/core';
import classes from './contactIcon.module.scss';

interface ContactIconProps extends Omit<React.ComponentPropsWithoutRef<'div'>, 'title'> {
  icon: typeof IconSun;
  title: React.ReactNode;
  description: React.ReactNode;
}

function ContactIcon({ icon: Icon, title, description, ...others }: ContactIconProps) {
  return (
    <div className={classes.wrapper} {...others}>
      <Box mr="md">
        <Icon size={24} />
      </Box>

      <div>
        <Text size='sm' fw={600} className={classes.title}>
          {title}
        </Text>
        <Text className={classes.description}>{description}</Text>
      </div>
    </div>
  );
}

const MOCKDATA = [
  {
    title: 'Email',
    description: (
      <a 
        href="https://mail.google.com/mail/?view=cm&fs=1&to=support@runanalytic.com" 
        target="_blank" 
        rel="noopener noreferrer"
        className="hover:underline"
      >
        support@runanalytic.com
      </a>
    ),
    icon: IconAt
  }
  ,
  { title: 'Phone', description: ' +971 54 385 8251', icon: IconPhone },
  { title: 'Address', description: ' UAE', icon: IconMapPin }
];

export function ContactIconsList() {
  const items = MOCKDATA.map((item, index) => <ContactIcon key={index} {...item} />);
  return <Stack>{items}</Stack>;
}