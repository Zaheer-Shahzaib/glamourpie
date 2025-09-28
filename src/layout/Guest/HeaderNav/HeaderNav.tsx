import {
  Box,
  Burger,
  Button,
  Container,
  Drawer,
  Group,
  Menu,
  rem,
  ScrollArea,
  Tooltip,
  useMantineColorScheme,
  useMantineTheme,
  Image,
  Text,
} from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import {
  IconCircleHalf2,
  IconLogin2,
  IconMoonStars,
  IconSunHigh,
  IconUserCircle,
} from "@tabler/icons-react";
import classes from "./HeaderNav.module.scss";
import { Link, useNavigate } from "react-router-dom";
import { PATH_AUTH, PATH_PAGES } from "../../../routes";
import { useScroll } from "../../../Context/scrollContext";
import { useAuth } from "../../../Context/useAuth";

const logo = "/run-analytics.png";

const HeaderNav = () => {
  const { navigateToSection } = useScroll();
  const navigate = useNavigate();
  const MOCK_DATA = [
    { link: PATH_PAGES.root, label: "Home" },
    { link: PATH_PAGES.about, label: "About Us" },
    {
      label: "Services",
      link: PATH_PAGES.services,
      // onClick: () => navigateToSection("services", "/"),
    },
    {
      link: PATH_PAGES.root,
      label: "Pricing",
      onClick: () => navigateToSection("pricing", "/"),
    },
    { link: PATH_PAGES.privacy, label: "Privacy Policy" },
    { link: PATH_PAGES.terms, label: "Terms of Service" },

    { link: PATH_PAGES.contact, label: "Contact Us" },
  ];

  const ICON_SIZE = 20;
  const theme = useMantineTheme();
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
    useDisclosure(false);
  const { setColorScheme, colorScheme } = useMantineColorScheme();
  const tablet_match = useMediaQuery("(max-width: 768px)");
  const { isAuthenticated, logout } = useAuth();
  const items = MOCK_DATA.map((link, index) => (
    <a
      key={`${link.label}-${index}`}
      href={link.link || "#"}
      className={classes.link}
      onClick={(e) => {
        e.preventDefault();
        link.onClick ? link.onClick() : (window.location.href = link.link);
      }}
    >
      {link.label}
    </a>
  ));

  const handleLogout = () => {
    logout();
    navigate("/");
  };
  return (
    <Box>
      <header className={classes.header}>
        <Container
          classNames={{ root: classes.inner }}
          fluid
        >
          <Group
            gap='xs'
            display={{ base: "none", sm: "flex" }}
            className={classes.links}
          >
            <Link to={PATH_PAGES.root}>
              <Image
                className='logo'
                src={`${process.env.PUBLIC_URL}/run-analytics.png`}
                alt='logo'
                style={{ height: 100 }}
              />
            </Link>
            {items}
          </Group>
          <Burger
            opened={drawerOpened}
            onClick={toggleDrawer}
            color='white'
            size='sm'
            className={classes.hiddenDesktop}
          />
          <Group
            gap='sm'
            style={{ marginLeft: "auto" }}
          >
            {
              !isAuthenticated && (
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
              )
              // : loading ? (
              //   <Text c='white'>Loading...</Text>
              // ) : (
              //   <Text c='white'>Hello, {profile?.username}</Text>
              // )
            }

            {isAuthenticated && (
              <Button
                onClick={handleLogout}
                variant='transparent'
                c='white'
                leftSection={<IconLogin2 size={20} />}
                className={classes.link}
              >
                Logout
              </Button>
            )}
          </Group>
        </Container>
      </header>

      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size='100%'
        padding='md'
        title={
          <Link
            to='/'
            className={classes.logoLink}
            style={{ marginLeft: "30px" }}
          >
            <Image
              src={logo}
              height={15}
              width={60}
              // fit="contain"
              alt='Company Logo'
              // className={classes.logo}
              style={{
                width: 100,
                height: 24,
              }}
            />
          </Link>
        }
        className={classes.hiddenDesktop}
        zIndex={1000}
        transitionProps={{
          transition: tablet_match ? "slide-up" : "slide-left",
        }}
        classNames={{
          content: classes.drawerContent,
          header: classes.drawerHeader,
          body: classes.drawerBody,
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
            align='start'
          >
            {items}
          </Group>
        </ScrollArea>
      </Drawer>
    </Box>
  );
};

export default HeaderNav;
