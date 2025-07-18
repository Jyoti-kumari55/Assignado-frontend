import React, { useEffect, useState } from "react";
import { BiTaskX } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { useUserAuth } from "../../hooks/useUserAuth";
import { UserContext } from "../../context/userContext";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import DashboardLayout from "../../components/layouts/DashboardLayout";

import Loader from "../../components/Loader";
import TaskStatusTabs from "../../components/task/TaskStatusTabs";
import TaskCard from "../../components/cards/TaskCard";

const UserTask = () => {
  useUserAuth();

  const [allTasks, setAllTasks] = useState([]);

  const [tabs, setTabs] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  const getAllTasks = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(API_PATHS.TASKS.GET_ALL_TASKS, {
        params: {
          status: filterStatus === "All" ? "" : filterStatus,
        },
      });
      setAllTasks(response.data?.tasks?.length > 0 ? response.data.tasks : []);

      const statusSummary = response.data?.statusSummary || {};
      const statusArr = [
        { label: "All", count: statusSummary.all || 0 },
        { label: "Pending", count: statusSummary.pendingTasks || 0 },
        { label: "In Progress", count: statusSummary.inProgressTasks || 0 },
        { label: "Completed", count: statusSummary.completedTasks || 0 },
      ];
      setTabs(statusArr);
    } catch (error) {
      console.error("Error occurred while creating a task.", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const clickHandler = (taskId) => {
    navigate(`/user/taskDetails/${taskId}`);
  };

  // const navigateToCreatePage = () => {
  //   navigate("/admin/create-task");
  // };
  useEffect(() => {
    getAllTasks(filterStatus);
    return () => {};
  }, [filterStatus]);

  return (
    <DashboardLayout activeMenu="My Tasks">
      <div className="my-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between">
          {/* <div className="flex items-center justify-between gap-3"> */}
          <h2 className="text-xl md:text-xl font-medium">My Tasks</h2>

          {tabs?.length > 0 && (
            <TaskStatusTabs
              tabs={tabs}
              activeTab={filterStatus}
              setActiveTab={setFilterStatus}
            />
          )}
        </div>

        {isLoading ? (
          <Loader text="Loading tasks..." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {allTasks.length === 0 ? (
              <div className="flex flex-col justify-center items-center h-[60vh] text-xl font-semibold col-span-full">
                <BiTaskX size={150} className="text-gray-600 opacity-10" />
                <span>No task Assigned yet!!</span>
              </div>
            ) : (
              allTasks?.map((todo) => (
                <TaskCard
                  key={todo._id}
                  title={todo.title}
                  description={todo.description}
                  priority={todo.priority}
                  status={todo.status}
                  progress={todo.progress}
                  createdAt={todo.createdAt}
                  dueDate={todo.dueDate}
                  assignedTo={todo.assignedTo?.map(
                    (item) => item.profileImageUrl
                  )}
                  attachmentCount={todo.attachments?.length || 0}
                  completedTodoCount={todo.completedTodoCount || 0}
                  todoCheckList={todo.todoCheckList || []}
                  onClick={() => {
                    clickHandler(todo._id);
                  }}
                />
              ))
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default UserTask;
