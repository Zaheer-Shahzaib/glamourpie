import {
  Button,
  Container,
  Grid,
  Text,
  Textarea,
  TextInput,
  Title,
  useMantineTheme,
  Paper,
  Stack,
} from "@mantine/core";

import classes from "../styles/contact-us.module.scss";
import { ContactIconsList } from "../Components/CustomComponent/contactIcon";
import GuestLayout from "../layout/Guest";

export function ContactUs() {
  const theme = useMantineTheme();

  return (
    <GuestLayout>
      <div className={classes.wrapper}>
        <Container size="lg">
          <Grid gutter={60} align="center">
            <Grid.Col span={{ base: 12, md: 6 }}>
              <div className={classes.infoSection}>
                <Title order={1} className={classes.title}>
                  Let’s Connect
                </Title>
                <Text className={classes.subtitle} mt="lg" mb="xl">
                  We’re here to help you succeed. Reach out with any questions,
                  ideas, or feedback.
                </Text>

                <ContactIconsList />
              </div>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <Paper p={40} radius="lg" className={classes.formCard} shadow="lg">
                <form>
                  <Stack gap="xl">
                    <TextInput
                      label="Full Name"
                      placeholder="Jane Doe"
                      required
                      classNames={{ input: classes.input, label: classes.label }}
                    />
                    <TextInput
                      label="Email Address"
                      placeholder="jane.doe@company.com"
                      required
                      classNames={{ input: classes.input, label: classes.label }}
                    />
                    <Textarea
                      label="Message"
                      placeholder="How can we help you?"
                      required
                      minRows={6}
                      classNames={{ input: classes.input, label: classes.label }}
                    />
                    <Button size="md" className={classes.submitButton}>
                      Send Message
                    </Button>
                  </Stack>
                </form>
              </Paper>
            </Grid.Col>
          </Grid>
        </Container>
      </div>
    </GuestLayout>
  );
}
