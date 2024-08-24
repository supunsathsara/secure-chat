"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { encryptMessage, generateMessageDigest } from "./crypto";

export const signOut = async () => {
  console.log("signing out");
  const supabase = createClient();
  await supabase.auth.signOut();
  return redirect("/login");
};

export const sendMessage = async (message: string, receiverId: string) => {
  const supabase = createClient();

  const session = await supabase.auth.getUser();

  console.log("Sending message to receiver", receiverId);
  console.log("Message", message);
  console.log("Sender", session.data.user?.id);

  // Encrypt the message
  const encryptedMessage = encryptMessage(message);

  const digest = generateMessageDigest(message);

  const { error } = await supabase.from("messages").insert([
    {
      sender_id: session.data.user?.id,
      receiver_id: receiverId,
      encrypted_message: encryptedMessage,
      message_digest: digest,
    },
  ]);

  if (error) {
    throw new Error("Failed to send message");
  }

  console.log("Message sent successfully");
};
