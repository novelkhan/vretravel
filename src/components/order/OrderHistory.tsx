import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface OrderItem {
  productId: number;
  productName: string;
  productImage: string;
  quantity: number;
  totalPrice: number;
}

interface Order {
  orderId: number;
  orderDate: string;
  totalAmount: number;
  isShipped: boolean;
  orderItems: OrderItem[];
}

const OrderHistory = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrderHistory = async () => {
      try {
        const response = await axios.get<Order[]>('/api/order/order-history');
        const sortedOrders = response.data.sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());
        setOrders(sortedOrders);
      } catch (error) {
        console.error('Error fetching order history:', error);
      }
    };

    fetchOrderHistory();
  }, []);

  return (
    <div className="container py-4">
      <h2 className="text-center mb-4">Order History</h2>
      {orders.length === 0 ? (
        <div className="text-center text-muted">
          <p>No orders found.</p>
        </div>
      ) : (
        orders.map(order => (
          <div key={order.orderId} className="card mb-3">
            <div className="card-body">
              <div className="order-header mb-3">
                <h3 className="card-title">Order ID: {order.orderId}</h3>
                <p className="card-text mb-1">Order Date: {new Date(order.orderDate).toLocaleDateString()}</p>
                <p className="card-text mb-1">Total Amount: ${order.totalAmount}</p>
                <p className="card-text">Status: {order.isShipped ? 'Shipped' : 'Processing'}</p>
              </div>
              <div className="order-items">
                <h4 className="h5 mb-3">Items:</h4>
                {order.orderItems.map(item => (
                  <div key={item.productId} className="d-flex align-items-center mb-3">
                    {item.productImage && (
                      <img
                        src={`data:image/jpeg;base64,${item.productImage}`}
                        alt={item.productName}
                        className="img-fluid rounded me-3"
                        style={{ width: '100px', height: '100px', objectFit: 'contain', backgroundColor: '#f0f0f0' }}
                      />
                    )}
                    <p className="mb-0">{item.productName} (x{item.quantity}) - ${item.totalPrice}</p>
                  </div>
                ))}
              </div>
              <button
                className="btn btn-primary mt-3"
                onClick={() => navigate(`/order-details/${order.orderId}`)}
              >
                Order Details
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default OrderHistory;