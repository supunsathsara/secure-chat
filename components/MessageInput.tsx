"use client";

import { sendMessage } from "@/lib/actions";
import { SendIcon } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import SubmitButton from "./SubmitButton";
import { Textarea } from "./ui/textarea";

const messageSchema = z
  .string()
  .min(1, { message: "Message cannot be empty" })
  .max(500, { message: "Message cannot exceed 500 characters" });

  const MessageInput = ({ userId, receiverId }: any) => {
    const [message, setMessage] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
  
    const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setMessage(e.target.value);
    };
  
        const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        // Validate
        const result = messageSchema.safeParse(message);
        if (!result.success) {
          const errorMessage = result.error.errors[0]?.message || "Invalid message";
          setError(errorMessage);
          return;
        }
    
        sendMessageHandler();
      }
    };
    
    const handleSendMessage = async () => {
      // Validate
      const result = messageSchema.safeParse(message);
      if (!result.success) {
        const errorMessage = result.error.errors[0]?.message || "Invalid message";
        setError(errorMessage);
        return;
      }
    
      sendMessageHandler();
    };
    
    const sendMessageHandler = async () => {
      try {
        await sendMessage(message, receiverId);
        setMessage("");
        setError(null); // Clear any previous errors
      } catch (err) {
        setError("Failed to send message");
      }
    };
  
    return (
      <div className="relative">
        <Textarea
          placeholder="Type your message..."
          className="rounded-2xl pr-16 resize-none"
          name="message"
          rows={1}
          value={message}
          onChange={handleMessageChange}
          onKeyDown={handleKeyDown}
        />
        <SubmitButton
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-3 top-1/2 -translate-y-1/2"
          onClick={handleSendMessage}
          pendingText=".."
        >
          <SendIcon className="w-5 h-5" />
        </SubmitButton>
        {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
      </div>
    );
  };

export default MessageInput;
