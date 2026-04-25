import { createFileRoute } from "@tanstack/react-router";
import { TamilCalendar } from "@/components/TamilCalendar";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Tamil Perpetual Calendar · தமிழ் நிரந்தர நாட்காட்டி" },
      {
        name: "description",
        content:
          "A mechanical-style Tamil perpetual digital calendar covering the full 60-year cycle from Prabhava to Akshaya, with sliding day-header alignment.",
      },
    ],
    links: [
      {
        rel: "preconnect",
        href: "https://fonts.googleapis.com",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Noto+Sans+Tamil:wght@400;600;700&display=swap",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="min-h-screen bg-background py-10 px-4">
      <TamilCalendar />
      <footer className="text-center text-xs text-muted-foreground mt-8 max-w-2xl mx-auto opacity-60">
        Mimicking the physical mechanical Tamil calendar — slide the weekday strip to align with the 1st, just like the brass shifter on the wooden plate.
      </footer>
    </main>
  );
}
