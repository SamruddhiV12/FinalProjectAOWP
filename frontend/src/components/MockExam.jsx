import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function MockExam({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setExam({
      id: 1,
      title: 'Madhyamaa Pratham Theory Exam',
      duration: 30,
      totalMarks: 50,
      questions: [
        {
          id: 1,
          type: 'mcq',
          question: 'Who is considered the author of Natyashastra?',
          options: ['Bharata Muni', 'Nandikeswara', 'Abhinava Gupta', 'Sharangadeva'],
          correctAnswer: 0
        },
        {
          id: 2,
          type: 'mcq',
          question: 'How many Adavus are there in Bharatanatyam?',
          options: ['6', '8', '10', '12'],
          correctAnswer: 1
        },
        {
          id: 3,
          type: 'mcq',
          question: 'What does "Tandava" represent?',
          options: [
            'Feminine, graceful dance',
            'Masculine, vigorous dance',
            'Devotional expression',
            'Pure dance without meaning'
          ],
          correctAnswer: 1
        },
        {
          id: 4,
          type: 'text',
          question: 'Name the nine Rasas (emotions) in Bharatanatyam and briefly explain any two.',
          marks: 10
        },
        {
          id: 5,
          type: 'text',
          question: 'Explain the structure of Margam in a traditional Bharatanatyam performance.',
          marks: 15
        }
      ]
    });
  }, [id]);

  // Timer
  useEffect(() => {
    if (!submitted && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      handleSubmit();
    }
  }, [timeLeft, submitted]);

  const handleMCQAnswer = (questionId, optionIndex) => {
    setAnswers({
      ...answers,
      [questionId]: optionIndex
    });
  };

  const handleTextAnswer = (questionId, text) => {
    setAnswers({
      ...answers,
      [questionId]: text
    });
  };

  const handleSubmit = () => {
    setSubmitted(true);
    alert('Exam Submitted! ✅\n\nYour teacher will review and grade your answers soon.');
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!exam) return <div style={{textAlign: 'center', padding: '3rem', color: 'white'}}>Loading exam...</div>;

  if (submitted) {
    return (
      <div className="container">
        <div className="section" style={{textAlign: 'center', padding: '4rem'}}>
          <h1>✅ Exam Submitted Successfully!</h1>
          <p style={{fontSize: '1.2rem', marginTop: '1rem', color: '#666'}}>
            Your answers have been recorded. Teacher Samruddhi will review and provide feedback soon.
          </p>
          <button 
            onClick={() => navigate('/student')}
            className="btn-primary"
            style={{marginTop: '2rem'}}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="section">
        {/* Exam Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
          paddingBottom: '1rem',
          borderBottom: '3px solid #FFD700'
        }}>
          <div>
            <h1>{exam.title}</h1>
            <p style={{color: '#666', marginTop: '0.5rem'}}>
              Total Marks: {exam.totalMarks} | Duration: {exam.duration} minutes
            </p>
          </div>
          <div style={{
            background: timeLeft < 300 ? '#ff4757' : '#8B0000',
            color: 'white',
            padding: '1rem 2rem',
            borderRadius: '12px',
            fontSize: '1.5rem',
            fontWeight: 'bold'
          }}>
            ⏱️ {formatTime(timeLeft)}
          </div>
        </div>

        {/* Questions */}
        <div style={{marginBottom: '2rem'}}>
          {exam.questions.map((q, index) => (
            <div 
              key={q.id}
              style={{
                background: 'linear-gradient(135deg, white 0%, #FFF8E7 100%)',
                padding: '2rem',
                borderRadius: '15px',
                marginBottom: '2rem',
                border: '2px solid #F4E4C1'
              }}
            >
              <h3 style={{color: '#8B0000', marginBottom: '1rem'}}>
                Question {index + 1}: {q.type === 'text' && `(${q.marks} marks)`}
              </h3>
              <p style={{fontSize: '1.1rem', marginBottom: '1.5rem', lineHeight: '1.6'}}>
                {q.question}
              </p>

              {q.type === 'mcq' ? (
                <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                  {q.options.map((option, optionIndex) => (
                    <label 
                      key={optionIndex}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '1rem',
                        background: answers[q.id] === optionIndex ? '#FFD700' : 'white',
                        border: '2px solid ' + (answers[q.id] === optionIndex ? '#8B0000' : '#F4E4C1'),
                        borderRadius: '10px',
                        cursor: 'pointer',
                        transition: 'all 0.3s'
                      }}
                    >
                      <input 
                        type="radio"
                        name={`question-${q.id}`}
                        checked={answers[q.id] === optionIndex}
                        onChange={() => handleMCQAnswer(q.id, optionIndex)}
                        style={{marginRight: '1rem', transform: 'scale(1.3)'}}
                      />
                      <span style={{fontSize: '1.05rem'}}>{option}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <textarea
                  value={answers[q.id] || ''}
                  onChange={(e) => handleTextAnswer(q.id, e.target.value)}
                  placeholder="Write your answer here..."
                  rows="6"
                  style={{
                    width: '100%',
                    padding: '1rem',
                    border: '2px solid #F4E4C1',
                    borderRadius: '10px',
                    fontSize: '1rem',
                    fontFamily: 'Georgia, serif',
                    resize: 'vertical'
                  }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <div style={{textAlign: 'center'}}>
          <button 
            onClick={handleSubmit}
            className="btn-primary btn-large"
          >
            Submit Exam
          </button>
        </div>
      </div>
    </div>
  );
}

export default MockExam;