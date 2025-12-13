import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/shared/ui/card";

const STEPS = [
  {
    step: "01",
    title: "간편 가입",
    description: "구글 계정으로 3초 만에 시작",
  },
  {
    step: "02",
    title: "자산 입력",
    description: "카테고리별로 자산을 간편하게 기록",
  },
  {
    step: "03",
    title: "차트 확인",
    description: "한눈에 보는 내 자산의 성장 그래프",
  },
] as const;

export function StepsSection() {
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            3단계로 시작하세요
          </h2>
          <p className="text-lg text-slate-600">
            복잡한 설정 없이 바로 시작할 수 있어요
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {STEPS.map((item, index) => (
            <div key={item.step} className="relative">
              {index < STEPS.length - 1 && (
                <div className="absolute left-1/2 top-12 hidden h-0.5 w-full bg-gradient-to-r from-emerald-200 to-transparent md:block" />
              )}
              <Card className="relative border-none bg-transparent shadow-none">
                <CardContent className="flex flex-col items-center p-0 text-center">
                  <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 text-3xl font-bold text-white shadow-lg shadow-emerald-200">
                    {item.step}
                  </div>
                  <CardTitle className="mb-2 text-xl">{item.title}</CardTitle>
                  <CardDescription className="text-base">
                    {item.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
