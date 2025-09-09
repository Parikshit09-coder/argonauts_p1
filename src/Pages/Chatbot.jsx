import React, { useState, useEffect, useRef } from "react";
import bgImage from "../assets/image-from-rawpixel-id-12627536-jpeg.jpg";

function Chatbot() {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! How can I help you today?", sender: "bot" },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef(null);

  const handleSendMessage = async () => {
    if (inputMessage.trim() === "") return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: "user",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");

    try {
      const response = await fetch(
        "https://parikshit099.app.n8n.cloud/webhook/bbcbd247-b892-452d-8b7c-e869395819a9",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: inputMessage }),
        },
      );
    

      const data = await response.json();
      console.log(data)
      const botMessage = {
        id: Date.now() + 1,
        text: data.text || "Sorry, I didn't get that.",
        sender: "bot",
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      const botMessage = {
        id: Date.now() + 1,
        text: "There was an error. Please try again later.",
        sender: "bot",
      };
      setMessages((prev) => [...prev, botMessage]);
    }
  }; 

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendMessage();
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div
      className="min-h-screen bg-cover bg-center relative"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>

      {/* Chat container */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-3xl bg-gray-900/90 text-white rounded-2xl shadow-2xl overflow-hidden border border-gray-700">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-4">
            <h1 className="text-xl font-bold">Argonauts Chatbot</h1>
            <p className="text-blue-100 text-sm">
              Ask me anything about Argo floats!
            </p>
          </div>

          {/* Messages */}
          <div className="h-96 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl shadow ${
                    message.sender === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-900"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-700 bg-gray-800 p-4">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message here..."
                className="flex-1 px-4 py-2 rounded-lg bg-gray-900 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
              />
              <button
                onClick={handleSendMessage}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chatbot;
