import React from "react";
const products = [
  {
    name: "Futerał",
    price: "1000zł",
    image: "/Produkt1.jpg", // Zmień na właściwą ścieżkę
  },
  {
    name: "GPS",
    price: "500zł",
    image: "/Produkt2.jpg", // Zmień na właściwą ścieżkę
  },
  {
    name: "Rękawice",
    price: "1000zł",
    image: "/Produkt3.jpg", // Zmień na właściwą ścieżkę
  },
];

const ProductGallery = () => {
  return (
    <div className="App-Page3-Swipe">
      <div className="App-Page3-Swipe">
        {products.map((product, index) => (
          <div key={index} className="product-card">
            <img
              src={product.image}
              alt={product.name}
              className=""
            />
            <p className="product_info">
              {product.name} - <strong>{product.price}</strong>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductGallery;




/*
const ProductsSection = () => {
    const Products = [
        {
            id: 1,
            name: 'Spiwor',
            text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque dignissim.',
            available_quantity: 77,
            image: "/Produkt1.jpg"
        },
        {
            id: 2,
            name: 'GPS',
            text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque dignissim.',
            available_quantity: 33,
            image: "/Produkt2.jpg"
        },
        {
            id: 3,
            name: 'Rekawiczki',
            text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque dignissim.',
            available_quantity: 99,
            image: "/Produkt3.jpg"
        },

    ];
    
 

    const ProductGallery = ({}) => {
    return (
      <div className="flex flex-col items-center space-y-4">
        <p className="text-lg font-semibold">Scroll up</p>
        <div className="flex space-x-8">
          {products.map((product, index) => (
            <div key={index} className="text-center">
              <img
                src={product.image}
                alt={product.name}
                className="w-64 h-64 object-contain mx-auto"
              />
              <p className="mt-2">
                {product.name} - <strong>{product.price}</strong>
              </p>
            </div>
          ))}
        </div>
      </div>
    );
    };
}
export default ProductGallery;
*/
