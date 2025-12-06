import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <div className="relative overflow-hidden bg-white">
      {/* Main content */}
      <div className="relative flex flex-col items-center justify-center text-center pt-10 pb-20 px-4 sm:px-6 lg:px-8 min-h-[60vh]">
        <div className="mb-6">
          <span className="inline-block bg-indigo-100 text-indigo-800 text-sm font-semibold uppercase tracking-wide px-3 py-1 rounded-full">
            Transform Your Career Today
          </span>
        </div>  
        
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight text-gray-900 max-w-3xl mb-6">
          Learn with <span className="text-indigo-600">Expert Mentors</span>
        </h1>
        
        <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mb-10 leading-relaxed">
          Master new skills with personalized guidance and hands-on projects that accelerate your career growth
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Link 
            to="/courses" 
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-base sm:text-lg py-3 px-8 rounded-lg shadow-md transform transition-all duration-300 hover:scale-105"
          >
            Explore Courses
          </Link>
          
          <Link 
            to="/register" 
            className="bg-white text-indigo-600 font-semibold text-base sm:text-lg py-3 px-8 rounded-lg shadow-md border border-indigo-600 transform transition-all duration-300 hover:scale-105"
          >
            Start Free Trial
          </Link>
        </div>
        
        <div className="mt-12 flex flex-wrap justify-center gap-8">
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-gray-900">10K+</div>
            <div className="text-gray-600">Students</div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-gray-900">200+</div>
            <div className="text-gray-600">Courses</div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-gray-900">98%</div>
            <div className="text-gray-600">Success Rate</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;