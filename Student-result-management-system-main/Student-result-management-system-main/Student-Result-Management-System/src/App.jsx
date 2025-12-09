
import React, { useState } from 'react';
import StudentList from './components/StudentList';
import StudentForm from './components/StudentForm';
import StudentDetails from './components/StudentDetails';

import {
  getAllStudents,
  createStudent,
  updateStudent,
  deleteStudent
} from './services/studentService';

function App() {
  
  const [students, setStudents] = useState([]); 
  const [mode, setMode] = useState('list'); 
  const [formMode, setFormMode] = useState('add'); 
  const [selectedStudent, setSelectedStudent] = useState(null);

 
  async function handleLoadStudents() {
    try {
      const data = await getAllStudents();
      setStudents(data);
      setMode('list');
      alert('Students loaded.');
    } catch (err) {
      console.error(err);
      alert('Error loading students: ' + err.message);
    }
  }

  function handleAddClick() {
    setFormMode('add');
    setSelectedStudent(null);
    setMode('form');
  }

  function handleEditClick(student) {
    setFormMode('edit');
    setSelectedStudent(student);
    setMode('form');
  }

  async function handleDeleteClick(student) {
    const ok = window.confirm(`Delete student "${student.name}" (ID ${student.id})?`);
    if (!ok) return;
    try {
      await deleteStudent(student.id);
      alert('Student deleted. Click "Load Students" to refresh the list.');
      
      setMode('list');
    } catch (err) {
      console.error(err);
      alert('Delete failed: ' + err.message);
    }
  }

  function handleViewClick(student) {
    setSelectedStudent(student);
    setMode('details');
  }

  function handleCancelForm() {
    setMode('list');
    setSelectedStudent(null);
  }

  
  async function handleFormSubmit(formData) {
    try {
      if (formMode === 'add') {
        await createStudent(formData);
        alert('Student added successfully. Click "Load Students" to refresh the list.');
      } else {
        // edit
        await updateStudent(formData.id, {
          name: formData.name,
          section: formData.section,
          marks: formData.marks,
          grade: formData.grade
        });
        alert('Student updated successfully. Click "Load Students" to refresh the list.');
      }
      setMode('list'); 
      setSelectedStudent(null);
    } catch (err) {
      console.error(err);
      alert('Save failed: ' + err.message);
    }
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <header style={{ padding: 16, borderBottom: '1px solid #ddd' }}>
        <h1>Student Result Management</h1>
      </header>

      <main>
        {mode === 'list' && (
          <StudentList
            students={students}
            onLoad={handleLoadStudents}
            onAdd={handleAddClick}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
            onView={handleViewClick}
          />
        )}

        {mode === 'form' && (
          <StudentForm
            initialData={formMode === 'edit' ? selectedStudent : null}
            mode={formMode}
            onCancel={handleCancelForm}
            onSubmit={handleFormSubmit}
          />
        )}

        {mode === 'details' && (
          <StudentDetails
            student={selectedStudent}
            onBack={() => setMode('list')}
          />
        )}
      </main>

      <footer style={{ padding: 16, borderTop: '1px solid #ddd', marginTop: 24 }}>
        <small>Note: Data is saved to JSON Server. Use the "Load Students" button to reload from server.</small>
      </footer>
    </div>
  );
}

export default App;
