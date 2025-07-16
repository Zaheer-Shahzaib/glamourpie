import {
  Container,
  Grid,
  Text,
  Anchor,
  Divider,
  Group,
  useMantineTheme,
} from "@mantine/core";
import {
  IconBrandTwitter,
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandLinkedin,
} from "@tabler/icons-react";

const FooterNav = () => {
  const theme = useMantineTheme();

  return (
    <footer
      className="text-white pt-10"
      style={{ backgroundColor: theme.colors.blue[4] }}
    >
      <Container>
        <Grid gutter="xl">
          <Grid.Col span={{ base: 12, sm: 6, md: 6 }}>
            <Text className="font-semibold text-lg mb-2">About RunAnalytic Technology</Text>
            <Text className="text-sm leading-relaxed mb-2">
              RunAnalytic Technology is a trusted technology provider serving businesses across UAE & KSA. Our team is dedicated to providing data-driven insights and enterprise solutions.
            </Text>
            <Anchor href="#" className="text-blue-200 text-sm">
              Learn more
            </Anchor>
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 6, md: 6 }} className="pl-12">
  <Text className="font-semibold text-lg mb-4 text-white">Contact</Text>
  <ul className="space-y-3 text-sm text-gray-300">
    <li>
      <Text className="text-sm">
        <span className="block font-medium text-gray-400">Address</span>
        UAE, KSA
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
        support@runanalytic.com
      </Text>
    </li>
    
  </ul>
</Grid.Col>

        </Grid>

        <Divider my="md" className="border-gray-700" />

        <div className="flex flex-col sm:flex-row justify-between items-center py-4 text-sm text-gray-300">
          <Text>
            &copy; 2025 <span className="font-semibold">RunAnalytic Technology</span> - All Rights Reserved&reg;.
          </Text>
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
