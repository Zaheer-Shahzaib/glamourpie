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

export interface LinksGroupProps {
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
  const ChevronIcon = IconChevronRight;

  const LinkItem = ({ linkData }: { linkData: { label: string; link: string } }) => {
    return (
      <Text
        component='button'
        size="sm"
        className={classes.link}
        onClick={() => {
          navigate(linkData.link);
          closeSidebar();
        }}
        data-active={linkData.link.toLowerCase() === location.pathname.toLowerCase() || undefined}
        data-mini={isMini}
        style={{
          padding: "4px 10px 2px 40px",
        }}
      >
        {linkData.label}
      </Text>
    );
  };

  const items = (hasLinks ? links : []).map((linkData) =>
    isMini ? (
      <Menu.Item key={`menu-${linkData.label}`}>
        <LinkItem linkData={linkData} />
      </Menu.Item>
    ) : (
      <LinkItem
        key={linkData.label}
        linkData={linkData}
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
  }, [location.pathname, label]);

  return <div className='menu_content'>{content}</div>;
}


