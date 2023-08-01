import { Component, OnInit, ViewChild } from '@angular/core';
import { PokeapiService } from '../../services/pokeapi.service';
import { Pokemon } from '../../models/pokemon';
import { MatTable } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { EditDialogComponent, EditDialogData } from '../edit-dialog/edit-dialog.component';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  pokemons: Pokemon[] = [];
  displayedColumns: string[] = ['imageUrl', 'name', 'skills', 'type', 'action'];

  @ViewChild(MatTable) table!: MatTable<any>;

  constructor(
    private pokeapiService: PokeapiService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.initPokemonList();
  }

  editPokemon(pokemon: Pokemon) {
    this.openEditDialog(pokemon, 'edit');
  }

  addPokemon() {
    const emptyPokemon: Pokemon = {
      imageUrl: '',
      name: '',
      skills: [],
      type: ''
    };
    this.openEditDialog(emptyPokemon, 'new');
  }

  private initPokemonList() {
    const limit = 5;
    const offset = 0;
    this.pokeapiService.getPokemonList(limit, offset).subscribe((data) => {
      if (data.results) {
        this.pokemons = [];
        data.results.forEach(result => {
          const { name } = result;
          this.getPokemon(name);
        });
      }
    });
  }
  
  private getPokemon(name: string) {
    this.pokeapiService.getPokemon(name).subscribe((pokemon) => {
      this.pokemons.push(pokemon);
      this.updateTable();
    });
  }

  private openEditDialog(pokemon: Pokemon, type: 'edit' | 'new') {
    let pokemonCopy = { ...pokemon }
    const dialogRef = this.dialog.open(EditDialogComponent, { 
      data: {
        pokemon: pokemonCopy,
        type
      } as EditDialogData
    });
    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        console.log('afterClosed');
        const { pokemon: newPokemon } = data;
        switch(type) {
          case 'new': 
            this.addNewPokemonOnList(newPokemon);
            break;
          case 'edit': 
            this.editExistPokemon(pokemon, newPokemon);
        }
      }
    });
  }

  private addNewPokemonOnList(pokemon: Pokemon) {
    const pokemonIndex = this.pokemons.indexOf(pokemon);
    if (pokemonIndex < 0) {
      this.pokemons.push(pokemon);
      this.updateTable();
    }
  }

  private editExistPokemon(oldPokemon: Pokemon, newPokemon: Pokemon) {
    const pokemonIndex = this.pokemons.indexOf(oldPokemon);
    if (pokemonIndex >= 0) {
      this.pokemons[pokemonIndex] = newPokemon;
      this.updateTable();
    }
  }

  private updateTable() {
    this.table.renderRows();
  }
}
