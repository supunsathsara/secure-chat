import MessageInput from "@/components/MessageInput";
import MessageList from "@/components/MessageList";
import ReceiverMessage from "@/components/ReceiverMessage";
import SenderMessage from "@/components/SenderMessage";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/utils/supabase/server";
import {
  CogIcon,
  MoveHorizontalIcon,
  PaperclipIcon,
  SearchIcon,
  SendIcon,
  X,
  XIcon,
} from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

const ChatPage = async ({ params }: { params: { userId: string } }) => {
  const supabase = createClient();

  const session = await supabase.auth.getUser();

  console.log(session.data.user?.user_metadata);

  const { data: receiverProfile, error: receiverFetchError } = await supabase
    .from("profiles")
    .select("id,full_name")
    .eq("id", params.userId)
    .single();

  if (receiverFetchError) {
    console.error(
      "An error occurred while fetching receiver profile",
      receiverFetchError.message
    );
  }

  console.log(receiverProfile);

  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .or(
      `and(sender_id.eq.${session.data.user?.id},receiver_id.eq.${params.userId}),and(sender_id.eq.${params.userId},receiver_id.eq.${session.data.user?.id})`
    )
    .order("created_at", { ascending: true });

  if (error) {
    console.error("An error occurred while fetching messages", error.message);
  }

  return (
    <div className="flex flex-col h-full min-h-screen w-full mx-auto bg-muted-foreground/80 shadow-lg">
      <div className="w-full max-w-5xl mx-auto">
        <div className="flex items-center w-full justify-between px-6 py-4 border-b">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src="/placeholder-user.jpg" alt="Avatar" />
              <AvatarFallback>{receiverProfile?.full_name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{receiverProfile?.full_name}</div>
              <div className="text-sm text-slate-700">Online</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <CogIcon className="w-5 h-5" />
            </Button>
            <Link href="/chat">
              <Button variant="ghost" size="icon">
                <XIcon className="w-6 h-6" />
              </Button>
            </Link>
          </div>
        </div>
        <div className="flex flex-col flex-grow overflow-hidden">
          <MessageList
            initialMessages={data!}
            userId={session.data.user?.id!}
            username={session.data.user?.user_metadata.full_name}
            receiver_name={receiverProfile?.full_name}
            receiver_id={receiverProfile?.id}
          />
          <div className="border-t px-4 py-4 bottom-0 mb-0">
            <MessageInput
              userId={session.data.user?.id}
              receiverId={receiverProfile?.id}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default ChatPage;
