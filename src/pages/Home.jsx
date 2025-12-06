import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCourses } from '../utils/api';
import HeroSection from '../components/Hero';

const Home = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        // Fetch courses sorted by rating in descending order
        const response = await getCourses({ 
          limit: 3,
          sortBy: 'rating',
          sortOrder: 'desc'
        });
        setCourses(response.data.courses);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching courses:', error);
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <HeroSection />

      {/* Featured Courses */}
      <section className="mb-20 md:mb-36">
        <h2 className="text-3xl font-bold mb-8 text-center">Featured Courses</h2>
        
        {courses.length === 0 ? (
          <p className="text-center text-gray-600">No courses available at the moment.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {courses.map((course) => (
              <div key={course._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={course.thumbnail} 
                    alt={course.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{course.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{course.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-indigo-600 font-semibold">${course.price}</span>
                    <Link 
                      to={`/courses/${course._id}`} 
                      className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition duration-300"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Crazy CTA Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 md:p-12 text-center mb-12 relative overflow-hidden">
        {/* Animated elements */}
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-white opacity-10 rounded-full"></div>
        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-white opacity-10 rounded-full"></div>
        
        <div className="relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Transform Your Future?</h2>
          <p className="text-indigo-100 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of students who have accelerated their careers with our expert-led courses
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              to="/register" 
              className="bg-white text-indigo-600 font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-lg"
            >
              Start Learning Free
            </Link>
            <Link 
              to="/courses" 
              className="bg-transparent border-2 border-white text-white font-bold py-4 px-8 rounded-full hover:bg-white hover:text-indigo-600 transition-all duration-300 text-lg"
            >
              Explore Courses
            </Link>
          </div>
          
          <div className="mt-8 flex flex-wrap justify-center gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">⚡ 24/7</div>
              <div className="text-indigo-200">Access</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">🏆 99%</div>
              <div className="text-indigo-200">Satisfaction</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">💰 30-Day</div>
              <div className="text-indigo-200">Guarantee</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;