import Hero from "@/components/Hero";
import LatestMovies from "@/components/LatestMovies";
import UpcomingMovies from "@/components/UpcomingMovies";
import {
  getFeaturedMovie,
  getLatestMovies,
  getUpcomingMovies
} from "@/app/(main)/data";

export default async function Page() {
  const [featuredMovie, latestMovies, upcomingMovies] = await Promise.all([
    getFeaturedMovie(),
    getLatestMovies(),
    getUpcomingMovies()
  ]);

  return (
    <main className="flex-1">
      <Hero featuredMovie={featuredMovie} />
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <h2 className="mb-8 text-3xl font-bold tracking-tighter sm:text-5xl">
            Teraz w kinie
          </h2>
          <LatestMovies movies={latestMovies} />
        </div>
      </section>
      {upcomingMovies.length > 0 && (
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="mb-8 text-3xl font-bold tracking-tighter sm:text-5xl">
              Wkrótce...
            </h2>
            <UpcomingMovies movies={upcomingMovies} />
          </div>
        </section>
      )}
    </main>
  );
}
