import { getSession } from "@/shared/auth/getSession";
import { WebApplicationJsonLd } from "@/shared/components/JsonLd";
import { Separator } from "@/shared/ui/separator";
import { LandingHeader } from "./_components/LandingHeader";
import { HeroSection } from "./_components/HeroSection";
import { FeaturesSection } from "./_components/FeaturesSection";
import { StepsSection } from "./_components/StepsSection";
import { BenefitsSection } from "./_components/BenefitsSection";
import { SalarySection } from "./_components/SalarySection";
import { PortfolioSection } from "./_components/PortfolioSection";
import { CTASection } from "./_components/CTASection";
import { LandingFooter } from "./_components/LandingFooter";

const SITE_URL = "https://assetlog.kr";
const PAGE_DESCRIPTION =
  "마이데이터가 못 잡는 숨은 자산까지 포함한 전체 자산을 차트로 시각화. 전세 보증금, 코인, 해외 자산 등 모든 자산을 한눈에 관리하세요.";

export default async function HomePage() {
  const session = await getSession();
  const isLoggedIn = !!session;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <WebApplicationJsonLd
        name="자산로그"
        description={PAGE_DESCRIPTION}
        url={SITE_URL}
      />

      <LandingHeader isLoggedIn={isLoggedIn} />
      <HeroSection isLoggedIn={isLoggedIn} />
      <Separator />
      <FeaturesSection />
      <Separator />
      <StepsSection />
      <Separator />
      <BenefitsSection />
      <Separator />
      <SalarySection />
      <Separator />
      <PortfolioSection />
      <Separator />
      <CTASection isLoggedIn={isLoggedIn} />
      <LandingFooter />
    </div>
  );
}
