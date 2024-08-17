import React, { useState, useEffect } from 'react';
import { IoSend } from 'react-icons/io5';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/Dialog';
import Loading from '@/components/ui/Loading';
import { useDashboardData } from '@/hook/useDashboardData';

type AIInsightDialogProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
};

const AIInsightDialog: React.FC<AIInsightDialogProps> = ({
  isOpen,
  onOpenChange,
}) => {
  const [aiChatInput, setAIChatInput] = useState('');
  const [aiChatResponse, setAIChatResponse] = useState('');
  const { loading, error, itemsSold, itemsRestocked, totalRevenue } =
    useDashboardData();

  useEffect(() => {
    if (isOpen) {
      // Set default query and send it when the dialog opens
      const defaultInput = `Give insights on which items to sell more based on current data:
      - Items Sold: ${itemsSold}
      - Items Restocked: ${itemsRestocked}
      - Total Revenue: IDR ${totalRevenue.toLocaleString()}`;
      sendAIRequest(defaultInput);
    }
  }, [isOpen, itemsSold, itemsRestocked, totalRevenue]);

  const sendAIRequest = async (input: string) => {
    // Making AI request
    await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [
          { role: 'user', content: input + ' in 3 sentences or less.' },
        ],
      }),
    })
      .then(async (response) => {
        if (!response.body) {
          throw new Error('Failed to get a response body');
        }
        const reader = response.body.getReader();
        setAIChatResponse('');

        // Process the stream
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            break; // Exit the loop when the stream is finished
          }

          // Decode the stream chunk to a string and update the response state
          const currentChunk = new TextDecoder().decode(value);
          setAIChatResponse((prev) => prev + currentChunk);
        }
      })
      .catch((error) => {
        console.error('Failed to fetch AI chat response:', error);
        setAIChatResponse('Failed to communicate with AI.');
      });
  };

  const handleAIChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiChatInput.trim()) {
      alert('Please enter a question for the AI.');
      return;
    }
    sendAIRequest(aiChatInput);
    setAIChatInput(''); // Clear the input box after submission
  };

  const handleClose = (isOpen: boolean) => {
    if (!isOpen) {
      setAIChatResponse('');
      setAIChatInput(''); // Clear the input when closing the dialog
    }
    onOpenChange(isOpen);
  };

  if (loading) return <Loading />;
  if (error) return <div>Error loading data.</div>;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="h-5/6">
        <DialogHeader>
          <DialogTitle>AI-Powered Sales Insight</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center overflow-auto">
          <div className="mb-4 w-full">
            {aiChatResponse && (
              <div className="mt-4">
                <label
                  htmlFor="aiResponse"
                  className="block text-sm font-medium text-gray-700"
                >
                  AI Response:
                </label>
                <div className="mt-1 text-sm">{aiChatResponse}</div>
              </div>
            )}
          </div>
          <form
            onSubmit={handleAIChatSubmit}
            className="flex flex-col gap-2 w-full"
          >
            <label
              htmlFor="aiInput"
              className="block text-sm font-medium text-gray-700"
            >
              Ask the AI:
            </label>
            <textarea
              id="aiInput"
              value={aiChatInput}
              onChange={(e) => setAIChatInput(e.target.value)}
              className="mt-1 block w-full py-2 px-3 border border-purple-800/30 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Ask the AI for sales insights..."
            />
            <div className="flex items-center gap-2 justify-between mt-2">
              <button type="submit" className="text-pink-600">
                <IoSend className="h-6 w-6" />
              </button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AIInsightDialog;
