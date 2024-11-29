import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ReservationsListSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="mb-2 h-6 w-40" />
        <Skeleton className="h-4 w-64" />
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
          </TabsList>
          <TabsContent value="upcoming">
            <ReservationListItems />
          </TabsContent>
          <TabsContent value="past">
            <ReservationListItems />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

function ReservationListItems() {
  return (
    <ul className="space-y-4">
      {[1, 2, 3].map((_, index) => (
        <li key={index} className="rounded-lg border p-4">
          <div className="mb-2 flex items-start justify-between">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-8 w-20" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[1, 2, 3, 4].map((_, i) => (
              <div key={i} className="flex items-center">
                <Skeleton className="mr-2 h-4 w-4" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </div>
        </li>
      ))}
    </ul>
  );
}
