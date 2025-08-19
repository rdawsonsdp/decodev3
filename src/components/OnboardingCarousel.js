import React, { useState } from 'react';

const slides = [
  {
    title: "👶🏽 Decode Their Blueprint",
    description: "Your child's birth card reveals their unique personality, challenges, and strengths. Let's uncover it—no guesswork, no judgment."
  },
  {
    title: "🌱 Forecast Growth",
    description: "Every year brings new lessons. Discover what your child's current age and card say about their emotional growth and potential."
  },
  {
    title: "🧠 Personalized Parenting Support",
    description: "Get aligned guidance and real talk—like a coach and an oracle rolled into one—based on your child's current energetic cycle."
  }
];

const OnboardingCarousel = ({ onComplete }) => {
  const [step, setStep] = useState(0);

  const nextSlide = () => {
    if (step < slides.length - 1) {
      setStep(step + 1);
    } else {
      localStorage.setItem('dyk-onboarded', 'true');
      onComplete();
    }
  };

  return (
    <div className="onboarding-overlay">
      <div className="onboarding-carousel">
        <div className="carousel-header">
          <button className="skip-btn" onClick={() => {
            localStorage.setItem('dyk-onboarded', 'true');
            onComplete();
          }}>
            Skip
          </button>
        </div>
        <div className="carousel-content">
          <h2 className="carousel-title">{slides[step].title}</h2>
          <p className="carousel-description">{slides[step].description}</p>
          <button
            onClick={nextSlide}
            className="carousel-next-btn"
          >
            {step === slides.length - 1 ? 'Let\'s Go!' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingCarousel;
