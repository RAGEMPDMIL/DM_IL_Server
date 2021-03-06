mp.events.delayInitialization = true; //  Setting this to true won't allow players to connect until this is false again

// DB
require('./modules/db');

// Authentication
require('./authentication/authentication');

// Player
require('./player/session/session');
require('./player/teleports/teleports');
require('./player/death/player-death');
require('./player/blips/player-blips');

// Commands
require('./server-commands/player-commands/player-commands');

// Chat
require('./chat/chat');

// World
require('./world/time/time');
require('./world/weather/weather');

// Map Blips
require('./bank-money-system/blips/blips');
require('./vehicle-system/dealerships/blips/dealership-blips');

// Map Colshapes
require('./bank-money-system/colshapes/colshapes');
require('./gun-system/colshapes/colshapes');

//Map Markers
require('./bank-money-system/markers/markers');
require('./gun-system/markers/markers');

// Functions
require('./events');

// Vehicle System
require('./vehicle-system/commands/vehicle-commands');
require('./vehicle-system/data/vehicles-data');
const vehicleUtils = require('./vehicle-system/util/vehicle-system-functions');

// Bank Money System
require('./bank-money-system/events/bank-money-system-events');
require('./bank-money-system/commands/bank-money-commands');

// Gun System
require('./gun-system/commands/gun-system-commands');

// admin-system
require('./admin-system/commands');
const server = require('./server-status/server');

// Wait for everything to load, then allow connections once all is loaded
(async () => {
    await server.setAllOffline();
    await vehicleUtils.initVehicleSystem();
    mp.events.delayInitialization = false; //  Players cannot join until this is false
})();