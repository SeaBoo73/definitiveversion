import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle, Bot, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AiChat } from "./ai-chat";

export function LiveChatButton() {
  const [showOptions, setShowOptions] = useState(false);
  const [showAiChat, setShowAiChat] = useState(false);



  const handleEmailSupport = () => {
    window.open('mailto:assistenza@seago.it?subject=Richiesta Assistenza SeaGO', '_self');
    setShowOptions(false);
  };

  const handleAiChat = () => {
    setShowOptions(false);
    setShowAiChat(true);
  };

  return (
    <>
      {/* Chat Button - Fixed position */}
      <Button
        onClick={() => setShowOptions(true)}
        className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-blue-500 to-ocean-blue hover:from-blue-600 hover:to-blue-700 text-white rounded-full w-14 h-14 shadow-lg transition-all"
        size="lg"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>

      {/* Chat Options Modal */}
      {showOptions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-blue-500" />
                Assistenza SeaGO
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-gray-600 mb-4">
                Scegli il tipo di assistenza:
              </p>
              
              {/* AI Chat - Primary Option */}
              <Button
                onClick={handleAiChat}
                className="w-full bg-gradient-to-r from-blue-500 to-ocean-blue hover:from-blue-600 hover:to-blue-700 text-white justify-start"
              >
                <Bot className="h-4 w-4 mr-2" />
                Chat con AI
                <span className="ml-auto text-xs bg-white/20 px-2 py-1 rounded-full">Consigliato</span>
              </Button>



              {/* Email */}
              <Button
                onClick={handleEmailSupport}
                variant="outline"
                className="w-full justify-start"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Email Assistenza
                <ExternalLink className="h-3 w-3 ml-auto" />
              </Button>

              {/* Chiudi */}
              <Button
                onClick={() => setShowOptions(false)}
                variant="ghost"
                className="w-full mt-4"
              >
                Chiudi
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* AI Chat Component */}
      <AiChat 
        isOpen={showAiChat} 
        onClose={() => setShowAiChat(false)} 
      />
    </>
  );
}