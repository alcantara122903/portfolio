import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 px-5">
      <Container className="text-center">
        <p className="text-xs font-medium uppercase tracking-widest text-sky-400">
          404
        </p>
        <h1 className="mt-4 text-3xl font-semibold text-zinc-50">
          Page not found
        </h1>
        <p className="mt-3 text-zinc-400">
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
        <div className="mt-8">
          <Button href="/">Back to Home</Button>
        </div>
      </Container>
    </div>
  );
}
