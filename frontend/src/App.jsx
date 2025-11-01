import ProtectedRoute from './components/ProtectedRoute'
import { BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import { Games } from './pages/GamesList';
import { Register } from './pages/Register';

function LogOut(){
    localStorage.clear();
    return <Navigate to='/login/'  replace/>
}


function App() {
    return(

        <BrowserRouter>




            <Routes>
                <Route path='/login/' element = {<Login />}/>
                <Route path='/register/' element = {<Register />}/>
                <Route path='/logout/' element = {<LogOut />}/>
                <Route path='/' element = {
                    <ProtectedRoute children={<Home/>} />
                }/>
                <Route path='/games' element = {
                    <ProtectedRoute children={<Games/>} />
                }/>
            </Routes>
        </BrowserRouter>
    )
}

export default App
