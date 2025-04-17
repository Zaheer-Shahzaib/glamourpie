import {
  Box,
  Burger,
  Button,
  Container,
  Drawer,
  Group,
  rem,
  ScrollArea,
  UnstyledButton,
  useMantineTheme,
} from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { IconLogin2, IconUserCircle } from "@tabler/icons-react";

import classes from "./HeaderNav.module.scss";
import { Link } from "react-router-dom";
import { PATH_AUTH, PATH_PAGES } from "../../../routes";

const MOCK_DATA = [
  {
    link: PATH_PAGES.root,
    label: "Home",
  },
  {
    link: PATH_PAGES.services,
    label: "Services",
  },
  {
    link: PATH_PAGES.about,
    label: "About us",
  },

  {
    link: PATH_PAGES.support,
    label: "Support",
  },
  {
    link: PATH_PAGES.contact,
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
              to={PATH_AUTH.signin}
              variant='transparent'
              c='white'
              leftSection={<IconLogin2 size={20} />}
              className={classes.link}
            >
              Sign In
            </Button>
            <Button
              component={Link}
              to={PATH_AUTH.signup}
              leftSection={<IconUserCircle size={20} />}
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
          h={`calc(100vh - ${rem(60)})`}
          mx='-md'
          scrollbarSize={0}
        >
          <Group
            display={{ base: "flex" }}
            className={classes.links}
            style={{ flexDirection: "column" }}
            align="start"
          >
            {items}
          </Group>
        </ScrollArea>
      </Drawer>
    </Box>
  );
};

export default HeaderNav;
