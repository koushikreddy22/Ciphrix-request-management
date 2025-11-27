import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Loader2 } from "lucide-react";
import api from "@/lib/api";

const CreateRequest = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    description: "",
    assigned_to_id: "",
  });

  const { data: employees = [], isLoading: employeesLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => api.get("users/employees"),
  });


  const mutation = useMutation({
    mutationFn: () => api.post("requests", formData),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Request created successfully",
      });
      navigate("/dashboard");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create request",
        variant: "destructive",
      });
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate();
  };

  if (!user) return null;

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
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground">Create New Request</h2>
          <p className="text-muted-foreground mt-1">Assign a task to another employee</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Request Details</CardTitle>
            <CardDescription>Fill in the information below to create a new request</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Provide detailed information about the request..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={6}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="assignedTo">Assign To</Label>

                <Select
                  value={formData.assigned_to_id?.toString()}
                  onValueChange={(value) =>
                    setFormData({ ...formData, assigned_to_id: value })
                  }
                  disabled={employeesLoading} // disable while loading
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        employeesLoading ? "Loading employees..." : "Select an employee"
                      }
                    />
                  </SelectTrigger>

                  <SelectContent>
                    {/* Loading State with Icon */}
                    {employeesLoading && (
                      <div className="flex items-center gap-2 p-3 text-sm text-muted-foreground">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Loading employees…
                      </div>
                    )}

                    {/* Employee List */}
                    {!employeesLoading &&
                      employees.map((employee) => (
                        <SelectItem
                          key={employee.id}
                          value={employee.id?.toString()}
                        >
                          {employee.username}{" "}
                          <span className="text-xs text-muted-foreground">
                            (ID: {employee.id})
                          </span>
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>


              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/dashboard")}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1" disabled={mutation.isPending}>
                  {mutation.isPending ? "Creating..." : "Create Request"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div >
  );
};

export default CreateRequest;
