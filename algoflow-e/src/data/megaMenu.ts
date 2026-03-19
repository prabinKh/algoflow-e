
export interface MegaMenuItem {
  title: string;
  href: string;
  columns: {
    type: 'brands' | 'categories' | 'products';
    title?: string;
    items: {
      name: string;
      href: string;
      image?: string;
      price?: number;
      badge?: string;
    }[];
  }[];
  banner?: {
    text: string;
    buttonText: string;
    buttonHref: string;
    backgroundColor?: string;
    discount?: number;
  };
}

export const megaMenuData: Record<string, MegaMenuItem> = {
  'laptops-computers': {
    title: 'Laptops & Computers',
    href: '/category/laptops-computers',
    columns: [
      {
        type: 'brands',
        title: 'All Laptop Brands',
        items: [
          { name: 'Dell', href: '/category/dell-laptop' },
          { name: 'Lenovo', href: '/category/lenovo-laptop' },
          { name: 'HP', href: '/category/hp-laptop' },
          { name: 'Apple MacBook', href: '/category/apple-macbook' },
          { name: 'Acer', href: '/category/acer-laptop' },
          { name: 'Asus', href: '/category/asus-laptop' },
          { name: 'MSI', href: '/category/msi-laptop' },
          { name: 'Samsung', href: '/category/samsung-laptop' },
          { name: 'Huawei', href: '/category/huawei-laptop' },
          { name: 'Microsoft Surface', href: '/category/microsoft-surface' }
        ]
      },
      {
        type: 'categories',
        title: 'Laptops by Type',
        items: [
          { name: 'Gaming Laptops', href: '/category/gaming-laptops' },
          { name: 'Business Laptops', href: '/category/business-laptops' },
          { name: 'Student Laptops', href: '/category/student-laptops' },
          { name: 'Ultrabooks', href: '/category/ultrabooks' },
          { name: '2-in-1 Laptops', href: '/category/2-in-1-laptops' },
          { name: 'Workstation Laptops', href: '/category/workstation-laptops' }
        ]
      },
      {
        type: 'products',
        title: 'Popular Products',
        items: [
          { 
            name: 'Dell Inspiron 15', 
            href: '/product/dell-tower-ect1250-i5-14400',
            image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=100&h=100&fit=crop',
            price: 82500,
            badge: 'Best Seller'
          },
          { 
            name: 'Lenovo Legion 5', 
            href: '/product/lenovo-legion-5-ryzen7',
            image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=100&h=100&fit=crop',
            price: 228000,
            badge: 'Gaming'
          },
          { 
            name: 'MacBook Air M2', 
            href: '/product/macbook-air-m2',
            image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=100&h=100&fit=crop',
            price: 145000,
            badge: 'New'
          }
        ]
      }
    ],
    banner: {
      text: 'Limited Time Offer: Up to 28% off on Gaming Laptops',
      buttonText: 'Shop Now',
      buttonHref: '/category/gaming-laptops',
      discount: 28
    }
  },
  'computer-peripherals': {
    title: 'Computer Peripherals',
    href: '/category/computer-peripherals',
    columns: [
      {
        type: 'brands',
        title: 'Peripheral Brands',
        items: [
          { name: 'Logitech', href: '/category/logitech' },
          { name: 'HP', href: '/category/hp' },
          { name: 'Dell', href: '/category/dell' },
          { name: 'Lenovo', href: '/category/lenovo' },
          { name: 'Samsung', href: '/category/samsung' },
          { name: 'LG', href: '/category/lg' },
          { name: 'Acer', href: '/category/acer' },
          { name: 'Asus', href: '/category/asus' },
          { name: 'Razer', href: '/category/razer' },
          { name: 'Corsair', href: '/category/corsair' }
        ]
      },
      {
        type: 'categories',
        title: 'Monitors',
        items: [
          { name: '24-inch Monitors', href: '/category/monitors' },
          { name: '27-inch Monitors', href: '/category/monitors' },
          { name: '32-inch Monitors', href: '/category/monitors' },
          { name: 'Gaming Monitors', href: '/category/monitors' },
          { name: '4K Monitors', href: '/category/monitors' },
          { name: 'Curved Monitors', href: '/category/monitors' }
        ]
      },
      {
        type: 'products',
        title: 'Popular Products',
        items: [
          { 
            name: 'Logitech G502 Mouse', 
            href: '/product/logitech-g502',
            image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=100&h=100&fit=crop',
            price: 8500,
            badge: 'Best Seller'
          },
          { 
            name: 'Dell 24" Monitor', 
            href: '/product/dell-24-inch-monitor-se2422h',
            image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=100&h=100&fit=crop',
            price: 23900,
            badge: 'Popular'
          }
        ]
      }
    ]
  },
  'audio-headphones': {
    title: 'Audio | Headphones',
    href: '/category/audio-headphones',
    columns: [
      {
        type: 'brands',
        title: 'Audio Brands',
        items: [
          { name: 'Sony', href: '/category/sony' },
          { name: 'JBL', href: '/category/jbl' },
          { name: 'Bose', href: '/category/bose' },
          { name: 'Sennheiser', href: '/category/sennheiser' },
          { name: 'Audio-Technica', href: '/category/audio-technica' },
          { name: 'Skullcandy', href: '/category/skullcandy' },
          { name: 'Beats', href: '/category/beats' },
          { name: 'Marshall', href: '/category/marshall' },
          { name: 'Philips', href: '/category/philips' },
          { name: 'Logitech', href: '/category/logitech' }
        ]
      },
      {
        type: 'categories',
        title: 'Headphones by Type',
        items: [
          { name: 'Wireless Headphones', href: '/category/headphones' },
          { name: 'Wired Headphones', href: '/category/headphones' },
          { name: 'Noise Cancelling', href: '/category/headphones' },
          { name: 'Sports/Earbuds', href: '/category/earbuds' },
          { name: 'Gaming Headsets', href: '/category/headphones' },
          { name: 'Studio Headphones', href: '/category/headphones' }
        ]
      },
      {
        type: 'products',
        title: 'Popular Products',
        items: [
          { 
            name: 'Sony WH-1000XM4', 
            href: '/product/sony-wh-1000xm4',
            image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop',
            price: 35000,
            badge: 'Premium'
          },
          { 
            name: 'JBL Flip 6', 
            href: '/product/jbl-flip-6',
            image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=100&h=100&fit=crop',
            price: 12500,
            badge: 'Best Seller'
          }
        ]
      }
    ]
  },
  'cameras': {
    title: 'Cameras',
    href: '/category/cameras',
    columns: [
      {
        type: 'brands',
        title: 'Camera Brands',
        items: [
          { name: 'Canon', href: '/category/canon' },
          { name: 'Nikon', href: '/category/nikon' },
          { name: 'Sony', href: '/category/sony' },
          { name: 'Fujifilm', href: '/category/fujifilm' },
          { name: 'Panasonic', href: '/category/panasonic' },
          { name: 'GoPro', href: '/category/gopro' },
          { name: 'DJI', href: '/category/dji' },
          { name: 'Olympus', href: '/category/olympus' },
          { name: 'Leica', href: '/category/leica' },
          { name: 'Insta360', href: '/category/insta360' }
        ]
      },
      {
        type: 'categories',
        title: 'Cameras by Type',
        items: [
          { name: 'DSLR Cameras', href: '/category/cameras' },
          { name: 'Mirrorless Cameras', href: '/category/cameras' },
          { name: 'Point & Shoot', href: '/category/cameras' },
          { name: 'Action Cameras', href: '/category/cameras' },
          { name: '360 Cameras', href: '/category/cameras' },
          { name: 'Drone Cameras', href: '/category/cameras' }
        ]
      },
      {
        type: 'products',
        title: 'Popular Products',
        items: [
          { 
            name: 'Canon EOS 1500D', 
            href: '/product/canon-eos-1500d',
            image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=100&h=100&fit=crop',
            price: 45000,
            badge: 'Popular'
          }
        ]
      }
    ]
  },
  'mobiles-tablets': {
    title: 'Mobiles | Tablets',
    href: '/category/mobiles-tablets',
    columns: [
      {
        type: 'brands',
        title: 'Mobile Brands',
        items: [
          { name: 'Apple iPhone', href: '/category/apple' },
          { name: 'Samsung', href: '/category/samsung-mobile' },
          { name: 'Google Pixel', href: '/category/google' },
          { name: 'OnePlus', href: '/category/oneplus' },
          { name: 'Xiaomi', href: '/category/xiaomi-mobile' },
          { name: 'Oppo', href: '/category/oppo-mobile' },
          { name: 'Vivo', href: '/category/vivo' },
          { name: 'Realme', href: '/category/realme' },
          { name: 'Nokia', href: '/category/nokia' },
          { name: 'Motorola', href: '/category/motorola' }
        ]
      },
      {
        type: 'categories',
        title: 'Mobiles by Price',
        items: [
          { name: 'Under Rs. 20,000', href: '/category/mobiles-tablets' },
          { name: 'Rs. 20,000 - 40,000', href: '/category/mobiles-tablets' },
          { name: 'Rs. 40,000 - 60,000', href: '/category/mobiles-tablets' },
          { name: 'Rs. 60,000 - 80,000', href: '/category/mobiles-tablets' },
          { name: 'Above Rs. 80,000', href: '/category/mobiles-tablets' }
        ]
      },
      {
        type: 'products',
        title: 'Popular Products',
        items: [
          { 
            name: 'iPhone 15 Pro Max', 
            href: '/product/iphone-15-pro-max',
            image: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=100&h=100&fit=crop',
            price: 185000,
            badge: 'Flagship'
          },
          { 
            name: 'Samsung S24 Ultra', 
            href: '/product/samsung-s24-ultra',
            image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=100&h=100&fit=crop',
            price: 165000,
            badge: 'New'
          }
        ]
      }
    ]
  },
  'home-kitchen': {
    title: 'Home | Kitchen',
    href: '/category/home-kitchen',
    columns: [
      {
        type: 'brands',
        title: 'Home Appliance Brands',
        items: [
          { name: 'Samsung', href: '/category/samsung' },
          { name: 'LG', href: '/category/lg' },
          { name: 'Whirlpool', href: '/category/whirlpool' },
          { name: 'Panasonic', href: '/category/panasonic' },
          { name: 'Philips', href: '/category/philips' },
          { name: 'Havells', href: '/category/havells' },
          { name: 'Bajaj', href: '/category/bajaj' },
          { name: 'Morphy Richards', href: '/category/morphy-richards' },
          { name: 'Prestige', href: '/category/prestige' },
          { name: 'Butterfly', href: '/category/butterfly' }
        ]
      },
      {
        type: 'categories',
        title: 'Large Appliances',
        items: [
          { name: 'Refrigerators', href: '/category/home-kitchen' },
          { name: 'Washing Machines', href: '/category/home-kitchen' },
          { name: 'Air Conditioners', href: '/category/home-kitchen' },
          { name: 'Microwave Ovens', href: '/category/home-kitchen' },
          { name: 'Dishwashers', href: '/category/home-kitchen' }
        ]
      },
      {
        type: 'products',
        title: 'Popular Products',
        items: [
          { 
            name: 'Samsung 235L Fridge', 
            href: '/product/samsung-fridge',
            image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=100&h=100&fit=crop',
            price: 45000,
            badge: 'Best Seller'
          }
        ]
      }
    ]
  },
  'fitness-health': {
    title: 'Fitness | Health Care',
    href: '/category/fitness-health',
    columns: [
      {
        type: 'brands',
        title: 'Fitness Brands',
        items: [
          { name: 'Fitbit', href: '/category/fitbit' },
          { name: 'Apple Watch', href: '/category/apple' },
          { name: 'Samsung Watch', href: '/category/samsung' },
          { name: 'Garmin', href: '/category/garmin' },
          { name: 'Noise', href: '/category/noise' },
          { name: 'Boat', href: '/category/boat' },
          { name: 'Lifelong', href: '/category/lifelong' },
          { name: 'Dr. Trust', href: '/category/dr-trust' },
          { name: 'Omron', href: '/category/omron' },
          { name: 'AccuSure', href: '/category/accusure' }
        ]
      },
      {
        type: 'categories',
        title: 'Wearables',
        items: [
          { name: 'Smart Watches', href: '/category/fitness-health' },
          { name: 'Fitness Bands', href: '/category/fitness-health' },
          { name: 'GPS Watches', href: '/category/fitness-health' },
          { name: 'Kids Smartwatches', href: '/category/fitness-health' }
        ]
      },
      {
        type: 'products',
        title: 'Popular Products',
        items: [
          { 
            name: 'Apple Watch Series 9', 
            href: '/product/apple-watch-9',
            image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=100&h=100&fit=crop',
            price: 55000,
            badge: 'New'
          }
        ]
      }
    ]
  },
  'car-accessories': {
    title: 'Car Accessories',
    href: '/category/car-accessories',
    columns: [
      {
        type: 'brands',
        title: 'Car Accessory Brands',
        items: [
          { name: 'Philips', href: '/category/car-accessories' },
          { name: 'Bosch', href: '/category/car-accessories' },
          { name: '3M', href: '/category/car-accessories' },
          { name: 'Michelin', href: '/category/car-accessories' },
          { name: 'Goodyear', href: '/category/car-accessories' },
          { name: 'JBL', href: '/category/car-accessories' },
          { name: 'Sony', href: '/category/car-accessories' },
          { name: 'Pioneer', href: '/category/car-accessories' },
          { name: 'Blaupunkt', href: '/category/car-accessories' },
          { name: 'Syska', href: '/category/car-accessories' }
        ]
      },
      {
        type: 'categories',
        title: 'Interior Accessories',
        items: [
          { name: 'Car Covers', href: '/category/car-accessories' },
          { name: 'Seat Covers', href: '/category/car-accessories' },
          { name: 'Floor Mats', href: '/category/car-accessories' },
          { name: 'Steering Covers', href: '/category/car-accessories' },
          { name: 'Air Fresheners', href: '/category/car-accessories' },
          { name: 'Phone Holders', href: '/category/car-accessories' }
        ]
      },
      {
        type: 'products',
        title: 'Popular Products',
        items: [
          { 
            name: 'Philips Car Vacuum', 
            href: '/product/philips-car-vacuum',
            image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=100&h=100&fit=crop',
            price: 4500,
            badge: 'Essential'
          },
          { 
            name: 'Bosch Battery Charger', 
            href: '/product/bosch-charger',
            image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=100&h=100&fit=crop',
            price: 12000,
            badge: 'Reliable'
          }
        ]
      }
    ],
    banner: {
      text: 'Upgrade Your Ride: 15% off on Car Electronics',
      buttonText: 'Shop Now',
      buttonHref: '/category/car-accessories',
      discount: 15
    }
  }
};
