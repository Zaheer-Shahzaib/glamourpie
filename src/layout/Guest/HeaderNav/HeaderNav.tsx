import { Box, Button, Container, Group } from "@mantine/core";
import { IconBrandGithub, IconStarFilled } from "@tabler/icons-react";

import "./HeaderNav.css";
import { Link } from "react-router-dom";

const MOCK_DATA = [
  {
    link: "",
    label: "Home",
  },

  {
    link: "",
    label: "Pricing",
  },
  {
    link: "",
    label: "Services",
  },
];

const HeaderNav = ({ ...props }) => {
  const items = MOCK_DATA.map((link) => (
    <a
      key={link.label}
      href={link.link}
      target='_blank'
      className={"link"}
    >
      {link.label}
    </a>
  ));

  return (
    <header className='header'>
      <Container
        className='inner'
        fluid
      >
        <Group
          gap='xs'
          className='links'
        >
          {items}
          <Box style={{ flexGrow: 1 }} />
        </Group>
        <Group>
          <Button
            component='a'
            target='_blank'
            href={""}
            variant='transparent'
            c='white'
            leftSection={<IconStarFilled size={16} />}
            className='link'
          >
            Give us a star
          </Button>
          <Link to={""}>
            <Button>Live Previews</Button>
          </Link>
        </Group>
      </Container>
    </header>
  );
};

export default HeaderNav;
