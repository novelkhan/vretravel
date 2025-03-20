import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

interface OrderItem {
  productId: number;
  productName: string;
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

const OrderDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get<Order>(`/api/order/order-details/${id}`);
        setOrder(response.data);
      } catch (error) {
        console.error('Failed to load order details:', error);
        alert('Failed to load order details. Please try again.');
      }
    };

    fetchOrderDetails();
  }, [id]);

  return (
    <div className="order-details-container">
      <h2>Order Details</h2>
      {order ? (
        <div className="order-details">
          <div className="order-info">
            <p><strong>Order ID:</strong> {order.orderId}</p>
            <p><strong>Order Date:</strong> {new Date(order.orderDate).toLocaleDateString()}</p>
            <p><strong>Total Amount:</strong> ${order.totalAmount}</p>
            <p><strong>Status:</strong> {order.isShipped ? 'Shipped' : 'Processing'}</p>
          </div>
          <div className="order-items">
            <h3>Items:</h3>
            {order.orderItems.map(item => (
              <div key={item.productId} className="order-item">
                <p><strong>{item.productName}</strong> (x{item.quantity}) - ${item.totalPrice}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="no-order">
          <p>Order not found.</p>
        </div>
      )}
    </div>
  );
};

export default OrderDetails;