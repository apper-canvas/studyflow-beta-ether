import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Card } from "@/components/atoms/Card";
import { teacherService } from "@/services/api/teacherService";
import ApperIcon from "@/components/ApperIcon";
import SearchBar from "@/components/molecules/SearchBar";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Badge from "@/components/atoms/Badge";
import Select from "@/components/atoms/Select";
import Label from "@/components/atoms/Label";

export default function Teachers() {
  const [teachers, setTeachers] = useState([])
  const [filteredTeachers, setFilteredTeachers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterDepartment, setFilterDepartment] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [editingTeacher, setEditingTeacher] = useState(null)
  const [formData, setFormData] = useState({
    name_c: '',
    email_c: '',
    department_c: ''
  });

  useEffect(() => {
    loadTeachers()
  }, [])

  useEffect(() => {
    filterTeachers()
  }, [teachers, searchQuery, filterDepartment])

  const loadTeachers = async () => {
    try {
      setLoading(true)
      const data = await teacherService.getAll()
      setTeachers(data)
      setError(null)
    } catch (err) {
      setError('Failed to load teachers')
      toast.error('Failed to load teachers')
    } finally {
      setLoading(false)
    }
  }

  const filterTeachers = () => {
    let filtered = teachers

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(teacher =>
        (teacher.name_c && teacher.name_c.toLowerCase().includes(query)) ||
        (teacher.email_c && teacher.email_c.toLowerCase().includes(query)) ||
        (teacher.department_c && teacher.department_c.toLowerCase().includes(query))
      )
    }

    if (filterDepartment !== 'all') {
      filtered = filtered.filter(teacher => teacher.department_c === filterDepartment)
    }

    setFilteredTeachers(filtered)
  }

  const openModal = (teacher = null) => {
    setEditingTeacher(teacher)
    setFormData(teacher ? { 
      name_c: teacher.name_c || '',
      email_c: teacher.email_c || '', 
      department_c: teacher.department_c || ''
    } : {
      name_c: '',
      email_c: '',
      department_c: ''
    })
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingTeacher(null)
    setFormData({
      name_c: '',
      email_c: '',
      department_c: ''
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name_c || !formData.email_c || !formData.department_c) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      if (editingTeacher) {
        const updatedTeacher = await teacherService.update(editingTeacher.Id, formData)
        setTeachers(prev => prev.map(t => t.Id === editingTeacher.Id ? updatedTeacher : t))
        toast.success('Teacher updated successfully')
      } else {
        const newTeacher = await teacherService.create(formData)
        setTeachers(prev => [...prev, newTeacher])
        toast.success('Teacher added successfully')
      }
      closeModal()
    } catch (err) {
      toast.error('Failed to save teacher')
    }
  }

  const handleDelete = async (teacherId, teacherName) => {
    if (!confirm(`Are you sure you want to delete ${teacherName}?`)) {
      return
    }

    try {
      await teacherService.delete(teacherId)
      setTeachers(prev => prev.filter(t => t.Id !== teacherId))
      toast.success('Teacher deleted successfully')
    } catch (err) {
      toast.error('Failed to delete teacher')
    }
  }

  const departments = [...new Set(teachers.map(t => t.department_c).filter(Boolean))].sort()

  if (loading) return <Loading />
  if (error) return <Error message={error} />

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Teachers</h1>
          <p className="text-gray-600">Manage teacher records and information</p>
        </div>
        <Button 
          onClick={() => openModal()}
          className="w-full sm:w-auto"
        >
          <ApperIcon name="Plus" size={16} />
          Add Teacher
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="space-y-4">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search teachers by name, email, or department..."
          />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label>Department</Label>
              <Select
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
              >
                <option value="all">All Departments</option>
                {departments.map(department => (
                  <option key={department} value={department}>{department}</option>
                ))}
              </Select>
            </div>
            
            <div className="flex items-end">
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchQuery('')
                  setFilterDepartment('all')
                }}
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Teachers Grid */}
      {filteredTeachers.length === 0 ? (
        <Empty 
          message={searchQuery || filterDepartment !== 'all' 
            ? "No teachers match your filters" 
            : "No teachers found"
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeachers.map(teacher => (
            <Card key={teacher.Id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{teacher.name_c}</h3>
                  <p className="text-sm text-gray-600">{teacher.email_c}</p>
                </div>
                <Badge variant="primary">
                  {teacher.department_c}
                </Badge>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Department:</span>
                  <span className="font-medium">{teacher.department_c}</span>
                </div>
              </div>
              
              <div className="flex gap-3 pt-4 border-t">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => openModal(teacher)}
                  className="flex-1"
                >
                  <ApperIcon name="Edit" size={14} />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDelete(teacher.Id, teacher.name_c)}
                  className="flex-1 text-error-600 hover:bg-error-50 border-error-300"
                >
                  <ApperIcon name="Trash2" size={14} />
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingTeacher ? 'Edit Teacher' : 'Add New Teacher'}
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={closeModal}
                >
                  <ApperIcon name="X" size={16} />
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label required>Full Name</Label>
                  <Input
                    value={formData.name_c || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, name_c: e.target.value }))}
                    placeholder="Enter teacher name"
                    required
                  />
                </div>

                <div>
                  <Label required>Email</Label>
                  <Input
                    type="email"
                    value={formData.email_c || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, email_c: e.target.value }))}
                    placeholder="Enter email address"
                    required
                  />
                </div>

                <div>
                  <Label required>Department</Label>
                  <Input
                    value={formData.department_c || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, department_c: e.target.value }))}
                    placeholder="Enter department"
                    required
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={closeModal}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1">
                    {editingTeacher ? 'Update Teacher' : 'Add Teacher'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}