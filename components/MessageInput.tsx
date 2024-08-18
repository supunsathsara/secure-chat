"use client";

import { useState } from "react";
import { SendIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { z } from "zod";
import { encryptMessage, generateMessageDigest } from "@/lib/crypto";
import { createClient } from "@/utils/supabase/client";

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

  const supabase = createClient();
  const handleSendMessage = async () => {
    try {
      // Validate the message
      messageSchema.parse(message);

      const encryptedMessage = encryptMessage(message);

      // Generate message digest
      const digest = generateMessageDigest(message);

      // Send the encrypted message and digest to Supabase
      const { error } = await supabase.from("messages").insert([
        {
          sender_id: userId,
          receiver_id: receiverId,
          encrypted_message: encryptedMessage,
          message_digest: digest,
        },
      ]);

      if (error) {
        throw new Error("Failed to send message");
      }

      // Clear the input field after sending
      setMessage("");

      //refresh the page
        window.location.reload();
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message);
      } else {
        setError("An error occurred while sending the message");
      }
    }
  };

  return (
    <div className="relative">
      <Textarea
        placeholder="Type your message..."
        className="rounded-2xl pr-16 resize-none"
        rows={1}
        value={message}
        onChange={handleMessageChange}
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="absolute right-3 top-1/2 -translate-y-1/2"
        onClick={handleSendMessage}
      >
        <SendIcon className="w-5 h-5" />
      </Button>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
};

export default MessageInput;
