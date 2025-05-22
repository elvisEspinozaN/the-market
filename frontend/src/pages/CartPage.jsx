import styles from "../styles/CartPage.module.css";
import {
  useCheckoutCartMutation,
  useGetCartQuery,
  useRemoveFromCartMutation,
  useUpdateCartItemMutation,
} from "../app/cartApi";
import { useState } from "react";

const CartPage = () => {
  const { data: cart, isLoading, error } = useGetCartQuery();
  const [updateCartItem] = useUpdateCartItemMutation();
  const [removeFromCart] = useRemoveFromCartMutation();
  const [checkoutCart] = useCheckoutCartMutation();
  const [checkoutMessage, setCheckoutMessage] = useState(null);

  const calculateTotal = () => {
    return cart
      ?.reduce((total, item) => {
        return total + item.price * item.quantity;
      }, 0)
      .toFixed(2);
  };

  const handleUpdate = async (cartItemId, newQuantity) => {
    try {
      await updateCartItem({ cartItemId, quantity: newQuantity }).unwrap();
    } catch (err) {
      console.error("Error on updating quantity: ", err);
    }
  };

  const handleCheckout = async () => {
    try {
      await checkoutCart().unwrap();
      setCheckoutMessage("Order placed successfully!");
    } catch (err) {
      console.error(("Error on check out: ", err));
      setCheckoutMessage("Something went wrong, try again.");
    }
  };

  if (isLoading) {
    return <div>Loading cart data...</div>;
  }

  if (error) {
    return <div>Error loading cart...</div>;
  }

  return (
    <div className={styles.cartContainer}>
      {cart?.length === 0 ? (
        checkoutMessage ? (
          <p className={styles.checkoutMessage}>{checkoutMessage}</p>
        ) : (
          <p>Your cart is empty</p>
        )
      ) : (
        <>
          <div className={styles.cartContainerItems}>
            <div className={styles.cartContainerItemsHeader}>
              <h3>Shopping Cart</h3>
              <p>{cart.length} Items</p>
            </div>
            {cart?.map((item) => (
              <div key={item.cart_item_id} className={styles.cartItem}>
                <div className={styles.cartImageContainer}>
                  <img src={item.image_url} alt={item.name} />
                  <div className={styles.cartImageContainerDetails}>
                    <p>{item.name}</p>
                    <p>category</p>
                    <button
                      onClick={() => removeFromCart(item.cart_item_id)}
                      className={styles.removeButton}
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <div className={styles.cartQuantityControl}>
                  <button
                    className={styles.cartQuantityControlButton}
                    onClick={() =>
                      handleUpdate(item.cart_item_id, item.quantity - 1)
                    }
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    className={styles.cartQuantityControlButton}
                    onClick={() =>
                      handleUpdate(item.cart_item_id, item.quantity + 1)
                    }
                    disabled={item.quantity >= item.stock}
                  >
                    +
                  </button>
                </div>
                <div className={styles.cartItemPrice}>
                  <p>${item.price}</p>
                </div>
                <div className={styles.cartItemTotal}>
                  <p>${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
          <div className={styles.orderSummaryContainer}>
            <h3>Order Summary</h3>
            <div className={styles.orderSummaryDetails}>
              <p>Total</p>
              <p>${calculateTotal()}</p>
            </div>
            <label>PROMO CODE</label>
            <input type="text" value="Enter your Code" />
            <div className={styles.orderSummaryTotal}>
              <p>TOTAL COST</p>
              <p>${calculateTotal()}</p>
            </div>
            <button className={styles.checkoutButton} onClick={handleCheckout}>
              Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
