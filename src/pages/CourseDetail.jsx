import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getCourseById, enrollInCourse } from '../utils/api';

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enrolling, setEnrolling] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState(''); // State for selected batch

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const response = await getCourseById(id);
        setCourse(response.data);
        
        // Check if the course is enrolled from the backend response
        const backendEnrolled = response.data.isEnrolled || false;
        
        // Check if we have a local record of enrollment
        const localEnrolledCourses = JSON.parse(localStorage.getItem('enrolledCourses') || '{}');
        const locallyEnrolled = !!localEnrolledCourses[id];
        
        // If either the backend or local storage says we're enrolled, set to true
        setIsEnrolled(backendEnrolled || locallyEnrolled);
      } catch (err) {
        setError('Failed to fetch course details');
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  const handleEnroll = async () => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    setEnrolling(true);
    try {
      // Pass the selected batch ID to the enroll function
      await enrollInCourse(id, selectedBatch || undefined);
      
      // Refresh the course data to get updated batch counts
      const response = await getCourseById(id);
      setCourse(response.data);
      
      // Check if the course is enrolled from the backend response
      const backendEnrolled = response.data.isEnrolled || false;
      
      // Update the enrollment status
      setIsEnrolled(backendEnrolled);
      
      // Store enrollment status in localStorage as a fallback
      const localEnrolledCourses = JSON.parse(localStorage.getItem('enrolledCourses') || '{}');
      localEnrolledCourses[id] = true;
      localStorage.setItem('enrolledCourses', JSON.stringify(localEnrolledCourses));
      
      alert('Successfully enrolled in the course!');
    } catch (err) {
      alert('Failed to enroll in the course. You might already be enrolled.');
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p>Loading course details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p>Course not found</p>
        </div>
      </div>
    );
  }

  const isLoggedIn = !!localStorage.getItem('token');

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Course Header */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="h-64 overflow-hidden">
          <img 
            src={course.thumbnail} 
            alt={course.title} 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-6">
          <div className="flex flex-wrap justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
              <p className="text-gray-600 mb-4">{course.description}</p>
              <div className="flex flex-wrap items-center mb-4">
                <div className="flex items-center mr-6">
                  <span className="text-yellow-500 mr-1">★</span>
                  <span className="font-semibold">{course.rating}</span>
                  <span className="text-gray-400 ml-1">({course.students} students)</span>
                </div>
                <div className="mr-6">
                  <span className="text-gray-600">{course.duration}</span>
                </div>
                <div>
                  <span className="bg-indigo-100 text-indigo-800 text-sm font-medium px-2.5 py-0.5 rounded">
                    {course.level}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-indigo-600 mb-4">${course.price}</div>
              {isEnrolled ? (
                <Link
                  to={`/courses/${id}/play`}
                  className="px-6 py-3 rounded-md font-semibold bg-green-600 text-white hover:bg-green-700"
                >
                  Continue Learning
                </Link>
              ) : (
                <div>
                  {/* Batch Selection */}
                  {course.batches && course.batches.length > 0 && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Select Batch
                      </label>
                      <select
                        value={selectedBatch}
                        onChange={(e) => setSelectedBatch(e.target.value)}
                        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                      >
                        <option value="">Select a batch (optional)</option>
                        {course.batches.map((batch, index) => (
                          <option key={index} value={batch._id.toString()}>
                            {batch.name} ({new Date(batch.startDate).toLocaleDateString()} - {batch.endDate ? new Date(batch.endDate).toLocaleDateString() : 'Ongoing'}) - {batch.enrolledStudents || 0}/{batch.maxStudents || '∞'} students
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  <button
                    onClick={handleEnroll}
                    disabled={enrolling}
                    className={`px-6 py-3 rounded-md font-semibold ${
                      enrolling
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                    }`}
                  >
                    {enrolling ? 'Enrolling...' : isLoggedIn ? 'Enroll Now' : 'Login to Enroll'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Course Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Instructor */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">Instructor</h2>
            <div className="flex items-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mr-4">
                <span className="text-gray-500">IMG</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold">{course.instructor.name}</h3>
                <p className="text-gray-600">Senior Software Engineer</p>
              </div>
            </div>
          </div>

          {/* What You'll Learn */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">What You'll Learn</h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {course.prerequisites && course.prerequisites.map((prereq, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>{prereq}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Course Content */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4">Course Content</h2>
            <div className="space-y-4">
              {course.lectures && course.lectures.map((lecture, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold">{lecture.title}</h3>
                    <span className="text-gray-500 text-sm">{lecture.duration}</span>
                  </div>
                  <p className="text-gray-600 mt-2">{lecture.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div>
          {/* Course Info */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">Course Information</h2>
            <div className="space-y-3">
              <div>
                <span className="font-semibold">Category:</span>
                <span className="ml-2">{course.category}</span>
              </div>
              <div>
                <span className="font-semibold">Language:</span>
                <span className="ml-2">{course.language || 'English'}</span>
              </div>
              <div>
                <span className="font-semibold">Certificate:</span>
                <span className="ml-2">{course.certificate ? 'Yes' : 'No'}</span>
              </div>
            </div>
          </div>

          {/* Batches Info */}
          {course.batches && course.batches.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Available Batches</h2>
              <div className="space-y-4">
                {course.batches.map((batch, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold">{batch.name}</h3>
                    <div className="mt-2 text-sm text-gray-600">
                      <div>Start Date: {new Date(batch.startDate).toLocaleDateString()}</div>
                      {batch.endDate && (
                        <div>End Date: {new Date(batch.endDate).toLocaleDateString()}</div>
                      )}
                      <div>
                        Students: {batch.enrolledStudents || 0}
                        {batch.maxStudents && ` / ${batch.maxStudents}`}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;