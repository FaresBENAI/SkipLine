export default function TestSimple() {
  const handleClick = () => {
    alert('Bouton cliqué sans problème!')
  }

  return (
    <div style={{ padding: '50px', fontFamily: 'Arial, sans-serif', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        <h1 style={{ color: '#333', marginBottom: '20px', fontSize: '28px' }}>
          🧪 Page de Test Ultra Simple
        </h1>
        
        <div style={{ backgroundColor: '#fff3cd', padding: '15px', borderRadius: '5px', marginBottom: '20px', border: '1px solid #ffeaa7' }}>
          <p><strong>⏰ Timestamp :</strong> {new Date().toLocaleString()}</p>
          <p><strong>🌐 URL :</strong> Page de test</p>
        </div>

        <div style={{ backgroundColor: '#d1ecf1', padding: '15px', borderRadius: '5px', marginBottom: '30px', border: '1px solid #bee5eb' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#0c5460' }}>📋 Test :</h3>
          <p>Cette page n'utilise AUCUN composant custom, AUCUN hook complexe</p>
          <p>Si elle se refresh, le problème est très profond</p>
        </div>

        <button 
          onClick={handleClick}
          style={{ 
            padding: '12px 24px', 
            backgroundColor: '#28a745', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
            margin: '10px'
          }}
        >
          ✅ Test Alert
        </button>

        <a 
          href="/"
          style={{ 
            padding: '12px 24px', 
            backgroundColor: '#6f42c1', 
            color: 'white', 
            textDecoration: 'none',
            borderRadius: '5px',
            display: 'inline-block',
            fontWeight: 'bold',
            margin: '10px'
          }}
        >
          🏠 Retour Accueil
        </a>
      </div>
    </div>
  )
}
