// Single source of mock data. Replace with a real database later.
export const data = {
  sales: [
    { month: "Apr", amount: 18200 }, { month: "May", amount: 21400 },
    { month: "Jun", amount: 19800 }, { month: "Jul", amount: 24600 },
    { month: "Aug", amount: 27100 }, { month: "Sep", amount: 29500 },
  ],
  customers: [
    { id: 1, name: "Anita Raman", city: "Chennai", orders: 14, spent: 5200 },
    { id: 2, name: "Karthik Selvam", city: "Madurai", orders: 9, spent: 3150 },
    { id: 3, name: "Meena Pillai", city: "Trichy", orders: 17, spent: 6890 },
    { id: 4, name: "Ravi Kumar", city: "Pudukkottai", orders: 6, spent: 1980 },
    { id: 5, name: "Divya Nair", city: "Coimbatore", orders: 11, spent: 4120 },
  ],
  products: [
    { id: 1, name: "Filter Coffee 500g", price: 380, stock: 64, sold: 412 },
    { id: 2, name: "Handloom Towel", price: 450, stock: 8, sold: 230 },
    { id: 3, name: "Spice Box", price: 620, stock: 31, sold: 187 },
    { id: 4, name: "Clay Teapot", price: 540, stock: 5, sold: 96 },
    { id: 5, name: "Jaggery 1kg", price: 160, stock: 120, sold: 505 },
  ],
};