import { Item } from './Item';
import { Spell } from './spells';
export class Characters {
    name?: string;
    image?: string;
    hp?: number;
    maxHp?: number;
    strength?: number;
    defense?: number;
    ressource?: number;
    ressource_type?: string;
    maxRessource?: number;
    spells?: Array<Spell>;
    inventory: Array<Item> = [];
    equippedItems: Array<Item> = [];
    isPlayer: boolean = false;
    isTurn: boolean = false;
    increment: number = 0;

    constructor(builder: CharactersBuilder) {
        this.name = builder.name;
        this.image = builder.image;
        this.hp = builder.hp;
        this.maxHp = builder.maxHp;
        this.strength = builder.strength;
        this.defense = builder.defense;
        this.ressource = builder.ressource;
        this.ressource_type = builder.ressource_type;
        this.maxRessource = builder.maxRessource;
        this.spells = builder.spells;
        // this.inventory = builder.inventory;
        // this.equippedItems = builder.equippedItems;
        this.increment = builder.increment;
    }
    public sleep(time: number) {
        return new Promise((resolve) => setTimeout(resolve, time));
    }
    public isAlive(target: Characters): void {
        if (this.hp! <= 0) {
            this.die(target);
        }
    }
    /**
 * 
 * @returns a message if the character is dead
 */
    public die(target: Characters): void {
        // Usage!
        this.sleep(1500).then(() => {
            // Do something after the sleep!  
            if (this.isPlayer) {
                document.getElementById("rpg-text-box")!.innerHTML = `<div class="center"><strong>You are dead</strong></div>`;
                document.getElementById("rpg-text-box")!.innerHTML += `<div class="center"><strong>Game Over</strong></div>`;
                document.getElementById("rpg-text-box")!.innerHTML += `<div class="center"><strong>Refresh the page to play again</strong></div>`;
            }
            else
                document.getElementById("rpg-text-box")!.innerHTML = `<div class="center"><strong><p>${this.name} is dead.</p><p>Well done !</p></strong></div>`;
            const randomNumber = Math.floor(Math.random() * 49);
            target.inventory!.push(this.inventory![randomNumber]);
            setTimeout(() => {
                document.getElementById("rpg-text-box")!.innerHTML = `<div style="margin-top:0.5rem;" class=""><strong><p style="margin-top:0;">You gained ${this.inventory![randomNumber].name}!</p> ${this.inventory![randomNumber].image}</strong></div>`;
            }, 1000);
            setTimeout(() => {
                target.equipItem(this.inventory![randomNumber], this);
            }, 1500);


        });
        // !.innerHTML = `<div class="center"><strong>${this.name} is dead</strong></div>`);
    }
    public healthbars(): void {
        let healthBar;
        this.isPlayer ? healthBar = document.getElementById('player-hp-bar') : healthBar = document.getElementById('enemy-hp-bar');
        const currentHealth = this.hp;
        const maxHealth = this.maxHp;
        this.hp! > 0 ? healthBar!.style.width = `${(currentHealth! / maxHealth!) * 100}%` : healthBar!.style.width = "100%";
        this.hp! > 0 ? healthBar!.innerHTML = `${Math.floor(this.hp!)} hp` : healthBar!.innerHTML = 'DEAD';
        this.hp! > 0 ? "" : healthBar!.style.backgroundColor = 'red';
    }
    /**
     * 
     * @param damage the amount of damage to be taken
     * 
     */
    public takeDamage(damage: number, target: Characters): void {
        this.hp! -= damage - this.defense! * 0.5;
        this.healthbars();
        this.isAlive(target);
    }
    public attack(target: Characters): void {
        if (this.hp! > 0 && target.hp! > 0) {
            document.getElementById("rpg-text-box")!.innerHTML = `<div class="center">${this.image}  <img src='https://images.contentstack.io/v3/assets/blt731acb42bb3d1659/blt72195c8d98391772/5fa1f09df9cf41781dad68fe/6692_Assassin_T4_Eclipse.png'>  ${target.image}</div>`;
            target.takeDamage(this.strength! + this.strength! * 0.3, this);
            // Usage!
            this.sleep(1000).then(() => {
                // Do something after the sleep!  
                if (this.isPlayer) {
                    target.ability(this, target.spells![Math.floor(Math.random() * target.spells!.length)]);
                }
            });
        }

    }
    public ability(target: Characters, spell: Spell): void {

        if (spell.isUltimate && this.isPlayer) {
            let ultimateCooldown = true;
            if (ultimateCooldown) {
                document.getElementById("spell3")!.style.backgroundColor = "red";
                document.getElementById("spell3")?.setAttribute("disabled", "true");
            }
        } else if (spell.isUltimate && !this.isPlayer) {
            let ultimateCooldown = true;
            if (ultimateCooldown) {
                this.spells!.pop();
            }
        }
        if (this.hp! > 0 && target.hp! > 0 && this.ressource! >= spell.manaCost) {
            target.takeDamage(spell.damage + this.strength! * 0.5, this);
            this.ressource! -= spell.manaCost;
            let manaBar;
            this.isPlayer ? manaBar = document.getElementById('player-mana-bar') : manaBar = document.getElementById('enemy-mana-bar');
            const currentMana = this.ressource;
            const maxMana = this.maxRessource;
            manaBar!.style.width = `${(currentMana! / maxMana!) * 100}%`;
            manaBar!.innerHTML = `${this.ressource} ${this.ressource_type}`;

            if (this.ressource! <= 0 && this.ressource_type === "Mana") {
                manaBar!.style.width = "100%";
                manaBar!.style.backgroundColor = 'lightblue';
                this.ressource = 0;
                manaBar!.innerHTML = `OOM`;
            } else if (this.ressource_type === "None" || this.ressource_type === "Blood Well") {
                manaBar!.innerHTML = '';
            }
            document.getElementById("rpg-text-box")!.innerHTML = `<div id="center" class="center">${this.image}  ${spell.name}  ${target.image}</div>`;
            // Usage!
            this.sleep(1000).then(() => {
                // Do something after the sleep!  
                if (this.isPlayer) {
                    if (target.hp! > 0) {
                        if (Math.random() > 0.3) {
                            target.ability(this, target.spells![Math.floor(Math.random() * target.spells!.length)]);
                        } else if (Math.random() > 0.9) {
                            target.equipItem(target.inventory![Math.floor(Math.random() * target.inventory!.length)], this);
                        }
                        else {
                            target.ability(this, target.spells![Math.floor(Math.random() * target.spells!.length)]);
                            this.sleep(1000).then(() => {
                                target.equipItem(target.inventory![Math.floor(Math.random() * target.inventory!.length)], this);
                            });
                        }

                    }
                }
            });

        } else if (this.ressource! < spell.manaCost && this.hp! > 0 && target.hp! > 0) {
            this.attack(target);
        }
        else return;
    }
    public equipItem(item: Item, target: Characters): void {
        if (this.hp! > 0) {
            if (this.equippedItems!.length < 6) {
                if (this.isPlayer) {
                    if (confirm(`Do you want to equip ${item.name} ? Stats : ${item.damage} damage ${item.health == undefined ? "" : item.health + " health"} ${item.armor == undefined ? "" : item.armor + " armor"}`)) {
                        this.strength! += item.damage!;
                        if (item.health !== undefined) {
                            this.hp! += item.health;
                            this.maxHp! += item.health;
                            const healthBar = document.getElementById('player-hp-bar');
                            const currentHealth = this.hp;
                            const maxHealth = this.maxHp;
                            healthBar!.style.width = `${(currentHealth! / maxHealth!) * 100}%`;
                            healthBar!.innerHTML = `${Math.floor(this.hp!)} hp`;
                        }
                        if (item.armor !== undefined) {
                            this.defense! += item.armor;
                        }
                        this.equippedItems = [...this.equippedItems!, item];
                        document.getElementById("items_title")!.innerHTML = `<div>Equipped items :</div><br><br>`;
                        // document.getElementById("equipped_items")!.innerHTML += `<div class="equipped_items" data-value="${item.name}">${item.image}</div>`;
                        document.getElementById("equipped_items")!.innerHTML += `
                    <div class="equipped-item" data-value="${item.name}">
                      <div>${item.image}</div>
                    </div>
                  `;

                        document.querySelectorAll('.equipped-item').forEach((equippedItem) => {
                            equippedItem.addEventListener('click', () => {
                                const itemName = (equippedItem as HTMLElement).dataset.value;
                                const item: any = this.equippedItems!.find((item) => item.name === itemName);
                                this.unequipItem(item, target);
                                equippedItem.remove();
                            });
                        });

                        this.increment++;
                        document.getElementById("rpg-text-box")!.innerHTML = `<p>${this.image} equipped ${item.image}</p>`;
                        for (let i = 0; i < this.spells!.length; i++) {
                            document.getElementById(`spell_damage${i}`)!.innerHTML = `Damage : ${Math.ceil(this.spells![i].damage + this.strength! * 0.5)}`;
                        }
                        this.sleep(1000).then(() => {
                            if (this.isPlayer) {
                                target.ability(this, target.spells![Math.floor(Math.random() * target.spells!.length)]);
                            }
                        });
                    }
                } else {
                    this.strength! += item.damage!;
                    if (item.health !== undefined) {
                        this.hp! += item.health;
                        this.maxHp! += item.health;
                        const healthBar = document.getElementById('enemy-hp-bar');
                        const currentHealth = this.hp;
                        const maxHealth = this.maxHp;
                        healthBar!.style.width = `${(currentHealth! / maxHealth!) * 100}%`;
                        healthBar!.innerHTML = `${Math.floor(this.hp!)} hp`;
                    }
                    this.equippedItems = [...this.equippedItems!, item];
                    document.getElementById("enemy_items")!.innerHTML += `<span class="enemy_item">${item.image}</span>`;
                    document.getElementById("rpg-text-box")!.innerHTML = `<p>${this.image} equipped ${item.image}</p>`;
                    this.inventory?.splice(this.inventory.indexOf(item), 1);
                }
            }
            else {
                document.getElementById("rpg-text-box")!.innerHTML = `<p>${this.image} <strong> cannot equip ${item.image}</strong></p><p>A maximum of 6 items can be equipped</p>`;
            }
        }
    }
    public unequipItem(item: Item, target: Characters): void {
        if (this.hp! > 0) {
            this.strength! -= item.damage!;
            if (item.health !== undefined) {
                this.maxHp! -= item.health;
                this.takeDamage(item.health, target);
            }
            if (item.armor !== undefined) {
                this.defense! -= item.armor;
            }
            this.equippedItems.splice(this.equippedItems.indexOf(item), 1);
            for (let i = 0; i < this.spells!.length; i++) {
                document.getElementById(`spell_damage${i}`)!.innerHTML = `Damage : ${Math.ceil(this.spells![i].damage + this.strength! * 0.5)}`;
            }
            document.getElementById("rpg-text-box")!.innerHTML = `<p>${this.image} unequipped ${item.image}</p>`;
        }
    }
    public showInventory(): void {
        document.getElementById("items_title")!.innerHTML = `<div>Equipped items :</div><br><br>`;
        this.equippedItems!.forEach(item => {
            document.getElementById("equipped_items")!.innerHTML += `<div>${item.image}</div>`;

        });
    }
}

export class CharactersBuilder {
    name?: string;
    image?: string;
    hp?: number;
    maxHp?: number;
    strength?: number;
    defense?: number;
    ressource?: number;
    ressource_type?: string;
    maxRessource?: number;
    spells?: Array<Spell>;
    inventory?: Array<Item>;
    equippedItems?: Array<Item>;
    increment: number = 0;

    addName(name: string): CharactersBuilder {
        this.name = name;
        return this;
    }
    addImage(image: string): CharactersBuilder {
        this.image = image;
        return this;
    }
    addHp(hp: number): CharactersBuilder {
        this.hp = hp;
        return this;
    }
    addMaxHp(maxHp: number): CharactersBuilder {
        this.maxHp = maxHp;
        return this;
    }
    addStrength(strength: number): CharactersBuilder {
        this.strength = strength;
        return this;
    }
    addDefense(defense: number): CharactersBuilder {
        this.defense = defense;
        return this;
    }
    addRessource(ressource: number): CharactersBuilder {
        this.ressource = ressource;
        return this;
    }
    addRessourceType(ressource_type: string): CharactersBuilder {
        this.ressource_type = ressource_type;
        return this;
    }
    addMaxRessource(maxRessource: number): CharactersBuilder {
        this.maxRessource = maxRessource;
        return this;
    }
    addSpells(spells: Array<Spell>): CharactersBuilder {
        this.spells = spells;
        return this;
    }
    addInventory(inventory: Array<Item>): CharactersBuilder {
        this.inventory = inventory;
        return this;
    }
    addEquippedItems(equippedItems: Array<Item>): CharactersBuilder {
        this.equippedItems = equippedItems;
        return this;
    }
    addIncrement(increment: number): CharactersBuilder {
        this.increment = increment;
        return this;
    }
    build(): Characters {
        return new Characters(this);
    }
}
