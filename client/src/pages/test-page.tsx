export default function TestPage() {
  return (
    <div className="min-h-screen bg-white p-8">
      <h1 className="text-3xl font-bold text-blue-600 mb-4">SeaGO - Test Page</h1>
      <p className="text-gray-600">Se vedi questa pagina, React funziona correttamente!</p>
      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Stato dell'applicazione:</h2>
        <ul className="space-y-1">
          <li>✅ React caricato</li>
          <li>✅ Tailwind CSS attivo</li>
          <li>✅ Routing funzionante</li>
        </ul>
      </div>
    </div>
  );
}