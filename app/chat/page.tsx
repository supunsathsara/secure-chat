import MessageInput from "@/components/MessageInput";
import MessageList from "@/components/MessageList";
import ReceiverMessage from "@/components/ReceiverMessage";
import SenderMessage from "@/components/SenderMessage";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { getReceiverId } from "@/lib/crypto";
import { createClient } from "@/utils/supabase/server";
import {
  CogIcon,
  MoveHorizontalIcon,
  PaperclipIcon,
  SearchIcon,
  SendIcon,
} from "lucide-react";


export const dynamic = 'force-dynamic'

const ChatPage = async () => {
  const supabase = createClient();

  const session = await supabase.auth.getUser();

  console.log(session.data.user?.user_metadata);

  const receiver = getReceiverId(session.data.user?.id!);

  const {data, error} = await supabase.from("messages").select("*");

    if (error) {
        console.error("An error occurred while fetching messages", error.message);
    }

    console.log(data);


  return (
    <div className="flex mt-20 flex-col h-full max-w-2xl mx-auto bg-muted-foreground rounded-2xl shadow-lg">
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src="/placeholder-user.jpg" alt="Avatar" />
            <AvatarFallback>
              {session.data.user?.user_metadata.full_name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">
              {session.data.user?.user_metadata.full_name}
            </div>
            <div className="text-sm text-slate-700">Online</div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon">
            <SearchIcon className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <CogIcon className="w-5 h-5" />
          </Button>
        </div>
      </div>
      <MessageList initialMessages={data!} userId={session.data.user?.id!} username={session.data.user?.user_metadata.full_name}   />
      <div className="border-t p-4">
        <MessageInput userId={session.data.user?.id} receiverId={receiver} />
      </div>
    </div>
  );
};
export default ChatPage;
