import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
// import './index.css'
// import ApplyToSeller from './pages/ApplyToSeller/ApplyToSeller'
// import ApplyToSeller from './pages/ApplyToSeller/ApplyToSeller'



createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <>
      <App />
    </>
  </StrictMode>,
)
