import { useQuery } from '@apollo/client';
import React, { useState, useEffect, FC, useMemo, useRef } from 'react';
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
  } = useQuery(GET_ITEMS_SOLD, { variables: { startDate, endDate } });

  const { loading: itemsRestockedLoading, error: itemsRestockedError } =
    useQuery(GET_ITEMS_RESTOCKED, { variables: { startDate, endDate } });

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

  const promptInput = useMemo(() => {
    if (
      !dashboardData?.itemsSold ||
      !dashboardData?.itemsRestocked ||
      !dashboardData?.revenues ||
      !dashboardData?.categories ||
      !ordersData?.orders ||
      !itemsSoldData?.itemsSold ||
      !productsData?.products
    ) {
      return '';
    }

    const totalItemsSold = dashboardData.itemsSold.reduce(
      (acc: number, item: ItemsSold) => acc + item.quantity,
      0,
    );
    const totalItemsRestocked = dashboardData.itemsRestocked.reduce(
      (acc: number, item: ItemsRestocked) => acc + item.quantity,
      0,
    );
    const totalRevenue = dashboardData.revenues.reduce(
      (acc: number, r: Revenue) => acc + r.amount,
      0,
    );
    const orderCount = ordersData.orders.length;
    const totalOrderValue = ordersData.orders.reduce(
      (acc: number, order: { totalAmount: number }) => acc + order.totalAmount,
      0,
    );
    const avgOrderValue = orderCount ? totalOrderValue / orderCount : 0;

    const bestSellers = [...itemsSoldData.itemsSold]
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 3)
      .map((item: ItemsSold) => item.product.name)
      .join(', ');

    const categoryTotals = new Map<string, number>();
    dashboardData.itemsSold.forEach((item: ItemsSold) => {
      const name = item.product.category?.name ?? 'Uncategorized';
      categoryTotals.set(name, (categoryTotals.get(name) ?? 0) + item.quantity);
    });
    const topCategories = Array.from(categoryTotals.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([name]) => name)
      .join(', ');

    const lowStock = [...productsData.products]
      .sort((a, b) => a.stock - b.stock)
      .slice(0, 3)
      .map((product) => `${product.name} (${product.stock})`)
      .join(', ');

    return `Provide insights based on the following data:
    - Items Sold: ${totalItemsSold}
    - Items Restocked: ${totalItemsRestocked}
    - Total Revenue: IDR ${totalRevenue.toLocaleString()}
    - Orders: ${orderCount}
    - Average Order Value: IDR ${avgOrderValue.toFixed(0)}
    - Best Selling Products: ${bestSellers || 'None'}
    - Top Categories: ${topCategories || 'None'}
    - Lowest Stock Products: ${lowStock || 'None'}
    - Categories: ${dashboardData.categories
      .map((c: Category) => c.name)
      .join(', ')}`;
  }, [dashboardData, ordersData, itemsSoldData, productsData]);

  const lastPromptRef = useRef<string>('');
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!promptInput || loading || error) return;
    if (lastPromptRef.current === promptInput) return;
    lastPromptRef.current = promptInput;
    sendAIRequest(promptInput);
  }, [promptInput, loading, error]);

  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  const sendAIRequest = async (input: string) => {
    try {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      setAIError(null);
      setAIChatResponse('');
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          messages: [
            { role: 'user', content: input + ' in 3 sentences or less.' },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`AI request failed with status ${response.status}`);
      }
      if (!response.body) throw new Error('No response body from AI');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let aiText = '';

      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        aiText += decoder.decode(value, { stream: true });
        setAIChatResponse(aiText);
      }
      aiText += decoder.decode();
      setAIChatResponse(aiText);
    } catch (err) {
      if ((err as Error).name === 'AbortError') return;
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
