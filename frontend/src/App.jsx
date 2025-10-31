import ProtectedRoute from './components/ProtectedRoute'
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';


function App() {
    return(

        <BrowserRouter>




            <Routes>
                <Route path='/login/' element = {<Login />}/>
                <Route path='/' element = {
                    <ProtectedRoute children={<Home/>} />
                }/>
            </Routes>
        </BrowserRouter>
    )
}

export default App
