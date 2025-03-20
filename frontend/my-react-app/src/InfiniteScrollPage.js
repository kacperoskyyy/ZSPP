import { useRef } from "react";

const SinglePageScroll = () => {
    const sectionRef = useRef(null);

    const scrollToSection = () => {
        sectionRef.current.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <div>
            <button onClick={scrollToSection}>Przewiñ w dó³</button>
            <div style={{ height: "100vh", background: "lightgray" }}>Sekcja 1</div>
            <div ref={sectionRef} style={{ height: "100vh", background: "lightblue" }}>
                Sekcja 2 (cel przewijania)
            </div>
        </div>
    );
};

export default SinglePageScroll;
