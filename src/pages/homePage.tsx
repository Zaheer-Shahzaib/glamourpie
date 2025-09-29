import {
  Box,
  Button,
  Container,
  ContainerProps,
  Grid,
  Group,
  Image,
  Paper,
  PaperProps,
  SimpleGrid,
  Stack,
  Text,
  Title,
  rem,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconArrowRight, IconPlayerPlay } from "@tabler/icons-react";
import PrivacyPolicy from "./PrivacyPolicy/PrivacyPolicy";

// import Link from 'next/link';
// import { PATH_APPS, PATH_AUTH, PATH_DASHBOARD, PATH_GITHUB } from '@/routes';
import GuestLayout from "../layout/Guest";
import { Link } from "react-router-dom";
import Pricing from "./price";

import classes from "../styles/Home.module.scss";
import Faqs from "../Components/Faqs/Faqs";
import Services from "../Components/services";
import { PATH_AUTH } from "../routes";
const DASHBOARDS = [
  {
    icon: "/showcase/dashboard-default.png",
    title: "Automatic Invoice Uploading",
    desp: "Generate and upload invoices seamlessly via SP-API integration — no manual effort required.",
  },
  {
    icon: "/showcase/dashboard-analytics.png",
    title: "Smart Invoice Templates",
    desp: "Choose from simple and premium templates designed for both VAT and non-VAT registered businesses.",
  },
  {
    icon: "/showcase/dashboard-saas.png",
    title: "Built for Amazon Sellers",
    desp: " Optimized to meet Amazon compliance requirements, including invoice authorization and upload policies.",
  },
  {
    icon: "/showcase/dashboard-default-dark.png",
    title: "Track Everything",
    desp: "View all your paid orders and monitor invoice status with real-time updates in your dashboard.",
  },
  {
    icon: "/showcase/dashboard-default-dark.png",
    title: "Transparent Pricing",
    desp: "Start free and scale affordably — only pay when your business grows.",
  },
  {
    icon: "/showcase/dashboard-default-dark.png",
    title: " Mobile App Coming Soon",
    desp: "iOS and Android apps for on-the-go invoicing are launching soon.",
  },
];

const IMAGE_PAPER_PROPS: PaperProps = {
  py: "md",
  className: classes.paperImage,
};

export default function Home() {
  const tablet_match = useMediaQuery("(max-width: 768px)");

  const BOX_PROPS: ContainerProps = {
    pt: rem(100),
    pb: rem(80),
    px: tablet_match ? rem(36) : rem(40 * 3),
    className: "section",
  };

  return (
    <>
      <>
        <title>Runanalytic Invoice</title>
        <meta
          name='description'
          content='Explore our versatile dashboard website template featuring a stunning array of themes and meticulously crafted components. Elevate your web project with seamless integration, customizable themes, and a rich variety of components for a dynamic user experience. Effortlessly bring your data to life with our intuitive dashboard template, designed to streamline development and captivate users. Discover endless possibilities in design and functionality today!'
        />
        <meta
          name='viewport'
          content='width=device-width, initial-scale=1'
        />
        <link
          rel='icon'
          href='/logo (2).jpg'
        />
      </>
      <GuestLayout>
        <Box className={classes.hero}>
          <Grid
            align='center'
            justify='center'
            gutter={{ base: 5, xs: "md", md: "xl", xl: 50 }}
          >
            <Grid.Col
              span={{ base: 12, md: 6 }}
              order={{ base: 2, md: 1 }}
            >
              <Stack>
                {/* <Text>Build like a Pro</Text> */}
                <Title className={classes.title}>
                  Automate Your
                  <Text
                    component='span'
                    inherit
                    className={classes.highlight}
                  >
                    &nbsp; Amazon &nbsp;
                  </Text>
                  Invoices with RunAnalytic Fast, Easy & Accurate
                </Title>
                <Text>
                  RunAnalytic Technology helps Amazon sellers across the UAE and KSA stay compliant and grow. Our secure, data-driven platform delivers insights and automation that simplify invoicing and business operations.
                </Text>
                <Group my='lg'>
                  <Link to={PATH_AUTH.signin} className={classes.btn}>
                    <Button
                      size='md'
                      radius={"md"}
                      className={classes.btn}
                      leftSection={<IconPlayerPlay size={18} />}
                    >
                      Start for Free
                    </Button>
                  </Link>
                </Group>
              </Stack>
            </Grid.Col>
            <Grid.Col
              span={{ base: 12, md: 6 }}
              order={{ base: 1, md: 2 }}
              style={{ justifyItems: "center" }}
            >
              <Image
                src='/assets/img4.jpg'
                alt='image'
                radius='md'
                h={tablet_match ? rem(200) : rem(400)}
                w={tablet_match ? rem(300) : rem(600)}
              />
            </Grid.Col>
          </Grid>
        </Box>
        {/* <Flex
          direction={{ base: "column", sm: "row" }}
          justify={{ sm: "space-evenly" }}
          align='center'
          px='lg'
          pt='xl'
          className='section'
        >
          <Text>Created: July, 24 2023</Text>
          <Text>Updated: December, 8 2023</Text>
          <Text>v 2.0</Text>
          <Text>View changelog</Text>
        </Flex> */}
        <Container
          fluid
          {...BOX_PROPS}
        >
          <Title
            order={2}
            ta='center'
            mb='xl'
          >
            Why Choose Us?
          </Title>
          <SimpleGrid
            cols={{ base: 1, sm: 1, md: 2, lg: 3 }}
            spacing={{ base: "sm", sm: "sm", md: "sm", lg: "lg" }}
            verticalSpacing={{ base: "sm", sm: "sm", md: "sm", lg: "lg" }}
          >
            {DASHBOARDS.map((dashboard) => (
              <Paper
                key={dashboard.title}
                component={Link}
                to={""}
                {...IMAGE_PAPER_PROPS}
              >
                <Text
                  className={classes.paperTitle}
                  mt='md'
                  ta='center'
                  tt='capitalize'
                  fz='lg'
                >
                  {dashboard.title}
                </Text>
                <Text
                  className={classes.paperText}
                  c='dimmed'
                  ta={"center"}
                  mt={"xs"}
                  fz={"md"}
                >
                  {dashboard.desp}
                </Text>
              </Paper>
            ))}
          </SimpleGrid>
        </Container>
        <Container
          id='pricing'
          fluid
          {...BOX_PROPS}
          style={{ position: 'relative' }}
        >
          <Pricing />
          <button
            onClick={() => window.location.href = '/contact-us'} // or use `navigate`
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              opacity: 0, // Makes it invisible
              cursor: 'pointer',
              border: 'none',
              background: 'transparent',
            }}
          />
        </Container>
        {/* <Container
          id='services'
          fluid
        >
          <Services />
        </Container> */}
        <Container
          fluid
          {...BOX_PROPS}
        >
          <Faqs />
        </Container>
        <Box
          {...BOX_PROPS}
          id='support'
        >
          <Paper className={classes.contactPaper}>
            <Title
              order={3}
              mb='md'
            >
              For any queries?
            </Title>
            <Button
              variant='subtle'
              component='a'
              href='/contact-us'
              rightSection={<IconArrowRight size={16} />}
              className={classes.contactBtn}
            >
              Contact Us
            </Button>
            <div className="my-3"></div>
            <Button
              variant='subtle'
              component='a'
              href='/privacy-policy'
              rightSection={<IconArrowRight size={16} />}
              className={classes.contactBtn}
            >
              Privacy Policy
            </Button>



          </Paper>
        </Box>
      </GuestLayout>
    </>
  );
}
