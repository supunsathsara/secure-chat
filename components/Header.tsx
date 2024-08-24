import NextLogo from "./NextLogo";
import SupabaseLogo from "./SupabaseLogo";

export default function Header() {
  return (
    <div className="flex flex-col gap-16 items-center">
      <div className="flex gap-8 justify-center items-center">
        <h1 className="text-4xl font-bold text-center tracking-wide">Peer Link</h1>
      </div>
      <h1 className="sr-only">Peer Link</h1>
      <div className="w-full p-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent my-8" />
      <p className="text-3xl lg:text-4xl !leading-tight mx-auto max-w-xl text-center">
      Connect with Thousands, Securely and Simply. 
      <br />
      Discover and Chat with New Friends on Peer Link.
      </p>
      {/* <div className="w-full p-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent my-8" /> */}
    </div>
  );
}
