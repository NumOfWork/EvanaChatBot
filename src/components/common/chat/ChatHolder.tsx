import styled from "styled-components";
import Row from "../Row";
import { Message } from "ai";
import ResponseBubble from "./ResponseBubble";
import UserBubble from "./UserBubble";

const ChatHolderEl = styled(Row)`
  width: 100%;
  height: fit-content;
  flex-direction: column;
  gap: 20px;
  padding: 20px 20px 130px 20px;
`;

export default function ChatHolder({ messages }: { messages: Message[] }) {
  return (
    <ChatHolderEl id="chatHolder">
      {messages.map((x) => {
        if (x.role === "assistant")
          return <ResponseBubble key={x.id} message={x} />;
        else if (x.role === "user")
          return <UserBubble key={x.id} message={x} />;
      })}
    </ChatHolderEl>
  );
}
