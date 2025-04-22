import {
  IconBrandInstagram,
  IconBrandTwitter,
  IconBrandYoutube,
} from "@tabler/icons-react";
import {
  ActionIcon,
  Button,
  Container,
  Group,
  SimpleGrid,
  Text,
  Textarea,
  TextInput,
  Title,
  useMantineTheme,
} from "@mantine/core";

import classes from "../styles/contact-us.module.scss";
import { ContactIconsList } from "../Components/CustomComponent/contactIcon";
import GuestLayout from "../layout/Guest";

const social = [IconBrandTwitter, IconBrandYoutube, IconBrandInstagram];

export function ContactUs() {
  const theme  = useMantineTheme();
  const icons = social.map((Icon, index) => (
    <ActionIcon
      key={index}
      size={28}
      className={classes.social}
      variant='transparent'
    >
      <Icon
        size={22}
        stroke={1.5}
      />
    </ActionIcon>
  ));

  return (
   <GuestLayout>
     <div className={classes.wrapper}>
        
        <Container
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <SimpleGrid
            bg={theme.colors.gray[5]}
            p={{ sm: "20px" , xs: "20px" , base: "20px", lg: "50px"}}
            cols={{ base: 1, sm: 2 }}
            style={{ borderRadius: "5px" }}
          
            spacing={50}
          >
            <div
              style={{
                backgroundColor: theme.colors.blue[5],
                borderRadius: "10px",
                padding: "20px",
              }}
            >
              <Title className={classes.title}>Contact us</Title>
              <Text
                className={classes.description}
                mt='sm'
                mb={30}
              >
                Leave your email and we will get back to you within 24 hours
              </Text>
  
              <ContactIconsList />
  
              <Group mt='xl'>{icons}</Group>
            </div>
  
            <div className={classes.form}>
              <TextInput
                label='Email'
                placeholder='your@email.com'
                required
                classNames={{ input: classes.input, label: classes.inputLabel }}
              />
              <TextInput
                label='Name'
                placeholder='John Doe'
                mt='md'
                classNames={{ input: classes.input, label: classes.inputLabel }}
              />
              <Textarea
                required
                label='Your message'
                placeholder='I want to order your goods'
                minRows={4}
                mt='md'
                classNames={{ input: classes.input, label: classes.inputLabel }}
              />
  
              <Group
                justify='flex-end'
                mt='md'
              >
                <Button className={classes.control}>Send message</Button>
              </Group>
            </div>
          </SimpleGrid>
        </Container>
      </div>
   </GuestLayout>
  );
}
