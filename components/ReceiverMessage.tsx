import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface MessageProps {
  message: string;
  verified: boolean;
  username: string;
  time: string;
}

const ReceiverMessage: React.FC<MessageProps> = ({ message, verified, username, time }) => {
  return (
    <div className="flex items-start gap-4">
    <Avatar>
      <AvatarImage src="/placeholder-user.jpg" alt={`${username}'s Avatar`} />
      <AvatarFallback>{username ? username.charAt(0) : 'U'}</AvatarFallback>
    </Avatar>
    <div className="grid gap-2 text-sm max-w-[90%]">
      <div className="bg-muted rounded-2xl p-3 w-full max-w-[40rem] relative group">
        {verified && (
          <div className="absolute bottom-0 left-0 w-full bg-primary px-2 py-1 rounded-bl-xl rounded-br-xl text-primary-foreground text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
            Verified
          </div>
        )}
        <p>{message}</p>
        <div className="text-xs text-muted-foreground mt-1">{time}</div>
      </div>
    </div>
  </div>
);
}
export default ReceiverMessage