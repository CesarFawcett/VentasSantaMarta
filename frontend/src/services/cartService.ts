import axios from 'axios';
import { Product } from './productService';

export interface CartItem extends Product {
  quantity: number;
}

type CartListener = (cart: CartItem[]) => void;

class CartService {
  private cart: CartItem[] = [];
  private listeners: CartListener[] = [];
  private readonly API_URL = 'http://localhost:8080/api/orders';

  constructor() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        this.cart = JSON.parse(savedCart);
      } catch (e) {
        console.error("Error parsing cart from localStorage", e);
        this.cart = [];
      }
    }
  }

  private notify() {
    localStorage.setItem('cart', JSON.stringify(this.cart));
    this.listeners.forEach(listener => listener([...this.cart]));
  }

  subscribe(listener: CartListener) {
    this.listeners.push(listener);
    listener([...this.cart]);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  getCart(): CartItem[] {
    return [...this.cart];
  }

  addToCart(product: Product) {
    const existingItem = this.cart.find(item => item.id === product.id);
    
    if (existingItem) {
      if (existingItem.quantity < product.stock) {
        existingItem.quantity += 1;
      } else {
        throw new Error(`No puedes agregar más de ${product.stock} unidades de este producto.`);
      }
    } else {
      if (product.stock > 0) {
        this.cart.push({ ...product, quantity: 1 });
      } else {
        throw new Error("Producto agotado.");
      }
    }
    this.notify();
  }

  updateQuantity(productId: string, quantity: number) {
    const item = this.cart.find(item => item.id === productId);
    if (item) {
      if (quantity <= 0) {
        this.removeFromCart(productId);
      } else if (quantity <= item.stock) {
        item.quantity = quantity;
        this.notify();
      } else {
        throw new Error(`Solo hay ${item.stock} unidades disponibles.`);
      }
    }
  }

  removeFromCart(productId: string) {
    this.cart = this.cart.filter(item => item.id !== productId);
    this.notify();
  }

  clearCart() {
    this.cart = [];
    this.notify();
  }

  getTotalItems(): number {
    return this.cart.reduce((total, item) => total + item.quantity, 0);
  }

  getTotalPrice(): number {
    return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  async checkout() {
    const userJson = localStorage.getItem('user');
    if (!userJson) throw new Error("Debes iniciar sesión para realizar la compra.");

    const user = JSON.parse(userJson);
    const token = user.token;

    const items = this.cart.map(item => ({
      productId: item.id,
      quantity: item.quantity
    }));

    try {
      const response = await axios.post(`${this.API_URL}/checkout`, items, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      this.clearCart();
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        throw new Error(error.response.data);
      }
      throw new Error("Error al procesar el pedido. Inténtalo de nuevo.");
    }
  }
}

export const cartService = new CartService();
