import React, { useState, useEffect } from 'react';
import { level1Ques, level2Ques, level3Ques, level4Ques, level5Ques } from '../data/quesData'; // Import question data

const TeamBlock = ({ team, index, handleDifficultyChange, handleToggleMemberStatus }) => {
  const [showModal, setShowModal] = useState(false); // Control modal visibility
  const [selectedQuestion, setSelectedQuestion] = useState(null); // Track the selected question
  const [timeLeft, setTimeLeft] = useState(null); // Timer state
  const [showAnswer, setShowAnswer] = useState(false); // Show answer after timer ends
  const [isTimerStarted, setIsTimerStarted] = useState(false); // Track if timer has started

  // Initialize questions from localStorage or default to an empty object
  const getQuestionsFromLocalStorage = () => {
    const storedQuestions = localStorage.getItem(`level${team.difficulty_level}Ques`);
    return storedQuestions ? JSON.parse(storedQuestions) : [];
  };

  const [questionsArray, setQuestionsArray] = useState(getQuestionsFromLocalStorage());

  // Select a random question based on team's current difficulty level
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

    const availableQuestions = questionsToSelectFrom.filter(q => !questionsArray.includes(q));

    if (availableQuestions.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableQuestions.length);
      setSelectedQuestion(availableQuestions[randomIndex]);
      setShowModal(true);
      setTimeLeft(null); // Reset timer
      setShowAnswer(false); // Hide answer initially
      setIsTimerStarted(false); // Timer has not started yet
    } else {
      alert('No more questions available for this level.');
    }
  };

  // Start the timer
  const handleStartTimer = () => {
    setIsTimerStarted(true);
    setTimeLeft(20); // Set timer to 20 seconds

    // Remove the selected question from the available questions
    const updatedQuestionsArray = [...questionsArray, selectedQuestion];
    setQuestionsArray(updatedQuestionsArray);

    // Store the updated questions in localStorage
    localStorage.setItem(`level${team.difficulty_level}Ques`, JSON.stringify(updatedQuestionsArray));
  };

  // End the timer and show the answer immediately
  const handleEndTimer = () => {
    setIsTimerStarted(false);
    setTimeLeft(0); // Reset timer to 0
    setShowAnswer(true); // Show the answer immediately
  };

  // Timer logic
  useEffect(() => {
    if (isTimerStarted && timeLeft === 0) {
      setShowAnswer(true); // Show answer when the timer ends
    }

    if (isTimerStarted && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, isTimerStarted]);

  return (
    <div className="p-4 border rounded-lg shadow-md mb-4" key={index}>
      <h3 className="text-lg font-bold">{team.name}</h3>
      <p className='font-bold'>Current level: {team.difficulty_level}</p>

      <div className='font-bold'>
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

      <div className="flex w-full justify-center">
        <button
          className="mt-4 px-4 py-2 bg-yellow-500 text-white rounded"
          onClick={handleSelectQuestion}
        >
          Get Question
        </button>
      </div>

      {/* Modal for showing the question and timer */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-95 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-5xl w-full relative text-center">
            {selectedQuestion && (
              <>
                {/* Large question text */}
                <h3 className="text-4xl font-bold mb-8">Question:</h3>
                <p className="text-[50px] mb-12">{selectedQuestion.question}</p>

                {/* Show Start Timer button initially */}
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

                {/* Timer display */}
                {isTimerStarted && (
                  <div className="text-center mt-6">
                    <p className="text-6xl font-bold">Time Left: {timeLeft} seconds</p>
                  </div>
                )}

                {/* Display answer when the timer ends */}
                {showAnswer && (
                  <div className="mt-12">
                    <h4 className="text-3xl font-bold">Answer:</h4>
                    <p className="text-2xl mt-4">{selectedQuestion.answer}</p>
                  </div>
                )}

                {/* End Timer Button */}
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

                {/* Close button */}
                <button
                  className="absolute top-4 right-4 px-6 py-3 bg-red-500 text-white rounded text-lg"
                  onClick={() => setShowModal(false)}
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
