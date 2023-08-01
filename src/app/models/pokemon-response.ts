import { Item } from "./item";

export interface PokemonResponse {
  name: string;
  abilities: AbilityItem[];
  types: TypeItem[];
  sprites: Sprites;
}

interface AbilityItem {
  ability: Item;
  is_hidden: boolean;
  slot: number;
}

interface TypeItem {
  type: Item;
  slot: number;
}

interface Sprites {
  back_default: string;
  back_female: string;
  back_shiny: string;
  back_shiny_female: string;
  front_default: string;
  front_female: string;
  front_shiny: string;
  front_shiny_female: string;
}