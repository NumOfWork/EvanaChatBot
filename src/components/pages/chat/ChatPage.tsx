"use client";
import useChat from "@/src/hooks/useChat";
import { Colors } from "@/src/statics/colors";
import styled from "styled-components";
import ChatHolder from "../../common/chat/ChatHolder";
import NewChatBtn from "../../common/chat/NewChatBtn";
import ChatInput from "../../common/input/ChatInput";
import Row from "../../common/Row";
import GetStarted from "./GetStarted";

const ChatPageEl = styled(Row)`
  position: relative;
  width: 100svw;
  min-height: 100svh;
  color: ${Colors.White};
  height: fit-content;
`;

export default function ChatPage() {
  const {
    isLoading,
    stage,
    setInput,
    handleSubmit,
    handleInputChange,
    messages,
    input,
    inputRef,
    reset,
  } = useChat();

  const canSend = !isLoading && typeof input === "string" && input.length > 0;

  return (
    <ChatPageEl id="chatPage">
      {stage === "CHAT" && <NewChatBtn onClick={reset}>เริ่มแชทใหม่</NewChatBtn>}
      <ChatHolder messages={messages} />
      <GetStarted
        setPrompt={setInput}
        active={stage === "GET_STARTED" && messages.length <= 0}
      />
      <ChatInput
        inputRef={inputRef}
        messageCount={messages.length}
        isLoading={isLoading}
        prompt={input}
        handleSubmit={handleSubmit}
        canSend={canSend}
        handleInputChange={handleInputChange}
        maxContextSize={2025}
      />
    </ChatPageEl>
  );
}
