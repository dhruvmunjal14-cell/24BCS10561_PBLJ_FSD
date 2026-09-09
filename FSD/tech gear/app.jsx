import { useMemo, useState } from "react";
import {
  BrowserRouter,
  Route,
  Routes,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { Link } from "react-router-dom";
import { PRODUCTS } from "./productData";

function Navbar() 
{
  return (
    <nav>
      <Link to="/products">All products</Link>
      <Link to="/products?category=audio">Audio products</Link>

      <Link to="/products?maxPrice=100">Products under 100</Link>

    </nav>

  );
}

function ProductCatalog() 
{

  const [searchParams, setSearchParams] = useSearchParams();

  const category = searchParams.get("category");
  const maxPrice = searchParams.get("maxPrice");
  const filteredProducts = useMemo(() => {
    const res = PRODUCTS.filter((product) => {
      if (category && product.category !== category) return false;
      if (maxPrice && product.price > Number(maxPrice)) return false;

      return product;

    });

    return res;
    
  }, [category, maxPrice]);
  return (
    <>
       <select
        value={category || ""}
        onChange={(e) => {
          const value = e.target.value;

          if (value == "") searchParams.delete("category");
          else searchParams.set("category", value);

          setSearchParams(searchParams);
            }}
      
      >
        
         <option value="">All categories</option>

        <option value="audio">Audio</option>
        <option value="peripherals">Peripherals</option>
        <option value="display">Display</option>
      </select>

      <input

        type="number"
        value={maxPrice || ""}
        onChange={(e) => {
         
            let value = e.target.value;

           if (value == "") searchParams.delete("maxPrice");
          else {

             searchParams.set("maxPrice", value);
          }

          setSearchParams(searchParams);
        }}
      />

        <button onClick={() => setSearchParams({})}>Clear Filters</button>

      {filteredProducts.length > 0 &&


        filteredProducts.map((product, index) => {
          return (

            <div key={index}>
              <h1>{product.id}</h1>
              <h1>{product.name}</h1>
              <h1>{product.category}</h1>

              <h1>{product.price}</h1>
              <Link to={`/product/${product.id}`}> View Details</Link>
            </div>
          );
        })}
    </>
  );
}

function ProductDetails() {
  const { productId } = useParams();

  const res = PRODUCTS.filter((item) => item.id ===  productId);

  const product = res[0];

  if (!product) {
    return (
      <>
        <h1>Product not found!</h1>

        <Link to="/products">Back to catalog</Link>
      </>
    );
  }
  return (
    <>
      <h1>{product.id}</h1>
      <h1>{product.name}</h1>
      <h1>{product.category}</h1>
      <h1>{product.price}</h1>

        <Link to="/products">Back to catalog</Link>
    </>
  );
}

function App() {
    
  return (
    <>
      <BrowserRouter>
        <Navbar />

        <Routes>
          <Route path="/products" element={<ProductCatalog />} />
          <Route path="/product/:productId" element={<ProductDetails />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;