import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCourseById, markLectureCompleted, submitAssignment, submitQuiz } from '../utils/api';

const VideoPlayer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentLecture, setCurrentLecture] = useState(0);
  const [completedLectures, setCompletedLectures] = useState(new Set());
  const [assignmentAnswer, setAssignmentAnswer] = useState('');
  const [quizAnswers, setQuizAnswers] = useState({});
  const [showAssignmentForm, setShowAssignmentForm] = useState(false);
  const [showQuizForm, setShowQuizForm] = useState(false);
  const [submissionMessage, setSubmissionMessage] = useState('');

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await getCourseById(id);
        setCourse(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load course details');
        setLoading(false);
      }
    };

    if (id) {
      fetchCourse();
    }
  }, [id]);

  const handleLectureSelect = (index) => {
    setCurrentLecture(index);
  };

  const handleMarkAsCompleted = async () => {
    try {
      if (!lecture) return;
      
      const lectureId = lecture._id;
      await markLectureCompleted(id, lectureId);
      
      // Update UI to show lecture as completed
      setCompletedLectures(prev => new Set(prev).add(lectureId));
      
      // Show success message
      setSubmissionMessage('Lecture marked as completed!');
      setTimeout(() => setSubmissionMessage(''), 3000);
    } catch (err) {
      console.error('Error marking lecture as completed:', err);
      setSubmissionMessage('Failed to mark lecture as completed');
      setTimeout(() => setSubmissionMessage(''), 3000);
    }
  };

  const handleAssignmentSubmit = async (e) => {
    e.preventDefault();
    try {
      // Use the current lecture ID as the module ID
      const moduleId = lecture?._id || 'default-module';
      await submitAssignment(id, moduleId, { answer: assignmentAnswer });
      
      setSubmissionMessage('Assignment submitted successfully!');
      setShowAssignmentForm(false);
      setAssignmentAnswer('');
      setTimeout(() => setSubmissionMessage(''), 3000);
    } catch (err) {
      console.error('Error submitting assignment:', err);
      setSubmissionMessage('Failed to submit assignment');
      setTimeout(() => setSubmissionMessage(''), 3000);
    }
  };

  const handleQuizSubmit = async (e) => {
    e.preventDefault();
    try {
      // Use the current lecture ID as the module ID
      const moduleId = lecture?._id || 'default-module';
      await submitQuiz(id, moduleId, { answers: quizAnswers });
      
      // In a real app, you would calculate the score based on correct answers
      // For now, we'll just show a mock score
      const score = 100; // Perfect score for demo
      setSubmissionMessage(`Quiz submitted successfully! Your score: ${score}%`);
      setShowQuizForm(false);
      setQuizAnswers({});
      setTimeout(() => setSubmissionMessage(''), 3000);
    } catch (err) {
      console.error('Error submitting quiz:', err);
      setSubmissionMessage('Failed to submit quiz');
      setTimeout(() => setSubmissionMessage(''), 3000);
    }
  };

  const handleQuizOptionChange = (questionIndex, option) => {
    setQuizAnswers(prev => ({
      ...prev,
      [questionIndex]: option
    }));
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p>Loading course content...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-red-500">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p>Course not found</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Get the current lecture
  const lecture = course.lectures && course.lectures[currentLecture];
  const videoUrl = course.videoUrl;
  const isCompleted = lecture && completedLectures.has(lecture._id);

  // Mock quiz questions
  const quizQuestions = [
    {
      question: "What is the primary purpose of a firewall?",
      options: [
        "To speed up internet connection",
        "To block unauthorized access to a network",
        "To improve computer graphics",
        "To compress files"
      ],
      correctAnswer: 1
    },
    {
      question: "Which of the following is a strong password?",
      options: [
        "password123",
        "johnsmith",
        "Tr0ub4dor&3",
        "123456"
      ],
      correctAnswer: 2
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{course.title}</h1>
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700"
        >
          Back to Course
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Video Player */}
        <div className="lg:col-span-3">
          <div className="bg-black rounded-lg overflow-hidden">
            <div className="aspect-video">
              {videoUrl ? (
                <video
                  src={videoUrl}
                  title={course.title}
                  className="w-full h-full"
                  controls
                  autoPlay
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white">
                  <p>No video content available for this course</p>
                </div>
              )}
            </div>
          </div>

          {/* Lecture Info */}
          <div className="mt-4">
            <h2 className="text-2xl font-bold">
              {lecture?.title}
            </h2>
            <p className="text-gray-600 mt-2">
              {lecture?.description}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex space-x-4">
            <button 
              onClick={handleMarkAsCompleted}
              className={`py-2 px-6 rounded ${
                isCompleted 
                  ? 'bg-green-600 text-white cursor-default' 
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
              disabled={isCompleted}
            >
              {isCompleted ? 'Completed' : 'Mark as Completed'}
            </button>
            <button 
              onClick={() => setShowAssignmentForm(!showAssignmentForm)}
              className="bg-gray-200 text-gray-800 py-2 px-6 rounded hover:bg-gray-300"
            >
              Submit Assignment
            </button>
            <button 
              onClick={() => setShowQuizForm(!showQuizForm)}
              className="bg-gray-200 text-gray-800 py-2 px-6 rounded hover:bg-gray-300"
            >
              Take Quiz
            </button>
          </div>

          {/* Assignment Form */}
          {showAssignmentForm && (
            <div className="mt-6 bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold mb-4">Submit Assignment</h3>
              <form onSubmit={handleAssignmentSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="assignment">
                    Assignment Submission
                  </label>
                  <textarea
                    id="assignment"
                    value={assignmentAnswer}
                    onChange={(e) => setAssignmentAnswer(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    rows="4"
                    placeholder="Enter your answer or Google Drive link"
                    required
                  />
                </div>
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setShowAssignmentForm(false)}
                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    Submit Assignment
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Quiz Form */}
          {showQuizForm && (
            <div className="mt-6 bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold mb-4">Take Quiz</h3>
              <form onSubmit={handleQuizSubmit}>
                {quizQuestions.map((question, index) => (
                  <div key={index} className="mb-6">
                    <p className="font-medium mb-2">{index + 1}. {question.question}</p>
                    <div className="ml-4 space-y-2">
                      {question.options.map((option, optionIndex) => (
                        <label key={optionIndex} className="flex items-center">
                          <input
                            type="radio"
                            name={`question-${index}`}
                            value={optionIndex}
                            onChange={() => handleQuizOptionChange(index, optionIndex)}
                            className="mr-2"
                            required={index === 0} // Only require the first question to make form valid
                          />
                          {option}
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setShowQuizForm(false)}
                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    Submit Quiz
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Submission Message */}
          {submissionMessage && (
            <div className="mt-4 p-4 bg-green-100 text-green-700 rounded">
              {submissionMessage}
            </div>
          )}
        </div>

        {/* Lectures List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold mb-4">Course Content</h3>
            <div className="space-y-3">
              {course.lectures && course.lectures.map((lecture, index) => {
                const isLectureCompleted = completedLectures.has(lecture._id);
                return (
                  <div
                    key={index}
                    onClick={() => handleLectureSelect(index)}
                    className={`p-3 rounded cursor-pointer ${
                      currentLecture === index
                        ? 'bg-indigo-100 border-l-4 border-indigo-600'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">{lecture.title}</h4>
                      <span className="text-sm text-gray-500">Lecture {lecture.order}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {lecture.description}
                    </p>
                    {isLectureCompleted && (
                      <span className="inline-block mt-1 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                        Completed
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Assignments & Quizzes */}
          <div className="mt-6 bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold mb-4">Assignments & Quizzes</h3>
            <div className="space-y-3">
              <div 
                onClick={() => setShowAssignmentForm(true)}
                className="p-3 rounded border hover:bg-gray-50 cursor-pointer"
              >
                <h4 className="font-medium">Assignment 1</h4>
                <p className="text-sm text-gray-600 mt-1">Submit your project files</p>
              </div>
              <div 
                onClick={() => setShowQuizForm(true)}
                className="p-3 rounded border hover:bg-gray-50 cursor-pointer"
              >
                <h4 className="font-medium">Quiz 1</h4>
                <p className="text-sm text-gray-600 mt-1">Multiple choice questions</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;