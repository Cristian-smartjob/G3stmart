import { ClientService } from "./clientService";
import { PeopleService } from "./peopleService";
import { RoleService } from "./roleService";

const clientService = new ClientService();
const peopleService = new PeopleService();
const roleService = new RoleService();

export { clientService, peopleService, roleService };

export { ClientService, PeopleService, RoleService };
