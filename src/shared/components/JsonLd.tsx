import type { WithContext, WebApplication, Organization } from "schema-dts";

interface JsonLdProps<T> {
  data: T;
}

function JsonLd<T>({ data }: JsonLdProps<T>) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

interface WebApplicationJsonLdProps {
  name: string;
  description: string;
  url: string;
}

export function WebApplicationJsonLd({
  name,
  description,
  url,
}: WebApplicationJsonLdProps) {
  const jsonLd: WithContext<WebApplication> = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name,
    description,
    url,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "KRW",
    },
  };

  return <JsonLd data={jsonLd} />;
}

interface OrganizationJsonLdProps {
  name: string;
  url: string;
  logo?: string;
}

export function OrganizationJsonLd({
  name,
  url,
  logo,
}: OrganizationJsonLdProps) {
  const jsonLd: WithContext<Organization> = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name,
    url,
    ...(logo && { logo }),
  };

  return <JsonLd data={jsonLd} />;
}
