import {
  Container,
  Grid,
  Text,
  Anchor,
  Divider,
  Group,
  useMantineTheme,
  Button,
} from "@mantine/core";
import {
  IconBrandTwitter,
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandLinkedin,
  IconArrowRight,
} from "@tabler/icons-react";
import { Link } from "react-router-dom";
import { PATH_PAGES } from "../../../routes/index";

const FooterNav = () => {
  const theme = useMantineTheme();

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer
      className="text-white pt-10"
      style={{ backgroundColor: theme.colors.blue[4] }}
    >
      <Container>
        <Grid gutter="xl">
          {/* About Section */}
          <Grid.Col span={{ base: 12, sm: 4, md: 4 }}>
            <Text className="font-semibold text-lg mb-2">
              RunAnalytic Technology
            </Text>
            <Text className="text-sm leading-relaxed mb-2">
              RunAnalytic Technology is a trusted technology provider serving
              businesses across UAE & KSA. Our team is dedicated to providing
              data-driven insights and enterprise solutions.
            </Text>

            <Button
              variant="subtle"
              component={Link}
              to={PATH_PAGES.about}
              rightSection={<IconArrowRight size={16} />}
              className="mt-4 bg-blue-900 hover:bg-blue-700 text-white hover:text-white px-4 py-2 rounded-lg text-sm font-medium shadow-md transition"
            >
              About Us
            </Button>
          </Grid.Col>

          {/* Contact Section */}
          <Grid.Col span={{ base: 12, sm: 4, md: 4 }}>
            <Text className="font-semibold text-lg mb-4 text-white">
              Contact
            </Text>
            <ul className="space-y-3 text-sm text-gray-300">
              <li>
                <Text className="text-sm">
                  <span className="block font-medium text-gray-400">Address</span>
                  UAE
                </Text>
              </li>
              <li>
                <Text className="text-sm">
                  <span className="block font-medium text-gray-400">Phone</span>
                  +971 54 385 8251
                </Text>
              </li>
              <li>
                <Text className="text-sm">
                  <span className="block font-medium text-gray-400">Email</span>
                  <a 
                    href="https://mail.google.com/mail/?view=cm&to=support@runanalytic.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    support@runanalytic.com
                  </a>
                </Text>
              </li>
            </ul>
          </Grid.Col>

          {/* More Section */}
          <Grid.Col span={{ base: 12, sm: 4, md: 4 }}>
            <Text className="font-semibold text-lg mb-4 text-white">
              More
            </Text>
            <ul className="space-y-3 text-sm text-gray-300">
              <li>
                <Link to={PATH_PAGES.privacy} onClick={handleClick}>
                  <Text className="text-sm hover:underline hover:font-semibold">Privacy Policy</Text>
                </Link>
              </li>
              <li>
                <Link to={PATH_PAGES.terms} onClick={handleClick}>
                  <Text className="text-sm hover:underline hover:font-semibold">Terms Of Service</Text>
                </Link>
              </li>
              <li>
                <Link to={PATH_PAGES.about} onClick={handleClick}>
                  <Text className="text-sm hover:underline hover:font-semibold">About Us</Text>
                </Link>
              </li>
            </ul>
          </Grid.Col>
        </Grid>

        <Divider my="md" className="border-gray-700" />

        {/* Bottom Footer */}
        <div className="flex flex-col sm:flex-row justify-between items-center py-4 text-sm text-gray-300">
          <Text>
            &copy; 2025 <span className="font-semibold">RunAnalytic Technology</span> - All
            Rights Reserved&reg;.
          </Text>
          {/* Uncomment if you want social icons */}
          {/* <Group className="mt-2 sm:mt-0">
            <Anchor href="#" className="text-gray-300 hover:text-white">
              <IconBrandInstagram size={18} />
            </Anchor>
            <Anchor href="#" className="text-gray-300 hover:text-white">
              <IconBrandFacebook size={18} />
            </Anchor>
            <Anchor href="#" className="text-gray-300 hover:text-white">
              <IconBrandTwitter size={18} />
            </Anchor>
            <Anchor href="#" className="text-gray-300 hover:text-white">
              <IconBrandLinkedin size={18} />
            </Anchor>
          </Group> */}
        </div>
      </Container>
    </footer>
  );
};

export default FooterNav;
