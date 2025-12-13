import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { User } from "lucide-react";

interface UserInfoCardProps {
  name: string;
  email: string;
  image?: string | null;
}

export function UserInfoCard({ name, email, image }: UserInfoCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <User className="h-5 w-5" />
          회원 정보
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center gap-4">
          {image && (
            <img
              src={image}
              alt={name}
              className="h-12 w-12 rounded-full"
            />
          )}
          <div>
            <p className="font-medium text-slate-900">{name}</p>
            <p className="text-sm text-slate-500">{email}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
