import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AiChat } from "./ai-chat";

export function LiveChatButton() {
  const [showAiChat, setShowAiChat] = useState(false);

  return (
    <TooltipProvider>
      {/* Chat Button - Fixed position, adjusted for mobile bottom nav */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={() => setShowAiChat(true)}
            className="fixed bottom-24 md:bottom-6 right-6 z-40 bg-gradient-to-r from-ocean-blue to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-full w-16 h-16 shadow-xl border-2 border-white transition-all flex items-center justify-center group"
            size="lg"
            data-testid="button-live-chat"
          >
            <div className="relative">
              <MessageCircle className="h-7 w-7 fill-white stroke-ocean-blue group-hover:animate-pulse" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
            </div>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left" className="bg-gray-900 text-white">
          <p>Chat con Assistenza SeaBoo</p>
        </TooltipContent>
      </Tooltip>

      {/* AI Chat Component */}
      <AiChat 
        isOpen={showAiChat} 
        onClose={() => setShowAiChat(false)} 
      />
    </TooltipProvider>
  );
}
