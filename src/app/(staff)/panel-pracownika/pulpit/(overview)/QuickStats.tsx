import { format } from "date-fns";
import { BarChart, Ticket, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getAllSales,
  getOccupancy,
  getTotalTicketsSold
} from "@/app/(staff)/panel-pracownika/pulpit/(overview)/data";

export default async function QuickStats() {
  const [sales, totalTicketsSold, occupancy] = await Promise.all([
    getAllSales(),
    getTotalTicketsSold(),
    getOccupancy()
  ]);

  const today = format(new Date(), "dd.MM.yyyy");

  return (
    <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Całkowita sprzedaż
          </CardTitle>
          <BarChart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{sales.toFixed(2)} PLN</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Sprzedane bilety
          </CardTitle>
          <Ticket className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalTicketsSold}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Zajętość kina ({today})
          </CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{occupancy || 0}%</div>
        </CardContent>
      </Card>
    </div>
  );
}
