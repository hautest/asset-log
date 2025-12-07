import { getSession } from "@/shared/auth/getSession";
import { Button } from "@/shared/ui/button";
import { Link } from "waku";

export default async function HomePage() {
  const data = await getData();

  const session = await getSession();
  console.log(session);

  return (
    <div>
      <title>{data.title}</title>
      <h1 className="text-4xl font-bold tracking-tight">{data.headline}</h1>
      <p>{data.body}</p>
      <Link to="/about" className="mt-4 inline-block underline">
        About page
      </Link>
      <Link to="/login" className="mt-4 inline-block underline">
        Login page
      </Link>
      <Button variant="secondary">Click me</Button>
    </div>
  );
}

const getData = async () => {
  const data = {
    title: "Waku",
    headline: "Waku",
    body: "Hello world!",
  };

  return data;
};

export const getConfig = async () => {
  return {
    render: "static",
  } as const;
};
