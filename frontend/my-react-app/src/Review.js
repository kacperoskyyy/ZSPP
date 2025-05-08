// JavaScript source code

import React from "react";
import Karuzela from "./Carousel";


  const Reviews = [
    {
      id: 1,
      name: "Pablo Mescopar",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque dignissim.",
      rating: 7,
    },
    {
      id: 2,
      name: "Giorgij Vasylenko",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque dignissim.",
      rating: 3,
    },
    {
      id: 3,
      name: "Mihaił Jakubović",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque dignissim.",
      rating: 9,
    },
    {
      id: 4,
      name: "Mihaił Jakubović",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque dignissim.",
      rating: 4,
    },
    {
      id: 5,
      name: "Mihaił Jakubović",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque dignissim.",
      rating: 5,
    },
    {
      id: 6,
      name: "Mihaił Jakubović",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque dignissim.",
      rating: 6,
    },
    {
      id: 7,
      name: "Mihaił Jakubović",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque dignissim.",
      rating: 7,
    },
    {
      id: 8,
      name: "Mihaił Jakubović",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque dignissim.",
      rating: 8,
    },
    {
      id: 9,
      name: "Mihaił Jakubović",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque dignissim.",
      rating: 9,
    },
    {
      id: 10,
      name: "Mihaił Jakubović",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque dignissim.",
      rating: 10,
    },
    
  ];
  const ReviewSection = () => {
  return (
    <div className="review-page">
      <div className="scroll-up">
        <div className="arrow-up"></div>
      </div>
      <div className="review-page">
     <Karuzela reviews={Reviews} slideWidth={330} interval={3000} /> 
  </div>
  </div>
);

      {/* <section className="review-section">
        <h1>Opinie naszych klientow</h1>

        <div className="review-container">
          {Reviews.map((review) => (
            <div key={review.id} className="review-card">
              <div className="review-header">
                <div className="review-avatar"></div>
                <h3>{review.name}</h3>
              </div>
              <p>{review.text}</p>
              <div className="rating">
                {[...Array(review.rating)].map((_, i) => (
                  <span key={i} className="star">
                    #
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div> */}
 
};

export default ReviewSection;
