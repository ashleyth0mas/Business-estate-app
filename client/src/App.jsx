import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import UpdateListing from './pages/UpdateListing';
import About from './pages/About';
import Profile from './pages/Profile';
import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute'
import SignUp from './pages/SignUp';
import Listingpg from './pages/Listingpg'
import CreateListing from './pages/CreateListing';
import Search from './pages/Search';
const App = () => {
  return (
    
      <BrowserRouter>
      <Header/>
        <Routes>
      
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
        
          <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<Profile />} /> 
          <Route path="/create-listing" element={<CreateListing />} /> 
          <Route path="/update-listing/:listingId" element={<UpdateListing />} /> 
          </Route>
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/listing/:listingId" element={<Listingpg />} />
          <Route path="/search" element={<Search />} />
        </Routes>
      </BrowserRouter>
    
  )
}

export default App