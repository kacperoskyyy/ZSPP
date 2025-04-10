// JavaScript source code

import React from 'react';

const ReviewSection = () => {
    const Reviews = [
        {
            id: 1,
            name: 'Pablo Mescopar',
            text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque dignissim.',
            rating: 7
        },
        {
            id: 2,
            name: 'Giorgij Vasylenko',
            text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque dignissim.',
            rating: 3
        },
        {
            id: 3,
            name: 'Mihai³ Jakuboviæ',
            text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque dignissim.',
            rating: 9
        },
    ];

    const Footer = ({ }) => (
        <footer className="footer">
            <div className="footer-section">
                <h3>Kontakt</h3>
                <p>ul. Willowa 2</p>
                <p>Bielsko-Bia³a 43-300</p>
                <p>Tel: 123 456 789</p>
                <p>wss.kontakt@mail.com</p>
            </div>
            <div className="footer-section">
                <h3>Social Media</h3>
                <div className="social-icons">
                    <a href="#" className="social-icon instagram"></a>
                    <a href="#" className="social-icon custom-icon"></a>
                </div>
            </div>
            <div className="footer-section">
                <h3>Regulamin</h3>
            </div>
        </footer>
    );
    return (
        <div className="review-page">
            <div className="scroll-up">
                <div className="arrow-up"></div>
                
            </div>

            <section className="review-section">
                <h1>Opinie naszych klientow</h1>

                <div className="review-container">
                    {Reviews.map(review => (
                        <div key={review.id} className="review-card">
                            <div className="review-header">
                                <div className="review-avatar"></div>
                                <h3>{review.name}</h3>
                            </div>
                            <p>{review.text}</p>
                            <div className="rating">
                                {[...Array(review.rating)].map((_, i) => (
                                    <span key={i} className="star">#</span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default ReviewSection;
  
