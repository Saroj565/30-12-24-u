import React, { createContext, useState } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [totalQuantity, setTotalQuantity] = useState([]);
  const [increaseQuantity,setIncreaseQuantity]=useState();
  const [decreaseQuantiy,setDecreaseQuantiy]=useState();
  const [cartItem, setCartItem] = useState([]);
  const [totalSum, setTotalSum] = useState([]);

  return (
    <UserContext.Provider value={{ totalQuantity, setTotalQuantity ,increaseQuantity,setIncreaseQuantity,decreaseQuantiy,setDecreaseQuantiy,cartItem, setCartItem,totalSum, setTotalSum}}>
      {children}
    </UserContext.Provider>
  );
};
