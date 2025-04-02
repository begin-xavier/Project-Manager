import React, { useState } from 'react';
import { format, addDays, parseISO } from 'date-fns';

interface Subcategory {
  name: string;
  deadline: Date;
}

interface Project {
  name: string;
  deadline: Date;
  subcategories: Subcategory[];
  progress: number; // Progress percentage
}

const App = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [newProject, setNewProject] = useState('');
  const [newSubcategories, setNewSubcategories] = useState('');

  const addProject = () => {
    if (!newProject) return;
    const deadline = addDays(new Date(), 10);
    const subcategories: Subcategory[] = newSubcategories
      ? newSubcategories.split(',').slice(0, 10).map((sub) => ({
          name: sub.trim(),
          deadline: addDays(new Date(), 10),
        }))
      : [];
    setProjects([
      ...projects,
      { name: newProject, deadline, subcategories, progress: 0 }, // Initialize progress to 0
    ]);
    setNewProject('');
    setNewSubcategories('');
  };

  const updateProjectDeadline = (index: number, newDate: string) => {
    const updatedProjects = [...projects];
    updatedProjects[index].deadline = parseISO(newDate);
    setProjects(updatedProjects);
  };

  const updateSubcategoryDeadline = (
    projectIndex: number,
    subIndex: number,
    newDate: string
  ) => {
    const updatedProjects = [...projects];
    updatedProjects[projectIndex].subcategories[subIndex].deadline = parseISO(
      newDate
    );
    setProjects(updatedProjects);
  };

  const deleteProject = (index: number) => {
    const updatedProjects = projects.filter((_, i) => i !== index);
    setProjects(updatedProjects);
  };

  const deleteSubcategory = (projectIndex: number, subIndex: number) => {
    const updatedProjects = [...projects];
    updatedProjects[projectIndex].subcategories.splice(subIndex, 1);
    setProjects(updatedProjects);
  };

  // Handle progress bar value change
  const handleProgressChange = (index: number, value: number) => {
    const updatedProjects = [...projects];
    updatedProjects[index].progress = value;
    setProjects(updatedProjects);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto bg-white-500 min-h-screen overflow-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Project Tracker</h1>
      <div className="grid grid-cols-5 gap-8 mb-8 p-8 bg-white shadow-md rounded-lg border border-gray-400">
        <div className="w-full">
          <label className="block text-gray-700 mb-2">Project Name </label>
          <input
            type="text"
            value={newProject}
            onChange={(e) => setNewProject(e.target.value)}
            className="border p-4 rounded w-full h-20 text-lg"
            placeholder="Enter project name"
          />
        </div>

        <div className="w-full">
          <label className="block text-gray-700 mb-2">Subcategories</label>
          <input
            type="text"
            value={newSubcategories}
            onChange={(e) => setNewSubcategories(e.target.value)}
            className="border p-4 rounded w-full h-20 text-lg"
            placeholder="Enter up to 10 subcategories (comma-separated)"
          />
        </div>

        <div className="w-full flex items-end">
          <button
            onClick={addProject}
            className="p-4 bg-blue-600 text-white rounded hover:bg-blue-700 w-full h-14 text-lg"
          >
            Add Project
          </button>
        </div>
      </div>

      <div className="overflow-auto" style={{ maxHeight: '70vh', maxWidth: '100vw' }}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4 border border-gray-300">
          {projects.map((project, projectIndex) => (
            <div
              key={projectIndex}
              className="p-6 bg-white shadow-md rounded-lg border border-gray-500 relative"
            >
              <h2 className="text-xl font-semibold mb-4 border-b pb-2 text-center">
                {project.name}
              </h2>
              <label className="block text-gray-700 mb-2">Project Deadline:</label>
              <input
                type="date"
                value={format(project.deadline, 'yyyy-MM-dd')}
                onChange={(e) => updateProjectDeadline(projectIndex, e.target.value)}
                className="border p-4 rounded w-full h-14 text-lg"
              />

              {/* Progress Bar */}
              <div className="mt-6">
                <label className="block text-gray-700 mb-2">Progress:</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={project.progress}
                  onChange={(e) => handleProgressChange(projectIndex, parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-sm">
                  <span>0%</span>
                  <span>100%</span>
                </div>
                <div className="mt-2 bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-blue-600 h-4 rounded-full"
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
                {/* Progress Percentage Text */}
                <div className="mt-2 text-center text-xl font-semibold">
                  {project.progress}%
                </div>
              </div>

              <h3 className="text-lg font-medium mt-6 border-b pb-2">Subcategories:</h3>
              <div className="grid grid-cols-1 gap-4 border-t border-gray-400 pt-4">
                {project.subcategories.length > 0 ? (
                  project.subcategories.map((sub, subIndex) => (
                    <div key={subIndex} className="p-4 bg-gray-50 border border-gray-500 rounded-lg">
                      <h4 className="font-semibold mb-2 text-center">{sub.name}</h4>
                      <label className="block text-gray-700 text-sm mb-2">Subcategory Deadline:</label>
                      <input
                        type="date"
                        value={format(sub.deadline, 'yyyy-MM-dd')}
                        onChange={(e) =>
                          updateSubcategoryDeadline(projectIndex, subIndex, e.target.value)
                        }
                        className="border p-4 rounded w-full h-14 text-lg"
                      />
                      <button
                        onClick={() => deleteSubcategory(projectIndex, subIndex)}
                        className="mt-2 p-2 bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Delete Subcategory
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center">No subcategories</p>
                )}
              </div>
              <button
                onClick={() => deleteProject(projectIndex)}
                className="mt-4 p-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete Project
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;