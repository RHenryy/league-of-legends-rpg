import './style.css'
import { CharactersBuilder } from './classes/Characters';
import { createSpellsFromAPI } from './classes/spells';
import ItemBuilder from './classes/Item.js';

// PROMISES
async function getData() {
  const championResponse = await fetch('http://ddragon.leagueoflegends.com/cdn/13.8.1/data/en_US/champion.json');
  const championData = await championResponse.json();

  const championArray = Object.keys(championData.data).map(key => {
    const championName = championData.data[key].id;
    return fetch(`https://ddragon.leagueoflegends.com/cdn/13.8.1/data/en_US/champion/${championName}.json`)
      .then(response => response.json())
      .then(champion => champion.data[championName]);
  });
  const allChampionData = await Promise.all(championArray);

  const itemResponse = await fetch('http://ddragon.leagueoflegends.com/cdn/13.8.1/data/en_US/item.json');
  const itemData = await itemResponse.json();

  return { champions: allChampionData, items: itemData };
}

// FETCH AND USE DATA
(async () => {
  const data = await getData();
  console.log(data.champions);
  //// Pushing instantiation of champions in array ////
  // using characters builder and spells builder //
  const champion_instance = [];
  for (let i = 0; i < data.champions.length; i++) {
    champion_instance.push(new CharactersBuilder().addName(data.champions[i].name).addHp(data.champions[i].stats.hp).addStrength(data.champions[i].stats.attackdamage).addDefense(data.champions[i].stats.armor).addRessource(data.champions[i].stats.mp).addRessourceType(data.champions[i].partype).addMaxRessource(data.champions[i].stats.mp).addSpells(createSpellsFromAPI(data.champions[i].spells)).addMaxHp(data.champions[i].stats.hp).addImage(`<img src="https://ddragon.leagueoflegends.com/cdn/13.8.1/img/champion/${data.champions[i].image.full}">`).build());
  }
  ///// Pushing the api data in array //////
  let item_url = "<img src='https://ddragon.leagueoflegends.com/cdn/13.8.1/img/item/";
  let items: Array<any> = [];
  Object.keys(data.items.data).forEach(function (key) {
    items.push(data.items.data[key]);
  });
  const filtered_items_response = items.filter(item => item.depth >= 3 && item.tags.includes('Damage') && item.name !== "The Golden Spatula");
  //// instantiation of filtered items pushed in array /////
  // using item builder //
  let item_instances = [];
  for (let i = 0; i < filtered_items_response.length; i++) {
    item_instances.push(new ItemBuilder().addName(filtered_items_response[i].name).addDamage((filtered_items_response[i].stats.FlatPhysicalDamageMod ? filtered_items_response[i].stats.FlatPhysicalDamageMod : filtered_items_response[i].stats.FlatMagicDamageMod)).addImage(item_url + filtered_items_response[i].image.full + "'>").addHealth(filtered_items_response[i].stats.FlatHPPoolMod).addArmor(filtered_items_response[i].stats.FlatArmorMod).build());
  }
  const filtered_items = item_instances.filter(item => item.damage !== undefined);
  //// Rendering the items grid ////
  for (let i = 0; i < filtered_items.length - 12; i++) {
    document.querySelector<HTMLDivElement>('#grid')!.innerHTML += `
      <div id="item${i}" class="grid-row">${filtered_items[i].image}</div>
      `;
  }
  //// Actual instantiation of the characters ////
  let player = champion_instance[115];
  let NPC = champion_instance[148];
  console.log(NPC);
  ///// Settings /////
  player.isPlayer = true;
  const target = NPC;
  NPC.inventory = filtered_items.slice();
  ///// UI /////////
  document.querySelector<HTMLDivElement>('#ui-rpg')!.innerHTML = `
   <div>
    <p>${NPC.image}</p>
    <p><strong>${NPC.name}</strong></p>
    <div id="enemy_items"></div>
    <div class="health-bar">
    <div id="enemy-hp-bar" class="health-bar-inner">${NPC.hp} Hp</div>
    </div>
    <div class="health-bar">
    <div id="enemy-mana-bar">${NPC.ressource} ${NPC.ressource_type}</div>
    </div>
    <div id="rpg-text-box" class="rpg-text-box">
    <p><strong>Click on the icons to use your spells.</strong></p>
    <p><strong>Click on an item on the right to equip or unequip it.</strong></p>
    <p><strong>You can equip up to 6 items. Each item has different stats.</strong></p>
    <p><strong>The enemy will counter attack one second after you take an action.</strong></p>
    <p><strong>Both you and your opponent can only use your ultimate ability once during a fight.</strong></p>
    </div>
    <div class="rpg-container">  
    <p>${player.image}</p>  
    <p><strong>${player.name}</strong></p>  
    <div  class="health-bar">
    <div id="player-hp-bar" class="health-bar-inner">${player.hp} Hp</div>
    </div>
    <div class="health-bar">
    <div  id="player-mana-bar">${player.ressource} ${player.ressource_type}</div>
    </div>
    <div id="player-spells" class="rpg-btn-group">
    <button class="rpg-btn" id="spell0"><span id="spell_damage0"> Damage : ${Math.floor(player.spells![0].damage + player.strength! * 0.5)}</span>${player.spells![0].name}</button>
    <button class="rpg-btn" id="spell1"> <span id="spell_damage1"> Damage : ${Math.floor(player.spells![1].damage + player.strength! * 0.5)}</span>${player.spells![1].name}</button>
    <button class="rpg-btn" id="spell2"><span id="spell_damage2"> Damage : ${Math.floor(player.spells![2].damage + player.strength! * 0.5)}</span>${player.spells![2].name}</button>
    <button class="rpg-btn" id="spell3"><span id="spell_damage3"> Damage : ${Math.floor(player.spells![3].damage + player.strength! * 0.5)}</span>${player.spells![3].name}</button>
    </div>
    </div>
  </div>
 `;
  //// Player spells event listeners ////
  for (let i = 0; i < player.spells!.length; i++) {
    document.getElementById(`spell${i}`)!.addEventListener("click", () => {
      player.ability(NPC, player.spells![i])
    });
  }
  //// Items event listeners ////
  for (let i = 0; i < filtered_items.length; i++) {
    let item = document.getElementById("item" + i);
    item?.addEventListener("click", () => {
      player.equipItem(filtered_items[i], target);
      if (!player.equippedItems.includes(filtered_items[i])) {
        return;
      }
      if (player.equippedItems.length < 6) {
        item!.remove();
      }
    });
  }
  //// Ressource bar styles depending on type of ressource ////
  if (player.ressource_type === "Mana") {
    document.getElementById("player-mana-bar")!.classList.add("mana-bar-inner");
  }
  else if (player.ressource_type === "Energy") {
    document.getElementById("player-mana-bar")!.classList.add("energy-bar-inner");
  }
  else if (player.ressource_type === "Fury" || player.ressource_type === "Rage") {
    document.getElementById("player-mana-bar")!.classList.add("fury-bar-inner");
  }
  if (NPC.ressource_type === "Mana") {
    document.getElementById("enemy-mana-bar")!.classList.add("mana-bar-inner");
  }
  else if (NPC.ressource_type === "Energy") {
    document.getElementById("enemy-mana-bar")!.classList.add("energy-bar-inner");
  }
  else if (NPC.ressource_type === "Fury" || NPC.ressource_type === "Rage") {
    document.getElementById("enemy-mana-bar")!.classList.add("fury-bar-inner");
  }

  // for(let i=0;i<filtered_items.length;i++){
  //   let item = document.getElementById("item"+i);
  //   item?.addEventListener("click", () => {
  //     player.equipItems(filtered_items[i]);
  //   });
  // }
  // })

  // .catch((error) => {
  //   console.error(error);
  // });
})();


