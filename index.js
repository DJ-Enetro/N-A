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
    const countBefore = bot.getInventoryItemQuantity(entityName);
    while (bot.getInventoryItemQuantity(entityName) <= countBefore) {
      await bot.findAndDigBlock(entityName);
    }
  }

  async function gatherMaterials() {
    while (!bot.inventoryContainsItem('spruce_log', { quantity: 16 })) {
      await gatherEntity('spruce_log');
    }
    await craft('spruce_planks', num=8);
    await craft('crafting_table', num=1);
    await craft('stick', num=5);

    search_results = bot.findBlocks({blockNames: ['grass']});
    let on_block = search_results[0].result;
    await placeCraftingTable(on_block);
    
    /*
    blockList = bot.findBlocks('grass');
    bot.chat(blockList[0].toString());
    surfaceBlocks = blockList.filter((b) => bot.mineflayer().blockAt(b.position.offset(0, 1, 0)).type === 0);
    utilityBlockPlacedOn = surfaceBlocks[0];
    */
    
    // utilityBlockPlacedOn = await bot.findBlock('grass_block', {onlyFindTopBlocks:true, maxDistance:20});

    while (bot.getInventoryItemQuantity('spruce_log') <= 12) {
      await gatherEntity('spruce_log');
    }
    
    while (bot.getInventoryItemQuantity('cobblestone') <= 20) {
      await gatherEntity('stone');
    }

    await bot.approachBlock(craftingTableLocation);
    await craft('stone_pickaxe', num=1, station=craftingTableLocation);
    await craft('stone_shovel', num=1, station=craftingTableLocation);
    
    while (bot.getInventoryItemQuantity('cobblestone') <= 40) {
      await gatherEntity('stone');
    }
    
    await bot.approachBlock(craftingTableLocation);
    await craft('stone_axe', num=1, station=craftingTableLocation);
    await craft('stone_pickaxe', num=6, station=craftingTableLocation);
    await craft('furnace', num=1, station=craftingTableLocation);
    await breakCraftingTable();
    
    while (bot.getInventoryItemQuantity('dirt') <= 32) {
      await gatherEntity('dirt');
    }

    // while (!bot.inventoryContainsItem('cobblestone', { quantity: 40 })) {

    search_results = bot.findBlocks({blockNames: ['stone']});
    on_block = search_results[0].result;
    // utilityBlockPlacedOn = await bot.findBlock('stone', {onlyFindTopBlocks:true, maxDistance:20});
    await placeCraftingTable(on_block);
    await bot.approachBlock(craftingTableLocation);
  }

  async function craft(item, num = 1, station=null) {
    if (station != null) {
      result = await bot.craftItem(item, {quantity:num, craftingTable:station});
    } else {
      result = await bot.craftItem(item, {quantity:num});
    }
    let msg;
    if (!result) {
      msg = 'why do I not have';
      msg += String(item);
    } else {
      msg = String(num);
      msg += item;
      msg += 'crafted';
    }
    bot.chat(msg);
  }

  async function placeCraftingTable(on_block) {
    await bot.placeBlock('crafting_table', on_block);
    craftingTableLocation = bot.findBlock('crafting_table');
  }

  async function breakCraftingTable() {
    await bot.findAndDigBlock('crafting_table');
    craftingTableLocation = null;
  }

  async function goMining() {
    while (!bot.inventoryContainsItem('coal', { quantity: 30 })) {
      blockToMine = await detect('coal_ore');
      bot.approachAndDigBlock(blockToMine);
    }
    
    while (!bot.inventoryContainsItem('raw_iron', { quantity: 32 })) {
      blockToMine = await detect('iron_ore');
      bot.approachAndDigBlock(blockToMine);
    }
  }

  async function detect(resource) {
    let meters = 30;
    let spot = await bot.findBlock(resource, { distance: meters });
    if (spot === null) {
      while (spot === null) {
        meters += 30;
        spot = await bot.findBlock(resource, { distance: meters });
      }
    } else {
      return spot;
    }
    
  }
  async function debugRun() {
    while (!bot.inventoryContainsItem('spruce_log', { quantity: 1 })) {
      await gatherEntity('spruce_log');
    }
    await craft('spruce_planks');
    await craft('crafting_table');

    const blocks1 = bot.findBlocks({blockNames: ['grass']});
    chosen = blocks1[0];
    let block = chosen.result;
    let pos = block.position;
    bot.chat(bot.vecToString(pos));
    bot.chat(chosen.value.toString());
    
    bot.placeBlock('crafting_table', block);
  
    // let surfaceBlocks = blocks1.filter((block) => bot.mineflayer().blockAt(block.position.plus(0, 1, 0)).type === 0);
    // let pick = surfaceBlocks[0];
    


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
    let search_results;
    
    let blockList;
    let surfaceBlocks;

    //await debugRun();
    await gatherMaterials();

    while (true) {
      await goMining();
    }

    
  });



}

exports.configureBot = configureBot;