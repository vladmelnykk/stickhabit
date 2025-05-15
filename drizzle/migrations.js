// This file is required for Expo/React Native SQLite migrations - https://orm.drizzle.team/quick-sqlite/expo

import journal from './meta/_journal.json';
import m0000 from './0000_first_matthew_murdock.sql';
import m0001 from './0001_dashing_karnak.sql';
import m0002 from './0002_oval_clint_barton.sql';
import m0003 from './0003_groovy_tattoo.sql';
import m0004 from './0004_careful_lightspeed.sql';
import m0005 from './0005_breezy_ben_parker.sql';

  export default {
    journal,
    migrations: {
      m0000,
m0001,
m0002,
m0003,
m0004,
m0005
    }
  }
  