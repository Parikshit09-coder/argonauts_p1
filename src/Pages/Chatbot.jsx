import React, { useState, useEffect, useRef } from "react";
import bgImage from "../assets/bg_cht.jpg";
function Chatbot() {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I can help you query oceanographic data from Argo floats. Try asking about specific measurements or locations.", sender: "bot" },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Function to extract and format JSON from the response
  const extractJsonFromResponse = (responseText) => {
    try {
      // Try to find JSON in the response using regex
      const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/);
      
      if (jsonMatch && jsonMatch[1]) {
        // Parse the JSON found between ```json and ```
        const jsonData = JSON.parse(jsonMatch[1]);
        return jsonData;
      }
      
      // If no code blocks found, try to parse the entire response as JSON
      return JSON.parse(responseText);
    } catch (error) {
      console.error("Error parsing JSON:", error);
      // If parsing fails, return the original text
      return { response: { answer: responseText } };
    }
  };

  // Function to format the bot response based on the data structure
  const formatBotResponse = (data) => {
    try {
      // Extract JSON from the response if needed
      const responseData = typeof data === "string" ? extractJsonFromResponse(data) : data;
      
      // Handle the response structure
      if (responseData.response && responseData.response.answer) {
        return (
          <div className="bg-gray-800 p-3 rounded-lg">
            <p className="text-white">{responseData.response.answer}</p>
            {responseData.response.argo_id && (
              <p className="text-blue-300 mt-2">Argo ID: {responseData.response.argo_id}</p>
            )}
          </div>
        );
      }
      
      // Handle case where data is in the output array
      if (Array.isArray(responseData) && responseData[0] && responseData[0].output) {
        const outputData = extractJsonFromResponse(responseData[0].output);
        if (outputData.response && outputData.response.answer) {
          return (
            <div className="bg-gray-800 p-3 rounded-lg">
              <p className="text-white">{outputData.response.answer}</p>
              {outputData.response.argo_id && (
                <p className="text-blue-300 mt-2">Argo ID: {outputData.response.argo_id}</p>
              )}
            </div>
          );
        }
        return responseData[0].output;
      }
      
      // Default case - return as text
      return typeof responseData === "string" ? responseData : JSON.stringify(responseData);
    } catch (error) {
      console.error("Error formatting response:", error);
      return "There was an error processing the response.";
    }
  };

  const handleSendMessage = async () => {
    if (inputMessage.trim() === "") return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: "user",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await fetch(
        "https://parikshit099.app.n8n.cloud/webhook/bbcbd247-b892-452d-8b7c-e869395819a9",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: inputMessage }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("API response:", data);
      
      const botMessage = {
        id: Date.now() + 1,
        text: formatBotResponse(data),
        sender: "bot",
      };
      
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      const botMessage = {
        id: Date.now() + 1,
        text: "There was an error connecting to the server. Please try again later.",
        sender: "bot",
      };
      setMessages((prev) => [...prev, botMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !isLoading) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Sample queries for quick access
  const sampleQueries = [
    "Show data for argo_point_22",
    "Find argo_id for temperature 3.2",
    "What is the salinity in northern_subtropical region?",
    "Show argo floats with temperature above 20°C"
  ];

  return (
    <div className="min-h-screen bg-cover bg-center relative" style={{ backgroundImage: `url(${bgImage})` }}>
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>

      {/* Chat container */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-3xl bg-gray-900/90 text-white rounded-2xl shadow-2xl overflow-hidden border border-gray-700">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-4">
            <h1 className="text-xl font-bold">Argo Floats Chatbot</h1>
            <p className="text-blue-100 text-sm">
              Query oceanographic data from Argo floats
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
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-200 text-gray-900 px-4 py-2 rounded-2xl shadow">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Sample Queries */}
          <div className="px-4 py-2 bg-gray-800 border-t border-gray-700">
            <p className="text-xs text-gray-400 mb-1">Try asking:</p>
            <div className="flex flex-wrap gap-2">
              {sampleQueries.map((query, index) => (
                <button
                  key={index}
                  onClick={() => setInputMessage(query)}
                  className="px-3 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded-full transition text-white"
                >
                  {query.length > 25 ? query.substring(0, 22) + "..." : query}
                </button>
              ))}
            </div>
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-700 bg-gray-800 p-4">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about Argo float data..."
                disabled={isLoading}
                className="flex-1 px-4 py-2 rounded-lg bg-gray-900 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400 disabled:opacity-50"
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading || inputMessage.trim() === ""}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition disabled:opacity-50 disabled:cursor-not-allowed"
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