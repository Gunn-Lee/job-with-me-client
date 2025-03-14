"use client";

import { useRef, useEffect } from "react";
import { FiUserPlus } from "react-icons/fi";
import { RiRobot2Line } from "react-icons/ri";
import type { Message } from "@/app/(protected)/chat/page";

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
}

export default function MessageList({ messages, isLoading }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom of messages when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <div className="flex-grow overflow-y-auto p-6">
      <div className="space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] md:max-w-[70%] rounded-lg p-3 ${
                message.role === "user"
                  ? "bg-blue-600 text-white rounded-br-none"
                  : "bg-gray-100 text-gray-800 rounded-bl-none"
              }`}
            >
              <div className="flex items-center mb-1">
                {message.role === "assistant" ? (
                  <>
                    <RiRobot2Line className="mr-2" />
                    <span className="font-medium">Assistant</span>
                  </>
                ) : (
                  <>
                    <FiUserPlus className="mr-2" />
                    <span className="font-medium">You</span>
                  </>
                )}
                <span className="text-xs ml-2 opacity-70">{formatTime(message.timestamp)}</span>
              </div>
              <p className="whitespace-pre-wrap">{message.content}</p>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-800 rounded-lg rounded-bl-none p-3">
              <div className="flex items-center">
                <RiRobot2Line className="mr-2" />
                <span className="font-medium">Assistant</span>
              </div>
              <div className="mt-2 flex items-center space-x-1">
                <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></div>
                <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '400ms' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}