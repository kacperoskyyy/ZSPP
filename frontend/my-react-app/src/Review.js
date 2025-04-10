// JavaScript source code

import React from "react";

const ReviewSection = () => {
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
      name: "Mihai� Jakubovi�",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque dignissim.",
      rating: 9,
    },
  ];

  return (
    <div className="review-page">
      <div className="scroll-up">
        <div className="arrow-up"></div>
      </div>

      <section className="review-section">
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
    </div>
  );
};

export default ReviewSection;
