import { useEffect } from "react";
import Nav from "./Nav";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";
import { useDispatch, useSelector } from "react-redux";
import getMessages from "../features/getMessages";
import { setArtifacts, setMessages } from "../redux/messageSlice";

const ChatArea = () => {
  const { selectedConversation } = useSelector((state) => state.conversation);
  const dispatch = useDispatch();

  useEffect(() => {
    const getMsg = async () => {
      if (selectedConversation?._id) {
        try {
          const data = await getMessages(selectedConversation._id);
          const messagesArray = Array.isArray(data) ? data : [];
          dispatch(setMessages(messagesArray));

          // Load latest generated artifacts for preview
          const latestArtifactMessage = [...messagesArray]
            .reverse()
            .find((msg) => msg.artifacts && msg.artifacts.length > 0);

          dispatch(setArtifacts(latestArtifactMessage?.artifacts || []));
        } catch (err) {
          console.error("Failed to load conversation messages:", err);
        }
      } else {
        dispatch(setMessages([]));
        dispatch(setArtifacts([]));
      }
    };

    getMsg();
  }, [selectedConversation?._id, dispatch]);

  return (
    <div className="flex-1 flex flex-col min-w-0 min-h-0 bg-[#0d0f14]">
      <Nav />
      <MessageList />
      <ChatInput />
    </div>
  );
};

export default ChatArea;
