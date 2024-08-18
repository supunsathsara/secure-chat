"use client";

import { useEffect, useState } from "react";
import ReceiverMessage from "./ReceiverMessage";
import SenderMessage from "./SenderMessage";
import { decryptMessage } from "@/lib/crypto";
import { createClient } from "@/utils/supabase/client";
import { send } from "process";

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  encrypted_message: string;
  message_digest: string;
  created_at: string;
}

interface MessageListProps {
  initialMessages: Message[];
  userId: string;
  username: string;
}

const MessageList: React.FC<MessageListProps> = ({
  initialMessages,
  userId,
  username,
}) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);

  useEffect(() => {
    const supabase = createClient();
    const channels = supabase
      .channel("custom-insert-channel")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          console.log("Change received!", payload);

          // Type assertion here
          const newMessage = payload.new as Message;

          setMessages((prevMessages) => [...prevMessages, newMessage]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channels);
    };
  }, []);

  return (
    <div>
      <div className="w-full flex-1 overflow-auto p-6 space-y-4">
        {messages.map((msg) => {
          const decryptedMessage = decryptMessage(msg.encrypted_message);
          const isSender = msg.sender_id === userId;
          //e4b26131-5541-403d-b688-fcae8cb18366 = Supun sathsara
          let sending = "user";
          if (userId == "e4b26131-5541-403d-b688-fcae8cb18366") {
            sending = "Madubashini gamage";
          } else {
            sending = "Supun Sathsara";
          }

          if (isSender) {
            return (
              <SenderMessage
                key={msg.id}
                message={decryptedMessage}
                verified={true} // Assuming messages are verified on send
                username={username}
                time={new Date(msg.created_at).toLocaleTimeString()}
              />
            );
          } else {
            return (
              <ReceiverMessage
                key={msg.id}
                message={decryptedMessage}
                verified={true} // Assuming messages are verified on send
                username={sending}
                time={new Date(msg.created_at).toLocaleTimeString()}
              />
            );
          }
        })}
      </div>
    </div>
  );
};

export default MessageList;
