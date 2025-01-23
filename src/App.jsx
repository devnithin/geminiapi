import { GoogleGenerativeAI } from "@google/generative-ai";
import { useState, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, Scissors, Type, RefreshCw, Check } from "lucide-react";
import dotenv from 'dotenv';
const App = () => {
  dotenv.config();
  const genAI = new GoogleGenerativeAI(process.env.API_URL);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  const handleOperation = async (operation) => {
    try {
      setLoading(true);
      const text = inputRef.current.value;
      if (!text.trim()) {
        setResult("Please enter some text first.");
        return;
      }

      let prompt;
      switch (operation) {
        case 'grammar':
          prompt = `Correct any grammar mistakes in the following text and explain the corrections made: ${text}`;
          break;
        case 'summarize':
          prompt = `Provide a concise summary of the following text: ${text}`;
          break;
        case 'paraphrase':
          prompt = `Paraphrase the following text in a different way while maintaining the same meaning: ${text}`;
          break;
        default:
          prompt = text;
      }

      const response = await model.generateContent(prompt);
      setResult(response.response.text());
    } catch (error) {
      setResult("An error occurred. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 flex items-center justify-center">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Nithin AI Assistant</CardTitle>
          <CardDescription className="text-center">
            Enter text for analysis, summarization, or correction
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col space-y-4">
              <Input
                ref={inputRef}
                placeholder="Type or paste your text here..."
                className="flex-1"
                rows={4}
              />
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                <Button 
                  onClick={() => handleOperation('default')} 
                  disabled={loading}
                  className="flex items-center justify-center space-x-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Response</span>
                </Button>
                <Button 
                  onClick={() => handleOperation('summarize')} 
                  variant="secondary"
                  disabled={loading}
                  className="flex items-center justify-center space-x-2"
                >
                  <Scissors className="w-4 h-4" />
                  <span>Summarize</span>
                </Button>
                <Button 
                  onClick={() => handleOperation('grammar')} 
                  variant="secondary"
                  disabled={loading}
                  className="flex items-center justify-center space-x-2"
                >
                  <Check className="w-4 h-4" />
                  <span>Grammar</span>
                </Button>
                <Button 
                  onClick={() => handleOperation('paraphrase')} 
                  variant="secondary"
                  disabled={loading}
                  className="flex items-center justify-center space-x-2 col-span-2 md:col-span-1"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Paraphrase</span>
                </Button>
              </div>
            </div>
            
            <Card className="bg-gray-50">
              <CardHeader>
                <CardTitle className="text-sm font-medium">Response</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center p-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                  </div>
                ) : (
                  <p className="whitespace-pre-wrap">{result}</p>
                )}
              </CardContent>
            </Card>
          </div>
        </CardContent>
        
        <CardFooter className="text-center text-sm text-gray-500">
          Powered by Google Gemini API
        </CardFooter>
      </Card>
    </div>
  );
};

export default App;