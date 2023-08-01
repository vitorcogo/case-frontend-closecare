import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Pokemon } from 'src/app/models/pokemon';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { Item } from 'src/app/models/item';
import { PokeapiService } from 'src/app/services/pokeapi.service';

export interface EditDialogData {
  type: 'edit' | 'new';
  pokemon: Pokemon;
}

@Component({
  selector: 'app-edit-dialog',
  templateUrl: './edit-dialog.component.html',
  styleUrls: ['./edit-dialog.component.scss']
})
export class EditDialogComponent implements OnInit {

  pokemon!: Pokemon;
  title: string = 'Editar';
  action: string = 'Salvar';
  pokemonTypes!: Observable<Item[]>;

  readonly separatorKeysCodes = [ ENTER, COMMA ] as const;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: EditDialogData,
    public dialogRef: MatDialogRef<EditDialogComponent>,
    private pokeapiService: PokeapiService
  ) { 
    this.pokemon = this.data.pokemon;
  }

  ngOnInit(): void {
    this.setDialogProperties();
    this.getPokemonTypes();
  }

  onCancel() {
    this.dialogRef.close();
  }

  addSkill(event: MatChipInputEvent): void {
    const skill = (event.value || '').trim();
    if (skill) {
      this.pokemon.skills.push(skill);
    }
    event.chipInput!.clear();
  }

  removeSkill(skill: string) {
    const index = this.pokemon.skills.indexOf(skill);
    if (index >= 0) {
      this.pokemon.skills.splice(index, 1);
    }
  }

  displayAutocomplete(pokemonType: string): string {
    return pokemonType ?? '';
  }

  private getPokemonTypes() {
    const limit = 50;
    const offset = 0;
    this.pokemonTypes = this.pokeapiService.getPokemonTypes(limit, offset);
  }

  private setDialogProperties() {
    switch (this.data.type) {
      case 'edit': {
        this.title = 'Editar';
        this.action = 'Salvar';
        break;
      }
      case 'new': {
        this.title = 'Adicionar';
        this.action = 'Adicionar';
        break;
      }
    }
  }
}
