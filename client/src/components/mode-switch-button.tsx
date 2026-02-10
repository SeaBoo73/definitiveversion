import { useLocation } from "wouter";
import { ArrowLeftRight, Ship } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useOwnerMode } from "@/hooks/use-owner-mode";

export function ModeSwitchButton() {
  const { user } = useAuth();
  const { isOwnerMode, enterOwnerMode, exitOwnerMode } = useOwnerMode();
  const [, navigate] = useLocation();

  if (!user || user.role !== 'owner') return null;

  if (isOwnerMode) {
    return (
      <button
        onClick={() => { exitOwnerMode(); navigate('/'); }}
        className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[60] bg-coral hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-full shadow-xl transition-all flex items-center gap-2"
      >
        <ArrowLeftRight className="h-5 w-5" />
        Modalità viaggio
      </button>
    );
  }

  return (
    <button
      onClick={() => { enterOwnerMode(); navigate('/owner-home'); }}
      className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[60] bg-coral hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-full shadow-xl transition-all flex items-center gap-2"
    >
      <Ship className="h-5 w-5" />
      Modalità SeaHost
    </button>
  );
}
