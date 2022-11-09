/* eslint-disable @typescript-eslint/naming-convention */
import { Component, ViewChild } from '@angular/core';
import { IonRefresher, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  @ViewChild('refresherRef') refresherRef: IonRefresher;

  private randomWord = '';
  private definition = '';
  private examples: string[]= [];

  constructor() {
    this.getRandomWord();
  }

  getRandomWord(event?,searchWord?){
    let api='';

    this.randomWord = '';
    this.definition = '';
    this.examples = [];

    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': '50b87cb0b0msh6151e2337ed79b2p186142jsn4e916087a254',
        'X-RapidAPI-Host': 'wordsapiv1.p.rapidapi.com'
      }
    };

    api='';
    if(!searchWord){
      api='https://wordsapiv1.p.rapidapi.com/words/?random=true';
    }else{
      api=`https://wordsapiv1.p.rapidapi.com/words/${searchWord}`;
    }
    fetch(api, options)
      .then(response => response.json())
      .then(async response => {
        this.randomWord = response?.word;
        if(this.randomWord){
          await this.getDefinition(this.randomWord).then(async (val)=>{
            this.definition = val;
          });
        }else{

        }

        if(!this.definition){
          this.getRandomWord();
        }else{
          await this.refresherRef.complete();
        }
        this.getExamples(this.randomWord);
      })
      .catch(err => console.error(err));
  }

  getDefinition(word): Promise<any>{
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': '50b87cb0b0msh6151e2337ed79b2p186142jsn4e916087a254',
        'X-RapidAPI-Host': 'wordsapiv1.p.rapidapi.com'
      }
    };
    return fetch(`https://wordsapiv1.p.rapidapi.com/words/${word}/definitions`, options)
      .then(response => response.json())
      .then(response => response?.definitions[0]?.definition)
      .catch(err => console.error(err));
  }

  getExamples(word){
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': '50b87cb0b0msh6151e2337ed79b2p186142jsn4e916087a254',
        'X-RapidAPI-Host': 'wordsapiv1.p.rapidapi.com'
      }
    };
    fetch(`https://wordsapiv1.p.rapidapi.com/words/${word}/examples`, options)
      .then(response => response.json())
      .then(response => {
        this.examples = response.examples;
      })
      .catch(err => console.error(err));
  }

  onSearch($event){
    let searchWord = '';
    console.log('event',$event);
    searchWord = $event.detail.value;
    this.getRandomWord(null,searchWord);
  }
}
