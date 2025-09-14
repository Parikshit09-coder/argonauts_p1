import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Chatbot from './Pages/Chatbot'
import Home from './Pages/Home'
import Dashboard from './Pages/Dashboard'
import Map from './Pages/Map'
import{ BrowserRouter, Routes, Route} from 'react-router-dom'
import Navbar from './Components/Navbar'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <Navbar/>
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/dashboard' element={<Dashboard/>}/>
      <Route path='/chatbot' element={<Chatbot/>}/>
      <Route path='/map' element={<Map/>}/>
    </Routes>
    </BrowserRouter>
   
  </StrictMode>
)