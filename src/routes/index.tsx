import { createFileRoute } from "@tanstack/react-router";
import { TamilCalendar } from "@/components/TamilCalendar";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Siva Arul Vaibhava Panchangam · சிவ அருள் வைபவ பஞ்சாங்கம்" },
      {
        name: "description",
        content:
          "A mechanical-style Tamil perpetual digital calendar covering the full 60-year cycle from Prabhava to Akshaya, with sliding day-header alignment.",
      },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Noto+Sans+Tamil:wght@400;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&display=swap",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="min-h-screen py-6 sm:py-10 px-3 sm:px-4">
      <TamilCalendar />
      <footer className="serif-font text-center text-[11px] sm:text-xs text-muted-foreground mt-6 sm:mt-8 max-w-md mx-auto opacity-80 italic px-4">
        ✦ காலம் ஓடினாலும், நிரந்தரம் நாட்காட்டி ✦
        <br />
        <span className="opacity-70">Time flows on, yet the calendar remains eternal.</span>
      </footer>
    </main>
  );
}
