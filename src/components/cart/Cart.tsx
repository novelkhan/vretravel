import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [selectedCartItems, setSelectedCartItems] = useState([]);

  useEffect(() => {
    const fetchCartItems = async () => {
      const response = await axios.get('/api/cart/cart-items');
      setCartItems(response.data);
    };
    fetchCartItems();
  }, []);

  const increaseQuantity = async (cartItemId) => {
    await axios.get(`/api/cart/incre?cartItemId=${cartItemId}`);
    setCartItems(cartItems.map(item => item.cartItemId === cartItemId ? { ...item, productQuantity: item.productQuantity + 1 } : item));
  };

  const decreaseQuantity = async (cartItemId) => {
    await axios.get(`/api/cart/decre?cartItemId=${cartItemId}`);
    setCartItems(cartItems.map(item => item.cartItemId === cartItemId ? { ...item, productQuantity: item.productQuantity - 1 } : item));
  };

  const removeItemFromCart = async (cartItemId) => {
    await axios.post(`/api/cart/remove-from-cart?cartItemId=${cartItemId}`);
    setCartItems(cartItems.filter(item => item.cartItemId !== cartItemId));
  };

  const proceedToCheckout = async () => {
    const selectedItemsId = selectedCartItems.length > 0 ? selectedCartItems.map(item => item.cartItemId) : cartItems.map(item => item.cartItemId);
    await axios.post('/api/order/cart-checkout', selectedItemsId);
    setCartItems([]);
  };

  return (
    <div className="container my-5">
      <h2 className="mb-4">Shopping Cart</h2>
      <div className="row">
        <div className="col-md-8">
          {cartItems.map(item => (
            <div key={item.cartItemId} className="card mb-3 shadow">
              <div className="card-body d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                  <input
                    type="checkbox"
                    checked={selectedCartItems.includes(item)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedCartItems([...selectedCartItems, item]);
                      } else {
                        setSelectedCartItems(selectedCartItems.filter(selectedItem => selectedItem.cartItemId !== item.cartItemId));
                      }
                    }}
                    className="form-check-input me-2"
                  />
                  <img src={`data:image/jpeg;base64,${item.productImageSRC}`} alt="Product" className="rounded me-3" width="80" />
                  <div>
                    <h5 className="mb-1">{item.productName}</h5>
                    <p className="text-muted mb-0">Price: ${item.productPrice}</p>
                  </div>
                </div>
                <div className="d-flex align-items-center">
                  <button className="btn btn-outline-secondary btn-sm me-2" onClick={() => decreaseQuantity(item.cartItemId)}>-</button>
                  <span className="mx-2">{item.productQuantity}</span>
                  <button className="btn btn-outline-secondary btn-sm me-3" onClick={() => increaseQuantity(item.cartItemId)}>+</button>
                  <button className="btn btn-danger btn-sm" onClick={() => removeItemFromCart(item.cartItemId)}>Remove</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="col-md-4">
          <div className="card shadow">
            <div className="card-body">
              <h5 className="card-title">Order Summary</h5>
              <p>Total Items: <strong>{selectedCartItems.length > 0 ? selectedCartItems.reduce((total, item) => total + item.productQuantity, 0) : cartItems.reduce((total, item) => total + item.productQuantity, 0)}</strong></p>
              <p>Total Price: <strong>${selectedCartItems.length > 0 ? selectedCartItems.reduce((total, item) => total + item.productPrice * item.productQuantity, 0) : cartItems.reduce((total, item) => total + item.productPrice * item.productQuantity, 0)}</strong></p>
              <button className="btn btn-primary w-100" disabled={cartItems.length === 0} onClick={proceedToCheckout}>
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;