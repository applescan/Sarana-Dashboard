import { useQuery } from '@apollo/client';
import React, { useState, useEffect } from 'react';
import {
  GET_DASHBOARD_DATA,
  GET_ORDERS,
  GET_ITEMS_SOLD,
  GET_ITEMS_RESTOCKED,
  GET_PRODUCTS,
} from '@/graphql/queries';
import {
  Category,
  ItemsRestocked,
  ItemsSold,
  Revenue,
} from '@/lib/types/types';

type AIInsightProps = {
  startDate: Date | undefined;
  endDate: Date | undefined;
};

const AIInsight: React.FC<AIInsightProps> = ({ startDate, endDate }) => {
  const [aiChatResponse, setAIChatResponse] = useState('');
  console.log(startDate, endDate);
  // Fetch dashboard data
  const { loading: dashboardLoading, data: dashboardData } = useQuery(
    GET_DASHBOARD_DATA,
    { variables: { startDate, endDate } },
  );

  // Fetch order data
  const { loading: ordersLoading, data: ordersData } = useQuery(GET_ORDERS, {
    variables: { startDate, endDate },
  });

  // Fetch items sold data
  const { loading: itemsSoldLoading, data: itemsSoldData } =
    useQuery(GET_ITEMS_SOLD);

  // Fetch items restocked data
  const { loading: itemsRestockedLoading, data: itemsRestockedData } =
    useQuery(GET_ITEMS_RESTOCKED);

  // Fetch products data
  const { loading: productsLoading, data: productsData } =
    useQuery(GET_PRODUCTS);

  const loading =
    dashboardLoading ||
    ordersLoading ||
    itemsSoldLoading ||
    itemsRestockedLoading ||
    productsLoading;

  useEffect(() => {
    if (
      dashboardData &&
      ordersData &&
      itemsSoldData &&
      itemsRestockedData &&
      productsData
    ) {
      const defaultInput = `Provide insights based on the following data:
      - Items Sold: ${dashboardData.itemsSold.reduce(
        (acc: number, item: ItemsSold) => acc + item.quantity,
        0,
      )}
      - Items Restocked: ${dashboardData.itemsRestocked.reduce(
        (acc: number, item: ItemsRestocked) => acc + item.quantity,
        0,
      )}
      - Total Revenue: IDR ${dashboardData.revenues
        .reduce((acc: number, revenue: Revenue) => acc + revenue.amount, 0)
        .toLocaleString()}
      - Orders: ${ordersData.orders.length}
      - Best Selling Products: ${itemsSoldData.itemsSold
        .slice(0, 3)
        .map((item: ItemsSold) => item.product.name)
        .join(', ')}
      - Categories: ${dashboardData.categories
        .map((category: Category) => category.name)
        .join(', ')}`;
      sendAIRequest(defaultInput);
    }
  }, [
    dashboardData,
    ordersData,
    itemsSoldData,
    itemsRestockedData,
    productsData,
  ]);

  const sendAIRequest = async (input: string) => {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'user', content: input + ' in 3 sentences or less.' },
          ],
        }),
      });

      if (!response.body) {
        throw new Error('Failed to get a response body');
      }

      const reader = response.body.getReader();
      setAIChatResponse('');

      // eslint-disable-next-line no-constant-condition
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const currentChunk = new TextDecoder().decode(value);
        setAIChatResponse((prev) => prev + currentChunk);
      }
    } catch (error) {
      console.error('Failed to fetch AI chat response:', error);
      setAIChatResponse('Failed to communicate with AI.');
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="flex gap-4 justify-between">
      <div>
        <iframe
          src="https://lottie.host/embed/3d0a9402-f9ed-4345-b334-d4e7b6454ce3/KVNu0XHNaS.json"
          style={{
            width: '150px',
            height: '100%',
            border: 'none',
          }}
        ></iframe>
      </div>
      <div className="mb-4">
        {aiChatResponse ? (
          <div className="p-4 bg-secondary rounded-lg shadow-md border border-gray-200">
            <h1 className="text-gray-800 font-bold text-lg">
              AI Sales Insight
            </h1>
            <p>{aiChatResponse}</p>
          </div>
        ) : (
          <p className="text-gray-500">Generating insights...</p>
        )}
      </div>
    </div>
  );
};

export default AIInsight;
