import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import ActivityModal from "@/components/organisms/ActivityModal";
import activityService from "@/services/api/activityService";

const Activities = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "Not Started", label: "Not Started" },
    { value: "In Progress", label: "In Progress" },
    { value: "Completed", label: "Completed" },
    { value: "On Hold", label: "On Hold" },
    { value: "Cancelled", label: "Cancelled" }
  ];

  const priorityOptions = [
    { value: "all", label: "All Priorities" },
    { value: "Low", label: "Low" },
    { value: "Normal", label: "Normal" },
    { value: "High", label: "High" }
  ];

  const loadActivities = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await activityService.getAll();
      setActivities(data || []);
    } catch (err) {
      setError(err.message || 'Failed to load activities');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadActivities();
  }, []);

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = !searchTerm || 
      activity.Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.subject_c?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.description_c?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || activity.status_c === statusFilter;
    const matchesPriority = priorityFilter === "all" || activity.priority_c === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleCreateActivity = () => {
    setSelectedActivity(null);
    setShowModal(true);
  };

  const handleEditActivity = (activity) => {
    setSelectedActivity(activity);
    setShowModal(true);
  };

  const handleDeleteActivity = async (id) => {
    if (window.confirm('Are you sure you want to delete this activity?')) {
      const success = await activityService.delete(id);
      if (success) {
        loadActivities();
      }
    }
  };

  const handleModalSave = () => {
    setShowModal(false);
    setSelectedActivity(null);
    loadActivities();
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'Completed': return 'success';
      case 'In Progress': return 'primary';
      case 'On Hold': return 'warning';
      case 'Cancelled': return 'error';
      default: return 'secondary';
    }
  };

  const getPriorityBadgeVariant = (priority) => {
    switch (priority) {
      case 'High': return 'error';
      case 'Normal': return 'primary';
      case 'Low': return 'secondary';
      default: return 'secondary';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTags = (tags) => {
    if (!tags) return [];
    if (typeof tags === 'string') {
      return tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    }
    if (Array.isArray(tags)) {
      return tags;
    }
    return [];
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadActivities} />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gradient mb-2">Activities</h1>
          <p className="text-gray-600">Manage your activities and tasks</p>
        </div>
        <Button onClick={handleCreateActivity} className="flex items-center gap-2">
          <ApperIcon name="Plus" className="w-4 h-4" />
          New Activity
        </Button>
      </div>

      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="md:col-span-2">
            <Input
              placeholder="Search activities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
          <Select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            {priorityOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </div>

        {filteredActivities.length === 0 ? (
          <Empty 
            title="No activities found" 
            description="Create your first activity to get started"
            actionLabel="New Activity"
            onAction={handleCreateActivity}
          />
        ) : (
          <div className="space-y-4">
            {filteredActivities.map((activity) => (
              <motion.div
                key={activity.Id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {activity.Name}
                        </h3>
                        <p className="text-sm text-gray-600 font-medium">
                          {activity.subject_c}
                        </p>
                      </div>
                    </div>

                    {activity.description_c && (
                      <p className="text-gray-700 text-sm mb-3 line-clamp-2">
                        {activity.description_c}
                      </p>
                    )}

                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <ApperIcon name="Calendar" className="w-4 h-4" />
                        Due: {formatDate(activity.due_date_c)}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-3">
                      <Badge variant={getStatusBadgeVariant(activity.status_c)}>
                        {activity.status_c}
                      </Badge>
                      <Badge variant={getPriorityBadgeVariant(activity.priority_c)}>
                        {activity.priority_c} Priority
                      </Badge>
                      {formatTags(activity.Tags).map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditActivity(activity)}
                    >
                      <ApperIcon name="Edit" className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteActivity(activity.Id)}
                      className="text-error-600 hover:text-error-700"
                    >
                      <ApperIcon name="Trash2" className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </Card>

      {showModal && (
        <ActivityModal
          activity={selectedActivity}
          onClose={() => setShowModal(false)}
          onSave={handleModalSave}
        />
      )}
    </motion.div>
  );
};

export default Activities;