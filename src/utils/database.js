import SQLite from 'react-native-sqlite-storage';

SQLite.enablePromise(true);

const db = SQLite.openDatabase({ name: 'HorseLocation.db', location: 'default' });

export const initDB = async () => {
  const database = await db;

  await database.executeSql(`
    CREATE TABLE IF NOT EXISTS HorseLocations (
      HorseLocationId INTEGER,
      HorseId INTEGER,
      HorseName TEXT,
      MicrochipNumber TEXT,
      Latitude REAL,
      Longitude REAL,
      Timestamp TEXT
    );
  `);
};

export const saveAllHorseLocations = async (microchipList) => {
    const database = await db;

    await Promise.all(
        microchipList.map(async (chip) => {
    await database.executeSql(
        `
        INSERT INTO HorseLocations (HorseLocationId, HorseId, HorseName, MicrochipNumber, Latitude, Longitude, Timestamp)
        VALUES (?, ?, ?, ?, ?, ?, ?);
        `,
        [
            chip.horseLocationId,
            chip.horseId,
            chip.horseName,
            chip.microchipNumber,
            chip.latitude,
            chip.longitude,
            chip.timestamp,
        ]
        );
    })
    );
};
  
  export const getAllHorseLocations = async () => {
    const database = await db;
    const [results] = await database.executeSql(`SELECT * FROM HorseLocations;`);
    const rows = results.rows;
    const locations = [];
  
    for (let i = 0; i < rows.length; i++) {
      locations.push(rows.item(i));
    }
  
    return locations;
  };

  //It will delete rows older than 30 days
  export const clearHorseLocations = async () => {
    const database = await db;
    await database.executeSql(`
        DELETE FROM HorseLocations WHERE Timestamp < datetime('now', '-30 days');
      `);      
  };
  