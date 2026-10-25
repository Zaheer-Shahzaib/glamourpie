import { useEffect, useMemo, useState } from "react";

import {
  ActionIcon,
  Box,
  Flex,
  Group,
  Image,
  ScrollArea,
  Text,
} from "@mantine/core";
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
import { getPastInvoiceBalance } from "../../Services/past-invoice-services";
import { UserProfile } from "../../types/profile.types";
import { getAvatarUrl } from "../../utils/helperFunctions";
const mockdata = [
  {
    title: "Dashboard",
    links: [
      { label: "Home", icon: IconChartBar, link: PATH_DASHBOARD.default },
      // {
      //   label: "Analytics",
      //   icon: IconChartInfographic,
      //   link: PATH_APPS.analytics,
      // },
      { label: "Orders", icon: IconListDetails, link: PATH_APPS.orders },
      {
        label: "Invoices",
        icon: IconFileInvoice,
        link: PATH_APPS.invoices.root,
      },
      {
        label: "Invoice Upload",
        icon: IconFiles,
        links: [
          {
            label: "Missing Invoice",
            link: PATH_APPS.invoices.upload.missing,
          },
        ],
      },
    ],
  },
  {
    title: "Settings",
    links: [
      {
        label: "Profile",
        icon: IconUserCircle,
        links: [
          { label: "Personal Info", link: PATH_APPS.profile.personal },
          { label: "Security", link: PATH_APPS.profile.security },
          // { label: "API Credentials", link: PATH_APPS.profile.credentials },
          // { label: "Statistics", link: PATH_APPS.profile.statistics },
        ],
      },
      {
        label: "Settings",
        icon: IconUserCode,
        links: [
          // { label: "SP-API Credentials", link: PATH_APPS.settings.spApi },
          { label: "Marketplace", link: PATH_APPS.settings.marketplace },
          { label: "Invoices", link: PATH_APPS.settings.invoices },
          // { label: "Notifications", link: PATH_APPS.settings.notifications },
          { label: "Business Info", link: PATH_APPS.settings.business },
          { label: "Billing & Subscription", link: PATH_APPS.settings.billing },
        ],
      },

      // { label: "Tasks", icon: IconListDetails, link: PATH_APPS.tasks },
      // { label: "Calendar", icon: IconCalendar, link: PATH_APPS.calendar },
      // { label: "File Manager", icon: IconFiles, link: PATH_APPS.fileManager },
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
  const [hasHistoricalAccess, setHasHistoricalAccess] = useState(false);

  useEffect(() => {
    if (token) {
      fetchUserProfile(token)
        .then((data) => setProfile(data))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
      getPastInvoiceBalance(token)
        .then((res) => {
          setHasHistoricalAccess(
            Boolean(
              res.hasHistoricalAccess ??
                (res.pastInvoiceBalance?.purchasedQuantity ?? 0) > 0,
            ),
          );
        })
        .catch(() => setHasHistoricalAccess(false));
    }
  }, [token]);

  useEffect(() => {
    if (tablet_match) {
      onSidebarStateChange("full");
    }
  }, [onSidebarStateChange, tablet_match]);

  const navSections = useMemo(() => {
    const uploadSubLinks = [
      {
        label: "Missing Invoice",
        link: PATH_APPS.invoices.upload.missing,
      },
      ...(hasHistoricalAccess
        ? [
            {
              label: "Historical Amazon Invoice",
              link: PATH_APPS.invoices.upload.historical,
            },
          ]
        : []),
    ];

    return mockdata.map((section) => {
      if (section.title !== "Dashboard") return section;
      const links = section.links.map((item) => {
        if (item.label !== "Invoice Upload") return item;
        return { ...item, links: uploadSubLinks };
      });
      return { ...section, links };
    });
  }, [hasHistoricalAccess]);

  const links = navSections.map((m) => (
    <Box
      key={m.title}
      pl={0}
      mb={sidebarState === "mini" ? 0 : "md"}
      className="box_content"
    >
      {sidebarState !== "mini" && (
        <Text
          tt="uppercase"
          size="xs"
          pl="md"
          fw={500}
          mb="sm"
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
            // setTimeout(() => {
            //   onClose();
            // }, 250);
          }}
        />
      ))}
    </Box>
  ));

  return (
    <div className={classes.navbar} data-sidebar-state={sidebarState}>
      <div className={classes.header}>
        <Flex justify="space-between" align="center" gap="sm">
          <Group
            justify={sidebarState === "mini" ? "center" : "space-between"}
            style={{ flex: tablet_match ? "auto" : 1 }}
          >
            <Image
              src="/bgremove-background.png"
              alt="Logo"
              h={120}
              className={classes.logo}
              style={{
                flex: tablet_match ? "auto" : 1,
                width: tablet_match ? "auto" : 100,
              }}
            />
          </Group>
          {tablet_match && (
            <ActionIcon onClick={onClose} variant="transparent">
              <IconX color="white" />
            </ActionIcon>
          )}
        </Flex>
      </div>

      <ScrollArea className={classes.links}>
        <div className={classes.linksInner} data-sidebar-state={sidebarState}>
          {links}
        </div>
      </ScrollArea>

      <div className={classes.footer}>
        {profile && (
          <UserProfileButton
            email={profile.email}
            image={getAvatarUrl(profile?.avatar)}
            name={profile?.firstname + " " + profile?.lastname}
            showText={sidebarState !== "mini"}
          />
        )}
      </div>
    </div>
  );
};

export default Navigation;
