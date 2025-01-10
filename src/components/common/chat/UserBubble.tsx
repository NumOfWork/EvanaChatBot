import styled from "styled-components";
import Row from "../Row";
import { Message } from "ai";
import { Colors } from "@/src/statics/colors";

const UserBubbleEl = styled(Row)`
  padding: 10px;
  background-color: ${Colors.Primary};
  border-radius: 10px;
  width: fit-content;
  margin-left: auto;
  max-width: calc(100svw - 40px);
`;

export default function UserBubble({ message }: { message: Message }) {
  return <UserBubbleEl>{message.content}</UserBubbleEl>;
}
