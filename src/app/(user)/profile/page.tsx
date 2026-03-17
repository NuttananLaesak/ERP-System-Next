import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Users } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-muted/40">
      <div className="max-w-3xl mx-auto p-6 space-y-6">
        <h1 className="text-3xl font-bold">Profile</h1>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>User Information</CardTitle>

            <Users className="h-5 w-5 text-muted-foreground" />
          </CardHeader>

          <CardContent className="space-y-2 text-sm">
            <p>Name: -</p>
            <p>Email: -</p>
            <p>Role:</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
