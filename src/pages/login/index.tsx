import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { GoogleLoginButton } from "./_components/GoogleLoginButton";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-2 sm:space-y-3">
          <CardTitle className="text-2xl font-bold tracking-tight sm:text-3xl">
            자산로그
          </CardTitle>
          <CardDescription className="text-sm sm:text-base">
            마이데이터가 못 잡는 숨은 자산까지 포함한 전체 자산을 차트로 시각화
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4 sm:pt-6">
          <GoogleLoginButton />
        </CardContent>
        <CardFooter>
          <p className="w-full text-center text-xs text-gray-500">
            로그인하면 서비스 이용약관 및 개인정보 처리방침에 동의하는 것으로
            간주됩니다.
          </p>
        </CardFooter>
      </Card>
    </main>
  );
}

export const getConfig = async () => {
  return {
    render: "static",
  } as const;
};
