import './style.css'
import ddl from '../create-tables.sql?raw'
import db from './model/connection.ts'

import LoginController from "./controller/login-controller.ts";

await db().exec(ddl);
new LoginController(); // initiallizes the login controller (start of program)