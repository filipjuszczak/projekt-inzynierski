import type { Room } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import ky from "ky";

export const useFetchRooms = () => {
  return useQuery({
    queryKey: ["rooms"],
    queryFn: () => ky.get("/api/rooms").json<Room[]>()
  });
};

export const useFetchRoomById = (roomId: string | undefined) => {
  return useQuery({
    queryKey: ["room", roomId],
    queryFn: () => ky.get(`/api/rooms/${roomId}`).json<Room>(),
    enabled: !!roomId
  });
};
