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
        <Container fluid>
          <Stack gap='lg'>
            {/* <PageHeader title="Default dashboard" withActions={true} /> */}
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

            {/* <DetailedStatsGrid/> */}
            {/* Render profile info if available */}

            {/* <Grid gutter={{ base: 5, xs: "md", md: "xl", xl: 50 }}>
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
                </Paper>  */}
            {/* </Grid.Col> */}
            {/* </Grid> */}
          </Stack>
        </Container>
      </MainLayout>
    </>
  );
}

export default DashBoard;
