import {
  Box,
  Burger,
  Button,
  Container,
  Drawer,
  Group,
  ScrollArea,
  useMantineTheme,
} from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import {
  IconLogin2,
  IconStarsFilled,
} from "@tabler/icons-react";

import classes from "./HeaderNav.module.scss";
import { Link } from "react-router-dom";

const MOCK_DATA = [
  {
    link: "/",
    label: "Home",
  },
  {
    link: "",
    label: "Services",
  },
  {
    link: "",
    label: "About us",
  },

  {
    link: "",
    label: "Support",
  },
  {
    link: "",
    label: "Contact Us",
  },
];

const HeaderNav = () => {
  const theme = useMantineTheme();
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
    useDisclosure(false);
  const tablet_match = useMediaQuery("(max-width: 768px)");

  const items = MOCK_DATA.map((link) => {
    return (
      <a
        key={link.label}
        href={link.link}
        className={classes.link}
      >
        {link.label}
      </a>
    );
  });

  return (
    <Box>
      <header className={classes.header}>
        <Container
          classNames={{ root: classes.inner }}
          fluid
        >
          {/* <Logo style={{ color: theme.white }} /> */}
          <Group
            gap='xs'
            display={{ base: "none", sm: "flex" }}
            className={classes.links}
          >
            {items}
          </Group>
          <Group>
            <Button
              component={Link}
              target='_blank'
              to={"PATH_GITHUB.repo"}
              variant='transparent'
              c='white'
              rightSection={<IconLogin2 size={20} />}
              className={classes.link}
            >
              Sign In
            </Button>
            <Button
              component={Link}
              to={"PATH_AUTH.signin"}
              rightSection={<IconLogin2 size={20} />}
            >
              Sign Up
            </Button>
          </Group>
          <Burger
            opened={drawerOpened}
            onClick={toggleDrawer}
            className={classes.hiddenDesktop}
            color={theme.white}
          />
        </Container>
      </header>
      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size='100%'
        padding='md'
        title='Menu'
        className={classes.hiddenDesktop}
        zIndex={1000000}
        transitionProps={{
          transition: tablet_match ? "slide-up" : "slide-left",
        }}
      >
        <ScrollArea
          h={`calc(100vh - 60px)`}
          mx='-md'
        >
          {items}
          <Button
            component={Link}
            target='_blank'
            to={"PATH_GITHUB.repo"}
            variant='transparent'
            c='white'
            leftSection={<IconStarsFilled size={16} />}
            className={classes.link}
          >
            Give us a star
          </Button>
          <Button
            component={Link}
            to={"PATH_DASHBOARD.default"}
          >
            Live Previews
          </Button>
        </ScrollArea>
      </Drawer>
    </Box>
  );
};

export default HeaderNav;
