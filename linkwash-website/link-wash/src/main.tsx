import { StrictMode, type ComponentType } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
 

const Application = App as ComponentType 

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Application/>
  </StrictMode>
)