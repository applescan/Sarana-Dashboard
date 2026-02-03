import { useQuery } from '@apollo/client';
import React, { useState, useEffect, FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
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
      const bestSellers = [...itemsSoldData.itemsSold]
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 3)
        .map((item: ItemsSold) => item.product.name)
        .join(', ');

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
      - Best Selling Products: ${bestSellers}
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
      <Card className="min-h-[180px] animate-pulse bg-card/50">
        <CardHeader>
          <CardTitle className="text-xl">🧠 AI Sales Insight</CardTitle>
        </CardHeader>
        <CardContent>Loading data and generating insights...</CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-red-500/30 bg-red-500/10 text-red-100">
        <CardHeader>
          <CardTitle className="text-xl">⚠️ Insight unavailable</CardTitle>
        </CardHeader>
        <CardContent>
          Please check your connection and try again shortly.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="relative overflow-hidden">
      <div className="absolute -left-10 top-2 hidden h-40 w-40 rounded-full bg-gradient-to-br from-primary/60 to-accent/40 blur-3xl sm:block" />
      <CardHeader className="relative z-10 flex flex-col gap-2">
        <CardTitle className="text-xl">🧠 AI Sales Insight</CardTitle>
        <p className="text-sm text-muted">
          Machine-curated signals based on your latest performance.
        </p>
      </CardHeader>
      <CardContent className="relative z-10">
        {aiError ? (
          <p className="text-red-300 text-sm">{aiError}</p>
        ) : aiChatResponse ? (
          <p className="text-secondary-foreground/90 whitespace-pre-wrap leading-relaxed">
            {aiChatResponse}
          </p>
        ) : (
          <p className="text-muted">Generating insights...</p>
        )}
      </CardContent>
    </Card>
  );
};

export default AIInsight;
