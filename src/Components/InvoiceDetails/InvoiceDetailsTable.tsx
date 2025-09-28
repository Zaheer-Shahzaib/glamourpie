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
  tabsItems: { label: string; value: string }[];
  // initialTab?: "products" | "orders";
}

export default function InvoiceDetailsTable({
  data,
  tabsItems,
}: InvoiceDetailsTableProps) {
  const [activeTab, setActiveTab] = useState<string | null>("products");
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const Keys = Object.keys(data.products[0]);
  console.log("data", Keys)
  const renderRows = (items: InvoiceItem[]) =>
    items.map((item, index) => (
      <Table.Tr
        key={index}
        className={`hover:bg-gray-100 transition-colors ${selectedRows.includes(index) ? "bg-blue-50" : ""
          }`}
      >
        {/* Checkbox column */}
        <Table.Td className="px-4 py-3">
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

        {/* Product details */}
        <Table.Td className="px-4 py-3">
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-900">{item.sku}</span>
            <span className="text-xs text-gray-500">{item.title}</span>
            <span className="text-xs text-gray-500">
              ${item.price} · COG: ${item.cost}
            </span>
            <span className="text-xs text-red-500">
              FBA: {item.fbaStock ?? 0} / FBM: {item.fbmStock ?? 0}
            </span>
          </div>
        </Table.Td>

        {/* Other numeric columns */}
        <Table.Td className="px-4 py-3 text-center">{item.unitsSold}</Table.Td>
        <Table.Td className="px-4 py-3 text-center">{item.refunds}</Table.Td>
        <Table.Td className="px-4 py-3 text-center">{item.sales}</Table.Td>
        <Table.Td className="px-4 py-3 text-center">{item.ads}</Table.Td>
        <Table.Td className="px-4 py-3 text-center">
          {item.sellableReturns ?? "—"}
        </Table.Td>
        <Table.Td className="px-4 py-3 text-center">{item.grossProfit}</Table.Td>
        <Table.Td className="px-4 py-3 text-center">{item.netProfit}</Table.Td>
        <Table.Td className="px-4 py-3 text-center">{item.margin}</Table.Td>
        <Table.Td className="px-4 py-3 text-center">{item.roi}</Table.Td>
      </Table.Tr>

    ));

  return (
    <Tabs
      value={activeTab}
      onChange={(value) => setActiveTab(value)}
      radius='md'
      
      
    >
      <Group mb="md" justify="space-between" gap={16}>
        <Tabs.List grow className="flex gap-2  rounded-lg bg-gray-100  p-1 ">
          {tabsItems.map((tab) => (
            <Tabs.Tab
              key={tab.value}
              value={tab.value}
              className="px-4 py-2 text-sm font-medium rounded-md transition 
                 data-[active=true]:bg-[#174A80]
                 data-[active=true]:text-white   
                 "
            >

              {tab.label}
            </Tabs.Tab>
          ))}

          {/* <Tabs.Tab
      value="products"
      className="px-4 py-2 text-sm font-medium rounded-md transition 
                 data-[active=true]:bg-blue-600 
                 data-[active=true]:text-white 
                 data-[active=true]:shadow-sm 
                 hover:bg-blue-100 
                 data-[active=true]:hover:bg-blue-700"
    >
    
      Products
    </Tabs.Tab>

    <Tabs.Tab
      value="orders"
      className="px-4 py-2 text-sm font-medium rounded-md transition 
                 
                 data-[active=true]:bg-blue-600 
                 data-[active=true]:text-white 
                 data-[active=true]:shadow-sm 
                 hover:bg-blue-100 
                 data-[active=true]:hover:bg-blue-700"
    >
      Order Items
    </Tabs.Tab> */}
        </Tabs.List>
      </Group>


      <Tabs.Panel value="products" pt="xs">
        <Table.ScrollContainer maxHeight={400} minWidth={400}>
          <Table

            withRowBorders
            highlightOnHover
            m="md"
            className="bg-white border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm"
          >
     

            <Table.Thead>
              <Table.Tr className="  bg-gray-100 hover:bg-slate-50 text-gray-700 ">
                <Table.Th className="w-12 px-4 py-3"></Table.Th>
                <Table.Th className=" px-4 py-3 text-left font-semibold  uppercase text-xs tracking-wide">
                  Product
                </Table.Th>
                <Table.Th className="px-4 py-3 text-left font-semibold  uppercase text-xs tracking-wide">
                  Units sold
                </Table.Th>
                <Table.Th className="px-4 py-3 text-left font-semibold  uppercase text-xs tracking-wide">
                  Refunds
                </Table.Th>
                <Table.Th className="px-4 py-3 text-left font-semibold  uppercase text-xs tracking-wide">
                  Sales
                </Table.Th>
                <Table.Th className="px-4 py-3 text-left font-semibold  uppercase text-xs tracking-wide">
                  Ads
                </Table.Th>
                <Table.Th className="px-4 py-3 text-left font-semibold  uppercase text-xs tracking-wide">
                  Sellable returns
                </Table.Th>
                <Table.Th className="px-4 py-3 text-left font-semibold  uppercase text-xs tracking-wide">
                  Gross profit
                </Table.Th>
                <Table.Th className="px-4 py-3 text-left font-semibold  uppercase text-xs tracking-wide">
                  Net profit
                </Table.Th>
                <Table.Th className="px-4 py-3 text-left font-semibold  uppercase text-xs tracking-wide">
                  Margin
                </Table.Th>
                <Table.Th className="px-4 py-3 text-left font-semibold  uppercase text-xs tracking-wide">
                  ROI
                </Table.Th>
              </Table.Tr>
            </Table.Thead>

            <Table.Tbody>{renderRows(data.products)}</Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      </Tabs.Panel>


     
      <Tabs.Panel value="orders" pt="xs">
        <Table.ScrollContainer maxHeight={400} minWidth={400}>
          <Table

            withRowBorders
            highlightOnHover
            m="md"
            className="bg-white border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm"
          >
     

            <Table.Thead>
              <Table.Tr className="  bg-gray-100 hover:bg-slate-50 text-gray-700 ">
                <Table.Th className="w-12 px-4 py-3"></Table.Th>
                <Table.Th className=" px-4 py-3 text-left font-semibold  uppercase text-xs tracking-wide">
                  Order Items
                </Table.Th>
                <Table.Th className="px-4 py-3 text-left font-semibold  uppercase text-xs tracking-wide">
                  Units sold
                </Table.Th>
                <Table.Th className="px-4 py-3 text-left font-semibold  uppercase text-xs tracking-wide">
                  Refunds
                </Table.Th>
                <Table.Th className="px-4 py-3 text-left font-semibold  uppercase text-xs tracking-wide">
                  Sales
                </Table.Th>
                <Table.Th className="px-4 py-3 text-left font-semibold  uppercase text-xs tracking-wide">
                  Ads
                </Table.Th>
                <Table.Th className="px-4 py-3 text-left font-semibold  uppercase text-xs tracking-wide">
                  Sellable returns
                </Table.Th>
                <Table.Th className="px-4 py-3 text-left font-semibold  uppercase text-xs tracking-wide">
                  Gross profit
                </Table.Th>
                <Table.Th className="px-4 py-3 text-left font-semibold  uppercase text-xs tracking-wide">
                  Net profit
                </Table.Th>
                <Table.Th className="px-4 py-3 text-left font-semibold  uppercase text-xs tracking-wide">
                  Margin
                </Table.Th>
                <Table.Th className="px-4 py-3 text-left font-semibold  uppercase text-xs tracking-wide">
                  ROI
                </Table.Th>
              </Table.Tr>
            </Table.Thead>

            <Table.Tbody>{renderRows(data.orders)}</Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      </Tabs.Panel>
    </Tabs>
  );
}
