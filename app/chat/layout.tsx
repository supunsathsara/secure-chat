import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronLeft, LogOut, Settings, User } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { signOut } from "@/lib/actions";

const mockUsers = [
  {
    id: 1,
    name: "Alice Johnson",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  { id: 2, name: "Bob Smith", avatar: "/placeholder.svg?height=32&width=32" },
  {
    id: 3,
    name: "Charlie Brown",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: 4,
    name: "Diana Prince",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  { id: 5, name: "Ethan Hunt", avatar: "/placeholder.svg?height=32&width=32" },
];

export default async function ChatLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = createClient();

  const session = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("profiles")
    .select("id,full_name, avatar_url")
    .neq("id", session.data.user?.id);

  if (error) {
    console.error("An error occurred while fetching profiles", error.message);
  }

  console.log(data);

  return (
    <div className="flex flex-col h-screen bg-background w-full">
      <header className="flex justify-between items-center p-4 bg-primary text-primary-foreground">
        <h1 className="text-2xl font-bold">Peer Link</h1>
        <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="cursor-pointer text-slate-800">
                <AvatarImage src="/user.png" alt="Profile" />
                <AvatarFallback>
                    {session.data.user?.email?.[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <form action={signOut}>
            <Button variant="secondary" size="sm">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </form>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-fit md:w-64 bg-muted py-4 px-1 md:p-4 overflow-y-auto border-r">
          <h2 className="text-sm break-words md:text-lg font-semibold mb-4">
            Available Users
          </h2>

          <ScrollArea className="h-full">
            {data &&
              data.map((user) => (
                <a
                  href={`/chat/${user.id}`}
                  key={user.id}
                  className="flex items-center justify-start mb-2"
                >
                  <Button
                    key={user.id}
                    variant="ghost"
                    className="w-full justify-start"
                  >
                    <Avatar className="mr-2">
                      <AvatarImage src={user.avatar_url} alt={user.full_name} />
                      <AvatarFallback>{user.full_name[0]}</AvatarFallback>
                    </Avatar>
                    <span className="hidden md:flex">{user.full_name}</span>
                  </Button>
                </a>
              ))}
          </ScrollArea>
        </aside>

        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
