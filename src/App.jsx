import React, { useEffect, useRef, useState } from "react";
import { Mic, Loader2, Volume2, AlertCircle } from "lucide-react";
import { initVapi, getAssistantId } from "./services/Aiservices";

const App = () => {
  const vapiRef = useRef(null);
  const [status, setStatus] = useState("idle"); // 'idle', 'listening', 'processing', 'error'
  const [errorMessage, setErrorMessage] = useState("");
  const [transcript, setTranscript] = useState("");

  useEffect(() => {
    // Initialize Vapi using our service
    const vapi = initVapi();

    if (!vapi) {
      setStatus("error");
      setErrorMessage(
        "Failed to initialize voice assistant. Please check your API keys."
      );
      return;
    }

    vapiRef.current = vapi;

    // Set up event listeners
    vapi.on("start", () => {
      setStatus("listening");
      setTranscript("");
    });

    vapi.on("end", () => {
      setStatus("idle");
    });

    vapi.on("error", (error) => {
      console.error("Vapi error:", error);
      setStatus("error");
      setErrorMessage("An error occurred with the voice assistant.");
    });

    vapi.on("speech", (speech) => {
      setTranscript(speech.transcript || "");
    });

    // Cleanup function
    return () => {
      if (vapiRef.current) {
        vapiRef.current.stop();
      }
    };
  }, []);

  const handleMicClick = () => {
    if (status === "error") {
      // Try to reinitialize
      setStatus("idle");
      setErrorMessage("");
      return;
    }

    if (vapiRef.current) {
      const assistantId = getAssistantId();
      if (!assistantId) {
        setStatus("error");
        setErrorMessage(
          "Assistant ID is missing. Please check your environment variables."
        );
        return;
      }

      try {
        vapiRef.current.start(assistantId);
      } catch (error) {
        console.error("Error starting voice assistant:", error);
        setStatus("error");
        setErrorMessage("Failed to start voice assistant.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100 p-4 sm:p-6">
      <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl px-6 py-10 w-full max-w-md text-center relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-purple-200 to-indigo-200 rounded-full opacity-50"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-gradient-to-tr from-indigo-200 to-purple-200 rounded-full opacity-50"></div>

        <div className="relative z-10">
          <h1 className="text-2xl sm:text-3xl font-bold text-indigo-800 mb-2">
            Health Voice Assistant
          </h1>
          <p className="text-gray-600 mb-8 text-sm sm:text-base">
            Ask anything related to your health. I'm here to help!
          </p>

          {/* Status indicator */}
          {status === "error" && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center">
              <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Transcript display */}
          {transcript && (
            <div className="mb-6 p-4 bg-indigo-50 border border-indigo-100 rounded-lg text-indigo-700 text-sm">
              <div className="flex items-center mb-2">
                <Volume2 className="w-4 h-4 mr-2" />
                <span className="font-medium">You said:</span>
              </div>
              <p className="text-gray-700">"{transcript}"</p>
            </div>
          )}

          {/* Main button */}
          <button
            onClick={handleMicClick}
            className={`w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center mx-auto rounded-full shadow-lg transition ${getButtonStyles()}`}
          >
            {getButtonIcon()}
          </button>

          {/* Status text */}
          <p className={`mt-4 text-sm font-semibold ${getStatusTextStyles()}`}>
            {getStatusText()}
          </p>
        </div>
      </div>
    </div>
  );

  // Helper functions for UI elements
  function getButtonStyles() {
    switch (status) {
      case "listening":
        return "bg-indigo-500 text-white animate-pulse hover:bg-indigo-600";
      case "error":
        return "bg-red-500 text-white hover:bg-red-600";
      default:
        return "bg-indigo-500 text-white hover:bg-indigo-600";
    }
  }

  function getButtonIcon() {
    switch (status) {
      case "listening":
        return <Loader2 className="animate-spin w-6 h-6 sm:w-8 sm:h-8" />;
      case "error":
        return <AlertCircle className="w-6 h-6 sm:w-8 sm:h-8" />;
      default:
        return <Mic className="w-6 h-6 sm:w-8 sm:h-8" />;
    }
  }

  function getStatusText() {
    switch (status) {
      case "listening":
        return "Listening...";
      case "error":
        return "Tap to retry";
      case "processing":
        return "Processing...";
      default:
        return "Tap microphone to speak";
    }
  }

  function getStatusTextStyles() {
    switch (status) {
      case "listening":
        return "text-indigo-700 animate-pulse";
      case "error":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  }
};

export default App;
