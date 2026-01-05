import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  ShoppingBag, 
  MapPin, 
  Clock, 
  ChevronLeft, 
  Search, 
  User, 
  Settings, 
  LogOut, 
  Plus, 
  Minus, 
  CheckCircle, 
  Package, 
  Truck, 
  ChevronRight,
  Star,
  Home,
  History,
  CreditCard,
  Bike
} from 'lucide-react';

// --- Types & Constants ---

type Screen = 
  | 'LOGIN' 
  | 'REGISTER' 
  | 'HOME' 
  | 'RESTAURANTS' 
  | 'MENU' 
  | 'CART' 
  | 'CHECKOUT' 
  | 'TRACKING' 
  | 'RIDER_DASHBOARD' 
  | 'PROFILE' 
  | 'HISTORY';

type Role = 'USER' | 'RIDER';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

const PRIMARY_COLOR = 'bg-emerald-600';
const PRIMARY_TEXT = 'text-emerald-600';
const PRIMARY_BORDER = 'border-emerald-600';

const RESTAURANTS = [
  { id: 1, name: 'FCCU Cafe', rating: 4.8, time: '15-20 min', image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=400' },
  { id: 2, name: 'Student Lounge Snacks', rating: 4.2, time: '10-15 min', image: 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?auto=format&fit=crop&q=80&w=400' },
  { id: 3, name: 'Grill & Chill', rating: 4.5, time: '20-30 min', image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&q=80&w=400' },
];

const MENU_ITEMS = [
  { id: 1, name: 'Chicken Zinger Burger', price: 350, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=400' },
  { id: 2, name: 'Fries Large', price: 150, image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&q=80&w=400' },
  { id: 3, name: 'Club Sandwich', price: 280, image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&q=80&w=400' },
  { id: 4, name: 'Coke 500ml', price: 80, image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=400' },
];

// --- Components ---

const Button = ({ children, onClick, className = "", variant = "primary" }: any) => {
  const base = "w-full py-4 rounded-2xl font-semibold transition-all active:scale-95 flex items-center justify-center gap-2";
  const styles = variant === "primary" 
    ? `${PRIMARY_COLOR} text-white shadow-lg` 
    : "bg-gray-100 text-gray-800";
  return (
    <button onClick={onClick} className={`${base} ${styles} ${className}`}>
      {children}
    </button>
  );
};

const Header = ({ title, onBack, rightElement }: any) => (
  <div className="flex items-center justify-between px-6 pt-12 pb-4 bg-white sticky top-0 z-40 border-b border-gray-100">
    <div className="flex items-center gap-4">
      {onBack && (
        <button onClick={onBack} className="p-2 -ml-2 hover:bg-gray-100 rounded-full">
          <ChevronLeft size={24} />
        </button>
      )}
      <h1 className="text-xl font-bold text-gray-900">{title}</h1>
    </div>
    {rightElement}
  </div>
);

// --- App Root ---

const App = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('LOGIN');
  const [role, setRole] = useState<Role | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [history, setHistory] = useState<any[]>([]);

  const addToCart = (item: any) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(i => i.id !== id));
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart(prev => prev.map(i => {
      if (i.id === id) {
        const newQty = Math.max(1, i.quantity + delta);
        return { ...i, quantity: newQty };
      }
      return i;
    }));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // --- Screens ---

  const LoginScreen = () => (
    <div className="h-full flex flex-col p-8 bg-white justify-between">
      <div className="mt-20 text-center">
        <div className={`w-24 h-24 ${PRIMARY_COLOR} rounded-3xl mx-auto flex items-center justify-center shadow-xl mb-6 transform rotate-12`}>
          <ShoppingBag className="text-white" size={48} />
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">CampusBite</h1>
        <p className="text-gray-500 mt-2 font-medium">FCCU's Internal Food Delivery</p>
      </div>

      <div className="space-y-4 mb-8">
        <h2 className="text-lg font-bold text-gray-800 mb-2">Welcome! Choose your role:</h2>
        <Button onClick={() => { setRole('USER'); setCurrentScreen('REGISTER'); }}>
          <User size={20} /> Continue as User
        </Button>
        <Button variant="secondary" onClick={() => { setRole('RIDER'); setCurrentScreen('RIDER_DASHBOARD'); }}>
          <Bike size={20} /> Continue as Rider
        </Button>
      </div>
    </div>
  );

  const RegisterScreen = () => (
    <div className="h-full bg-white p-8 flex flex-col">
      <Header title="Create Account" onBack={() => setCurrentScreen('LOGIN')} />
      <div className="flex-1 space-y-6 mt-6">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-gray-600 block mb-1">Full Name</label>
            <input type="text" placeholder="John Doe" className="w-full p-4 rounded-xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-2 ring-emerald-500/20" />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-600 block mb-1">FCCU ID</label>
            <input type="text" placeholder="24-10XXX" className="w-full p-4 rounded-xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-2 ring-emerald-500/20" />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-600 block mb-1">Phone Number</label>
            <input type="tel" placeholder="+92 300 1234567" className="w-full p-4 rounded-xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-2 ring-emerald-500/20" />
          </div>
        </div>
        <Button onClick={() => setCurrentScreen('HOME')}>Create Account</Button>
        <p className="text-center text-sm text-gray-500">
          Already have an account? <button onClick={() => setCurrentScreen('HOME')} className={`${PRIMARY_TEXT} font-bold`}>Login</button>
        </p>
      </div>
    </div>
  );

  const HomeScreen = () => (
    <div className="h-full bg-gray-50 flex flex-col">
      <div className="bg-white p-6 pt-12 rounded-b-[2rem] shadow-sm">
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="text-gray-400 text-sm font-medium">Deliver to</p>
            <div className="flex items-center gap-1 font-bold text-gray-900">
              <MapPin size={16} className={PRIMARY_TEXT} /> Lucas Center, FCCU
            </div>
          </div>
          <button onClick={() => setCurrentScreen('PROFILE')} className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
            <User size={20} className="text-gray-600" />
          </button>
        </div>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input type="text" placeholder="Search for food..." className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl border-none focus:ring-2 ring-emerald-500/10" />
        </div>
      </div>

      <div className="p-6 space-y-8 flex-1 overflow-y-auto">
        {/* Banner */}
        <div className={`${PRIMARY_COLOR} rounded-3xl p-6 text-white relative overflow-hidden shadow-lg`}>
          <div className="relative z-10">
            <h3 className="text-2xl font-bold mb-2">Free Delivery</h3>
            <p className="text-emerald-50 opacity-90 text-sm mb-4">On orders over Rs. 500 for students!</p>
            <button onClick={() => setCurrentScreen('RESTAURANTS')} className="bg-white text-emerald-700 px-6 py-2 rounded-xl font-bold text-sm">Order Now</button>
          </div>
          <ShoppingBag className="absolute -bottom-4 -right-4 opacity-10" size={120} />
        </div>

        {/* Categories */}
        <div className="grid grid-cols-4 gap-4">
          {['Burgers', 'Pizza', 'Drinks', 'Coffee'].map((cat) => (
            <div key={cat} className="flex flex-col items-center gap-2">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                <div className={`w-8 h-8 ${PRIMARY_COLOR} opacity-20 rounded-lg`} />
              </div>
              <span className="text-xs font-semibold text-gray-600">{cat}</span>
            </div>
          ))}
        </div>

        {/* Featured */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-900">Featured Cafes</h3>
            <button onClick={() => setCurrentScreen('RESTAURANTS')} className={`${PRIMARY_TEXT} font-bold text-sm`}>View All</button>
          </div>
          <div className="space-y-4">
            {RESTAURANTS.slice(0, 2).map((res) => (
              <div key={res.id} onClick={() => setCurrentScreen('MENU')} className="bg-white rounded-2xl p-3 shadow-sm flex gap-4 cursor-pointer active:scale-[0.98] transition-transform">
                <img src={res.image} className="w-24 h-24 rounded-xl object-cover" />
                <div className="flex-1 flex flex-col justify-center">
                  <h4 className="font-bold text-gray-900">{res.name}</h4>
                  <div className="flex items-center gap-4 mt-1">
                    <div className="flex items-center gap-1 text-xs text-yellow-500 font-bold">
                      <Star size={12} fill="currentColor" /> {res.rating}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-400 font-medium">
                      <Clock size={12} /> {res.time}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Nav */}
      <div className="bg-white border-t px-8 py-4 flex justify-between items-center">
        <Home size={24} className={PRIMARY_TEXT} />
        <History size={24} className="text-gray-300" onClick={() => setCurrentScreen('HISTORY')} />
        <ShoppingBag size={24} className="text-gray-300" onClick={() => setCurrentScreen('CART')} />
        <User size={24} className="text-gray-300" onClick={() => setCurrentScreen('PROFILE')} />
      </div>
    </div>
  );

  const RestaurantListScreen = () => (
    <div className="h-full bg-white flex flex-col">
      <Header title="All Restaurants" onBack={() => setCurrentScreen('HOME')} />
      <div className="p-6 space-y-4 flex-1 overflow-y-auto">
        {RESTAURANTS.map((res) => (
          <div key={res.id} onClick={() => setCurrentScreen('MENU')} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden active:scale-[0.98] transition-transform">
            <img src={res.image} className="w-full h-40 object-cover" />
            <div className="p-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-lg">{res.name}</h3>
                <span className="bg-emerald-50 text-emerald-700 text-xs px-2 py-1 rounded-lg font-bold">Open</span>
              </div>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-1 text-sm text-yellow-500 font-bold">
                  <Star size={14} fill="currentColor" /> {res.rating}
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-400 font-medium">
                  <Clock size={14} /> {res.time}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const MenuScreen = () => (
    <div className="h-full bg-white flex flex-col">
      <div className="relative h-64">
        <img src={RESTAURANTS[0].image} className="w-full h-full object-cover" />
        <div className="absolute top-12 left-6">
          <button onClick={() => setCurrentScreen('RESTAURANTS')} className="p-3 bg-white/90 backdrop-blur rounded-full shadow-lg">
            <ChevronLeft size={20} />
          </button>
        </div>
        <div className="absolute -bottom-1 left-0 right-0 h-10 bg-white rounded-t-[3rem]" />
      </div>

      <div className="px-6 pb-6 -mt-2">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-900">{RESTAURANTS[0].name}</h2>
            <p className="text-gray-500 text-sm mt-1">Campus Main Cafe • Quick Bites</p>
          </div>
          <div className="bg-emerald-50 p-2 rounded-2xl">
            <div className="flex items-center gap-1 text-emerald-700 font-bold">
              <Star size={16} fill="currentColor" /> 4.8
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-lg font-bold">Popular Items</h3>
          <div className="space-y-4">
            {MENU_ITEMS.map((item) => (
              <div key={item.id} className="flex gap-4 p-2">
                <img src={item.image} className="w-20 h-20 rounded-2xl object-cover" />
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900">{item.name}</h4>
                  <p className="text-emerald-600 font-extrabold mt-1">Rs. {item.price}</p>
                </div>
                <button 
                  onClick={() => addToCart(item)}
                  className={`w-10 h-10 rounded-xl ${PRIMARY_COLOR} text-white flex items-center justify-center active:scale-90 transition-transform`}
                >
                  <Plus size={20} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {cart.length > 0 && (
        <div className="fixed bottom-8 left-0 right-0 px-6">
          <button onClick={() => setCurrentScreen('CART')} className={`${PRIMARY_COLOR} w-full py-4 rounded-2xl shadow-xl text-white flex justify-between items-center px-6 animate-bounce-short`}>
            <div className="flex items-center gap-2">
              <span className="bg-white/20 px-2 py-0.5 rounded-lg text-sm font-bold">{cart.reduce((a,b)=>a+b.quantity,0)}</span>
              <span className="font-bold">View Cart</span>
            </div>
            <span className="font-bold">Rs. {cartTotal}</span>
          </button>
        </div>
      )}
    </div>
  );

  const CartScreen = () => (
    <div className="h-full bg-gray-50 flex flex-col">
      <Header title="Your Cart" onBack={() => setCurrentScreen('MENU')} />
      <div className="p-6 flex-1 overflow-y-auto space-y-4">
        {cart.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400">
            <ShoppingBag size={64} className="mb-4 opacity-20" />
            <p className="font-medium">Your cart is empty</p>
            <Button className="mt-4 px-8 w-auto" onClick={() => setCurrentScreen('MENU')}>Go to Menu</Button>
          </div>
        ) : (
          <>
            {cart.map((item) => (
              <div key={item.id} className="bg-white p-4 rounded-2xl shadow-sm flex gap-4">
                <img src={item.image} className="w-16 h-16 rounded-xl object-cover" />
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900">{item.name}</h4>
                  <p className="text-emerald-600 font-bold">Rs. {item.price}</p>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => updateQuantity(item.id, -1)} className="p-1 rounded-lg bg-gray-50 border"><Minus size={16} /></button>
                  <span className="font-bold">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, 1)} className="p-1 rounded-lg bg-gray-50 border"><Plus size={16} /></button>
                </div>
              </div>
            ))}
            
            <div className="bg-white p-6 rounded-3xl shadow-sm mt-8 space-y-3">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span>Rs. {cartTotal}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Delivery Fee</span>
                <span>Rs. 50</span>
              </div>
              <div className="border-t pt-3 flex justify-between font-extrabold text-lg text-gray-900">
                <span>Total</span>
                <span>Rs. {cartTotal + 50}</span>
              </div>
            </div>
          </>
        )}
      </div>
      {cart.length > 0 && (
        <div className="p-6 bg-white border-t">
          <Button onClick={() => setCurrentScreen('CHECKOUT')}>Go to Checkout</Button>
        </div>
      )}
    </div>
  );

  const CheckoutScreen = () => (
    <div className="h-full bg-gray-50 flex flex-col">
      <Header title="Checkout" onBack={() => setCurrentScreen('CART')} />
      <div className="p-6 space-y-6 flex-1 overflow-y-auto">
        <section>
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Delivery Address</h3>
          <div className="bg-white p-4 rounded-2xl shadow-sm flex items-center gap-4">
            <div className={`p-3 rounded-xl bg-emerald-50 ${PRIMARY_TEXT}`}>
              <MapPin size={24} />
            </div>
            <div className="flex-1">
              <h4 className="font-bold">Lucas Center, Ground Floor</h4>
              <p className="text-gray-400 text-xs">FCCU Campus, Lahore</p>
            </div>
            <button className={`${PRIMARY_TEXT} text-xs font-bold`}>Edit</button>
          </div>
        </section>

        <section>
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Payment Method</h3>
          <div className="bg-white p-4 rounded-2xl shadow-sm flex items-center gap-4">
            <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
              <CreditCard size={24} />
            </div>
            <div className="flex-1">
              <h4 className="font-bold">Cash on Delivery</h4>
              <p className="text-gray-400 text-xs">Pay when you receive</p>
            </div>
            <CheckCircle size={20} className={PRIMARY_TEXT} />
          </div>
        </section>

        <section className="bg-white p-6 rounded-3xl shadow-sm space-y-3">
          <h3 className="font-bold text-gray-900 mb-2">Order Summary</h3>
          {cart.map(i => (
            <div key={i.id} className="flex justify-between text-sm">
              <span className="text-gray-600">{i.quantity}x {i.name}</span>
              <span className="font-medium">Rs. {i.price * i.quantity}</span>
            </div>
          ))}
          <div className="border-t pt-3 mt-3 flex justify-between font-extrabold text-xl">
            <span>Amount to pay</span>
            <span className={PRIMARY_TEXT}>Rs. {cartTotal + 50}</span>
          </div>
        </section>
      </div>
      <div className="p-6 bg-white border-t">
        <Button onClick={() => {
          setHistory(prev => [{ id: Math.random(), date: 'Today', total: cartTotal + 50, status: 'Completed' }, ...prev]);
          setCart([]);
          setCurrentScreen('TRACKING');
        }}>Confirm Order</Button>
      </div>
    </div>
  );

  const TrackingScreen = () => {
    const [step, setStep] = useState(1);
    
    useEffect(() => {
      const timer = setInterval(() => {
        setStep(s => (s < 4 ? s + 1 : s));
      }, 3000);
      return () => clearInterval(timer);
    }, []);

    return (
      <div className="h-full bg-gray-50 flex flex-col">
        <Header title="Track Order" onBack={() => setCurrentScreen('HOME')} />
        
        <div className="flex-1 relative flex flex-col">
          {/* Map Simulation */}
          <div className="h-1/2 bg-gray-200 relative overflow-hidden">
             <div className="absolute inset-0 opacity-30 bg-[url('https://www.google.com/maps/vt/pb=!1m4!1m3!1i15!2i20235!3i13180!2m3!1e0!2sm!3i647146594!3m14!2sen!3sUS!5e18!12m1!1e68!12m3!1e37!2m1!1ssmartmaps!12m3!1e35!2m1!1s1!4e0!5m1!5f2')] bg-cover" />
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className={`w-12 h-12 ${PRIMARY_COLOR} rounded-full flex items-center justify-center animate-pulse text-white shadow-2xl`}>
                  <Truck size={24} />
                </div>
             </div>
          </div>

          <div className="bg-white rounded-t-[3rem] -mt-10 flex-1 p-8 shadow-2xl z-10">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 rounded-2xl bg-gray-100 p-2">
                <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=200" className="w-full h-full rounded-xl object-cover" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-lg">Ahmed (Student Rider)</h4>
                <p className="text-gray-400 text-sm">Your order is being picked up</p>
              </div>
              <button className={`w-12 h-12 rounded-2xl bg-emerald-50 ${PRIMARY_TEXT} flex items-center justify-center`}>
                <Truck size={24} />
              </button>
            </div>

            <div className="space-y-6 relative">
              <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-gray-100" />
              {[
                { id: 1, title: 'Order Confirmed', time: '12:30 PM', icon: <Package size={16} /> },
                { id: 2, title: 'Preparing Food', time: '12:35 PM', icon: <Clock size={16} /> },
                { id: 3, title: 'On the way', time: '12:45 PM', icon: <Truck size={16} /> },
                { id: 4, title: 'Delivered', time: '12:55 PM', icon: <CheckCircle size={16} /> },
              ].map((s) => (
                <div key={s.id} className="flex items-center gap-4 relative z-10">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${step >= s.id ? PRIMARY_COLOR + ' text-white' : 'bg-gray-200 text-gray-400'}`}>
                    {s.icon}
                  </div>
                  <div className="flex-1">
                    <p className={`font-bold ${step >= s.id ? 'text-gray-900' : 'text-gray-300'}`}>{s.title}</p>
                    <p className="text-xs text-gray-400">{s.time}</p>
                  </div>
                </div>
              ))}
            </div>

            <Button className="mt-8" variant="secondary" onClick={() => setCurrentScreen('HISTORY')}>View Order History</Button>
          </div>
        </div>
      </div>
    );
  };

  const HistoryScreen = () => (
    <div className="h-full bg-gray-50 flex flex-col">
      <Header title="Order History" onBack={() => setCurrentScreen('HOME')} />
      <div className="p-6 space-y-4 flex-1 overflow-y-auto">
        {history.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400">
            <History size={64} className="mb-4 opacity-20" />
            <p className="font-medium">No previous orders</p>
          </div>
        ) : (
          history.map((order) => (
            <div key={order.id} className="bg-white p-5 rounded-2xl shadow-sm space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-gray-900">FCCU Cafe</h4>
                  <p className="text-gray-400 text-xs">{order.date}</p>
                </div>
                <span className="bg-emerald-50 text-emerald-700 text-xs px-3 py-1 rounded-full font-bold">
                  {order.status}
                </span>
              </div>
              <div className="flex justify-between items-center border-t pt-3">
                <span className="text-sm text-gray-500 font-medium">Rs. {order.total}</span>
                <button className={`${PRIMARY_TEXT} text-sm font-bold flex items-center gap-1`}>
                  Reorder <ChevronRight size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  const ProfileScreen = () => (
    <div className="h-full bg-gray-50 flex flex-col">
      <Header title="Profile" onBack={() => setCurrentScreen('HOME')} />
      <div className="p-6 flex flex-col items-center">
        <div className="w-24 h-24 rounded-full bg-emerald-100 border-4 border-white shadow-lg overflow-hidden mb-4">
          <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200" className="w-full h-full object-cover" />
        </div>
        <h3 className="text-xl font-bold text-gray-900">John Doe</h3>
        <p className="text-gray-400 text-sm font-medium">john.doe@fccu.edu.pk</p>

        <div className="w-full mt-10 space-y-2">
          {[
            { icon: <User size={20} />, label: 'Personal Information', screen: 'PROFILE' },
            { icon: <History size={20} />, label: 'Order History', screen: 'HISTORY' },
            { icon: <MapPin size={20} />, label: 'Manage Addresses', screen: 'PROFILE' },
            { icon: <Settings size={20} />, label: 'App Settings', screen: 'PROFILE' },
          ].map((item, idx) => (
            <button 
              key={idx} 
              onClick={() => setCurrentScreen(item.screen as Screen)}
              className="w-full bg-white p-4 rounded-2xl shadow-sm flex items-center justify-between active:bg-gray-50"
            >
              <div className="flex items-center gap-4">
                <div className="text-gray-400">{item.icon}</div>
                <span className="font-semibold text-gray-700">{item.label}</span>
              </div>
              <ChevronRight size={18} className="text-gray-300" />
            </button>
          ))}
        </div>

        <button 
          onClick={() => { setRole(null); setCurrentScreen('LOGIN'); }}
          className="mt-8 flex items-center gap-2 text-red-500 font-bold"
        >
          <LogOut size={20} /> Logout
        </button>
      </div>
    </div>
  );

  const RiderDashboard = () => (
    <div className="h-full bg-gray-50 flex flex-col">
      <div className="bg-emerald-600 p-8 pt-16 pb-12 rounded-b-[3rem] text-white">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Rider Dashboard</h1>
            <p className="text-emerald-100 text-sm">Welcome back, Ahmed!</p>
          </div>
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
             <User size={24} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/10 p-4 rounded-3xl border border-white/10">
             <p className="text-xs font-medium text-emerald-100 uppercase">Total Earned</p>
             <h4 className="text-xl font-bold">Rs. 1,250</h4>
          </div>
          <div className="bg-white/10 p-4 rounded-3xl border border-white/10">
             <p className="text-xs font-medium text-emerald-100 uppercase">Deliveries</p>
             <h4 className="text-xl font-bold">12</h4>
          </div>
        </div>
      </div>

      <div className="p-6 flex-1 overflow-y-auto space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-900">Available Tasks</h3>
          <span className="flex items-center gap-1 text-xs text-emerald-600 font-bold">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" /> Online
          </span>
        </div>

        <div className="space-y-4">
          {[
            { id: 1, store: 'FCCU Cafe', dist: '200m away', pay: 'Rs. 50', items: 3, dest: 'Lucas Center' },
            { id: 2, store: 'Student Lounge', dist: '500m away', pay: 'Rs. 60', items: 1, dest: 'Hostel 5' },
          ].map(task => (
            <div key={task.id} onClick={() => setCurrentScreen('TRACKING')} className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 active:scale-[0.98] transition-all cursor-pointer">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-bold text-gray-900 text-lg">{task.store}</h4>
                  <p className="text-gray-400 text-xs flex items-center gap-1">
                    <MapPin size={12} /> {task.dist}
                  </p>
                </div>
                <span className="text-emerald-600 font-extrabold">{task.pay}</span>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-6 bg-gray-50 p-3 rounded-2xl">
                <div className="flex items-center gap-1 font-medium">
                  <Package size={14} /> {task.items} Items
                </div>
                <div className="w-1 h-1 bg-gray-300 rounded-full" />
                <div className="flex items-center gap-1 font-medium">
                  <MapPin size={14} /> {task.dest}
                </div>
              </div>
              <Button>Accept Task</Button>
            </div>
          ))}
        </div>
      </div>
      
      <div className="p-6">
        <button onClick={() => setCurrentScreen('LOGIN')} className="w-full py-4 text-gray-400 font-semibold flex items-center justify-center gap-2">
          <LogOut size={18} /> Switch to User Mode
        </button>
      </div>
    </div>
  );

  return (
    <div className="mobile-container">
      <div className="notch" />
      <div className="status-bar">
        <span>9:41</span>
        <div className="flex gap-2">
           <span className="w-4 h-4 rounded-sm bg-black/10 flex items-center justify-center">
             <div className="w-2 h-2 bg-black rounded-full" />
           </span>
        </div>
      </div>
      <div className="screen-content">
        {currentScreen === 'LOGIN' && <LoginScreen />}
        {currentScreen === 'REGISTER' && <RegisterScreen />}
        {currentScreen === 'HOME' && <HomeScreen />}
        {currentScreen === 'RESTAURANTS' && <RestaurantListScreen />}
        {currentScreen === 'MENU' && <MenuScreen />}
        {currentScreen === 'CART' && <CartScreen />}
        {currentScreen === 'CHECKOUT' && <CheckoutScreen />}
        {currentScreen === 'TRACKING' && <TrackingScreen />}
        {currentScreen === 'HISTORY' && <HistoryScreen />}
        {currentScreen === 'PROFILE' && <ProfileScreen />}
        {currentScreen === 'RIDER_DASHBOARD' && <RiderDashboard />}
      </div>
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
