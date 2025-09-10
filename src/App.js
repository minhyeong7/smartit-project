import {BrowserRouter, Routes, Route} from 'react-router-dom'
import HomePage from './components/HomePage'
import NotFoundPage from './components/NotFoundPage'
import RescueList from './components/RescueList'
import RescueButton from './components/RescueButton'
import Layout from './components/Layout'



export default function App(){


  return(
    <BrowserRouter>
      <Routes>
        <Route path='/' element={ <Layout />}>
          <Route index element={ <HomePage />} />
          <Route path='rescues' element={ <RescueList />} />
          <Route path='cctvs' element={ <RescueButton />} />
        </Route>
        <Route path='*' element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}