import { useEffect, useMemo, useState } from "react";

import {
  Box,
  Collapse,
  Group,
  Menu,
  Text,
  Tooltip,
  UnstyledButton,
} from "@mantine/core";
import { IconChevronRight } from "@tabler/icons-react";
import classes from "./Links.module.scss";
import { useLocation, useNavigate } from "react-router-dom";
import * as _ from "lodash";
interface LinksGroupProps {
  icon?: any;
  label: string;
  initiallyOpened?: boolean;
  link?: string;
  links?: {
    label: string;
    link: string;
  }[];
  closeSidebar: () => void;
  isMini?: boolean;
}

export function LinksGroup(props: LinksGroupProps) {
  const {
    icon: Icon,
    label,
    initiallyOpened,
    link,
    links,
    closeSidebar,
    isMini,
  } = props;
  const navigate = useNavigate();
  const location = useLocation();
  const hasLinks = Array.isArray(links);
  const [opened, setOpened] = useState(initiallyOpened || false);
  const [currentPath, setCurrentPath] = useState<string | undefined>();
  const ChevronIcon = IconChevronRight;

  const LinkItem = ({ link }: { link: { label: string; link: string } }) => {
    return (
      <Text
        component='button'
        className={classes.link}
        onClick={() => {
          navigate(link.link);
          closeSidebar();
        }}
        data-active={link.link.toLowerCase() === location.pathname || undefined}
        data-mini={isMini}
      >
        {link.label}
      </Text>
    );
  };

  const items = (hasLinks ? links : []).map((link) =>
    isMini ? (
      <Menu.Item key={`menu-${link.label}`}>
        <LinkItem link={link} />
      </Menu.Item>
    ) : (
      <LinkItem
        key={link.label}
        link={link}
      />
    )
  );

  const content: React.ReactElement = useMemo(() => {
    let view: React.ReactElement;
    if (isMini) {
      view = (
        <>
          <Menu
            position='right-start'
            withArrow
            arrowPosition='center'
            trigger='hover'
            openDelay={100}
            closeDelay={400}
          >
            <Menu.Target>
              <UnstyledButton
                onClick={() => {
                  setOpened((o) => !o);
                  link && navigate(link || "#");
                  closeSidebar();
                }}
                className={classes.control}
                data-active={opened || undefined}
                data-mini={isMini}
              >
                <Tooltip
                  label={label}
                  position='right'
                  transitionProps={{ duration: 0 }}
                >
                  <Icon size={24} />
                </Tooltip>
              </UnstyledButton>
            </Menu.Target>
            <Menu.Dropdown>{items}</Menu.Dropdown>
          </Menu>
        </>
      );
    } else {
      view = (
        <>
          <UnstyledButton
            onClick={() => {
              setOpened((o) => !o);
              link && navigate(link || "#");
              closeSidebar();
            }}
            className={classes.control}
            data-active={opened || undefined}
            data-mini={isMini}
          >
            <Group
              justify='space-between'
              gap={0}
            >
              <Box style={{ display: "flex", alignItems: "center" }}>
                <Icon size={18} />
                {!isMini && <Box ml='md'>{label}</Box>}
              </Box>
              {hasLinks && (
                <ChevronIcon
                  className={classes.chevron}
                  size='1rem'
                  stroke={1.5}
                  style={{
                    transform: opened ? `rotate(90deg)` : "none",
                  }}
                />
              )}
            </Group>
          </UnstyledButton>
          {hasLinks ? <Collapse in={opened}>{items}</Collapse> : null}
        </>
      );
    }

    return view;
  }, [
    ChevronIcon,
    Icon,
    closeSidebar,
    hasLinks,
    isMini,
    items,
    label,
    link,
    opened,
    navigate,
  ]);

  useEffect(() => {
    const paths = location.pathname.split("/");
    setOpened(paths.includes(label.toLowerCase()));
    setCurrentPath(_.last(paths)?.toLowerCase() || undefined);
  }, [location.pathname, label]);

  return <div className='menu_content'>{content}</div>;
}
