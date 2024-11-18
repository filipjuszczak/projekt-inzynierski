import { Film } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getRecentlyAddedGenres } from "@/app/(staff)/staff/dashboard/(overview)/db";

export default async function RecentGenres() {
  const recentGenres = await getRecentlyAddedGenres();

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Ostatnio dodane gatunki</CardTitle>
      </CardHeader>
      <CardContent>
        {recentGenres.length ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {recentGenres.map((genre) => (
              <Card key={genre.id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {genre.name}
                  </CardTitle>
                  <Film className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {genre._count.movies}
                  </div>
                  <p className="text-xs text-muted-foreground">filmy</p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div>Brak gatunków.</div>
        )}
      </CardContent>
    </Card>
  );
}
