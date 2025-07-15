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
import { Card, Image,  Badge, Button } from '@mantine/core';

interface TabData {
  tabKey: string;
  tabLabel: string;
  titles: string[];
  items: InvoiceItem[];
}

interface Props {
  tabsData: TabData[];
}

export default function InvoiceDetailsTable({ tabsData }: Props) {
  const [activeTab, setActiveTab] = useState(tabsData[0]?.tabKey || "");
  
  const renderRows = (items: InvoiceItem[]) =>
  items.map((item, index) => (
    <Table.Tr key={index}>
      <Table.Td>
        <Checkbox aria-label="Select row" />
      </Table.Td>
      <Table.Td>
        <Group wrap="nowrap">
          <Box>
            <Text size="sm" fw={500}>
              {item.sku}
            </Text>
            <Text size="xs" c="dimmed">
              {item.title}
            </Text>
            <Text size="xs" c="dimmed">
              ${item.price} · COG: ${item.cost}
            </Text>
            <Text size="xs" c="red">
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
  onChange={(val) => val && setActiveTab(val)} // ✅ null check added
  
  radius="md"
>
      <Group mb="md" justify="space-between" gap={16}>
        <Tabs.List grow>
          {tabsData.map((tab) => (
            <Tabs.Tab key={tab.tabKey} value={tab.tabKey}>
              {tab.tabLabel}
            </Tabs.Tab>
          ))}
        </Tabs.List>
      </Group>

      {tabsData.map((tab) => (
        <Tabs.Panel key={tab.tabKey} value={tab.tabKey} pt="xs">
          <ScrollArea>
            <Table withRowBorders highlightOnHover m="md" className="transition-transform transform hover:translate-y-[-5px] hover:shadow-xl">
              <Table.Thead>
                {/* <Table.Tr>
                  {tab.titles.map((title, idx) => (
                    <Table.Th key={idx}>{title}</Table.Th>
                  ))}
                </Table.Tr> */}
              </Table.Thead>
              
         {/* <Table.Tbody className="bg-white rounded-xl shadow-md p-5 mb-4">
    {renderRows(tab.items)} </Table.Tbody>   */}


<Card shadow="sm" padding="lg" radius="md" withBorder>
              <Card.Section>
                <Table withRowBorders highlightOnHover>
                  <Table.Thead>
                    <Table.Tr>
                      {tab.titles.map((title, idx) => (
                        <Table.Th key={idx}>{title}</Table.Th>
                      ))}
                    </Table.Tr>
                  </Table.Thead>

                  {/* Table Body */}
                  <Table.Tbody className="bg-white">
                    {renderRows(tab.items)}
                  </Table.Tbody>
                </Table>
               </Card.Section>
            </Card>


            </Table>



          </ScrollArea>

          
         
        </Tabs.Panel>
      ))}
    </Tabs>
  );
}
