export default function ClientDashboard() {
  return (
    <html>
      <head>
        <title>Dashboard Test</title>
      </head>
      <body style={{ margin: 0, padding: '50px', fontFamily: 'Arial, sans-serif', backgroundColor: '#f0f8ff' }}>
        <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '10px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
          <h1 style={{ color: '#28a745', marginBottom: '30px', fontSize: '32px' }}>
            🎉 VICTOIRE ! Dashboard Client Accessible
          </h1>
          
          <div style={{ backgroundColor: '#d4edda', padding: '25px', borderRadius: '8px', marginBottom: '25px', border: '2px solid #c3e6cb' }}>
            <h2 style={{ margin: '0 0 15px 0', color: '#155724', fontSize: '20px' }}>
              ✅ Page dashboard client fonctionne !
            </h2>
            <p style={{ margin: 0, color: '#155724', fontSize: '16px' }}>
              Cette page n'a AUCUNE vérification de session, AUCUN useEffect, AUCUNE redirection automatique.
              Si vous voyez ce message, le problème était dans le code de la page dashboard originale.
            </p>
          </div>

          <div style={{ backgroundColor: '#fff3cd', padding: '20px', borderRadius: '8px', marginBottom: '25px', border: '1px solid #ffeaa7' }}>
            <h3 style={{ marginTop: 0, color: '#856404' }}>📊 Informations :</h3>
            <p style={{ margin: '5px 0', color: '#856404' }}>
              <strong>Timestamp :</strong> {new Date().toLocaleString()}
            </p>
            <p style={{ margin: '5px 0', color: '#856404' }}>
              <strong>Middleware :</strong> Supprimé
            </p>
            <p style={{ margin: '5px 0', color: '#856404' }}>
              <strong>Vérifications :</strong> Aucune
            </p>
          </div>

          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
            <a 
              href="/auth/login"
              style={{ 
                padding: '12px 24px', 
                backgroundColor: '#007bff', 
                color: 'white', 
                textDecoration: 'none',
                borderRadius: '5px',
                fontWeight: 'bold'
              }}
            >
              �� Retour Login
            </a>
            
            <a 
              href="/"
              style={{ 
                padding: '12px 24px', 
                backgroundColor: '#28a745', 
                color: 'white', 
                textDecoration: 'none',
                borderRadius: '5px',
                fontWeight: 'bold'
              }}
            >
              🏠 Accueil
            </a>
          </div>
        </div>
      </body>
    </html>
  )
}
