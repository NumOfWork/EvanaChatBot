import styled from "styled-components";
import Row from "../Row";
import { Message } from "ai";
import { Colors } from "@/src/statics/colors";

const ResponseBubbleEl = styled(Row)`
  padding: 10px;
  background-color: ${Colors.Secondary};
  border-radius: 10px;
  width: fit-content;
  margin-right: auto;
  max-width: calc(100svw - 40px);
`;

export default function ResponseBubble({ message }: { message: Message }) {
  return <ResponseBubbleEl>{message.content}</ResponseBubbleEl>;
}
