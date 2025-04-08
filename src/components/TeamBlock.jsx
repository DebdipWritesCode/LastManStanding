import React, { useState, useEffect, useRef } from 'react';
import { level1Ques, level2Ques, level3Ques, level4Ques, level5Ques } from '../data/quesData';
import RouletteModal from './RouletteModal';

const TeamBlock = ({ team, index, handleDifficultyChange, handleToggleMemberStatus }) => {
  const [showModal, setShowModal] = useState(false);
  const [rouletteModal, setRouletteModal] = useState(false);
  const [rouletteModalData, setRouletteModalData] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isTimerStarted, setIsTimerStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const timerRef = useRef(null);

  const getQuestionsFromLocalStorage = () => {
    const storedQuestions = localStorage.getItem(`level${team.difficulty_level}Ques`);
    return storedQuestions ? JSON.parse(storedQuestions) : [];
  };

  const [questionsArray, setQuestionsArray] = useState(getQuestionsFromLocalStorage());

  const handleSelectQuestion = () => {
    let questionsToSelectFrom = [];
    switch (team.difficulty_level) {
      case 1:
        questionsToSelectFrom = level1Ques;
        break;
      case 2:
        questionsToSelectFrom = level2Ques;
        break;
      case 3:
        questionsToSelectFrom = level3Ques;
        break;
      case 4:
        questionsToSelectFrom = level4Ques;
        break;
      case 5:
        questionsToSelectFrom = level5Ques;
        break;
      default:
        break;
    }

    const usedQuestionIds = new Set(questionsArray.map(q => q.id));
    const availableQuestions = questionsToSelectFrom.filter(q => !usedQuestionIds.has(q.id));

    if (availableQuestions.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableQuestions.length);
      setSelectedQuestion(availableQuestions[randomIndex]);
      setShowModal(true);
      setTimeLeft(null);
      setShowAnswer(false);
      setIsTimerStarted(false);
    } else {
      alert('No more questions available for this level.');
    }
  };

  const startInterval = () => {
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setShowAnswer(true);
          setIsTimerStarted(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleStartTimer = () => {
    setIsTimerStarted(true);
    setTimeLeft(15);
    setIsPaused(false);
    startInterval();

    const updatedQuestionsArray = [...questionsArray, selectedQuestion];
    setQuestionsArray(updatedQuestionsArray);
    localStorage.setItem(`level${team.difficulty_level}Ques`, JSON.stringify(updatedQuestionsArray));
  };

  const handlePauseTimer = () => {
    setIsPaused(true);
    clearInterval(timerRef.current);
  };

  const handleResumeTimer = () => {
    setIsPaused(false);
    startInterval();
  };

  const handleEndTimer = () => {
    setIsTimerStarted(false);
    clearInterval(timerRef.current);
    setTimeLeft(0);
    setShowAnswer(true);
  };

  const handleRouletteModal = (members) => {
    const filteredMembers = members.filter(member => member.status === 'participating');
    if (filteredMembers.length === 0) {
      alert('No members available for roulette.');
      return;
    }
    setRouletteModalData(filteredMembers);
    setRouletteModal(true);
  };

  useEffect(() => {
    return () => clearInterval(timerRef.current); // Cleanup on unmount
  }, []);

  return (
    <div className="p-4 border rounded-lg shadow-md mb-4" key={index}>
      <h3 className="text-2xl font-bold">{team.name}</h3>
      <p className='font-bold'>Current level: {team.difficulty_level}</p>

      <div className='font-bold text-xl'>
        {team.members.map((member, memberIndex) => (
          <div
            key={memberIndex}
            className={`p-2 ${member.status === 'participating' ? 'bg-green-300' : 'bg-red-300'}`}
            onClick={() => handleToggleMemberStatus(index, memberIndex)}
          >
            <p>{member.name} - {member.status}</p>
          </div>
        ))}
      </div>

      <div className="flex justify-between mt-4">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={() => handleDifficultyChange(index, 'increase')}
        >
          Increase Difficulty
        </button>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={() => handleDifficultyChange(index, 'decrease')}
        >
          Decrease Difficulty
        </button>
      </div>

      <div className="flex w-full justify-around">
        <button
          className="mt-4 px-4 py-2 bg-yellow-500 text-white rounded"
          onClick={handleSelectQuestion}
        >
          Get Question
        </button>
        <button
          className="mt-4 px-4 py-2 bg-yellow-500 text-white rounded"
          onClick={() => handleRouletteModal(team.members)}
        >
          Spin the Wheel
        </button>
      </div>

      {rouletteModal && (
        <RouletteModal setRouletteModal={setRouletteModal} data={rouletteModalData} />
      )}

      {showModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-95 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-5xl w-full relative text-center">
            {selectedQuestion && (
              <>
                <h3 className="text-4xl font-bold mb-8">Question:</h3>
                <p className="text-[50px] mb-12">{selectedQuestion.question}</p>

                {!isTimerStarted && (
                  <div className="flex justify-center">
                    <button
                      className="px-8 py-4 bg-green-500 text-white rounded text-2xl"
                      onClick={handleStartTimer}
                    >
                      Start Timer
                    </button>
                  </div>
                )}

                {isTimerStarted && (
                  <div className="text-center mt-6">
                    <p className="text-6xl font-bold">Time Left: {timeLeft} seconds</p>
                  </div>
                )}

                {isTimerStarted && (
                  <div className="flex justify-center mt-4 space-x-4">
                    <button
                      className={`px-8 py-4 ${isPaused ? 'bg-yellow-500' : 'bg-blue-500'} text-white rounded text-2xl`}
                      onClick={isPaused ? handleResumeTimer : handlePauseTimer}
                    >
                      {isPaused ? 'Resume Timer' : 'Pause Timer'}
                    </button>
                  </div>
                )}

                {showAnswer && (
                  <div className="mt-12">
                    <h4 className="text-3xl font-bold">Answer:</h4>
                    <p className="text-2xl mt-4">{selectedQuestion.answer}</p>
                  </div>
                )}

                {isTimerStarted && (
                  <div className="flex justify-center mt-6">
                    <button
                      className="px-8 py-4 bg-red-500 text-white rounded text-2xl"
                      onClick={handleEndTimer}
                    >
                      End Timer
                    </button>
                  </div>
                )}

                <button
                  className="absolute top-4 right-4 px-6 py-3 bg-red-500 text-white rounded text-lg"
                  onClick={() => {
                    clearInterval(timerRef.current);
                    setShowModal(false);
                  }}
                >
                  Close
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamBlock;