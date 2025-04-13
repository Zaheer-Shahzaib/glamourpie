import { useState } from "react";
import {
  Icon2fa,
  IconBellRinging,
  IconDatabaseImport,
  IconFingerprint,
  IconKey,
  IconLogout,
  IconReceipt2,
  IconSettings,
  IconSwitchHorizontal,
} from "@tabler/icons-react";
import { Burger, Code, Group, useMantineTheme } from "@mantine/core";
import "./dashboard.css";
import { useDisclosure } from "@mantine/hooks";

const data = [
  { link: "", label: "Notifications", icon: IconBellRinging },
  { link: "", label: "Billing", icon: IconReceipt2 },
  { link: "", label: "Security", icon: IconFingerprint },
  { link: "", label: "SSH Keys", icon: IconKey },
  { link: "", label: "Databases", icon: IconDatabaseImport },
  { link: "", label: "Authentication", icon: Icon2fa },
  { link: "", label: "Other Settings", icon: IconSettings },
];

export default function DashboardNavBar() {
  const [active, setActive] = useState("Billing");
  const theme = useMantineTheme();
  const [opened, { toggle }] = useDisclosure();
  const links = data.map((item) => (
    <a
      className={"link"}
      data-active={item.label === active || undefined}
      href={item.link}
      key={item.label}
      onClick={(event) => {
        event.preventDefault();
        setActive(item.label);
      }}
    >
      <item.icon className="linkIcon" stroke={1.5} />
      <span>{item.label}</span>
    </a>
  ));

  return (
    <nav className="navbar">
      <Burger lineSize={6} size="xl" opened={opened} onClick={toggle} aria-label="Toggle navigation" />
      <div className="navbarMain">{links}</div>

      <div className={"footer"}>
        <a
          href="#"
          className="link"
          onClick={(event) => event.preventDefault()}
        >
          <IconSwitchHorizontal className={"linkIcon"} stroke={1.5} />
          <span>Change account</span>
        </a>

        <a
          href="#"
          className={"link"}
          onClick={(event) => event.preventDefault()}
        >
          <IconLogout className={"linkIcon"} stroke={1.5} />
          <span>Logout</span>
        </a>
      </div>
    </nav>
  );
}
