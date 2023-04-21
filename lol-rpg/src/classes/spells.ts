// interface APISpellData {
//     name: string;
//     description: string;
//     damage: number;
//     manaCost: number;
//     isUltimate: boolean;
// }
export class Spell {
    public name: string;
    public description: string;
    public damage: number;
    public manaCost: number;
    public isUltimate: boolean = false;

    constructor(name: string, description: string, damage: number, manaCost: number, isUltimate: boolean = false) {
        this.name = name;
        this.description = description;
        this.damage = damage;
        this.manaCost = manaCost;
        this.isUltimate = isUltimate;
    }
}

export function createSpellsFromAPI(data: any): Spell[] {
    const spells: Spell[] = [];
    for (const spellData of data) {
        spellData.name = `<img src='https://ddragon.leagueoflegends.com/cdn/13.8.1/img/spell/${spellData.image.full}'>`;
        spellData.manaCost = (spellData.cost[0]);
        if (spellData.maxrank === 3) {
            spellData.damage = 250;
            spellData.isUltimate = true;
        }
        else { spellData.damage = Math.ceil(Math.random() * 25) + 75 }
        const spell = new Spell(spellData.name, spellData.description, spellData.damage, spellData.manaCost, spellData.isUltimate);
        spells.push(spell);
    }
    return spells;
}
