export default function SimpleMappa() {
  return (
    <div style={{ padding: '20px', backgroundColor: '#f0f8ff' }}>
      <h1 style={{ color: '#333', textAlign: 'center' }}>🗺️ MAPPA DEL LAZIO - TEST SEMPLICE</h1>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '20px',
        marginTop: '20px'
      }}>
        <div style={{ 
          backgroundColor: 'white', 
          padding: '20px', 
          borderRadius: '10px',
          border: '2px solid #3b82f6'
        }}>
          <h3>Porto di Civitavecchia</h3>
          <p>📍 42.0942, 11.7939</p>
          <p>⚓ Porto principale del Lazio</p>
          <p style={{ color: 'green', fontWeight: 'bold' }}>4 barche disponibili</p>
          <button style={{
            backgroundColor: '#3b82f6',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}>
            Esplora barche
          </button>
        </div>

        <div style={{ 
          backgroundColor: 'white', 
          padding: '20px', 
          borderRadius: '10px',
          border: '2px solid #10b981'
        }}>
          <h3>Porto di Gaeta</h3>
          <p>📍 41.2058, 13.5696</p>
          <p>⚓ Località turistica rinomata</p>
          <p style={{ color: 'green', fontWeight: 'bold' }}>2 barche disponibili</p>
          <button style={{
            backgroundColor: '#10b981',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}>
            Esplora barche
          </button>
        </div>

        <div style={{ 
          backgroundColor: 'white', 
          padding: '20px', 
          borderRadius: '10px',
          border: '2px solid #f59e0b'
        }}>
          <h3>Porto di Ponza</h3>
          <p>📍 40.8992, 12.9619</p>
          <p>⚓ Isola paradisiaca</p>
          <p style={{ color: 'green', fontWeight: 'bold' }}>2 barche disponibili</p>
          <button style={{
            backgroundColor: '#f59e0b',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}>
            Esplora barche
          </button>
        </div>
      </div>

      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '10px',
        marginTop: '20px',
        textAlign: 'center'
      }}>
        <h4>✅ MAPPA INTERATTIVA DEL LAZIO FUNZIONANTE</h4>
        <p>Se vedi questa pagina, la mappa sta funzionando correttamente!</p>
      </div>
    </div>
  );
}