import ProtectedRoute from './components/ProtectedRoute'
import { BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import { Games } from './pages/GamesList';
import { Register } from './pages/Register';
import { Navbar } from './components/Navbar';
import { SingleGame } from './pages/SingleGame';
import {AdminPannel} from './pages/AdminPannel';

function App() {
    return(

        <BrowserRouter>
            <Navbar />
            <Routes>
                <Route path='/login/' element = {<Login />}/>
                <Route path='/register/' element = {<Register />}/>
                <Route path='/' element = {<Home/>} />
                <Route path='/games' element = {
                    <ProtectedRoute children={<Games/>} />
                }/>
                <Route path='/games/:id/' element = {
                    <ProtectedRoute children={<SingleGame/>} />
                }/>
                 <Route path='/admin-pannel/' element = {
                    <ProtectedRoute children={<AdminPannel />} requireAdmin={true}/>
                }/>
            </Routes>
        </BrowserRouter>
    )
}

export default App
