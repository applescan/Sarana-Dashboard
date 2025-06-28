import { useQuery } from '@apollo/client';
import React, { useState, useEffect, FC } from 'react';
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
  startDate?: Date;
  endDate?: Date;
};

const AIInsight: FC<AIInsightProps> = ({ startDate, endDate }) => {
  const [aiChatResponse, setAIChatResponse] = useState('');
  const [aiError, setAIError] = useState<string | null>(null);

  const {
    loading: dashboardLoading,
    data: dashboardData,
    error: dashboardError,
  } = useQuery(GET_DASHBOARD_DATA, { variables: { startDate, endDate } });

  const {
    loading: ordersLoading,
    data: ordersData,
    error: ordersError,
  } = useQuery(GET_ORDERS, { variables: { startDate, endDate } });

  const {
    loading: itemsSoldLoading,
    data: itemsSoldData,
    error: itemsSoldError,
  } = useQuery(GET_ITEMS_SOLD);

  const {
    loading: itemsRestockedLoading,
    data: itemsRestockedData,
    error: itemsRestockedError,
  } = useQuery(GET_ITEMS_RESTOCKED);

  const {
    loading: productsLoading,
    data: productsData,
    error: productsError,
  } = useQuery(GET_PRODUCTS);

  const loading =
    dashboardLoading ||
    ordersLoading ||
    itemsSoldLoading ||
    itemsRestockedLoading ||
    productsLoading;

  const error =
    dashboardError ||
    ordersError ||
    itemsSoldError ||
    itemsRestockedError ||
    productsError;

  useEffect(() => {
    if (
      dashboardData?.itemsSold &&
      dashboardData?.itemsRestocked &&
      dashboardData?.revenues &&
      dashboardData?.categories &&
      ordersData?.orders &&
      itemsSoldData?.itemsSold
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
        .reduce((acc: number, r: Revenue) => acc + r.amount, 0)
        .toLocaleString()}
      - Orders: ${ordersData.orders.length}
      - Best Selling Products: ${itemsSoldData.itemsSold
        .slice(0, 3)
        .map((item: ItemsSold) => item.product.name)
        .join(', ')}
      - Categories: ${dashboardData.categories
        .map((c: Category) => c.name)
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
      setAIError(null);
      setAIChatResponse('');
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'user', content: input + ' in 3 sentences or less.' },
          ],
        }),
      });

      if (!response.body) throw new Error('No response body from AI');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let aiText = '';

      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        aiText += decoder.decode(value);
        setAIChatResponse(aiText);
      }
    } catch (err) {
      console.error('AI Error:', err);
      setAIError('⚠️ Failed to get insights. Please try again later.');
    }
  };

  if (loading) {
    return (
      <div className="text-gray-500 text-sm animate-pulse">
        Loading data and generating AI insight...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 bg-red-50 border border-red-300 p-4 rounded">
        ⚠️ Error fetching data. Please check your network or try again.
      </div>
    );
  }

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
      <div className="mb-4 max-w-xl">
        <div className="p-4 bg-secondary rounded-lg shadow-md border border-gray-200">
          <h1 className="text-gray-800 font-bold text-lg mb-2">
            🧠 AI Sales Insight
          </h1>
          {aiError ? (
            <p className="text-red-600 text-sm">{aiError}</p>
          ) : aiChatResponse ? (
            <p className="text-gray-700 whitespace-pre-wrap">
              {aiChatResponse}
            </p>
          ) : (
            <p className="text-gray-500">Generating insights...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIInsight;
