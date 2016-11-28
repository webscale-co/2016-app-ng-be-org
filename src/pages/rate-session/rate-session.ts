// 3d party imports
import { Component } from '@angular/core';
import { NavParams, ViewController, ToastController } from 'ionic-angular';

// app imports
import { Session, Rating } from '../../entities';
import { ConferenceDataService } from '../../services';

@Component({
  selector: 'page-rate-session',
  templateUrl: 'rate-session.html'
})
export class RateSessionPage {

  session: Session;
  sessionRating: Rating;

  constructor(private params: NavParams,
              private viewCtrl: ViewController,
              private toastCtrl: ToastController,
              private conferenceData: ConferenceDataService) {

    this.session = params.data.session;
    this.populateRating();

  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  saveRating() {
    let rawRating = JSON.parse(JSON.stringify(this.sessionRating));
    rawRating.speakers.forEach((speaker)=> {
      delete speaker.firstname;
      delete speaker.name;
      delete speaker.avatar;
    });
    console.log(rawRating);
    if(rawRating.$key){
      this.conferenceData.updateRating(rawRating);
    } else {
      this.conferenceData.saveRating(rawRating);
    }

    this.viewCtrl.dismiss();
    let toast = this.toastCtrl.create({
      message: 'Thanks, your rating has been saved!',
      showCloseButton: true,
      closeButtonText: 'close',
      duration: 3000
    });
    toast.present();
  }

  setSessionRate(rate) {
    this.sessionRating.rating = rate;
  }

  setSpeakerRate(rate, speaker) {
    speaker.rating = rate;
  }

  private populateRating() {

    if (this.session.rating) {
      delete this.session.rating.$exists;
      this.sessionRating = this.session.rating;
      this.session.rating.speakers.forEach((speakerA) => {
        this.session.speakers.forEach((speakerB) => {
          if(speakerA.speakerId === speakerB.$key){
            speakerA.firstname = speakerB.firstname;
            speakerA.name = speakerB.name;
            speakerA.avatar = speakerB.avatar;
          }
        });
      });
    } else {
      this.sessionRating = {
        sessionId: this.session.$key,
        remarks: '',
        rating: 1,
        speakers: []
      };
      this.session.speakers.forEach((speaker)=> {
        this.sessionRating.speakers.push({
          speakerId: speaker.$key,
          firstname: speaker.firstname,
          name: speaker.name,
          avatar: speaker.avatar,
          rating: 1
        })
      })
    }

  }

}