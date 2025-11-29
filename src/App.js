import './App.css';
import Navbar from './components/navbar/Navbar';
import Home from './components/home/Home';
import Services from './components/services/Services';
import { Route, Routes } from 'react-router-dom';
import Register from './components/register/Register';
import Login from './components/login/Login';
import Footer from './components/footer/Footer';
import UserHome from './components/home page on login/UserHome';
import NavbarU from './components/navbar on login/NavbarU';
import AdminHome from './components/admin home/AdminHome';
import NavbarA from './components/navbar Admin/NavbarA';
import RegisterC from './components/register courier/RegisterC';
import CourierHome from './components/Courier Home/CourierHome';
import NavbarC from './components/navbar courier/NavbarC';

function App() {
  return (
    <div className='App'>
      
      <Routes>
      <Route
          path="/"
          element={[<Navbar/>,<Home /> , <Services/>, <Footer/>]}
        />
      <Route path="/Register" element={[<Navbar/>,<Register />]} />
      <Route path="/Login" element={[<Navbar/>,<Login />]} />
      <Route path='/UserHome' element={[<NavbarU/>, <UserHome/>]}/>
      <Route path='/AdminHome' element={[<NavbarA/>,<AdminHome/>]}/>
      <Route path='/RegisterCourier' element={<RegisterC/>}/>
      <Route path='/CourierHome' element={[<NavbarC/>,<CourierHome/>]}/>
      </Routes>
      
    </div>
  );
}

export default App;
