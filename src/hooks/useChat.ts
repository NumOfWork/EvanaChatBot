import { useChat as useAIChat } from "ai/react";
import { useEffect, useRef, useState } from "react";

export type CHAT_STATE = "GET_STARTED" | "CHAT";
export default function useChat() {
  const [stage, setStage] = useState<CHAT_STATE>("GET_STARTED");
  const inputRef = useRef<HTMLDivElement | null>(null);
  const {
    messages,
    handleSubmit,
    input,
    handleInputChange,
    isLoading,
    setInput,
    error,
    stop,
    reload,
    setMessages,
    setData,
  } = useAIChat({
    onError: (e) => {
      console.log("useChat error", e);
    },
  });

  const reset = () => {
    stop();
    setData([]);
    setInput("");
    setMessages([]);
  };

  const focusPrompt = () => {
    if (inputRef.current) inputRef.current.focus();
  };

  //scroll to bot when messages change
  useEffect(() => {
    if (messages.length > 0) {
      setStage("CHAT");
      if (typeof window !== "undefined") {
        document.getElementById("bimboApp")?.scrollTo({ top: 1000000000 });
      }
    } else {
      setStage("GET_STARTED");
    }
  }, [messages]);

  //focus on prompt input when not loading
  useEffect(() => {
    if (!isLoading) focusPrompt();
  }, [isLoading]);

  return {
    messages,
    stage,

    handleInputChange,
    input,
    isLoading,
    error,
    stop,
    handleSubmit,
    setInput,
    inputRef,
    reload,
    reset,
  };
}
