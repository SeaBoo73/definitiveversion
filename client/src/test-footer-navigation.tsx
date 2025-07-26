import { Link, useLocation } from "wouter";
import { useEffect, useState } from "react";

export function TestFooterNavigation() {
  const [location, setLocation] = useLocation();
  const [testResults, setTestResults] = useState<string[]>([]);

  const testLinks = [
    { path: "/documenti", label: "Documenti" },
    { path: "/fatturazione", label: "Fatturazione" },
    { path: "/metodi-pagamento", label: "Metodi Pagamento" },
    { path: "/rimborsi", label: "Rimborsi" },
    { path: "/politiche-cancellazione", label: "Politiche" },
    { path: "/modifica-prenotazione", label: "Modifica" }
  ];

  const testNavigation = (path: string, label: string) => {
    const startTime = Date.now();
    console.log(`Testing navigation to ${path}`);
    
    // Simulate navigation
    setLocation(path);
    
    setTimeout(() => {
      const currentLocation = window.location.pathname;
      const result = `${label}: ${currentLocation === path ? '✅' : '❌'} (${Date.now() - startTime}ms)`;
      setTestResults(prev => [...prev, result]);
      console.log(result);
    }, 100);
  };

  return (
    <div className="fixed top-4 left-4 bg-yellow-100 p-4 rounded-lg shadow-lg z-50 max-w-sm">
      <h3 className="font-bold mb-2">Test Footer Navigation</h3>
      <div className="text-sm mb-2">Current: {location}</div>
      
      <div className="space-y-1 mb-4">
        {testLinks.map(({ path, label }) => (
          <button 
            key={path}
            onClick={() => testNavigation(path, label)}
            className="block w-full text-left text-blue-600 hover:bg-blue-50 px-2 py-1 rounded"
          >
            Test {label}
          </button>
        ))}
      </div>

      <div className="text-xs">
        <div className="font-semibold">Results:</div>
        {testResults.map((result, i) => (
          <div key={i}>{result}</div>
        ))}
      </div>

      <button 
        onClick={() => setTestResults([])}
        className="mt-2 text-xs bg-gray-200 px-2 py-1 rounded"
      >
        Clear
      </button>
    </div>
  );
}