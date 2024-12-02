// import Movies from "@/components/movies/Movies";
// import { getMovies } from "@/app/(main)/filmy/data";
// import { getQueryClient } from "@/lib/get-query-client";
// import type { Filters } from "@/lib/types";
// import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

// interface MovieGridProps {
//   filters: Filters;
// }

// export default async function MovieGrid({ filters }: MovieGridProps) {
//   // const { movies, nextCursor } = await getMovies(filters);

//   // return <Movies initialMovies={movies} nextCursor={nextCursor} />;
//   return (
//     <HydrationBoundary state={dehydrate(queryClient)}>
//       <Movies />
//     </HydrationBoundary>
//   );
// }
