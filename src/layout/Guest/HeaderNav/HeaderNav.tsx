import {
  Box,
  Burger,
  Button,
  Container,
  Drawer,
  Group,
  rem,
  ScrollArea,
  useMantineColorScheme,
  useMantineTheme,
  Image,
} from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { IconLogin2 } from "@tabler/icons-react";
import classes from "./HeaderNav.module.scss";
import { Link, useNavigate } from "react-router-dom";
import { PATH_AUTH, PATH_PAGES } from "../../../routes";
import { useScroll } from "../../../Context/scrollContext";

const logo = "/assets/logo (2).jpg";

const HeaderNav = () => {
  const { navigateToSection } = useScroll();
  const navigate = useNavigate();
  const MOCK_DATA = [
    { link: PATH_PAGES.root, label: "Home" },
    { link: PATH_PAGES.about, label: "About Us" },
    { label: "Services", link: PATH_PAGES.services, onClick: () => navigateToSection("services", "/") },
    { link: PATH_PAGES.contact, label: "Pricing", onClick: () => navigate("/contact-us") },
    { link: PATH_PAGES.privacy, label: "Privacy Policy" },
    { link: PATH_PAGES.terms, label: "Terms of Service" },
    { link: PATH_PAGES.contact, label: "Contact Us" },
  ];

  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false);
  const theme = useMantineTheme();
  const tablet_match = useMediaQuery("(max-width: 768px)");

  const items = MOCK_DATA.map((link, index) => (
    <a
      key={`${link.label}-${index}`}
      href={link.link || "#"}
      className={classes.link}
      onClick={(e) => {
        e.preventDefault();
        link.onClick ? link.onClick() : (window.location.href = link.link);
        closeDrawer(); // close drawer after click
      }}
    >
      {link.label}
    </a>
  ));

  return (
    <Box>
      <header className={classes.header}>
        <Container className={classes.inner} fluid>
          {/* Logo */}
          <Link to={PATH_PAGES.root}>
            <Image
              className="logo"
              src={`${process.env.PUBLIC_URL}/run-analytics.png`}
              alt="logo"
              style={{ height: 60 }}
            />
          </Link>

          {/* Desktop Links */}
          <Group gap="xs" display={{ base: "none", sm: "flex" }} className={classes.links}>
            {items}
          </Group>

          {/* Right Buttons & Burger */}
          <Group gap="sm" style={{ marginLeft: "auto" }}>
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

            {/* Burger for Mobile */}
            {tablet_match && <Burger opened={drawerOpened} onClick={toggleDrawer} size="sm" color="white" />}
          </Group>
        </Container>
      </header>

      {/* Mobile Drawer */}
      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size="100%"
        padding="md"
        title={
          <Link to="/" className={classes.logoLink} style={{ marginLeft: "30px" }}>
            <Image src={logo} height={30} width={100} fit="contain" alt="Company Logo" className={classes.logo} />
          </Link>
        }
        className={classes.hiddenDesktop}
        zIndex={1000000}
        transitionProps={{ transition: tablet_match ? "slide-up" : "slide-left" }}
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
