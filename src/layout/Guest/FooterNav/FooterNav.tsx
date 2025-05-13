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
      className={`text-white pt-10`}
      style={{ backgroundColor: theme.colors.blue[4] }}
    >
      <Container>
        <Grid gutter={'xl'}>
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Text className='font-semibold text-lg mb-2'>About InvoiceApp</Text>
            <Text className='text-sm leading-relaxed mb-2'>
              Go Paperless! Get Paid Faster!! Simple And Easy-to-use Online
              Invoicing Software for Small Business Owners & Freelancers.
            </Text>
            <Anchor
              href='#'
              className='text-blue-400 text-sm'
            >
              Tweet
            </Anchor>
          </Grid.Col>

          <Grid.Col span={{ base: 6, sm: 3, md: 3 }}>
            <Text className='font-semibold text-lg mb-2'>Links</Text>
            <ul className='space-y-1 text-sm'>
              <li>
                <Anchor
                  className='text-blue-500 text-sm'
                  href='#'
                >
                  Pricing
                </Anchor>
              </li>
              <li>
                <Anchor
                  className='text-blue-500 text-sm'
                  href='#'
                >
                  Features
                </Anchor>
              </li>
              <li>
                <Anchor
                  className='text-blue-500 text-sm'
                  href='#'
                >
                  API Docs
                </Anchor>
              </li>
              <li>
                <Anchor
                  className='text-blue-500 text-sm'
                  href='#'
                >
                  Invoice Blog
                </Anchor>
              </li>
            </ul>
          </Grid.Col>

          <Grid.Col span={{ base: 6, sm: 3, md: 3 }}>
            <Text className='font-semibold text-lg mb-2'>Products</Text>
            <ul className='space-y-1 text-sm'>
              <li>
                <Anchor
                  className='text-blue-500 text-sm'
                  href='#'
                >
                  Free Templates
                </Anchor>
              </li>
              <li>
                <Anchor
                  className='text-blue-500 text-sm'
                  href='#'
                >
                  Accountants
                </Anchor>
              </li>
              {/* <li><Anchor href="#">Freelancers</Anchor></li>
              <li><Anchor href="#">Integrations</Anchor></li> */}
            </ul>
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Text className='font-semibold text-lg mb-2'>Support</Text>
            <ul className='space-y-1 text-sm'>
              <li>
                <Anchor
                  className='text-blue-500 text-sm'
                  href='#'
                >
                  Help center
                </Anchor>
              </li>
              <li>
                <Anchor
                  className='text-blue-500 text-sm'
                  href='#'
                >
                  Terms
                </Anchor>
              </li>
              <li>
                <Anchor
                  className='text-blue-500 text-sm'
                  href='#'
                >
                  FAQs
                </Anchor>
              </li>
              <li>
                <Anchor
                  className='text-blue-500 text-sm'
                  href='#'
                >
                  Demo
                </Anchor>
              </li>
            </ul>
          </Grid.Col>
        </Grid>

        <Divider
          my='md'
          className='border-gray-700'
        />

        <div className='flex flex-col sm:flex-row justify-between items-center py-4 text-sm text-gray-300'>
          <Text>
            &copy; 2025 <span className='font-semibold'>InvoiceApp Inc.</span> - All
            Rights Reserved&reg;.
          </Text>
          <Group className='mt-2 sm:mt-0'>
            <Anchor
              href='#'
              className='text-gray-300 hover:text-white'
            >
              <IconBrandInstagram size={18} />
            </Anchor>
            <Anchor
              href='#'
              className='text-gray-300 hover:text-white'
            >
              <IconBrandFacebook size={18} />
            </Anchor>
            <Anchor
              href='#'
              className='text-gray-300 hover:text-white'
            >
              <IconBrandTwitter size={18} />
            </Anchor>
            <Anchor
              href='#'
              className='text-gray-300 hover:text-white'
            >
              <IconBrandLinkedin size={18} />
            </Anchor>
          </Group>
        </div>
      </Container>
    </footer>
  );
};

export default FooterNav;
