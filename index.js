/**
 * This strategy is an advanced example of how to customize movements, place blocks, and craft items with the rg-bot package.
 * The Bot will collect coal until it has 100 points-worth of items in its inventory.
 * (Note: Coal_Ore and apples are each worth 1 point.  Why apples you say?  Apples are a possible byproduct from collecting the logs to create new pickaxes.)
 *
 * @param {RGBot} bot
 */
function configureBot(bot) {

  bot.setDebug(true);
    
  /*
  Strategy
  
  2v2: Bot will go mining for coal and iron, player will kill mobs, get bell, bread and poppies
  
  ** Early game **
  
  - craft 8 stone picks > 2 wood logs
  - crafting table > 1 wood log
  - charcoal? > 4 planks, 6 logs: 7 logs > 6 charcoal
  - sticks for torches > 1 log
  - wooden shovel
  12 logs and and 24 stone
  
  - reach stone level, mine two layers down, then place crafting table
  
  ** Mid game **
  
  - craft furnace
    - place down when 8 iron ore obtained, wait until all finished smelting, then take
  how to mine?
  
  */

  
  async function gatherWood() {
  
  }

  // Recreated from RG's Advanced Bot
  async function gatherEntity(entityName) {
    let skipCurrentEntity = false;
    const countBefore = bot.getInventoryItemQuantity(entityName);
    while (bot.getInventoryItemQuantity(entityName) <= countBefore) {
      const foundEntity = await bot.findBlock(entityName, {skipClosest: skipCurrentEntity});
      if (foundEntity) {
        const success = await bot.findAndDigBlock(entityName, {skipClosest: skipCurrentEntity});
        if (!success) {
          skipCurrentEntity = true;
        } else {
           skipCurrentEntity = false;
        }
      } else {
        skipCurrentEntity = false;
        let didWander = false;
        while (!didWander) {
          didWander = await bot.wander();
        }
      }
    }
  }

  async function gatherMaterials() {
    while (!bot.inventoryContainsItem('spruce_log', {quantity:12})) {
      await gatherEntity('spruce_log');
    }
    craft('spruce_planks', 12);
    if (!bot.inventoryContainsItem('crafting_table')) {
      bot.craftItem('crafting_table');
    }
    craft('sticks', 5);
    utilityBlockPlacedOn = bot.findBlock('grass_block');
    placeCraftingTable(utilityBlockPlacedOn);
    craft('wooden_shovel');
    craft('wooden_pickaxe');
    breakCraftingTable();
    
    while (!bot.inventoryContainsItem('cobblestone', {quantity:40})) {
      await gatherEntity('stone');
    }
    utilityBlockPlacedOn = bot.findBlock('stone');
    placeCraftingTable(utilityBlockPlacedOn);
    craft('stone_pickaxe', 7);
    craft('furnace');
    breakCraftingTable();
  }

  async function craft(item, num = 1) {
    await bot.craftItem(item, {quantity: num})
  }
  
  async function placeCraftingTable(targetBlock) {
    await bot.placeBlock('crafting_table', targetBlock, {reach: 3});
  }

  async function breakCraftingTable() {
    await bot.findAndDigBlock('crafting_table')
  }

  
  
  async function goMining() {
    while (true) {
      let toMine = detectCoalAndIron();
      bot.approachAndDigBlock(toMine);
    }
  }

  async function detectCoalAndIron() {
    let ironSpot = await bot.findBlock('iron_ore');
    let coalSpot = await bot.findBlock('coal_ore');
    if (coalSpot === null) {
      await bot.findBlock('coal_ore', {distance: 60});
    } else {
      return coalSpot;
    }
    if (ironSpot === null) {
      await bot.findBlock('iron_ore', {distance: 60});
    } else {
      return ironSpot;
    }
  }

  /*
  async function establishBase() {
    
  }
  
  async function mine(direction) {
    switch (direction)
      case "up":
        break;
      case "down":
        break;
      case "forward":
        break;
  }
  */
  
  bot.on('spawn', async () => {
    let craftingTableLocation = null;
    let utilityBlockPlacedOn;
    let furnaceLocation;
    let nextBlockToMine;
    
    await gatherMaterials();

    while (true) {
      await goMining();
    }
  });
  
  

}

exports.configureBot = configureBot;
