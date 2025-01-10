import { Colors } from "@/src/statics/colors";
import styled from "styled-components";

const NewChatBtn = styled.button`
  all: unset;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 10px;
  left: 50%;
  cursor: pointer;
  border-radius: 0 0 10px 10px;
  color: ${Colors.White};
  position: fixed;
  top: 0;
  transform: translate(-50%, -80%) scale(1.05);
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
  width: 100px;
  height: 20px;
  transition: all 0.15s;
  background-color: ${Colors.NewBtn};

  &:hover {
    transform: translate(-50%, 0) scale(1.05);
    /* top: 10px; */
  }
`;

export default NewChatBtn;
