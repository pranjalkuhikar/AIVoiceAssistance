import Vapi from "@vapi-ai/web";

// Get API keys from environment variables
const apiKey = import.meta.env.VITE_VAPI_API_KEY;
const assistantId = import.meta.env.VITE_VAPI_ASSISTANT_ID;

// Create a singleton instance of Vapi
let vapiInstance = null;

export const initVapi = () => {
  if (!vapiInstance) {
    if (!apiKey) {
      console.error(
        "API key is missing. Make sure VITE_VAPI_API_KEY is set in your .env file."
      );
      return null;
    }
    vapiInstance = new Vapi(apiKey);
  }
  return vapiInstance;
};

export const getAssistantId = () => {
  if (!assistantId) {
    console.error(
      "Assistant ID is missing. Make sure VITE_VAPI_ASSISTANT_ID is set in your .env file."
    );
    return null;
  }
  return assistantId;
};
