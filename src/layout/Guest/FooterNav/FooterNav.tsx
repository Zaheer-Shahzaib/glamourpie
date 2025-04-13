import {
  ActionIcon,
  ActionIconProps,
  Container,
  Divider,
  Flex,
  Group,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import {
  IconBrandFacebook,
  IconBrandGithub,
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandTwitter,
  IconWorld,
} from '@tabler/icons-react';

import './FooterNav.css';

const ICON_SIZE = 18;

const ACTION_ICON_PROPS: ActionIconProps = {
  size: 'lg',
  color: 'primary.3',
  variant: 'transparent',
};

const FooterNav = () => {
  const mobile_match = useMediaQuery('(max-width: 425px)');

  return (
    <footer className="footer">
      <Container fluid mb="xl">
        <Stack gap="lg">
          <Title ta="center" order={2}>
            Start automating your Amazon invoices with InvoiceGenie
          </Title>
          <Text ta="center">
            <strong>InvoiceGenie</strong> is your one-stop platform to create, manage, and upload compliant Amazon invoices with speed, automation, and ease. Whether you're VAT registered or not, we’ve got tailored invoice templates to suit your needs — fully aligned with Amazon policies and VAT compliance.
          </Text>
          <Group justify="center">
            <Text ta="center">
              ⭐ Help us grow — star the project or share it with your network!
            </Text>
          </Group>
        </Stack>

        <Divider mt="xl" mb="md" />

        <Flex
          direction={{ base: 'column', sm: 'row' }}
          gap={{ base: 'sm', sm: 'lg' }}
          justify={{ base: 'center', sm: 'space-between' }}
          align={{ base: 'center' }}
        >
          {/* Footer Social Icons */}
          <Group gap="xs" align="center" justify="flex-end" wrap="nowrap">
            <ActionIcon
              component="a"
              href="https://kelvinkiprop.netlify.app/"
              target="_blank"
              {...ACTION_ICON_PROPS}
            >
              <IconWorld size={ICON_SIZE} />
            </ActionIcon>
            <ActionIcon
              component="a"
              href="https://github.com/kelvink96"
              target="_blank"
              {...ACTION_ICON_PROPS}
            >
              <IconBrandGithub size={ICON_SIZE} />
            </ActionIcon>
            <ActionIcon
              component="a"
              href="https://twitter.com/kelvink_96"
              target="_blank"
              {...ACTION_ICON_PROPS}
            >
              <IconBrandTwitter size={ICON_SIZE} />
            </ActionIcon>
            <ActionIcon
              component="a"
              href="https://www.linkedin.com/in/kelvink96/"
              target="_blank"
              {...ACTION_ICON_PROPS}
            >
              <IconBrandLinkedin size={ICON_SIZE} />
            </ActionIcon>
            <ActionIcon
              component="a"
              href="https://www.facebook.com/kelvinkk96"
              target="_blank"
              {...ACTION_ICON_PROPS}
            >
              <IconBrandFacebook size={ICON_SIZE} />
            </ActionIcon>
            <ActionIcon
              component="a"
              href="https://www.instagram.com/kelvink_96/"
              target="_blank"
              {...ACTION_ICON_PROPS}
            >
              <IconBrandInstagram size={ICON_SIZE} />
            </ActionIcon>
          </Group>
        </Flex>
      </Container>
    </footer>
  );
};

export default FooterNav;
