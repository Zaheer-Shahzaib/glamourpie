import {
  Box,
  Burger,
  Button,
  Container,
  Drawer,
  Group,
  rem,
  ScrollArea,
  useMantineTheme,
  Image,
} from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { IconLogin2 } from "@tabler/icons-react";
import classes from "./HeaderNav.module.scss";
import { Link, useNavigate } from "react-router-dom";
import { PATH_AUTH, PATH_PAGES } from "../../../routes";
import { useScroll } from "../../../Context/scrollContext";

const logo = "/run-analytics.png"; // Final unified logo path

const HeaderNav = () => {
  const { navigateToSection } = useScroll();
  const navigate = useNavigate();
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false);
  const theme = useMantineTheme();
  const tablet_match = useMediaQuery("(max-width: 768px)");

  const MOCK_DATA = [
    { link: PATH_PAGES.root, label: "Home" },
    { link: PATH_PAGES.about, label: "About Us" },
    { label: "Services", link: PATH_PAGES.services, onClick: () => navigateToSection("services", "/") },
    { link: PATH_PAGES.contact, label: "Pricing", onClick: () => navigate("/contact-us") },
    { link: PATH_PAGES.privacy, label: "Privacy Policy" },
    { link: PATH_PAGES.terms, label: "Terms of Service" },
    { link: PATH_PAGES.contact, label: "Contact Us" },
  ];

  const items = MOCK_DATA.map((link, index) => (
    <a
      key={`${link.label}-${index}`}
      href={link.link || "#"}
      className={classes.link}
      onClick={(e) => {
        e.preventDefault();
        link.onClick ? link.onClick() : (window.location.href = link.link);
        closeDrawer(); // Close drawer on mobile after click
      }}
    >
      {link.label}
    </a>
  ));

  return (
    <Box>
      <header
        className={classes.header}
        style={{
          backgroundColor: "#000", // Fixed black header
          color: "#fff",
          position: "fixed", // Always fixed on top
          top: 0,
          left: 0,
          width: "100%",
          zIndex: 2000, // Ensure it stays above everything
        }}
      >
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

          {/* Right Buttons & Mobile Burger */}
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

            {tablet_match && (
              <Burger
                opened={drawerOpened}
                onClick={toggleDrawer}
                size="sm"
                color="white"
              />
            )}
          </Group>
        </Container>
      </header>

      {/* Mobile Drawer */}
      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size="100%"
        padding="md"
        withOverlay={false} // Keeps header visible
        styles={{
          content: {
            backgroundColor: "#fff", // White drawer
            marginTop: "60px", // Start below header
          },
        }}
        transitionProps={{ transition: tablet_match ? "slide-up" : "slide-left" }}
        classNames={{
          content: classes.drawerContent,
          header: classes.drawerHeader,
          body: classes.drawerBody,
        }}
      >
        <ScrollArea h={`calc(100vh - ${rem(60)})`} mx="-md" scrollbarSize={0}>
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
