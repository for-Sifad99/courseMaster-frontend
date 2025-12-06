import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCourses, createCourse, updateCourse, deleteCourse, getEnrolledStudents, getSubmittedAssignments, getSubmittedQuizzes, getCourseBatches } from '../utils/api';
const AdminDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    instructor: { id: '', name: '' },
    price: '',
    category: '',
    duration: '',
    level: '',
    thumbnail: '',
    videoUrl: '',
    batches: [{
      name: '',
      startDate: '',
      endDate: '',
      maxStudents: ''
    }]
  });
  const [enrolledStudents, setEnrolledStudents] = useState({});
  const [showEnrolledStudents, setShowEnrolledStudents] = useState(null);
  const [submittedAssignments, setSubmittedAssignments] = useState({});
  const [showAssignments, setShowAssignments] = useState(null);
  const [submittedQuizzes, setSubmittedQuizzes] = useState({});
  const [showQuizzes, setShowQuizzes] = useState(null);
  const [courseBatches, setCourseBatches] = useState({});
  const [showBatches, setShowBatches] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await getCourses();
      setCourses(response.data.courses);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('instructor.')) {
      const instructorField = name.split('.')[1];
      setFormData({
        ...formData,
        instructor: {
          ...formData.instructor,
          [instructorField]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Process batches to convert maxStudents to number and remove empty batches
      const processedBatches = (formData.batches || [])
        .filter(batch => batch.name.trim() !== '' && batch.startDate.trim() !== '')
        .map(batch => ({
          // Remove _id field if it exists and convert dates properly
          name: batch.name,
          startDate: batch.startDate ? new Date(batch.startDate).toISOString() : undefined,
          endDate: batch.endDate ? new Date(batch.endDate).toISOString() : undefined,
          maxStudents: batch.maxStudents ? parseInt(batch.maxStudents) : undefined
        }));

      const courseData = {
        ...formData,
        price: parseFloat(formData.price),
        batches: processedBatches,
        instructor: {
          id: formData.instructor.id || '64f8a2b3c5d9e7a1b2c3d4e5', // Default admin ID
          name: formData.instructor.name || 'Admin Instructor'
        }
      };

      // Log the data being sent for debugging
      console.log('Sending course data:', courseData);
      console.log('Processed batches:', processedBatches);

      if (editingCourse) {
        await updateCourse(editingCourse._id, courseData);
      } else {
        await createCourse(courseData);
      }

      // Reset form
      setFormData({
        title: '',
        description: '',
        instructor: { 
          id: '64f8a2b3c5d9e7a1b2c3d4e5', // Default admin ID
          name: 'Admin Instructor' 
        },
        price: '',
        category: '',
        duration: '',
        level: '',
        thumbnail: '',
        videoUrl: '',
        batches: [{
          name: '',
          startDate: '',
          endDate: '',
          maxStudents: ''
        }]
      });
      setEditingCourse(null);
      setShowCreateForm(false);
      fetchCourses();
    } catch (error) {
      console.error('Error saving course:', error);
      // Display more detailed error information
      if (error.response && error.response.data && error.response.data.message) {
        console.error('Backend error message:', error.response.data.message);
        alert(`Error saving course: ${error.response.data.message}`);
      } else {
        alert('Error saving course. Please check the console for details.');
      }
    }
  };

  const handleEdit = (course) => {
    console.log('Editing course:', course); // Log the course being edited
    setEditingCourse(course);
    setFormData({
      title: course.title,
      description: course.description,
      instructor: {
        id: course.instructor?.id || '64f8a2b3c5d9e7a1b2c3d4e5', // Default admin ID
        name: course.instructor?.name || 'Admin Instructor'
      },
      price: course.price,
      category: course.category,
      duration: course.duration || '',
      level: course.level || '',
      thumbnail: course.thumbnail || '',
      videoUrl: course.videoUrl || '',
      batches: course.batches && course.batches.length > 0 ? course.batches.map(batch => ({
        // Remove _id field if it exists
        name: batch.name || '',
        startDate: batch.startDate ? new Date(batch.startDate).toISOString().split('T')[0] : '',
        endDate: batch.endDate ? new Date(batch.endDate).toISOString().split('T')[0] : '',
        maxStudents: batch.maxStudents || ''
      })) : [{
        name: '',
        startDate: '',
        endDate: '',
        maxStudents: ''
      }]
    });
    setShowCreateForm(true);
  };

  const handleDelete = async (courseId) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await deleteCourse(courseId);
        fetchCourses();
      } catch (error) {
        console.error('Error deleting course:', error);
      }
    }
  };

  const handleViewEnrolledStudents = async (courseId) => {
    try {
      const response = await getEnrolledStudents(courseId);
      setEnrolledStudents({ ...enrolledStudents, [courseId]: response.data });
      setShowEnrolledStudents(courseId);
    } catch (error) {
      console.error('Error fetching enrolled students:', error);
    }
  };

  const handleCloseEnrolledStudents = () => {
    setShowEnrolledStudents(null);
  };

  const handleViewAssignments = async (courseId) => {
    try {
      const response = await getSubmittedAssignments(courseId);
      setSubmittedAssignments({ ...submittedAssignments, [courseId]: response.data });
      setShowAssignments(courseId);
    } catch (error) {
      console.error('Error fetching submitted assignments:', error);
    }
  };

  const handleCloseAssignments = () => {
    setShowAssignments(null);
  };

  const handleViewQuizzes = async (courseId) => {
    try {
      const response = await getSubmittedQuizzes(courseId);
      setSubmittedQuizzes({ ...submittedQuizzes, [courseId]: response.data });
      setShowQuizzes(courseId);
    } catch (error) {
      console.error('Error fetching submitted quizzes:', error);
    }
  };

  const handleCloseQuizzes = () => {
    setShowQuizzes(null);
  };

  const handleViewBatches = async (courseId) => {
    try {
      const response = await getCourseBatches(courseId);
      setCourseBatches({ ...courseBatches, [courseId]: response.data });
      setShowBatches(courseId);
    } catch (error) {
      console.error('Error fetching course batches:', error);
    }
  };

  const handleCloseBatches = () => {
    setShowBatches(null);
  };

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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <button
          onClick={() => {
            setEditingCourse(null);
            setFormData({
              title: '',
              description: '',
              instructor: { 
                id: '64f8a2b3c5d9e7a1b2c3d4e5', // Default admin ID
                name: 'Admin Instructor' 
              },
              price: '',
              category: '',
              duration: '',
              level: '',
              thumbnail: '',
              videoUrl: '',
              batches: [{
                name: '',
                startDate: '',
                endDate: '',
                maxStudents: ''
              }]
            });
            setShowCreateForm(!showCreateForm);
          }}
          className="bg-indigo-600 text-white py-2 px-6 rounded hover:bg-indigo-700 transition duration-300"
        >
          {showCreateForm ? 'Cancel' : 'Create New Course'}
        </button>
      </div>

      {/* Create/Edit Course Form */}
      {showCreateForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6">
            {editingCourse ? 'Edit Course' : 'Create New Course'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
                  Category
                </label>
                <input
                  type="text"
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  rows="3"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">
                  Price ($)
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="level">
                  Level
                </label>
                <select
                  id="level"
                  name="level"
                  value={formData.level}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option value="">Select Level</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="duration">
                  Duration
                </label>
                <input
                  type="text"
                  id="duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="e.g., 40 hours"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="instructor.name">
                  Instructor Name
                </label>
                <input
                  type="text"
                  id="instructor.name"
                  name="instructor.name"
                  value={formData.instructor.name}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="thumbnail">
                  Thumbnail URL
                </label>
                <input
                  type="text"
                  id="thumbnail"
                  name="thumbnail"
                  value={formData.thumbnail}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="videoUrl">
                  Video URL
                </label>
                <input
                  type="text"
                  id="videoUrl"
                  name="videoUrl"
                  value={formData.videoUrl}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              
              {/* Batches Section */}
              <div className="md:col-span-2">
                <h3 className="text-lg font-bold mb-4">Batches</h3>
                {(formData.batches || []).map((batch, index) => (
                  <div key={index} className="border rounded p-4 mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                          Batch Name
                        </label>
                        <input
                          type="text"
                          value={batch.name}
                          onChange={(e) => {
                            const newBatches = [...(formData.batches || [])];
                            newBatches[index].name = e.target.value;
                            setFormData({ ...formData, batches: newBatches });
                          }}
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          placeholder="e.g., Batch 1"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                          Start Date
                        </label>
                        <input
                          type="date"
                          value={batch.startDate}
                          onChange={(e) => {
                            const newBatches = [...(formData.batches || [])];
                            newBatches[index].startDate = e.target.value;
                            setFormData({ ...formData, batches: newBatches });
                          }}
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                          End Date
                        </label>
                        <input
                          type="date"
                          value={batch.endDate}
                          onChange={(e) => {
                            const newBatches = [...(formData.batches || [])];
                            newBatches[index].endDate = e.target.value;
                            setFormData({ ...formData, batches: newBatches });
                          }}
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                          Max Students
                        </label>
                        <input
                          type="number"
                          value={batch.maxStudents}
                          onChange={(e) => {
                            const newBatches = [...(formData.batches || [])];
                            newBatches[index].maxStudents = e.target.value;
                            setFormData({ ...formData, batches: newBatches });
                          }}
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    setFormData({
                      ...formData,
                      batches: [...(formData.batches || []), { name: '', startDate: '', endDate: '', maxStudents: '' }]
                    });
                  }}
                  className="bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300"
                >
                  Add Another Batch
                </button>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-indigo-600 text-white py-2 px-6 rounded hover:bg-indigo-700 transition duration-300"
              >
                {editingCourse ? 'Update Course' : 'Create Course'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Courses List */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Manage Courses</h2>
        {courses.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600 mb-4">No courses available.</p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-indigo-600 text-white py-2 px-6 rounded hover:bg-indigo-700 transition duration-300"
            >
              Create Your First Course
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {courses.map((course) => (
              <div key={course._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold">{course.title}</h3>
                      <p className="text-gray-600">{course.category}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(course)}
                        className="bg-yellow-500 text-white py-1 px-3 rounded hover:bg-yellow-600 transition duration-300 text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleViewBatches(course._id)}
                        className="bg-indigo-500 text-white py-1 px-3 rounded hover:bg-indigo-600 transition duration-300 text-sm"
                      >
                        View Batches
                      </button>
                      <button
                        onClick={() => handleViewEnrolledStudents(course._id)}
                        className="bg-green-500 text-white py-1 px-3 rounded hover:bg-green-600 transition duration-300 text-sm"
                      >
                        View Students
                      </button>
                      <button
                        onClick={() => handleViewAssignments(course._id)}
                        className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 transition duration-300 text-sm"
                      >
                        Assignment Review
                      </button>
                      <button
                        onClick={() => handleViewQuizzes(course._id)}
                        className="bg-purple-500 text-white py-1 px-3 rounded hover:bg-purple-600 transition duration-300 text-sm"
                      >
                        Quiz Review
                      </button>
                      <button
                        onClick={() => handleDelete(course._id)}
                        className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 transition duration-300 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">{course.description}</p>
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-4">
                      <span className="bg-indigo-100 text-indigo-800 text-sm font-semibold px-2.5 py-0.5 rounded">
                        ${course.price}
                      </span>
                      <span className="bg-gray-100 text-gray-800 text-sm font-semibold px-2.5 py-0.5 rounded">
                        {course.level}
                      </span>
                      <span className="bg-gray-100 text-gray-800 text-sm font-semibold px-2.5 py-0.5 rounded">
                        {course.duration || 'N/A'}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500">
                      {course.students || 0} students enrolled
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Enrolled Students Modal */}
      {showEnrolledStudents && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Enrolled Students</h3>
                <button
                  onClick={handleCloseEnrolledStudents}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Enrollment Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {enrolledStudents[showEnrolledStudents]?.map((student) => (
                      <tr key={student.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{student.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{student.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{student.enrollmentDate}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {!enrolledStudents[showEnrolledStudents] || enrolledStudents[showEnrolledStudents]?.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-gray-500">No students enrolled in this course yet.</p>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Submitted Assignments Modal */}
      {showAssignments && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-96 overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Submitted Assignments</h3>
                <button
                  onClick={handleCloseAssignments}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Student
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Submission Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Answer
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {submittedAssignments[showAssignments]?.map((assignment) => (
                      <tr key={assignment.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{assignment.userName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{assignment.userEmail}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{new Date(assignment.submittedAt).toLocaleDateString()}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-500">{assignment.answer}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {!submittedAssignments[showAssignments] || submittedAssignments[showAssignments]?.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-gray-500">No assignments submitted for this course yet.</p>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Submitted Quizzes Modal */}
      {showQuizzes && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-96 overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Submitted Quizzes</h3>
                <button
                  onClick={handleCloseQuizzes}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Student
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Submission Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Score
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {submittedQuizzes[showQuizzes]?.map((quiz) => (
                      <tr key={quiz.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{quiz.userName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{quiz.userEmail}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{new Date(quiz.submittedAt).toLocaleDateString()}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{quiz.score}%</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {!submittedQuizzes[showQuizzes] || submittedQuizzes[showQuizzes]?.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-gray-500">No quizzes submitted for this course yet.</p>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Course Batches Modal */}
      {showBatches && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-96 overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Course Batches</h3>
                <button
                  onClick={handleCloseBatches}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Batch Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Start Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        End Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Max Students
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Enrolled Students
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {courseBatches[showBatches]?.map((batch, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{batch.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{new Date(batch.startDate).toLocaleDateString()}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{batch.endDate ? new Date(batch.endDate).toLocaleDateString() : 'N/A'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{batch.maxStudents || 'Unlimited'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{batch.enrolledStudents || 0}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {!courseBatches[showBatches] || courseBatches[showBatches]?.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-gray-500">No batches defined for this course yet.</p>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;