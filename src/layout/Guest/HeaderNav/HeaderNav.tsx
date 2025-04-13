import {
  Box,
  Burger,
  Button,
  Container,
  Drawer,
  Group,
  ScrollArea,
  rem,
  useMantineTheme,
} from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { IconBrandGithub, IconPlayerPlay } from "@tabler/icons-react";
// import { PATH_AUTH, PATH_DASHBOARD, PATH_DOCS, PATH_GITHUB } from '@/routes';

import "./HeaderNav.css";
import { Link } from "react-router-dom";

const MOCK_DATA = [
  {
    link: "",
    label: "Home",
  },

  {
    link: "",
    label: "Pricing",
  },
  {
    link: "",
    label: "Services",
  },
];

type HeaderNavProps = {
  mobileOpened: boolean;
  toggleMobile: () => void;
  desktopOpened: boolean;
  toggleDesktop: () => void;
};

const HeaderNav = ({
  mobileOpened,
  toggleMobile,
  desktopOpened,
  toggleDesktop,
}: HeaderNavProps) => {
  const theme = useMantineTheme();

  const items = MOCK_DATA.map((link) => (
    <a
      key={link.label}
      href={link.link}
      target='_blank'
      className={"link"}
    >
      {link.label}
    </a>
  ));

  return (
    <header className='header'>
      <Container
        className='inner'
        fluid
      >
        <Group
          gap='xs'
          className='links'
        >
          <Burger
            opened={mobileOpened}
            onClick={toggleMobile}
            hiddenFrom='sm'
            size='sm'
            className='burger'
            c={theme.white}
          />
          <Burger
            opened={desktopOpened}
            onClick={toggleDesktop}
            visibleFrom='sm'
            size='sm'
            style={{
              backgroundColor: theme.white,
              color: theme.colors.blue[1],
            }}
          />
          {items}
          <Box style={{ flexGrow: 1 }} />
        </Group>
        <Group>
          <Button
            component='a'
            target='_blank'
            href={""}
            variant='transparent'
            c='white'
            leftSection={<IconBrandGithub size={16} />}
            className='link'
          >
            Give us a star
          </Button>
          <Link to={""}>
            <Button>Live Previews</Button>
          </Link>
        </Group>
      </Container>
    </header>
  );
};

export default HeaderNav;
