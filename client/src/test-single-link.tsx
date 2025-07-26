import { useLocation } from "wouter";

export function TestSingleLink() {
  const [, setLocation] = useLocation();
  
  const testNavigation = () => {
    console.log('🚢 TEST: Single link clicked');
    setLocation('/metodi-pagamento');
  };
  
  return (
    <div className="fixed top-4 right-4 z-50 bg-red-500 p-4 text-white">
      <h3>Test Navigation</h3>
      <button 
        onClick={testNavigation}
        className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600"
      >
        Test Metodi Pagamento
      </button>
    </div>
  );
}