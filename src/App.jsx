import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/common/Header';
import Login from './components/Login';
import Register from './components/Register';
import ImageProcess from './components/ImageProcess';
import ProtectedRoute from './components/common/ProtectedRoute';
import './index.scss';

const App = () => {
  return (
    <Router>
      <Header />
      <main className='main-container'>
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route element={<ProtectedRoute />}>
            <Route path='/' element={<ImageProcess />} />
          </Route>
        </Routes>
      </main>
    </Router>
  )
}

export default App;
