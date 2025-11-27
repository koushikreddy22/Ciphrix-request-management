import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Check, X, Play, CheckCircle } from "lucide-react";
import api from "@/lib/api";
import RequestDetailSkeleton from "@/components/RequestDetailSkeleton";

type RequestStatus = "pending" | "approved" | "rejected" | "closed";

interface Request {
  id: string;
  description: string;
  status: RequestStatus;
  created_by_id: string;
  assigned_to_id: string;
  created_at: string;
}

const statusColors: Record<RequestStatus, string> = {
  pending: "bg-warning text-warning-foreground",
  approved: "bg-success text-success-foreground",
  rejected: "bg-destructive text-destructive-foreground",
  closed: "bg-muted text-muted-foreground",
};

const RequestDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [user, setUser] = useState<any>(null);

  const { data: request, isLoading, isError } = useQuery<Request>({
    queryKey: ['request', id],
    queryFn: () => api.get(`requests/${id}`),
  });

  const mutation = useMutation({
    mutationFn: (action: string) => api.put(`requests/${id}/${action}`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['request', id] });
      queryClient.invalidateQueries({ queryKey: ['requests'] });
      toast({ title: "Success", description: "Request updated successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update request" });
    },
  });


  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/signin");
    } else {
      setUser(JSON.parse(userData));
    }
  }, [navigate]);


  if (isLoading) return <RequestDetailSkeleton />;
  if (isError || !request) return <div>Error fetching request.</div>;
  if (!user) return null;

  const isManager = user.role === "manager";
  const isAssignedTo = request.assigned_to_id === user.id;
  const canApprove = isManager && request.status === "pending";
  const canClose = isAssignedTo && request.status === "approved";

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => navigate("/dashboard")} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between mb-4">
              <div className="space-y-2 flex-1">
                <CardTitle className="text-3xl">{request.description}</CardTitle>
                <CardDescription>Request ID: {request.id}</CardDescription>
              </div>
              <Badge className={`${statusColors[request.status]} text-sm`}>
                {request.status}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2 text-foreground">Description</h3>
              <p className="text-muted-foreground leading-relaxed">{request.description}</p>
            </div>

            <Separator />

            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold mb-1 text-sm text-muted-foreground">Created By</h3>
                <p className="text-foreground">{request.created_by_id}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-1 text-sm text-muted-foreground">Assigned To</h3>
                <p className="text-foreground">{request.assigned_to_id}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-1 text-sm text-muted-foreground">Created Date</h3>
                <p className="text-foreground">{new Date(request.created_at).toLocaleDateString()}</p>
              </div>
            </div>

            <Separator />

            {/* Action Buttons */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Actions</h3>

              {canApprove && (
                <div className="flex gap-3">
                  <Button
                    onClick={() => mutation.mutate('approve')}
                    disabled={mutation.isPending}
                    className="flex-1 gap-2"
                    variant="default"
                  >
                    <Check className="w-4 h-4" />
                    Approve Request
                  </Button>
                  <Button
                    onClick={() => mutation.mutate('reject')}
                    disabled={mutation.isPending}
                    className="flex-1 gap-2"
                    variant="destructive"
                  >
                    <X className="w-4 h-4" />
                    Reject Request
                  </Button>
                </div>
              )}

              {canClose && (
                <Button
                  onClick={() => mutation.mutate('close')}
                  disabled={mutation.isPending}
                  className="w-full gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Close Request
                </Button>
              )}

              {!canApprove && !canClose && (
                <Card className="bg-muted/50">
                  <CardContent className="py-6">
                    <p className="text-center text-muted-foreground">
                      {request.status === "closed"
                        ? "This request has been closed."
                        : request.status === "rejected"
                        ? "This request has been rejected."
                        : "No actions available for this request."}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default RequestDetail;
