import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { TEXTS_FR, TEXTS_EN, TEXTS_AR } from '../textes';
import { UsaFlag, FranceFlag, ArabeFlag } from '../flags';

import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  languages: any[] = [
    {
      name: 'Français',
      code: 'fr',
      flag: FranceFlag,
    },
    {
      name: 'English',
      code: 'en',
      flag: UsaFlag,
    },
    {
      name: 'العربية',
      code: 'ar',
      flag: ArabeFlag,
    },
  ];
  editedText: string = '';
  currentLanguage: string = 'fr';
  nbrErrors: number = 0; //number of errors
  textArea: string = ''; //text from textarea
  @ViewChild('textAreaElement', { static: false }) textAreaElement: ElementRef =
    {} as ElementRef; //textarea element
  currentText: string = ''; //current text to be typed
  textes: string[] = []; //set of all available texts
  dateStart: Date = new Date(); //start time
  dateEnd: Date = new Date(); //end time
  enableScore: boolean = false; //enable score(activated at the end)
  cursor: number = 0; //position of cursor in the current text array
  displayedTextLength: number = 0; //length of my text
  muted: boolean = false;

  constructor() {
    //filter special characters
    const TEXTS_FR_WithoutSpecialCaracter: any[] = TEXTS_FR.map((text) => {
      return this.noSpecialCaracter(text);
    });
    this.textes = this.shuffleArray(TEXTS_FR_WithoutSpecialCaracter); //set textes
    // this.textes.unshift(`Commeçons...`); //add empty text to the beginning of the array

    this.currentText = this.textes[0]; //set current text
    //set edited text to current text
    this.editedText = this.currentText;

    setTimeout(() => {
      //focus on textarea
      if (this.textAreaElement && this.textAreaElement.nativeElement) {
        this.textAreaElement.nativeElement.focus();
      }
    });
  }
  shuffleArray(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1)); // Index aléatoire entre 0 et i inclus
      [array[i], array[j]] = [array[j], array[i]]; // Échange des éléments aux positions i et j
    }
    return array;
  }
  noSpecialCaracter(text: string) {
    text = text.replace('’', "'");
    text = text.replace('’', "'");
    text = text.replace('œ', 'oe');
    text = text.replace('Œ', 'Oe');
    text = text.replace('É', 'E');
    text = text.replace('À', 'A');
    text = text.replace('È', 'E');
    text = text.replace('Ê', 'E');
    text = text.replace('Ë', 'E');
    text = text.replace('Ï', 'I');
    text = text.replace('ï', 'i');

    return text;
  }
  isFocusedLetter(i: number) {
    return i == this.cursor;
  }
  //get the current text as array
  getCurrentTextTab() {
    let tab = this.currentText.split('');
    tab = tab.filter((value: string) => value != '\n'); //remove \n from array
    return tab;
  }
  //get the time between start and end of the test
  getTestTime() {
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
      this.hideLangages();
      this.hideEditText();
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
    //first restart
    setTimeout(() => {
      //set edited text to current text
      this.editedText = this.currentText;
      //remove bg-success and bg-danger classes
      let length = this.currentText.length;
      for (let i = 0; i < length; i++) {
        const element = document.getElementById('' + i) as HTMLDivElement;
        element.className = '';
      }
      this.enableScore = false; //disable score
      this.hideResult(); //hide result div
      this.nbrErrors = 0; //reset number of errors
      this.textArea = ''; //reset textarea
      //reset cursor
      this.cursor = 0;

      //length of my text
      this.displayedTextLength = 0;
      //focus on textarea
      //focus on textarea
      if (this.textAreaElement && this.textAreaElement.nativeElement) {
        this.textAreaElement.nativeElement.focus();
        this.textAreaElement.nativeElement.value = '';
      }
    });
    //seconde restart for persistent bug(empty textarea and highlighted letters)
    setTimeout(() => {
      //remove bg-success and bg-danger classes
      let length = this.currentText.length;
      for (let i = 0; i < length; i++) {
        const element = document.getElementById('' + i) as HTMLDivElement;
        element.className = '';
      }
      //focus on textarea
      if (this.textAreaElement && this.textAreaElement.nativeElement) {
        this.textAreaElement.nativeElement.focus();
      }
    }, 10);
    return;
  }
  //on input, make checking
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

    //my letter
    const myLetter = this.noSpecialCaracter(tabMyText[tabMyText.length - 1]);
    //expected letter
    const expect = this.noSpecialCaracter(tabCurrentText[tabMyText.length - 1]);
    let letterhtml = document.getElementById(
      '' + this.cursor
    ) as HTMLDivElement;
    if (myLetter == expect) {
      letterhtml.className = 'bg-success';
    } else {
      //play error sound if not muted
      if (!this.muted) {
        let errorAudio = document.getElementById(
          'errorAudio'
        ) as HTMLAudioElement;
        errorAudio.play();
      }
      //if the 2 letters are not the same
      //add 1 to nbrErrors
      this.nbrErrors++;
      letterhtml.className = 'bg-danger';
    }
    //move cursor
    this.cursor++;
  }
  //get the speed of typing
  getSpeed() {
    let res = this.nbrWords() / this.getTestTime();
    return res.toFixed(0);
  }
  //go to next text
  next() {
    this.textIndex++;
    this.currentText = this.textes[this.textIndex];
    this.restart();
  }
  textIndex: number = 0;
  //go to previous text
  previous() {
    this.restart();
    this.textIndex--;
    this.currentText = this.textes[this.textIndex];
  }
  //get if there is no next text
  noNextText() {
    return this.textIndex == this.textes.length - 1;
  }
  //get if there is no previous text
  noPreviousText() {
    return this.textIndex == 0;
  }
  displayLangages() {
    let languages = document.getElementById('languages') as HTMLDivElement;
    if (languages.style.display == 'block') {
      this.hideLangages();
    } else {
      languages.style.display = 'block';
      this.hideResult();
      this.hideEditText();
    }
  }
  hideLangages() {
    let languages = document.getElementById('languages') as HTMLDivElement;
    languages.style.display = 'none';
  }
  changeLanguage(lang: string) {
    this.displayLangages();

    if (lang == this.currentLanguage) {
      return;
    }
    this.currentLanguage = lang;
    switch (lang) {
      case 'fr':
        //filter special characters
        const TEXTS_FR_WithoutSpecialCaracter: string[] = TEXTS_FR.map(
          (text) => {
            return this.noSpecialCaracter(text);
          }
        );
        this.textes = this.shuffleArray(TEXTS_FR_WithoutSpecialCaracter); //set textes
        this.currentText = this.textes[0]; //set current text

        break;
      case 'en':
        //filter special characters
        const TEXTS_EN_WithoutSpecialCaracter: string[] = TEXTS_EN.map(
          (text) => {
            return this.noSpecialCaracter(text);
          }
        );
        this.textes = this.shuffleArray(TEXTS_EN_WithoutSpecialCaracter); //set textes
        this.currentText = this.textes[0]; //set current text

        break;
      case 'ar':
        //filter special characters
        const TEXTS_AR_WithoutSpecialCaracter: string[] = TEXTS_AR.map(
          (text) => {
            return this.noSpecialCaracter(text);
          }
        );
        this.textes = this.shuffleArray(TEXTS_AR_WithoutSpecialCaracter); //set textes
        this.currentText = this.textes[0]; //set current text

        break;

      default:
        break;
    }
    this.restart();
  }
  getFooterSentence() {
    switch (this.currentLanguage) {
      case 'fr':
        return ' Tous droits réservés';
        break;
      case 'en':
        return ' All rights reserved';
        break;
      case 'ar':
        return ' جميع الحقوق محفوظة';
        break;

      default:
        return ' Tous droits réservés';

        break;
    }
  }
  getHeaderSentence() {
    switch (this.currentLanguage) {
      case 'fr':
        return 'Pratiquez la dactylographie !';

      case 'en':
        return 'Practice typing !';
      case 'ar':
        return 'تمرن على الكتابة بالحاسوب';

      default:
        return 'Pratiquez la dactylographie !';
    }
  }
  getPlaceholder() {
    switch (this.currentLanguage) {
      case 'fr':
        return 'Tapez ici...';
      case 'en':
        return 'Type here...';
      case 'ar':
        return 'اكتب هنا...';

      default:
        return 'Tapez ici...';
    }
  }
  getResultTrans() {
    switch (this.currentLanguage) {
      case 'fr':
        return 'Résultat';
      case 'en':
        return 'Result';
      case 'ar':
        return 'النتيجة';

      default:
        return 'Résultat';
    }
  }
  getSpeedTrans() {
    switch (this.currentLanguage) {
      case 'fr':
        return 'Vitesse';
      case 'en':
        return 'Speed';
      case 'ar':
        return 'السرعة';

      default:
        return 'Vitesse';
    }
  }
  getErrorsTrans() {
    switch (this.currentLanguage) {
      case 'fr':
        return 'Erreurs';
      case 'en':
        return 'Errors';
      case 'ar':
        return 'الأخطاء';

      default:
        return 'Erreurs';
    }
  }
  getProportionErrorsTrans() {
    switch (this.currentLanguage) {
      case 'fr':
        return "Pourcentage d'erreurs";
      case 'en':
        return 'Pourcentage of errors';
      case 'ar':
        return 'نسبة الأخطاء';

      default:
        return "Pourcentage d'erreurs";
    }
  }

  getFinishTrans() {
    switch (this.currentLanguage) {
      case 'fr':
        return 'Terminé';
      case 'en':
        return 'Finished';
      case 'ar':
        return 'انتهى';

      default:
        return 'Terminé';
    }
  }
  getUnitySpeedTrans() {
    switch (this.currentLanguage) {
      case 'fr':
        return 'mots/min';
      case 'en':
        return 'words/min';
      case 'ar':
        return 'كلمة/دقيقة';

      default:
        return 'mots/min';
    }
  }
  getEditTrans() {
    switch (this.currentLanguage) {
      case 'fr':
        return 'Modifier';
      case 'en':
        return 'Edit';
      case 'ar':
        return 'تعديل';

      default:
        return 'Modifier';
    }
  }
  editText() {
    this.displayEditText();
    this.currentText = this.editedText;
  }
  displayEditText() {
    let result = document.getElementById('editText') as HTMLDivElement;
    if (result.style.display == 'block') {
      this.hideEditText();
    } else {
      result.style.display = 'block';
      this.hideResult();
      this.hideLangages();
    }
  }
  hideEditText() {
    let result = document.getElementById('editText') as HTMLDivElement;
    result.style.display = 'none';
  }
  getProportionErrors() {
    let res = (this.nbrErrors * 100) / this.currentText.split('').length;
    return res.toFixed(2);
  }
  mute() {
    if (this.muted == true) {
      this.muted = false;
    } else {
      this.muted = true;
    }
  }
}
