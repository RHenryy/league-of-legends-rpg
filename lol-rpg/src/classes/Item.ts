export class Item {
    name?: string;
    image?: string;
    health?: number;
    damage?: number | undefined;
    armor?: number;
    strength?: number;
    agility?: number;
    rarity?: string;
    durability?: number;
    droprate?: number;
    equipped?: boolean;


    constructor(builder: ItemBuilder) {
        this.name = builder.name;
        this.image = builder.image;
        this.health = builder.health;
        this.damage = builder.damage;
        this.armor = builder.armor;
        this.strength = builder.strength;
        this.agility = builder.agility;
        this.rarity = builder.rarity;
        this.durability = builder.durability;
        this.droprate = builder.droprate;
        this.equipped = false;
    }
}

class ItemBuilder {
    name?: string;
    image?: string;
    health?: number;
    damage?: number;
    armor?: number;
    strength?: number;
    agility?: number;
    rarity?: string;
    durability?: number;
    droprate?: number;

    addName(name: string): ItemBuilder {
        this.name = name;
        return this;
    }
    addImage(image: string): ItemBuilder {
        this.image = image;
        return this;
    }
    addHealth(health: number): ItemBuilder {
        this.health = health;
        return this;
    }

    addDamage(damage: number): ItemBuilder {
        this.damage = damage;
        return this;
    }
    addArmor(armor: number): ItemBuilder {
        this.armor = armor;
        return this;
    }
    addStrength(strength: number): ItemBuilder {
        this.strength = strength;
        return this;
    }

    addAgility(agility: number): ItemBuilder {
        this.agility = agility;
        return this;
    }

    addRarity(rarity: string): ItemBuilder {
        this.rarity = rarity;
        return this;
    }

    addDurability(durability: number): ItemBuilder {
        this.durability = durability;
        return this;
    }

    addDroprate(droprate: number): ItemBuilder {
        this.droprate = droprate;
        return this;
    }

    build(): Item {
        return new Item(this);
    }
}


export default ItemBuilder;