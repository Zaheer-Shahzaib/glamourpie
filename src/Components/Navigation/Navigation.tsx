import { useEffect, useState } from "react";

import { ActionIcon, Box, Flex, Group, Image, ScrollArea, Text } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import {
  IconBrandAuth0,
  IconBriefcase,
  IconCalendar,
  IconChartArcs3,
  IconChartBar,
  IconChartInfographic,
  IconFileInvoice,
  IconFiles,
  IconListDetails,
  IconLogin2,
  IconMessages,
  IconRotateRectangle,
  IconUserCircle,
  IconUserCode,
  IconUserPlus,
  IconUserShield,
  IconX,
} from "@tabler/icons-react";
import classes from "./Navigation.module.scss";
import { SidebarState, User } from "../../types/index";
import { LinksGroup } from "./Links/Links";
import UserProfileButton from "../UserButton";
import { useNavigate } from "react-router-dom";
import { PATH_DASHBOARD, PATH_APPS } from "../../routes";
import { useAuth } from "../../Context/useAuth";
import { fetchUserProfile } from "../../Services/user-services";
import { UserProfile } from "../../types/profile.types";
import { getAvatarUrl } from "../../utils/helperFunctions";
const mockdata = [
  {
    title: "Dashboard",
    links: [
      { label: "Default", icon: IconChartBar, link: PATH_DASHBOARD.default },
      {
        label: "Analytics",
        icon: IconChartInfographic,
        link: PATH_APPS.analytics,
      },
    ],
  },
  {
    title: "Apps",
    links: [
      {
        label: "Profile",
        icon: IconUserCircle,
        links: [
          { label: "Personal Info", link: PATH_APPS.profile.personal },
          { label: "Security", link: PATH_APPS.profile.security },
          { label: "API Credentials", link: PATH_APPS.profile.credentials },
          { label: "Statistics", link: PATH_APPS.profile.statistics },
        ]
      },
      {
        label: "Settings",
        icon: IconUserCode,
        links: [
          { label: "SP-API Credentials", link: PATH_APPS.settings.spApi },
          { label: "Marketplace", link: PATH_APPS.settings.marketplace },
          { label: "Invoices", link: PATH_APPS.settings.invoices },
          { label: "Notifications", link: PATH_APPS.settings.notifications },
          { label: "Business Info", link: PATH_APPS.settings.business },
        ]
      },
      { label: "Orders", icon: IconListDetails, link: PATH_APPS.orders },
      {
        label: "Invoices",
        icon: IconFileInvoice,
        links: [
          { label: "List", link: PATH_APPS.invoices.all },
          { label: "Details", link: PATH_APPS.invoices.sample },
        ],
      },
      { label: "Tasks", icon: IconListDetails, link: PATH_APPS.tasks },
      { label: "Calendar", icon: IconCalendar, link: PATH_APPS.calendar },
      { label: "File Manager", icon: IconFiles, link: PATH_APPS.fileManager },
    ],
  },
];

type NavigationProps = {
  onClose: () => void;
  sidebarState: SidebarState;
  onSidebarStateChange: (state: SidebarState) => void;
};

const Navigation = ({
  onClose,
  onSidebarStateChange,
  sidebarState,
}: NavigationProps) => {
  const tablet_match = useMediaQuery("(max-width: 768px)");
  const navigate = useNavigate();
  const { token } = useAuth();
  const [profile, setProfile] = useState<UserProfile>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetchUserProfile(token)
        .then((data) => setProfile(data))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [token]);

  useEffect(() => {
    if (tablet_match) {
      onSidebarStateChange("full");
    }
  }, [onSidebarStateChange, tablet_match]);

  const links = mockdata.map((m) => (
    <Box
      key={m.title}
      pl={0}
      mb={sidebarState === "mini" ? 0 : "md"}
      className='box_content'
    >
      {sidebarState !== "mini" && (
        <Text
          tt='uppercase'
          size='xs'
          pl='md'
          fw={500}
          mb='sm'
          className={classes.linkHeader}
        >
          {m.title}
        </Text>
      )}
      {m.links.map((item) => (
        <LinksGroup
          key={item.label}
          {...item}
          isMini={sidebarState === "mini"}
          closeSidebar={() => {
            setTimeout(() => {
              onClose();
            }, 250);
          }}
        />
      ))}
    </Box>
  ));


  return (
    <div
      className={classes.navbar}
      data-sidebar-state={sidebarState}
    >
      <div className={classes.header}>
        <Flex
          justify='space-between'
          align='center'
          gap='sm'
        >
          <Group
            justify={sidebarState === "mini" ? "center" : "space-between"}
            style={{ flex: tablet_match ? "auto" : 1 }}
          >
            <Image src="/bgremove-background.png" alt="Logo" h={120} className={classes.logo}
              style={{
                flex: tablet_match ? "auto" : 1,
                width: tablet_match ? "auto" : 100

              }} />
          </Group>
          {tablet_match && (
            <ActionIcon
              onClick={onClose}
              variant='transparent'
            >
              <IconX color='white' />
            </ActionIcon>
          )}
        </Flex>
      </div>

      <ScrollArea className={classes.links}>
        <div
          className={classes.linksInner}
          data-sidebar-state={sidebarState}
        >
          {links}
        </div>
      </ScrollArea>

      <div className={classes.footer}>
        {profile &&
          <UserProfileButton
            email={profile.email}
            image={getAvatarUrl(profile?.avatar)}
            name={profile?.firstname + " " + profile?.lastname}
            showText={sidebarState !== "mini"}
          />
        }
      </div>
    </div>
  );
};

export default Navigation;
