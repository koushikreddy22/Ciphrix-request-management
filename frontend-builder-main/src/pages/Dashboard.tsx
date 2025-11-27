import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClipboardList, LogOut, Plus, UserCircle, RefreshCw } from "lucide-react";
import api from "@/lib/api";
import DashboardSkeleton from "@/components/DashboardSkeleton";

type RequestStatus = "pending" | "approved" | "rejected" | "in_progress" | "closed";

interface Request {
  id: string;
  title: string;
  description: string;
  status: RequestStatus;
  created_by_id: string;
  assigned_to_id: string;
  manager_id: string;
  created_at: string;
}

const statusColors: Record<RequestStatus, string> = {
  pending: "bg-warning text-warning-foreground",
  approved: "bg-success text-success-foreground",
  rejected: "bg-destructive text-destructive-foreground",
  in_progress: "bg-primary text-primary-foreground",
  closed: "bg-muted text-muted-foreground",
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  const { data: requests = [], isLoading, isError, refetch } = useQuery<Request[]>({
    queryKey: ["requests"],
    queryFn: () => api.get("requests"),
  });

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) navigate("/signin");
    else setUser(JSON.parse(userData));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/signin");
  };

  // 🔥 Final filtering logic
  const getFilteredRequests = (filter: string) => {
    if (!user) return [];

    switch (filter) {
      case "created":
        return requests.filter((r) => r.created_by_id === user.id);

      case "assigned":
        return requests.filter((r) => r.assigned_to_id === user.id);

      case "pending-approval":
        return requests.filter(
          (r) => r.status === "pending" && r.manager_id === user.id
        );

      case "handled":
        return requests.filter(
          (r) =>
            (r.status === "approved" || r.status === "rejected") &&
            r.manager_id === user.id
        );

      default:
        return [];
    }
  };

  if (!user) return null;
  if (isLoading) return <DashboardSkeleton />;
  if (isError) return <div>Error loading requests.</div>;

  return (
    <div className="min-h-screen bg-background">

      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <ClipboardList className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Request Manager</h1>
              <p className="text-xs text-muted-foreground">Workflow Management System</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <UserCircle className="w-5 h-5 text-muted-foreground" />
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">{user.email}</p>
                <Badge variant="outline" className="text-xs capitalize">
                  {user.role}
                </Badge>
              </div>
            </div>

            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">

        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div>
              <h2 className="text-3xl font-bold text-foreground">Dashboard</h2>
              <p className="text-muted-foreground mt-1">Manage and track all requests</p>
            </div>
            <Button variant="outline" size="icon" onClick={() => refetch()} disabled={isLoading}>
              <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>

          {/* ❌ Managers cannot create requests */}
          {user.role === "employee" && (
            <Button onClick={() => navigate("/create-request")} className="gap-2">
              <Plus className="w-4 h-4" />
              Create Request
            </Button>
          )}
        </div>

        <Tabs defaultValue={user.role === "employee" ? "created" : "pending-approval"} className="space-y-6">

          <TabsList>

            {/* Employee tabs */}
            {user.role === "employee" && (
              <>
                <TabsTrigger value="created">Created by Me</TabsTrigger>
                <TabsTrigger value="assigned">Assigned to Me</TabsTrigger>
              </>
            )}

            {/* Manager tabs */}
            {user.role === "manager" && (
              <>
                <TabsTrigger value="pending-approval">Pending Approval</TabsTrigger>
                <TabsTrigger value="handled">Handled</TabsTrigger>
              </>
            )}
          </TabsList>

          {["created", "assigned", "pending-approval", "handled"].map((filter) => {
            if (user.role === "employee" && (filter === "pending-approval" || filter === "handled"))
              return null;

            if (user.role === "manager" && (filter === "created" || filter === "assigned"))
              return null;

            return (
              <TabsContent key={filter} value={filter} className="space-y-4">
                {getFilteredRequests(filter).map((request) => (
                  <Card
                    key={request.id}
                    className="cursor-pointer transition-all hover:shadow-lg"
                    onClick={() => navigate(`/request/${request.id}`)}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-1 flex-1">
                          <CardTitle className="text-xl">{request.title}</CardTitle>
                          <CardDescription>{request.description}</CardDescription>
                        </div>
                        <Badge className={statusColors[request.status]}>
                          {request.status}
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent>
                      <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <div>
                          <span className="font-medium">Created by:</span>{" "}
                          {request.created_by_id}
                        </div>
                        <div>
                          <span className="font-medium">Assigned to:</span>{" "}
                          {request.assigned_to_id}
                        </div>
                        <div>
                          <span className="font-medium">Date:</span> {request.created_at}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {/* No data */}
                {getFilteredRequests(filter).length === 0 && (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <p className="text-muted-foreground">No requests found</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            );
          })}

        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;
