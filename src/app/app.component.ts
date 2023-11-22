import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { TEXTS_FR, TEXTS_EN, usaFlag } from '../textes';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  usaFlag = usaFlag;
  nbrErrors: number = 0; //number of errors
  textArea: string = ''; //text from textarea
  @ViewChild('myText', { static: false }) myText: ElementRef = {} as ElementRef; //text which has been typed element
  @ViewChild('textAreaElement', { static: false }) textAreaElement: ElementRef =
    {} as ElementRef; //textarea element
  currentText: string = ''; //current text to be typed
  currentTextTab: any = ''; //current text to be typed as array(to get each letter and move the cursor)
  textes: string[] = []; //set of all available texts
  dateStart: Date = new Date(); //start time
  dateEnd: Date = new Date(); //end time
  enableScore: boolean = false; //enable score(activated at the end)
  cursor: number = 0; //position of cursor in the current text array
  displayedTextLength: number = 0; //length of my text
  shuffleArray(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1)); // Index aléatoire entre 0 et i inclus
      [array[i], array[j]] = [array[j], array[i]]; // Échange des éléments aux positions i et j
    }
    return array;
  }
  constructor() {
    this.textes = this.shuffleArray(TEXTS_FR); //set textes
    this.currentText = this.textes[0]; //set current text
    this.currentTextTab = this.currentText.split(''); //set current text as array
    this.currentTextTab = this.currentTextTab.filter(
      (value: string) => value != '\n'
    ); //remove \n from array
    setTimeout(() => {
      //focus on textarea
      if (this.textAreaElement && this.textAreaElement.nativeElement) {
        this.textAreaElement.nativeElement.focus();
      }
    });
  }
  focusedLetter(i: number) {
    return i == this.cursor;
  }
  //move cursor forward

  getCurrentTextTab() {
    return this.currentTextTab;
  }
  //get the time between start and end of the test
  timeOut() {
    let time: any = this.dateEnd.getTime() - this.dateStart.getTime();
    time = time / 60000;
    time = time.toFixed(2);
    return time;
  }
  //get number of words in current text
  nbrWords() {
    return this.currentText.split(' ').length;
  }
  //get the enability of score
  isEnableScore() {
    return this.enableScore;
  }
  //display and hide result div
  result() {
    let result = document.getElementById('result') as HTMLDivElement;
    if (result.style.display == 'block') {
      this.hideResult();
    } else {
      result.style.display = 'block';
    }
  }
  hideResult() {
    let result = document.getElementById('result') as HTMLDivElement;
    result.style.display = 'none';
  }
  //get the current text
  getCurrentText() {
    return this.currentText;
  }
  //restart the test
  restart() {
    this.enableScore = false; //disable score
    this.hideResult(); //hide result div
    this.nbrErrors = 0; //reset number of errors
    this.textArea = ''; //reset textarea
    this.myText.nativeElement.innerHTML = ''; //reset myText
    //reset cursor
    this.cursor = 0;
    //length of my text
    this.displayedTextLength = 0;
    //focus on textarea
    setTimeout(() => {
      //focus on textarea
      if (this.textAreaElement && this.textAreaElement.nativeElement) {
        this.textAreaElement.nativeElement.focus();
      }
    });
    return;
  }
  //on input, amke checking
  check() {
    //if user deleted somthing return, else updating m text length
    if (this.textArea.length == this.displayedTextLength + 1) {
      this.displayedTextLength = this.textArea.length;
    } else {
      return;
    }
    //if user wanna restart , call restart function
    if (this.textArea.length == 0) {
      this.restart();
      return;
    }
    //if first type, start timer
    if (this.textArea.length == 1 && this.nbrErrors == 0) {
      this.dateStart = new Date();
    }
    //if last type, stop timer, enable score
    if (this.textArea.length == this.currentText.length) {
      this.dateEnd = new Date();
      this.enableScore = true;
      this.result();
    }
    //get text from textarea as array
    let tabMyText = this.textArea.split('');
    //get text from currentText as array
    let tabCurrentText = this.currentText
      .substring(0, this.textArea.length + 1)
      .split('');
    //remove \n from array
    tabCurrentText = tabCurrentText.filter((value) => value != '\n');

    let result = '';
    //my letter
    const mine = tabMyText[tabMyText.length - 1];
    //expected letter
    const expect = tabCurrentText[tabMyText.length - 1];

    if (mine == expect) {
      //if the 2 letters are the same
      //add letter to result
      result = mine;
    } else {
      //if the 2 letters are not the same
      //add 1 to nbrErrors
      this.nbrErrors++;
      //add letter to result with red color
      result =
        '<span class="text-danger" style="color:red"><ins>' +
        mine +
        '</ins></span>';
    }
    //add result to myText
    this.myText.nativeElement.innerHTML += result;
    //move cursor
    this.cursor++;
  }
  //get the speed of typing
  getSpeed() {
    let res = this.nbrWords() / this.timeOut();
    return res.toFixed(0);
  }
  //go to next text
  next() {
    let i = this.textes.indexOf(this.currentText) + 1;
    this.currentTextTab = this.textes[i].split('');
    this.currentText = this.textes[i];
    this.restart();
  }
  //go to previous text
  previous() {
    this.restart();
    let i = this.textes.indexOf(this.currentText) - 1;
    this.currentTextTab = this.textes[i].split('');
    this.currentText = this.textes[i];
  }
  //get if there is no next text
  noNextText() {
    return this.textes.indexOf(this.currentText) == this.textes.length - 1;
  }
  //get if there is no previous text
  noPreviousText() {
    return this.textes.indexOf(this.currentText) == 0;
  }
  displayLangages() {
    let languages = document.getElementById('languages') as HTMLDivElement;
    if (languages.style.display == 'block') {
      languages.style.display = 'none';
    } else {
      languages.style.display = 'block';
    }
  }
  changeLanguage(lang: string) {
    switch (lang) {
      case 'fr':
        this.textes = this.shuffleArray(TEXTS_FR); //set textes
        this.currentText = this.textes[0]; //set current text
        this.currentTextTab = this.currentText.split(''); //set current text as array
        this.currentTextTab = this.currentTextTab.filter(
          (value: string) => value != '\n'
        ); //remove \n from array
        break;
      case 'en':
        this.textes = this.shuffleArray(TEXTS_EN); //set textes
        this.currentText = this.textes[0]; //set current text
        this.currentTextTab = this.currentText.split(''); //set current text as array
        this.currentTextTab = this.currentTextTab.filter(
          (value: string) => value != '\n'
        ); //remove \n from array
        break;

      default:
        break;
    }
    this.displayLangages();
    this.restart();
  }
}
