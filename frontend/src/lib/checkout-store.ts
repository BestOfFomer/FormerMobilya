import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ShippingAddress {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

interface CheckoutState {
  // Contact & Shipping
  email: string;
  phone: string;
  shippingAddress: ShippingAddress;
  
  // Payment
  paymentMethod: 'credit_card' | 'bank_transfer' | '';
  
  // Actions
  setContactInfo: (email: string, phone: string) => void;
  setShippingAddress: (address: ShippingAddress) => void;
  setPaymentMethod: (method: 'credit_card' | 'bank_transfer') => void;
  clearCheckout: () => void;
}

const initialShippingAddress: ShippingAddress = {
  firstName: '',
  lastName: '',
  address: '',
  city: '',
  postalCode: '',
  country: 'TR',
};

export const useCheckoutStore = create<CheckoutState>()(
  persist(
    (set) => ({
      email: '',
      phone: '',
      shippingAddress: initialShippingAddress,
      paymentMethod: '',
      
      setContactInfo: (email, phone) =>
        set({ email, phone }),
      
      setShippingAddress: (address) =>
        set({ shippingAddress: address }),
      
      setPaymentMethod: (method) =>
        set({ paymentMethod: method }),
      
      clearCheckout: () =>
        set({
          email: '',
          phone: '',
          shippingAddress: initialShippingAddress,
          paymentMethod: '',
        }),
    }),
    {
      name: 'checkout-storage',
    }
  )
);
