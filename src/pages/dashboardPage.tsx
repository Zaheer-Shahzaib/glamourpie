"use client";

import {
  Button,
  Container,
  Grid,
  Group,
  Paper,
  PaperProps,
  Stack,
  Text,
  Box,
  Title,
} from "@mantine/core";
import { IconChevronRight } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import { PATH_TASKS } from "../routes";
import MainLayout from "../layout/Main";
import StatsGrid from "../Components/StatsGrid/StatsGrid";
import useFetchData from "../hooks/userFetchData";
import RevenueChart from "../Components/RevenueChart/RevenueChart";
import { useAuth } from "../Context/useAuth";
import { useEffect, useState } from "react";
import { fetchUserProfile } from "../Services/user-services";
import DetailedStatsCard from "../Components/StatsGrid/detailsStatsGrid";
import DetailedStatsGrid from "../Components/StatsGrid/detailsStatsGrid";
import InvoiceDetailsTable from "../Components/InvoiceDetails/InvoiceDetailsTable";
import { mockItems } from "../constant/mock-data";

const PAPER_PROPS: PaperProps = {
  p: "md",
  shadow: "md",
  radius: "md",
  style: { height: "100%" },
};

function DashBoard() {
  const {
    data: statsData,
    error: statsError,
    loading: statsLoading,
  } = useFetchData();

  return (
    <>
      <>
        <title>Dashboard | Runanalytic Invoice</title>
        <meta
          name='description'
          content='Explore our versatile dashboard website template featuring a stunning array of themes and meticulously crafted components. Elevate your web project with seamless integration, customizable themes, and a rich variety of components for a dynamic user experience. Effortlessly bring your data to life with our intuitive dashboard template, designed to streamline development and captivate users. Discover endless possibilities in design and functionality today!'
        />
      </>
      <MainLayout>
        {/* ORIGINAL DASHBOARD CODE - COMMENTED OUT FOR BLUR OVERLAY */}
        {/* 
        <Container fluid>
          <Stack gap='lg'>
            <StatsGrid
              data={statsData}
              loading={statsLoading}
              error={statsError}
              paperProps={PAPER_PROPS}
            />
            <InvoiceDetailsTable
              data={{
                products: mockItems,
                orders: mockItems,
              }}
            />

            <DetailedStatsGrid/>
            Render profile info if available

            <Grid gutter={{ base: 5, xs: "md", md: "xl", xl: 50 }}>
              <Grid.Col span={8}>
                <RevenueChart {...PAPER_PROPS} />
              </Grid.Col>
              <Grid.Col span={4}> 
                 <SalesChart {...PAPER_PROPS} />
               </Grid.Col>
              <Grid.Col span={4}> 
               <MobileDesktopChart {...PAPER_PROPS} /> 
              </Grid.Col>
              <Grid.Col span={8}> 
               <Paper {...PAPER_PROPS}> 
                <Group
                    justify='space-between'
                    mb='md'
                  >
                    <Text
                      size='lg'
                      fw={600}
                    >
                      Tasks
                    </Text>
                    <Button
                      variant='subtle'
                      component={Link}
                      to={PATH_TASKS.root}
                      rightSection={<IconChevronRight size={18} />}
                    >
                      View all
                    </Button>
                  </Group> 
                 <ProjectsTable
                  data={projectsData.slice(0, 6)}
                  error={projectsError}
                  loading={projectsLoading}
                />
                </Paper>  
            </Grid.Col>
            </Grid>
          </Stack>
        </Container>
        */}

        {/* BLUR OVERLAY IMPLEMENTATION - START */}
        <Box style={{ position: 'relative', minHeight: '100vh' }}>
          {/* Blurred background content - Original dashboard with blur effect */}
          <Box
            style={{
              filter: 'blur(8px)',
              pointerEvents: 'none',
              opacity: 0.3,
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              overflow: 'hidden'
            }}
          >
            <Container fluid>
              <Stack gap='lg'>
                <StatsGrid
                  data={statsData}
                  loading={statsLoading}
                  error={statsError}
                  paperProps={PAPER_PROPS}
                />
                <InvoiceDetailsTable
                  data={{
                    products: mockItems,
                    orders: mockItems,
                  }}
                />
              </Stack>
            </Container>
          </Box>

          {/* Full screen overlay with disclaimer message */}
          <Box
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              backdropFilter: 'blur(5px)',
              zIndex: 1000,
              minHeight: '100vh',
            }}
          >
            <Paper
              shadow="xl"
              radius="lg"
              p="xl"
              style={{
                maxWidth: 600,
                textAlign: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.98)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <Stack gap="lg" align="center">
                <Title order={1} c="blue" size="h1">
                  🚧 Dashboard Under Development
                </Title>
                <Text size="xl" c="dimmed" fw={500}>
                  This dashboard is currently under construction.
                  We're working hard to bring you the best experience.
                </Text>
                <Text size="lg" c="dimmed">
                  Please check back soon for updates!
                </Text>
                <Box
                  style={{
                    width: '100%',
                    height: '4px',
                    backgroundColor: 'var(--mantine-color-blue-6)',
                    borderRadius: '2px',
                    marginTop: '1rem'
                  }}
                />
                <Button
                  component={Link}
                  to="/"
                  variant="filled"
                  size="lg"
                  style={{
                    marginTop: '1rem',
                    backgroundColor: 'var(--mantine-color-blue-6)',
                  }}
                >
                  🏠 Back to Home
                </Button>
              </Stack>
            </Paper>
          </Box>
        </Box>
        {/* BLUR OVERLAY IMPLEMENTATION - END */}
      </MainLayout>
    </>
  );
}

export default DashBoard;
