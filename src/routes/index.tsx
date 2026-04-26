import { createFileRoute } from "@tanstack/react-router";
import { DayCardsDashboard } from "@/components/DayCardsDashboard";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <main className="min-h-screen bg-[#f1f3f4] py-6 sm:py-10 px-3 sm:px-6">
      <DayCardsDashboard />
    </main>
  );
}
