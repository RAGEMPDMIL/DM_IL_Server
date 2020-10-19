const vehicles = require('../data/vehicle-data.json').Vehicles;
const adminLevel = require('../../admin-system/commands');

mp.events.addCommand('vcolor', async (player,fullText,r1,g1,b1,r2,g2,b2) => {
    const aLevel = await adminLevel.getAdminLevel(player.name);
    if(aLevel < 1) return player.outputChatBox("!{#ff0000}you cannot use this command");
    player.veh.setColorRGB(Number(r1), Number(g1), Number(b2), Number(r2), Number(g2), Number(b2));
    player.notify("~g~vehicle color changed");
});
mp.events.addCommand('vcall', async(player) => {
    const aLevel = await adminLevel.getAdminLevel(player.name);
    if(aLevel < 1) return player.outputChatBox("!{#ff0000}you cannot use this command");
    player.veh.position = player.position
    player.putIntoVehicle(player.veh,0);
    player.notify("~g~you called your car !");
});
mp.events.addCommand('vehicle', async(player, vehicle) => {
    const aLevel = await adminLevel.getAdminLevel(player.name);
    if (aLevel < 1){
        return player.outputChatBox("!{#ff0000}you cannot use this command");
    } else
    {
        if (player.vehicle) {
            return player.outputChatBox("!{#FF7D3C}! אינך יכול לבצע פקודה זו ברכב");
        }
        if (!vehicle) {
            return player.outputChatBox('!{#ff0000}Error!{#ffffff} /vehicle [model]');
        }
        if(player.veh){
            player.veh.destroy();
        }
        const selectedVehicle = vehicle.toLowerCase();
        if(vehicles[selectedVehicle]) {
            const playerPos = player.position;
            const random = Math.floor(Math.random() * 255) + 1;
            player.veh = mp.vehicles.new(vehicles[selectedVehicle].hash, playerPos, {
                numberPlate: `${player.name}`,
                color: [
                    [random, random, random],
                    [random, random, random]
                ]
            });
            player.putIntoVehicle(player.veh, 0);
            player.notify(`~g~you created ${vehicle} !`);
        } else {
            return player.outputChatBox('!{#ff0000}Error!{#ffffff} vehicle model not found');
        }
    }
});

mp.events.addCommand('vmod', async(player, _, modType) => {
    const aLevel = await adminLevel.getAdminLevel(player.name);
    if(aLevel < 1) return player.outputChatBox("!{#ff0000}you cannot use this command");
    if (!player.vehicle) return player.outputChatBox("!{#FF7D3C}You need to be in a vehicle to use this command.");
    if (!modType) return player.outputChatBox("!{#FF7D3C}/mod (מitro|horn|engine|breaks|shield|all)");
    if (modType == 'nitro') {

        player.vehicle.setMod(parseInt(40), parseInt(2));
        player.notify("~g~Nitro added to your vehicle !");

    } else if (modType == 'horn') {

        let random = Math.floor(Math.random() * 33) + 1;
        player.vehicle.setMod(parseInt(14), parseInt(random));
        player.notify("~g~Random horn added to your vehicle !");

    } else if (modType == 'engine') {

        player.vehicle.setMod(parseInt(11), parseInt(3));
        player.notify("~g~Racing engine added to your vehicle !");

    } else if (modType == 'breaks') {

        player.vehicle.setMod(parseInt(13), parseInt(2));
        player.notify("~g~Racing breaks added to your vehicle !");

    } else if (modType == 'shield') {

        player.vehicle.setMod(parseInt(16), parseInt(4));
        player.notify("~g~Shields added to your vehicle !");

    } else if (modType == 'all') {

        player.vehicle.setMod(parseInt(40), parseInt(2));
        let random = Math.floor(Math.random() * 33) + 1;
        player.vehicle.setMod(parseInt(14), parseInt(random));
        player.vehicle.setMod(parseInt(16), parseInt(4));
        player.vehicle.setMod(parseInt(13), parseInt(2));
        player.vehicle.setMod(parseInt(11), parseInt(3));
        player.notify("~g~you added all the mods !");

    } else{
        player.outputChatBox("!{#FF7D3C}/mod (מitro|horn|engine|breaks|shield|all)");
    }
});


