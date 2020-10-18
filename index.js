mp.events.delayInitialization = true; //  Setting this to true won't allow players to connect until this is false again

// DB
require('./modules/db');

// Authentication
require('./authentication/authentication');

// Player
require('./player/session/session');
require('./player/teleports/teleports');
require('./player/death/player-death');

// Commands
require('./server-commands/player-commands/player-commands');
require('./server-commands/admin-commands/admin-commands');

// Chat
require('./chat/chat');

// World
require('./world/time/time');
require('./world/weather/weather');

// Map Blips
require('./bank-money-system/blips/blips');

// Map Colshapes
require('./bank-money-system/colshapes/colshapes');

//Map Markers
require('./bank-money-system/markers/markers');

// Functions
require('./events');
const server = require('./server-status/server');

// Gun Store
require('./gun-store/colshapes');
require('./gun-store/markers');
// Wait for everything to load, then allow connections once all is loaded
(async () => {
    await server.setAllOffline();
    mp.events.delayInitialization = false; //  Players cannot join until this is false
})();