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

function normalizePath(path: string) {
  return path.toLowerCase().replace(/\/+$/, "");
}

function isChildNavActive(childLink: string, pathname: string) {
  const path = normalizePath(pathname);
  const child = normalizePath(childLink);
  return path === child || path.startsWith(`${child}/`);
}

/** Top-level link (no submenu): match route but not Invoice Upload subtree. */
function isLeafNavActive(itemLink: string, pathname: string) {
  const path = normalizePath(pathname);
  const base = normalizePath(itemLink);
  if (path === base) return true;
  if (!path.startsWith(`${base}/`)) return false;
  if (path.startsWith(`${base}/upload`)) return false;
  return true;
}

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
  const childLinks = hasLinks ? links : [];
  const anyChildActive = childLinks.some((l) =>
    isChildNavActive(l.link, location.pathname),
  );
  const leafActive =
    !hasLinks && link
      ? isLeafNavActive(link, location.pathname)
      : false;
  const groupActive = hasLinks && anyChildActive;

  const [opened, setOpened] = useState(
    initiallyOpened || anyChildActive || false,
  );
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
        data-active={
          isChildNavActive(linkData.link, location.pathname) || undefined
        }
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

  useEffect(() => {
    if (!hasLinks) return;
    setOpened(anyChildActive);
  }, [anyChildActive, hasLinks]);

  const content: React.ReactElement = useMemo(() => {
    let view: React.ReactElement;

    if (!hasLinks && link) {
      view = (
        <UnstyledButton
          onClick={() => {
            navigate(link);
            closeSidebar();
          }}
          className={classes.control}
          data-active={leafActive || undefined}
          data-mini={isMini}
        >
          {isMini ? (
            <Tooltip
              label={label}
              position="right"
              transitionProps={{ duration: 0 }}
            >
              <Icon size={24} />
            </Tooltip>
          ) : (
            <Group justify="space-between" gap={0}>
              <Box style={{ display: "flex", alignItems: "center" }}>
                <Icon size={18} />
                <Box ml="md">{label}</Box>
              </Box>
            </Group>
          )}
        </UnstyledButton>
      );
      return view;
    }

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
                }}
                className={classes.control}
                data-active={groupActive || undefined}
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
            }}
            className={classes.control}
            data-active={groupActive || undefined}
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
    groupActive,
    leafActive,
    opened,
    navigate,
  ]);

  return <div className='menu_content'>{content}</div>;
}


