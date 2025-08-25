import styled from "styled-components";

import { Colors } from "@/src/statics/colors";
import prompts from "@/src/statics/prompts";
import { Dispatch, SetStateAction } from "react";
import Row from "../../common/Row";

const GetStartedEl = styled(Row)<{ $active?: string }>`
  position: absolute;
  align-items: center;
  justify-content: center;
  text-align: center;
  width: fit-content;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -80%);
  flex-direction: column;
  display: ${(p) => (p.$active === "true" ? "" : "none")};
  gap: 30px;
`;
const TitleEl = styled.h1`
  font-size: 5rem;
  margin: 0;
  padding: 0;
  color: ${Colors.Primary};
`;

const HolderEl = styled(Row)`
  align-items: center;
  width: 100%;
  /* background-color: red; */
  gap: 18px;
  flex-direction: column;
`;
const SugEl = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  border-radius: 20px;
  width: 100%;
  /* max-width: 200px; */
  user-select: none;
  cursor: pointer;
  height: 80px;
  transition: all 0.15s;
  text-align: left;
  border: 1px solid ${Colors.White};
  gap: 10px;

  & > div {
    &:first-child {
      color: ${Colors.White};
      font-size: 0.8rem;
      font-weight: bold;
    }
    &:last-child {
      color: ${Colors.Primary};
      font-size: 0.8rem;
    }
  }

  &:hover {
    transform: translateY(-8px);
    background-color: ${Colors.White};
    box-shadow: rgb(223, 246, 255) 0px 2px 8px 0px;

    & > div {
      &:first-child {
        color: ${Colors.Primary};
      }
      &:last-child {
        color: ${Colors.Background};
      }
    }
  }
`;

const SubTitleEl = styled.h3`
  font-size: 1.5rem;
  margin: 0;
  padding: 0;
  color: ${Colors.White};
`;

export default function GetStarted({
  setPrompt,
  active,
}: {
  setPrompt: Dispatch<SetStateAction<string>>;
  active: boolean;
}) {
  return (
    <GetStartedEl $active={active ? "true" : "false"}>
      <Row $fd="column">
        <TitleEl>EVana ChatBot</TitleEl>
        <SubTitleEl>ถามฉันมาได้เลย 😀😎</SubTitleEl> 
      </Row>
      <HolderEl>
        {prompts.map((p) => { 
          return (
            <SugEl
              key={p.id}
              onClick={() => {
                setPrompt(p.prompt);
              }}
            >
              <div>{p.title}</div>
              <div>
                {p.prompt.length > 50
                  ? p.prompt.substring(0, 50) + "..."
                  : p.prompt}
              </div>
            </SugEl>
          );
        })}
      </HolderEl>
    </GetStartedEl>
  );
}
