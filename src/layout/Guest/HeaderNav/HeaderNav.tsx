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

const logo = '/assets/logo (2).jpg';

const HeaderNav = () => {
  const { navigateToSection } = useScroll();
  const navigate = useNavigate();
  const MOCK_DATA = [
    {
      link: PATH_PAGES.root,
      label: "Home",
    },
    {
      label: "Services",
      link: PATH_PAGES.services,
      onclick: () => {
        navigateToSection("services", "/");
      },
    },
    {
      link: PATH_PAGES.contact,
      label: "Pricing",
      onClick: () => navigate("/contact-us"),
    },
    {
      link: PATH_PAGES.support,
      label: "Support",
      onclick: () => {
        navigateToSection("support", "/");
      },
    },
    {
      link: PATH_PAGES.contact,
      label: "Contact Us",
    },
    {
      link: PATH_PAGES.privacy,
      label: "Privacy Policy",
    },
    {
      link: PATH_PAGES.about, 
      label: "About Us", 
    }
  ];

  const ICON_SIZE = 20;
  const theme = useMantineTheme();
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
    useDisclosure(false);
  const { setColorScheme, colorScheme } = useMantineColorScheme();
  const tablet_match = useMediaQuery("(max-width: 768px)");

  const items = MOCK_DATA.map((link) => (
    <a
      key={link.label}
      href={link.link || "#"}
      className={classes.link}
      onClick={(e) => {
        e.preventDefault();
        link.onclick ? link.onclick() : (window.location.href = link.link);
      }}
    >
      {link.label}
    </a>
  ));

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
                className="logo"
                src={`${process.env.PUBLIC_URL}/run-analytics.png`}
                alt="logo"
                style={{ height: 100 }}
              />
            </Link>
            {items}
          </Group>

          {/* Right-aligned buttons */}
          <Group gap="sm" style={{ marginLeft: 'auto' }}>
            <Button
              component={Link}
              to={PATH_AUTH.signin}
              variant="transparent"
              c="white"
              leftSection={<IconLogin2 size={20} />}
              className={classes.link}
            >
              Sign In
            </Button>
            {/* <Button
              component={Link}
              to={PATH_AUTH.signup}
              leftSection={<IconUserCircle size={20} />}
            >
              Sign Up
            </Button> */}
            <Menu shadow="lg" width={200}>
              <Menu.Target>
                <Tooltip label="Switch color modes">
                  <Button variant="dark">
                    {colorScheme === "auto" ? (
                      <IconCircleHalf2 size={ICON_SIZE} />
                    ) : colorScheme === "dark" ? (
                      <IconMoonStars size={ICON_SIZE} />
                    ) : (
                      <IconSunHigh size={ICON_SIZE} />
                    )}
                  </Button>
                </Tooltip>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Label tt="uppercase" ta="center" fw={600}>
                  Select color modes
                </Menu.Label>
                <Menu.Item leftSection={<IconSunHigh size={16} />} onClick={() => setColorScheme("light")}>
                  Light
                </Menu.Item>
                <Menu.Item leftSection={<IconMoonStars size={16} />} onClick={() => setColorScheme("dark")}>
                  Dark
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Container>
      </header>

      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size="100%"
        padding="md"
        title={
          <Link to="/" className={classes.logoLink} style={{ marginLeft: '30px' }}>
            <Image
              src={logo}
              height={15}
              width={60}
              fit="contain"
              alt="Company Logo"
              className={classes.logo}
            />
          </Link>
        }
        className={classes.hiddenDesktop}
        zIndex={1000000}
        transitionProps={{
          transition: tablet_match ? "slide-up" : "slide-left",
        }}
      >
        <ScrollArea h={`calc(100vh - ${rem(60)})`} mx="-md" scrollbarSize={0}>
          <Group display={{ base: "flex" }} className={classes.links} style={{ flexDirection: "column" }} align="start">
            {items}
          </Group>
        </ScrollArea>
      </Drawer>
    </Box>
  );
};

export default HeaderNav;