import { useState } from "react";
import {
  Tabs,
  Table,
  Text,
  Box,
  Group,
  Avatar,
  ScrollArea,
  Checkbox,
} from "@mantine/core";
import { InvoiceItem } from "../../types";

interface InvoiceDetailsTableProps {
  data: {
    products: InvoiceItem[];
    orders: InvoiceItem[]; // or you can customize if needed
  };
}

export default function InvoiceDetailsTable({
  data,
}: InvoiceDetailsTableProps) {
  const [activeTab, setActiveTab] = useState<"products" | "orders">("products");
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  const renderRows = (items: InvoiceItem[]) =>
    items.map((item, index) => (
      <Table.Tr key={index}
       bg={selectedRows.includes(index) ? 'var(--mantine-color-blue-light)' : undefined}
      >
        <Table.Td>
             <Checkbox
          aria-label="Select row"
          checked={selectedRows.includes(index)}
          onChange={(event) =>
            setSelectedRows(
              event.currentTarget.checked
                ? [...selectedRows, index]
                : selectedRows.filter((position) => position !== index)
            )
          }
        />
        </Table.Td>
         <Table.Td>
          <Group wrap='nowrap'>
            <Box>
              <Text
                size='sm'
                fw={500}
              >
                {item.sku}
              </Text>
              <Text
                size='xs'
                c='dimmed'
              >
                {item.title}
              </Text>
              <Text
                size='xs'
                c='dimmed'
              >
                ${item.price} · COG: ${item.cost}
              </Text>
              <Text
                size='xs'
                c='red'
              >
                FBA: {item.fbaStock ?? 0} / FBM: {item.fbmStock ?? 0}
              </Text>
            </Box>
          </Group>
        </Table.Td>
        <Table.Td>{item.unitsSold}</Table.Td>
        <Table.Td>{item.refunds}</Table.Td>
        <Table.Td>{item.sales}</Table.Td>
        <Table.Td>{item.ads}</Table.Td>
        <Table.Td>{item.sellableReturns ?? "—"}</Table.Td>
        <Table.Td>{item.grossProfit}</Table.Td>
        <Table.Td>{item.netProfit}</Table.Td>
        <Table.Td>{item.margin}</Table.Td>
        <Table.Td>{item.roi}</Table.Td>
      </Table.Tr>
    ));

  return (
    <Tabs
      value={activeTab}
      onChange={(value) => setActiveTab(value as "products" | "orders")}
      radius='md'
    >
      <Group mb='md' justify="space-between" gap={16}>
        <Tabs.List grow>
          <Tabs.Tab value='products'>Products</Tabs.Tab>
          <Tabs.Tab value='orders'>Order Items</Tabs.Tab>
        </Tabs.List>
      </Group>
      <Tabs.Panel
        value='products'
        pt='xs'
      >
        <Table.ScrollContainer maxHeight={400} minWidth={400}>
          <Table withRowBorders highlightOnHover m={"md"}>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Product</Table.Th>
                <Table.Th>Units sold</Table.Th>
                <Table.Th>Refunds</Table.Th>
                <Table.Th>Sales</Table.Th>
                <Table.Th>Ads</Table.Th>
                <Table.Th>Sellable returns</Table.Th>
                <Table.Th>Gross profit</Table.Th>
                <Table.Th>Net profit</Table.Th>
                <Table.Th>Margin</Table.Th>
                <Table.Th>ROI</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{renderRows(data.products)}</Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      </Tabs.Panel>

      <Tabs.Panel
        value='orders'
        pt='xs'
      >
        <ScrollArea>
          <Table withRowBorders highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Product</Table.Th>
                <Table.Th>Units sold</Table.Th>
                <Table.Th>Refunds</Table.Th>
                <Table.Th>Sales</Table.Th>
                <Table.Th>Ads</Table.Th>
                <Table.Th>Sellable returns</Table.Th>
                <Table.Th>Gross profit</Table.Th>
                <Table.Th>Net profit</Table.Th>
                <Table.Th>Margin</Table.Th>
                <Table.Th>ROI</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{renderRows(data.orders)}</Table.Tbody>
          </Table>
        </ScrollArea>
      </Tabs.Panel>
    </Tabs>
  );
}
