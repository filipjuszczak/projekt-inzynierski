import { createAccessControl } from "better-auth/plugins/access";
import {
  defaultStatements,
  userAc,
  adminAc
} from "better-auth/plugins/admin/access";

const CRUD = ["create", "read", "update", "delete"];

export const ac = createAccessControl({
  ...defaultStatements,
  movie: CRUD,
  genre: CRUD,
  room: CRUD,
  showtime: CRUD,
  reservation: ["read", "delete"]
});

export const user = ac.newRole({
  ...userAc.statements,
  reservation: ["read", "delete"]
});

export const employee = ac.newRole({
  movie: CRUD,
  genre: CRUD,
  room: CRUD,
  showtime: CRUD,
  reservation: ["read", "delete"]
});

export const admin = ac.newRole({
  movie: CRUD,
  genre: CRUD,
  room: CRUD,
  showtime: CRUD,
  reservation: ["read", "delete"],
  ...adminAc.statements
});
