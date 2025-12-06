import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getCourses } from '../utils/api';

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'createdAt');
  const [sortOrder, setSortOrder] = useState(searchParams.get('sortOrder') || 'desc');
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page')) || 1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const params = {
          page: currentPage,
          limit: 6,
          search: searchTerm,
          category: category,
          sortBy: sortBy,
          sortOrder: sortOrder
        };
        
        const response = await getCourses(params);
        setCourses(response.data.courses);
        setTotalPages(response.data.totalPages);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching courses:', error);
        setLoading(false);
      }
    };

    fetchCourses();
    
    // Update URL params
    const params = {};
    if (searchTerm) params.search = searchTerm;
    if (category) params.category = category;
    if (sortBy) params.sortBy = sortBy;
    if (sortOrder) params.sortOrder = sortOrder;
    if (currentPage > 1) params.page = currentPage.toString();
    
    setSearchParams(params);
  }, [searchTerm, category, sortBy, sortOrder, currentPage, setSearchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handleReset = () => {
    setSearchTerm('');
    setCategory('');
    setSortBy('createdAt');
    setSortOrder('desc');
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p>Loading courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">All Courses</h1>
      
      {/* Search and Filter Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <input
              type="text"
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search courses..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Categories</option>
              <option value="Web Development">Web Development</option>
              <option value="Data Science">Data Science</option>
              <option value="Mobile Development">Mobile Development</option>
              <option value="Design">Design</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 mb-1">
              Sort By
            </label>
            <select
              id="sortBy"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="createdAt">Date Added</option>
              <option value="title">Title</option>
              <option value="price">Price</option>
              <option value="rating">Rating</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="sortOrder" className="block text-sm font-medium text-gray-700 mb-1">
              Order
            </label>
            <select
              id="sortOrder"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>
        </form>
        
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleReset}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
          >
            Reset Filters
          </button>
          <button
            type="submit"
            onClick={handleSearch}
            className="ml-2 px-4 py-2 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700"
          >
            Apply Filters
          </button>
        </div>
      </div>
      
      {/* Courses Grid */}
      {courses.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">No courses found matching your criteria.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
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
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center">
                      <span className="text-yellow-500 mr-1">★</span>
                      <span>{course.rating}</span>
                      <span className="text-gray-400 ml-1">({course.students} students)</span>
                    </div>
                    <span className="text-indigo-600 font-semibold">${course.price}</span>
                  </div>
                  <Link 
                    to={`/courses/${course._id}`} 
                    className="block w-full text-center bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition duration-300"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <nav className="inline-flex rounded-md shadow">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 text-sm font-medium rounded-l-md ${
                    currentPage === 1 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Previous
                </button>
                
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-4 py-2 text-sm font-medium ${
                      currentPage === i + 1
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 text-sm font-medium rounded-r-md ${
                    currentPage === totalPages 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Next
                </button>
              </nav>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CourseList;