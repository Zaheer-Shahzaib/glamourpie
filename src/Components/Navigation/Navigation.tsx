import { useEffect, useState } from "react";

import { ActionIcon, Box, Flex, Group, ScrollArea, Text } from "@mantine/core";
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
import { PATH_DASHBOARD } from "../../routes";
import { useAuth } from "../../Context/useAuth";
import { fetchUserProfile } from "../../Services/user-services";
const mockdata = [
  {
    title: "Dashboard",
    links: [
      { label: "Default", icon: IconChartBar, link: PATH_DASHBOARD.default },
      {
        label: "Analytics",
        icon: IconChartInfographic,
        link: "",
      },
      // { label: "SaaS", icon: IconChartArcs3, link: PATH_DASHBOARD.saas },
    ],
  },
  {
    title: "Apps",
    links: [
      { label: "Profile", icon: IconUserCircle, link: "" },
      { label: "Settings", icon: IconUserCode, link: "" },
      // { label: "Chat", icon: IconMessages, link: "" },
      // { label: "Projects", icon: IconBriefcase, link: "" },
      { label: "Orders", icon: IconListDetails, link: "" },
      {
        label: "Invoices",
        icon: IconFileInvoice,
        links: [
          {
            label: "List",
            link: "",
          },
          {
            label: "Details",
            link: "",
          },
        ],
      },
      { label: "Tasks", icon: IconListDetails, link: "" },
      { label: "Calendar", icon: IconCalendar, link: "" },
      {
        label: "File Manager",
        icon: IconFiles,
        link: "",
      },
    ],
  },
  // {
  //   title: "Auth",
  //   links: [
  //     { label: "Sign In", icon: IconLogin2, link: "" },
  //     { label: "Sign Up", icon: IconUserPlus, link: "" },
  //     {
  //       label: "Reset Password",
  //       icon: IconRotateRectangle,
  //       link: "",
  //     },
  //     { label: "Clerk", icon: IconUserShield, link: "" },
  //     { label: "Auth0", icon: IconBrandAuth0, link: "" },
  //   ],
  // },
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
  const [profile, setProfile] = useState<User>();
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
            {/* <Logo className={classes.logo} showText={sidebarState !== 'mini'} /> */}
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
          image={profile?.avatar ?? ""}
          name={profile?.username}
          showText={sidebarState !== "mini"}
        />
        }
      </div>
    </div>
  );
};

export default Navigation;
