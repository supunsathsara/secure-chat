"use client";

import { useEffect, useState } from "react";
import ReceiverMessage from "./ReceiverMessage";
import SenderMessage from "./SenderMessage";
import { decryptMessage, verifyMessage} from "@/lib/crypto";
import { createClient } from "@/utils/supabase/client";
import { ScrollArea } from "./ui/scroll-area";


export const dynamic = 'force-dynamic'

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
  receiver_name: string;
  receiver_id: string;
}

const MessageList: React.FC<MessageListProps> = ({
  initialMessages,
  userId,
  username,
  receiver_name,
  receiver_id,
}) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);

  useEffect(() => {
    const supabase = createClient();
    const channels = supabase
      .channel("chat-insert-channel")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          console.log("Change received!", payload);
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
     <ScrollArea className=" h-[350px] md:h-[470px] mt-4 mb-1 py-2 overflow-hidden">
      <div className="space-y-4 px-1 mr-2">
        {messages.map((msg) => {
          const decryptedMessage = decryptMessage(msg.encrypted_message);
          const isSender = msg.sender_id === userId;
    
          if (isSender) {
            return (
              <SenderMessage
                key={msg.id}
                message={decryptedMessage}
                verified={verifyMessage(decryptedMessage, msg.message_digest)}
                username={username}
                time={new Date(msg.created_at).toLocaleTimeString()}
              />
            );
          } else {
            return (
              <ReceiverMessage
                key={msg.id}
                message={decryptedMessage}
                verified={verifyMessage(decryptedMessage, msg.message_digest)}
                username={receiver_name}
                time={new Date(msg.created_at).toLocaleTimeString()}
              />
            );
          }
        })}
      </div>
    </ScrollArea>
  );
};

export default MessageList;

