"use client";

import { useState } from "react";
import ChatHeader from "@/components/chat/ChatHeader";
import MessageList from "@/components/chat/MessageList";
import ChatInput from "@/components/chat/ChatInput";
import SuggestedTopics from "@/components/chat/SuggestedTopics";

// Define types for messages
export interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "Hello! I'm your job search assistant. How can I help with your job search today?",
      role: "assistant",
      timestamp: new Date(),
    },
  ]);
  
  const [isLoading, setIsLoading] = useState(false);
  
  // Topics for quick prompts
  const quickPrompts = [
    "Help me improve my resume",
    "Prepare for a technical interview",
    "Tips for salary negotiation",
    "How to write a cover letter",
    "LinkedIn profile optimization",
  ];

  const handleSendMessage = async (messageText: string) => {
    if (!messageText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: messageText,
      role: "user",
      timestamp: new Date(),
    };

    // Add user message to chat
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    // Simulate AI response
    try {
      // Delay to simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Example responses based on keywords
      let responseText = "I'm not sure how to help with that. Could you provide more details?";
      
      if (messageText.toLowerCase().includes("resume")) {
        responseText = "For resume improvement, focus on quantifying your achievements, using action verbs, and tailoring it to each job description. Would you like me to review a specific section?";
      } else if (messageText.toLowerCase().includes("interview")) {
        responseText = "Technical interviews often include algorithms, system design, and behavioral questions. I recommend researching the company, practicing coding problems, and preparing examples of your past work. What role are you interviewing for?";
      } else if (messageText.toLowerCase().includes("salary") || messageText.toLowerCase().includes("negotiation")) {
        responseText = "When negotiating salary, research market rates, emphasize your value, and consider the total compensation package. It's usually best to let the employer name the first figure. Would you like specific negotiation phrases?";
      } else if (messageText.toLowerCase().includes("cover letter")) {
        responseText = "Effective cover letters should be personalized, concise, and highlight relevant experience. Address why you're interested in the company specifically and how your skills match their needs. Would you like a template?";
      }

      const aiMessage: Message = {
        id: Date.now().toString(),
        content: responseText,
        role: "assistant",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Failed to get AI response:", error);
      // Add error message
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          content: "Sorry, I'm having trouble connecting. Please try again later.",
          role: "assistant",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-160px)]">
      <ChatHeader />
      
      <div className="bg-white rounded-lg shadow-md flex flex-col flex-grow">
        <MessageList messages={messages} isLoading={isLoading} />
        
        <SuggestedTopics topics={quickPrompts} onSelectTopic={handleSendMessage} />
        
        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
}