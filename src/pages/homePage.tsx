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
    desp: "Generate and upload invoices seamlessly through API integration – no manual effort required.",
  },
  {
    icon: "/showcase/dashboard-analytics.png",
    title: "Smart Invoice Templates",
    desp: "Choose between Simple and Premium templates tailored for VAT and Non-VAT registered businesses",
  },
  {
    icon: "/showcase/dashboard-saas.png",
    title: "Built for Amazon Sellers",
    desp: "Optimized to meet Amazon compliance requirements including Authorization Code and Uploading",
  },
  {
    icon: "/showcase/dashboard-default-dark.png",
    title: "Track Everything",
    desp: "View all your paid orders and track invoice status with real-time updates in your statistics dashboard.",
  },
  {
    icon: "/showcase/dashboard-default-dark.png",
    title: "Transparent Pricing",
    desp: "Start for free and only pay when you scale.",
  },
  {
    icon: "/showcase/dashboard-default-dark.png",
    title: " Mobile App Coming Soon",
    desp: "iOS and Android apps launching soon for on-the-go invoice creation.",
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
        <title>DesignSparx | Website UI Kit</title>
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
          href='/favicon.ico'
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
                <Text>Build like a Pro</Text>
                <Title className={classes.title}>
                  Automate Your
                  <Text
                    component='span'
                    inherit
                    className={classes.highlight}
                  >
                    &nbsp; Amazon &nbsp;
                  </Text>
                  Invoices – Fast, Easy & Accurate
                </Title>
                <Text>
                  Say goodbye to manual billing! Generate & upload invoices
                  directly to Amazon in just a few clicks.
                </Text>
                <Group my='lg'>
                  <Link to={PATH_AUTH.signin}>
                    <Button
                      size='md'
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
                src='/assets/upload-invoice.jpeg'
                alt='image'
                radius='md'
                h={tablet_match ? rem(300) : rem(500)}
                w={tablet_match ? rem(300) : rem(500)}
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
        >
          <Pricing />
        </Container>
        <Container
          id='services'
          fluid
          {...BOX_PROPS}
        >
          <Services />
        </Container>
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
          </Paper>
        </Box>
      </GuestLayout>
    </>
  );
}
