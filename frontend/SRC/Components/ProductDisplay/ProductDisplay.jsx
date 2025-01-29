import React, { useContext, useState } from 'react';
import './ProductDisplay.css';
import star_icon from '../Assets/star_icon.png';
import star_dull_icon from '../Assets/star_dull_icon.png';
import { ShopContext } from '../../Context/ShopContext';

const ProductDisplay = (props) => {
    const { product } = props;
    const { addToCart } = useContext(ShopContext);
    const [likes, setLikes] = useState(product.likes || 0); // Initialize likes from the product object

    // Handle like functionality
    const handleLike = async () => {
        try {
            const response = await fetch('http://localhost:4000/like', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: product.id }),
            });
            const data = await response.json();
            if (data.success) {
                setLikes(data.likes); // Update likes count dynamically
                alert(`You liked ${product.name}. Total Likes: ${data.likes}`);
            }
        } catch (error) {
            console.error("Error liking the product:", error);
        }
    };

    return (
        <div className="productdisplay">
            <div className="productdisplay-left">
                <div className="productdisplay-img-list">
                    <img src={product.image} alt="" />
                    <img src={product.image} alt="" />
                    <img src={product.image} alt="" />
                    <img src={product.image} alt="" />
                </div>
                <div className="productdisplay-img">
                    <img className='productdisplay-main-img' src={product.image} alt="" />
                </div>
            </div>
            <div className="productdisplay-right">
                <h1>{product.name}</h1>
                <div className="productdisplay-right-star">
                    <img src={star_icon} alt="" />
                    <img src={star_icon} alt="" />
                    <img src={star_icon} alt="" />
                    <img src={star_icon} alt="" />
                    <img src={star_dull_icon} alt="" />
                    <p>(122)</p>
                </div>
                <div className="productdisplay-right-prices">
                    <div className="productdisplay-right-price-old">${product.old_price}</div>
                    <div className="productdisplay-right-price-new">${product.new_price}</div>
                </div>
                <div className="productdisplay-right-description">
                    It is a very good game, based on what we have seen so far, just writing this for testing.
                </div>
                <button className="like-button" onClick={handleLike}>
                    Like
                </button>
                <button onClick={() => { addToCart(product.id); }}>ADD TO CART</button>

            </div>
        </div>
    );
};

export default ProductDisplay;
