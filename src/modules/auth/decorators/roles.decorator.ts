import { SetMetadata } from "@nestjs/common";
import { Role } from "src/modules/auth/decorators/roles.enum";

export const Roles = (...roles: Role[]) => SetMetadata("Roles", roles);