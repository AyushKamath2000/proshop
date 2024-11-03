export const addDecimals = (num) => (Math.round(num*100)/100).toFixed(2);

export const updateCart = (state) => {
    //Calculate items price
    state.itemsPrice = addDecimals(state.cartItems.reduce((acc,item)=>acc+ item.qty * item.price,0));
    //Calculate shipping price
    state.shippingPrice = addDecimals(state.itemsPrice > 100 ? 0 : 10);
    //Calculate tax price
    state.taxPrice = addDecimals(0.15*state.itemsPrice);
    //Calculate total price
    state.totalPrice = addDecimals(Number(state.itemsPrice) + Number(state.shippingPrice) + Number(state.taxPrice));

    localStorage.setItem('cart',JSON.stringify(state));
    
    return state;

}
