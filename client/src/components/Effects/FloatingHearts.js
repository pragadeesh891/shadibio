import React from 'react';
import './FloatingHearts.css';

const FloatingHearts = () => {
    // Generate 20 hearts with random properties
    const hearts = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        left: Math.random() * 100, // 0 to 100% width
        size: Math.random() * 20 + 10, // 10px to 30px
        delay: Math.random() * 10,
        duration: Math.random() * 10 + 5,
    }));

    return (
        <div className="hearts-container">
            {hearts.map((heart) => (
                <div
                    key={heart.id}
                    className="heart"
                    style={{
                        left: `${heart.left}%`,
                        width: `${heart.size}px`,
                        height: `${heart.size}px`,
                        animationDelay: `${heart.delay}s`,
                        animationDuration: `${heart.duration}s`,
                    }}
                >
                    ❤️
                </div>
            ))}
        </div>
    );
};

export default FloatingHearts;
