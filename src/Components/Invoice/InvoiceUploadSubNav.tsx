import { Tabs } from "@mantine/core";
import { useLocation, useNavigate } from "react-router-dom";
import { PATH_APPS } from "../../routes";

type Props = {
  showHistorical?: boolean;
};

export default function InvoiceUploadSubNav({ showHistorical = false }: Props) {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname.toLowerCase();

  const isHistorical =
    path.includes("/historical") || path.includes("/past");
  const active = isHistorical ? "historical" : "missing";

  return (
    <Tabs
      value={active}
      onChange={(v) => {
        if (v === "historical" && showHistorical) {
          navigate(PATH_APPS.invoices.upload.historical);
        } else {
          navigate(PATH_APPS.invoices.upload.missing);
        }
      }}
    >
      <Tabs.List>
        <Tabs.Tab value="missing">Missing Invoice</Tabs.Tab>
        {showHistorical && (
          <Tabs.Tab value="historical">Historical Amazon Invoice</Tabs.Tab>
        )}
      </Tabs.List>
    </Tabs>
  );
}
