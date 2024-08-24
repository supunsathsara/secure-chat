import Image from "next/image";

export const dynamic = "force-dynamic";
import chatImage from "../../public/Conversation-Rafiki.png";

const ChatPage = async () => {
  return (
    <div className="flex flex-col mx-auto my-auto justify-center">
      <div className="flex flex-col mx-auto max-w-2xl my-auto p-3 items-center justify-center">
        <Image src={chatImage} alt="Image" width="500" className="" />
        <h2 className="text-2xl font-bold text-center">
          Connect with Thousands,
          <br/>
          <span className="text-blue-700">Securely and Simply</span> with
          <span className="text-blue-700"> Peer Link</span>.
        </h2>
        <h3 className="text-lg text-center">
          Discover and Chat with New Friends.
        </h3>
      </div>
    </div>
  );
};
export default ChatPage;
