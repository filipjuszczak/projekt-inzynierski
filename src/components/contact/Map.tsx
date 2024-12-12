import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Map() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Nasza lokalizacja</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative h-[300px] w-full">
          <Image
            src="/images/image-placeholder.svg"
            alt="Mapa położenia CinemaPlus"
            fill
            className="rounded-md object-cover"
          />
        </div>
      </CardContent>
    </Card>
  );
}
