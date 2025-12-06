import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getEnrolledCourses } from '../utils/api';

const StudentDashboard = () => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    enrolledCourses: 0,
    hoursLearned: 0,
    certificates: 0
  });

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        const response = await getEnrolledCourses();
        setEnrolledCourses(response.data);
        
        // Calculate stats
        const courseCount = response.data.length;
        const totalProgress = response.data.reduce((sum, course) => sum + (course.progress || 0), 0);
        const avgProgress = courseCount > 0 ? totalProgress / courseCount : 0;
        const estimatedHours = Math.round(avgProgress * courseCount * 0.5); // Rough estimate
        const completedCourses = response.data.filter(course => course.progress === 100).length;
        
        setStats({
          enrolledCourses: courseCount,
          hoursLearned: estimatedHours,
          certificates: completedCourses
        });
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching enrolled courses:', error);
        setLoading(false);
      }
    };

    fetchEnrolledCourses();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Student Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-500 mb-2">Enrolled Courses</h3>
          <p className="text-3xl font-bold">{stats.enrolledCourses}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-500 mb-2">Hours Learned</h3>
          <p className="text-3xl font-bold">{stats.hoursLearned}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-500 mb-2">Certificates</h3>
          <p className="text-3xl font-bold">{stats.certificates}</p>
        </div>
      </div>
      
      {/* Continue Learning */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6">Continue Learning</h2>
        
        {enrolledCourses.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600 mb-4">You haven't enrolled in any courses yet.</p>
            <Link 
              to="/courses" 
              className="bg-indigo-600 text-white py-2 px-6 rounded hover:bg-indigo-700 transition duration-300"
            >
              Browse Courses
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {enrolledCourses.map((course) => (
              <div key={course._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={course.thumbnail} 
                    alt={course.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold">{course.title}</h3>
                    <span className="bg-indigo-100 text-indigo-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                      {course.category}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4 line-clamp-2">{course.description}</p>
                  
                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Progress</span>
                      <span className="text-sm font-medium">{course.progress || 0}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-indigo-600 h-2 rounded-full" 
                        style={{ width: `${course.progress || 0}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <Link 
                    to={`/courses/${course._id}/play`} 
                    className="block w-full text-center bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition duration-300"
                  >
                    Continue Learning
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;