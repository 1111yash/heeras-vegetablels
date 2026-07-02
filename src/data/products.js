

const products = [
  // Vegetables (सब में unitType: "weight" जोड़ दिया है)
  { id: 1, name: "Tomato", price: 40, image: "/images/Tomato.jpg", category: "Vegetables", unitType: "weight" },
  { id: 2, name: "Potato", price: 30, image: "images/aloo.jpg", category: "Vegetables", unitType: "weight" },
  { id: 3, name: "Onion", price: 35, image: "/images/Onion.jpg", category: "Vegetables", unitType: "weight" },
  { id: 4, name: "Brinjal", price: 50, image: "/images/brinjal.jpg", category: "Vegetables", unitType: "weight" },
  { id: 5, name: "Cabbage", price: 35, image: "/images/cabage.jpg", category: "Vegetables", unitType: "weight" },
  { id: 6, name: "Cauliflower", price: 45, image: "/images/fullkobi.jpg", category: "Vegetables", unitType: "weight" },
  { id: 7, name: "Carrot", price: 60, image: "/images/carrot.jpg", category: "Vegetables", unitType: "weight" },
  { id: 8, name: "Cucumber", price: 35, image: "/images/Khira.jpg", category: "Vegetables", unitType: "weight" },
  { id: 9, name: "Lady Finger", price: 50, image: "/images/ladyfinger.jpg", category: "Vegetables", unitType: "weight" },
  { id: 10, name: "Spinach", price: 25, image: "/images/spinach.jpg", category: "Vegetables", unitType: "weight" },
  { id: 11, name: "Capsicum", price: 80, image: "/images/capsicumimg.jpg", category: "Vegetables", unitType: "weight" },
  { id: 12, name: "Round Gourd(tinda)", price: 40, image: "/images/tinda.jpg", category: "Vegetables", unitType: "weight" },
  { id: 13, name: "Green Chilli", price: 90, image: "/images/mirchi.jpg", category: "Vegetables", unitType: "weight" },
  { id: 14, name: "Garlic", price: 140, image: "/images/garlic.jpg", category: "Vegetables", unitType: "weight" },
  { id: 15, name: "Ginger", price: 120, image: "/images/ginger.jpg", category: "Vegetables", unitType: "weight" },
  { id: 21, name: "Ivy guard", price: 120, image: "/images/tondare.jpg", category: "Vegetables", unitType: "weight" },
  { id: 22, name: "Cluster Beans (Gavar)", price: 75, image: "/images/gawar.jpg", category: "Vegetables", unitType: "weight" },
  { id: 23, name: "coriander", price: 60, image: "/images/coriander.jpg", category: "Vegetables", unitType: "weight" },

  // Dairy
  {
    id: 25,
    name: "Buffalo A2 Milk (Maroti Dairy)",
    price: 90,
    image: "/images/amul1l.jpg",
    category: "Dairy",
    unitType: "liquid",
    
  },
  // Eggs
  {
    id: "egg_01",
    name: "Farm Fresh White Eggs",
    category: "Eggs",
    unitType: "pieces",
    price: 9,
    image: "/images/white egg.jpg",

  },
  {
    id: "egg_02",
    name: "Free Range Country Eggs (देशी अंडे)",
    category: "Eggs",
    unitType: "pieces",
    price: 15,
    image: "/images/desi egg.jpg",
    inStock: false, // 🔴 Out of Stock
  },
];

export default products;