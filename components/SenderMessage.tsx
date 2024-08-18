import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface SenderMessageProps {
  message: string;
  verified: boolean;
  username: string;
  time: string;
}

const SenderMessage: React.FC<SenderMessageProps> = ({ message, verified, username, time }) => {
  return (
    <div className="flex items-start gap-4 justify-end">
    <div className="grid gap-2 text-sm">
      <div className="bg-blue-400/40 rounded-2xl p-3 max-w-[80%] relative group">
      {verified && (
          <div className="absolute top-0 right-0 bg-primary px-2 py-1 rounded-bl-xl text-primary-foreground text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
            Verified
          </div>
        )}
        <p className="text-slate-100">{message}</p>
        <div className="text-xs text-slate-800 mt-1">{time}</div>
      </div>
    </div>
    <Avatar>
      <AvatarImage src="/placeholder-user.jpg" alt="Avatar" />
      <AvatarFallback>{username ? username.charAt(0) : 'U'}</AvatarFallback>
    </Avatar>
  </div>
  );
};

export default SenderMessage;