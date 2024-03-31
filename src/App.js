import React, { useEffect, useState, createContext } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import './responsive.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/header/header';
import Footer from './components/footer/footer';
import Home from './pages/Home/index';
import Listing from './pages/Listing';
import NotFound from './pages/NotFound';
import DetailsPage from './pages/Details';
import Checkout from './pages/checkout';
import Chat from './components/Chat'; // Import Chat component here
import axios from 'axios';
import Cart from './pages/cart';
import Loader from './assets/images/loading.gif';
import data from './data';


const MyContext = createContext();

function App() {
  const [productData, setProductData] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsloading] = useState(true);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isopenNavigation, setIsopenNavigation] = useState(false);
  const [isLogin, setIsLogin] = useState();
  const [isOpenFilters, setIsopenFilters] = useState(false);
  const [cartTotalAmount, setCartTotalAmount] = useState();

  useEffect(() => {
    getData("http://localhost:4000/productData");
    getCartData("http://localhost:4000/cartItems")
    const is_Login = localStorage.getItem('isLogin');
    setIsLogin(is_Login);
    setTimeout(() => {
      setProductData(data[1]);
      setIsloading(false);
    }, 3000);
  }, []);

  const getData = async (url) => {
    try {
      const response = await axios.get(url);
      setProductData(response.data);
      setTimeout(() => {
        setIsloading(false);
      }, 2000);
    } catch (error) {
      console.log(error.message);
    }
  }

  const getCartData = async (url) => {
    try {
      const response = await axios.get(url);
      setCartItems(response.data);
    } catch (error) {
      console.log(error.message);
    }
  }

  const addToCart = async (item) => {
    item.quantity = 1;
    try {
      const res = await axios.post("http://localhost:4000/cartItems", item);
      if (res !== undefined) {
        setCartItems([...cartItems, { ...item, quantity: 1 }])
      }
    } catch (error) {
      console.log(error)
    }
  }

  const removeItemsFromCart = (id) => {
    const arr = cartItems.filter((obj) => obj.id !== id);
    setCartItems(arr)
  }

  const emptyCart = () => {
    setCartItems([])
  }

  const openFilters = () => {
    setIsopenFilters(!isOpenFilters)
  }

  const value = {
    cartItems,
    isLogin,
    windowWidth,
    isOpenFilters,
    addToCart,
    removeItemsFromCart,
    emptyCart,
    openFilters,
    isopenNavigation,
    setIsopenNavigation,
    setCartTotalAmount,
    cartTotalAmount
  }

  return (
    data.productData.length !== 0 &&
    <BrowserRouter>
      <MyContext.Provider value={value}>
        <Header data={data.productData} />
        <Routes>
          <Route exact path="/" element={<Home data={data.productData} />} />
          <Route exact path="/cat/:id" element={<Listing data={data.productData} single={true} />} />
          <Route exact path="/cat/:id/:id" element={<Listing data={data.productData} single={false} />} />
          <Route exact path="/product/:id" element={<DetailsPage data={data.productData} />} />
          <Route exact path="/cart" element={<Cart />} />
          <Route exact path="/checkout" element={<Checkout />} />
          <Route exact path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </MyContext.Provider>
      {/* Render Chat component outside of Routes */}
      <Chat />
    </BrowserRouter>
  );
}

export default App;
export { MyContext }