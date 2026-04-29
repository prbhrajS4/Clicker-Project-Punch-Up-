import { PGlite } from '@electric-sql/pglite';
import ddl from '../../create-tables.sql?raw'

let src = import.meta.env.VITE_DATABASE_URL;
console.log(`Using ${src} for database URL`);
const pgliteDb = await PGlite.create(src)

if (src == 'memory://') {
  db().exec(ddl)
}


export default function db() {
  return pgliteDb;
}
