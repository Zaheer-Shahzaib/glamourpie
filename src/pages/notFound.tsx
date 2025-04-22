import {
  Button,
  Container,
  Text,
  Title,
  Group,
} from "@mantine/core";
import { useNavigate } from "react-router-dom";

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <Container
      size='sm'
      style={{
        textAlign: "center",
        alignItems: "center",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <Title
        order={1}
        mt='lg'
        c='red'
      >
        Oops! Something went wrong.
      </Title>
      <Text
        size='lg'
        mt='sm'
        c='dimmed'
      >
        The page you are looking for might have been removed, had its name
        changed, or is temporarily unavailable.
      </Text>
      <Group
        mt='xl'
        justify='center'
        align='center'
        mx='auto'
      >
        <Button
          variant='filled'
          size='md'
          onClick={() => navigate("/")}
          style={{ textTransform: "capitalize" }}
        >
          Go to Home
        </Button>
        <Button
          variant='outline'
          size='md'
          onClick={() => navigate(-1)}
          style={{ textTransform: "capitalize" }}
        >
          Go Back
        </Button>
      </Group>
    </Container>
  );
};

export default ErrorPage;
