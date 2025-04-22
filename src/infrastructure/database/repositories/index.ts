import { ClientRepository } from "./clientRepository";
import { PeopleRepository } from "./peopleRepository";
import { JobTitleRepository } from "./jobTitleRepository";
import { RoleRepository } from "./roleRepository";
import { BaseRepository } from "./baseRepository";

const clientRepository = new ClientRepository();
const peopleRepository = new PeopleRepository();
const jobTitleRepository = new JobTitleRepository();
const roleRepository = new RoleRepository();

export { clientRepository, peopleRepository, jobTitleRepository, roleRepository };

export { BaseRepository, ClientRepository, PeopleRepository, JobTitleRepository, RoleRepository };
