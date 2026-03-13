"use client";

import { useEffect, useState } from "react";

import Navbar from "@/app/(user)/components/layout/navbar";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

import { toast } from "sonner";

import {
  ClipboardList,
  CheckCircle2,
  Clock,
  ListTodo,
  Plus,
  ArrowLeft,
  ArrowRight,
  ClipboardListIcon,
} from "lucide-react";

import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  Task,
} from "@/services/user/tasks.service";

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [open, setOpen] = useState(false);

  const loadTasks = async () => {
    const data = await getTasks();
    setTasks(data);
  };

  useEffect(() => {
    loadTasks();
  }, []);

  // ---------------- CREATE ----------------

  const handleCreate = async () => {
    if (!title.trim()) return;

    const promise = createTask(title, 1);

    toast.promise(promise, {
      loading: "Creating task...",
      success: () => {
        setTitle("");
        setOpen(false);
        loadTasks();
        return "Task created successfully";
      },
      error: (err) => err.message || "Create failed",
    });
  };

  // ---------------- NEXT ----------------

  const handleNext = async (task: Task) => {
    if (task.status === "TODO") {
      await updateTask(task.id, "IN_PROGRESS");
    } else if (task.status === "IN_PROGRESS") {
      await updateTask(task.id, "DONE");
    }

    loadTasks();
  };

  // ---------------- BACK ----------------

  const handleBack = async (task: Task) => {
    if (task.status === "DONE") {
      await updateTask(task.id, "IN_PROGRESS");
    } else if (task.status === "IN_PROGRESS") {
      await updateTask(task.id, "TODO");
    }

    loadTasks();
  };

  // ---------------- DELETE ----------------

  const handleDelete = async (id: number) => {
    await deleteTask(id);
    toast.success("Task deleted");
    loadTasks();
  };

  // ---------------- STATS ----------------

  const todo = tasks.filter((t) => t.status === "TODO").length;
  const progress = tasks.filter((t) => t.status === "IN_PROGRESS").length;
  const done = tasks.filter((t) => t.status === "DONE").length;

  const percent = tasks.length
    ? ((done + progress * 0.5) / tasks.length) * 100
    : 0;

  // ---------------- GROUP BY DAY ----------------

  const today = new Date().toDateString();

  const todayTasks = tasks.filter(
    (t) => new Date(t.createdAt).toDateString() === today,
  );

  const earlierTasks = tasks.filter(
    (t) => new Date(t.createdAt).toDateString() !== today,
  );

  // ---------------- STATUS COLORS ----------------

  const statusColor = (status: Task["status"]) => {
    if (status === "TODO") return "bg-gray-200 text-gray-800";
    if (status === "IN_PROGRESS") return "bg-yellow-200 text-yellow-800";
    if (status === "DONE") return "bg-green-200 text-green-800";
  };

  // ---------------- RENDER TASK ----------------

  const renderTasks = (list: Task[]) =>
    list.map((task) => {
      const canBack = task.status !== "TODO";
      const canNext = task.status !== "DONE";
      return (
        <div
          key={task.id}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border rounded-lg p-3 hover:bg-muted hover:shadow-sm transition"
        >
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium">{task.title}</p>
            <Badge className={statusColor(task.status)}>{task.status}</Badge>
          </div>

          <div className="flex items-center gap-3 sm:gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={!canBack}
              onClick={() => handleBack(task)}
              className="disabled:opacity-40"
            >
              <ArrowLeft size={16} />
            </Button>

            <Button
              size="sm"
              variant="outline"
              disabled={!canNext}
              onClick={() => handleNext(task)}
              className="disabled:opacity-40"
            >
              <ArrowRight size={16} />
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button size="sm" variant="destructive">
                  Delete
                </Button>
              </AlertDialogTrigger>

              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Task?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>

                  <AlertDialogAction
                    onClick={() => handleDelete(task.id)}
                    className="bg-red-500 hover:bg-red-600"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      );
    });

  return (
    <div className="min-h-screen bg-muted/40">
      <Navbar />

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ClipboardListIcon className="w-8 h-8 text-muted-foreground" />
            <h1 className="text-2xl font-bold">Tasks Manager</h1>
          </div>

          {/* CREATE TASK */}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus size={16} />
                New Task
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Create Task</DialogTitle>
              </DialogHeader>

              <Input
                placeholder="Task title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <DialogFooter>
                <Button onClick={handleCreate}>Create Task</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* PROGRESS */}
        <Card>
          <CardHeader>
            <CardTitle>Progress</CardTitle>
          </CardHeader>

          <CardContent>
            <Progress value={percent} />
            <p className="text-sm text-muted-foreground mt-2">
              {Math.round(percent)}% completed
            </p>
          </CardContent>
        </Card>

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <ListTodo className="text-gray-500" />
              <div>
                <p className="text-sm text-muted-foreground">Todo</p>
                <p className="text-xl font-bold">{todo}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <Clock className="text-yellow-500" />
              <div>
                <p className="text-sm text-muted-foreground">In Progress</p>
                <p className="text-xl font-bold">{progress}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <CheckCircle2 className="text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Done</p>
                <p className="text-xl font-bold">{done}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* TODAY */}
        <Card>
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle>Today</CardTitle>
            <ClipboardList className="h-5 w-5 text-muted-foreground" />
          </CardHeader>

          <CardContent className="space-y-3">
            {todayTasks.length ? renderTasks(todayTasks) : "No tasks today"}
          </CardContent>
        </Card>

        {/* EARLIER */}
        <Card>
          <CardHeader>
            <CardTitle>Earlier</CardTitle>
          </CardHeader>

          <CardContent className="space-y-3">
            {earlierTasks.length ? renderTasks(earlierTasks) : "No older tasks"}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
