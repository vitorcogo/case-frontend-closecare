import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";
import { map } from 'rxjs/operators'
import { ListResponse } from "../models/list-response";
import { Pokemon } from "../models/pokemon";
import { PokemonResponse } from "../models/pokemon-response";
import { Item } from "../models/item";

@Injectable({
  providedIn: 'root'
})
export class PokeapiService {
  private readonly API_URL = 'https://pokeapi.co/api/v2';
  
  constructor(private http: HttpClient) { }

  getPokemonList(limit: number, offset: number): Observable<ListResponse> {
    const url = `${this.API_URL}/pokemon?limit=${limit}&offset=${offset}`;
    return this.http.get<ListResponse>(url);
  }
  
  getPokemon(name: string): Observable<Pokemon> {
    const url = `${this.API_URL}/pokemon/${name}`;
    return this.http.get<PokemonResponse>(url)
      .pipe(
        map(response => this.transformPokemonResult(response))
      );
  }

  getPokemonTypes(limit: number, offset: number): Observable<Item[]> {
    const url = `${this.API_URL}/type?limit=${limit}&offset=${offset}`;
    return this.http.get<ListResponse>(url)
      .pipe(
        map(response => response.results)
      );
  }

  private transformPokemonResult(response: PokemonResponse): Pokemon {
    const { abilities, types, name, sprites } = response;

    let skills: string[] = [];
    abilities.forEach(el => skills.push(el.ability.name));

    return {
      name,
      skills,
      type: types[0].type.name,
      imageUrl: sprites.back_default
    };
  }
}