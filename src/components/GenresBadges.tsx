import { Badge } from "@/components/ui/badge";

interface GenresProps {
  genres: string[];
}

export default function Genres({ genres }: GenresProps) {
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      {genres.length <= 2 ? (
        genres.map((genre) => (
          <Badge key={genre} variant="outline">
            {genre}
          </Badge>
        ))
      ) : (
        <>
          {genres.slice(0, 2).map((genre) => (
            <Badge key={genre} variant="outline" className="flex-shrink-0">
              {genre}
            </Badge>
          ))}
          <Badge variant="outline" title={genres.slice(2).join(", ")}>
            +{genres.length - 2}
          </Badge>
        </>
      )}
    </div>
  );
}
