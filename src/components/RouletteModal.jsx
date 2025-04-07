import React, { useState, useRef } from 'react';
import { Wheel } from 'react-custom-roulette';

const RouletteModal = ({ setRouletteModal, data }) => {
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [eliminated, setEliminated] = useState(null);

  // Sound refs
  const spinSoundRef = useRef(null);
  const eliminatedSoundRef = useRef(null);

  const handleSpinClick = () => {
    const randomIndex = Math.floor(Math.random() * data.length);
    setPrizeNumber(randomIndex);
    setMustSpin(true);
    setEliminated(null);
    
    if (spinSoundRef.current) {
      spinSoundRef.current.currentTime = 0;
      spinSoundRef.current.play();
    }
  };

  const wheelData = data.map((item, index) => ({
    option: Object.values(item)[0] || `Player ${index + 1}`,
  }));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-xl shadow-2xl max-w-4xl w-full relative flex flex-col items-center">
        
        <h2 className="text-4xl font-bold mb-6 text-center text-gray-800">Elimination Time 😈</h2>

        <Wheel
          mustStartSpinning={mustSpin}
          prizeNumber={prizeNumber}
          data={wheelData}
          backgroundColors={['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0']}
          textColors={['#ffffff']}
          outerBorderColor="#222"
          outerBorderWidth={5}
          spinDuration={0.4}
          numberOfSpins={10} 
          innerBorderColor="#fff"
          radiusLineColor="#dedede"
          radiusLineWidth={2}
          fontSize={34}
          onStopSpinning={() => {
            setMustSpin(false);
            const result = wheelData[prizeNumber].option;
            setEliminated(result);

            if (eliminatedSoundRef.current) {
              eliminatedSoundRef.current.currentTime = 0;
              eliminatedSoundRef.current.play();
            }
          }}
        />

        <button
          className="mt-8 px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg text-xl"
          onClick={handleSpinClick}
          disabled={mustSpin}
        >
          {mustSpin ? 'Spinning...' : '🔥 Spin for Elimination'}
        </button>

        {eliminated && (
          <p className="mt-6 text-2xl text-red-700 font-bold">
            ☠️ Eliminated: {eliminated}!
          </p>
        )}

        <button
          onClick={() => setRouletteModal(false)}
          className="absolute top-4 right-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
        >
          Close
        </button>

        {/* Audio elements */}
        <audio ref={spinSoundRef} src="/sounds/spin.wav" />
        <audio ref={eliminatedSoundRef} src="/sounds/eliminated.wav" />
      </div>
    </div>
  );
};

export default RouletteModal;
