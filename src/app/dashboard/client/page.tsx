// Pas de 'use client' - version SSR pure

export default function ClientDashboard() {
  return (
    <div style={{ padding: '50px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: '#333', marginBottom: '20px' }}>
        Dashboard Client - Version SSR
      </h1>
      
      <div style={{ backgroundColor: '#f0f0f0', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <p><strong>Test :</strong> Cette page est en SSR pur (pas de 'use client')</p>
        <p><strong>Timestamp :</strong> {new Date().toLocaleString()}</p>
        <p><strong>Status :</strong> Si cette page ne se refresh pas, le problème vient du 'use client'</p>
      </div>

      <div style={{ backgroundColor: '#e6f3ff', padding: '20px', borderRadius: '8px' }}>
        <h3>Instructions de test :</h3>
        <ol>
          <li>Ouvrez les outils de développement (F12)</li>
          <li>Allez dans l'onglet Console</li>
          <li>Regardez s'il y a des erreurs</li>
          <li>Notez si la page se refresh automatiquement</li>
        </ol>
      </div>

      <div style={{ marginTop: '30px' }}>
        <a 
          href="/auth/login" 
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#0070f3', 
            color: 'white', 
            textDecoration: 'none',
            borderRadius: '5px',
            display: 'inline-block'
          }}
        >
          Retour Login
        </a>
      </div>
    </div>
  )
}
