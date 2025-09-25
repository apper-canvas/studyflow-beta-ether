import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Textarea from "@/components/atoms/Textarea";
import Select from "@/components/atoms/Select";
import FormField from "@/components/molecules/FormField";
import ApperIcon from "@/components/ApperIcon";
import activityService from "@/services/api/activityService";

const ActivityModal = ({ activity, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    Name: "",
    subject_c: "",
    description_c: "",
    status_c: "Not Started",
    priority_c: "Normal",
    due_date_c: "",
    Tags: ""
  });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const statusOptions = [
    { value: "Not Started", label: "Not Started" },
    { value: "In Progress", label: "In Progress" },
    { value: "Completed", label: "Completed" },
    { value: "On Hold", label: "On Hold" },
    { value: "Cancelled", label: "Cancelled" }
  ];

  const priorityOptions = [
    { value: "Low", label: "Low" },
    { value: "Normal", label: "Normal" },
    { value: "High", label: "High" }
  ];

  useEffect(() => {
    if (activity) {
      setFormData({
        Name: activity.Name || "",
        subject_c: activity.subject_c || "",
        description_c: activity.description_c || "",
        status_c: activity.status_c || "Not Started",
        priority_c: activity.priority_c || "Normal",
        due_date_c: activity.due_date_c || "",
        Tags: activity.Tags || ""
      });
    }
  }, [activity]);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.Name.trim()) newErrors.Name = "Activity name is required";
    if (!formData.subject_c.trim()) newErrors.subject_c = "Subject is required";
    if (!formData.status_c) newErrors.status_c = "Status is required";
    if (!formData.priority_c) newErrors.priority_c = "Priority is required";
    if (!formData.due_date_c) newErrors.due_date_c = "Due date is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setSaving(true);
      
      const activityData = {
        Name: formData.Name.trim(),
        subject_c: formData.subject_c.trim(),
        description_c: formData.description_c.trim(),
        status_c: formData.status_c,
        priority_c: formData.priority_c,
        due_date_c: formData.due_date_c,
        Tags: formData.Tags.trim()
      };
      
      let result;
      if (activity) {
        result = await activityService.update(activity.Id, activityData);
      } else {
        result = await activityService.create(activityData);
      }
      
      if (result) {
        onSave();
      }
    } catch (error) {
      setErrors({ submit: error.message || "Failed to save activity" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              {activity ? "Edit Activity" : "Create Activity"}
            </h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <ApperIcon name="X" className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="Activity Name" required error={errors.Name}>
              <Input
                value={formData.Name}
                onChange={(e) => handleChange("Name", e.target.value)}
                placeholder="e.g., Complete Project Proposal"
                error={!!errors.Name}
              />
            </FormField>

            <FormField label="Subject" required error={errors.subject_c}>
              <Input
                value={formData.subject_c}
                onChange={(e) => handleChange("subject_c", e.target.value)}
                placeholder="e.g., Mathematics, Science, etc."
                error={!!errors.subject_c}
              />
            </FormField>
          </div>

          <FormField label="Description" error={errors.description_c}>
            <Textarea
              value={formData.description_c}
              onChange={(e) => handleChange("description_c", e.target.value)}
              placeholder="Describe the activity details..."
              rows={4}
              error={!!errors.description_c}
              className="resize-vertical"
            />
          </FormField>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField label="Status" required error={errors.status_c}>
              <Select
                value={formData.status_c}
                onChange={(e) => handleChange("status_c", e.target.value)}
                error={!!errors.status_c}
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </FormField>

            <FormField label="Priority" required error={errors.priority_c}>
              <Select
                value={formData.priority_c}
                onChange={(e) => handleChange("priority_c", e.target.value)}
                error={!!errors.priority_c}
              >
                {priorityOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </FormField>

            <FormField label="Due Date" required error={errors.due_date_c}>
              <Input
                type="date"
                value={formData.due_date_c}
                onChange={(e) => handleChange("due_date_c", e.target.value)}
                error={!!errors.due_date_c}
              />
            </FormField>
          </div>

          <FormField 
            label="Tags" 
            error={errors.Tags}
          >
            <Input
              value={formData.Tags}
              onChange={(e) => handleChange("Tags", e.target.value)}
              placeholder="e.g., homework, project, research (comma separated)"
            />
            <p className="text-xs text-gray-500 mt-1">
              Separate multiple tags with commas
            </p>
          </FormField>

          {errors.submit && (
            <div className="text-error-600 text-sm">{errors.submit}</div>
          )}

          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={saving}
              className="flex-1"
            >
              {activity ? "Update Activity" : "Create Activity"}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default ActivityModal;