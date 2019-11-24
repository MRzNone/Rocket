import * as firebase from "firebase";
import { Member } from '.';

export class Meeting {
  constructor() {
    this.db = firebase.firestore();

    this.memberDB = new Member();
  }

  async fetchMeetingData(meetingId) {
    let docRef = this.db.collection("Meeting").doc(meetingId);

    let doc = undefined;
    try {
      doc = await docRef.get();
    } catch (e) {
      // error
      console.error(e);
      return { status: "ERR" };
    }

    // not exist
    if (!doc.exists) {
      console.error("Meeting " + meetingId + " does not exist");
      return { status: "NON_EXIST" };
    }

    // process dates
    const data = doc.data();
    data.dates = data.dates.map((timeStamp) => timeStamp.toDate());

    // process host
    data.hostId = data.host.id;
    delete data.host;

    const promArr = [];
    data.members.forEach((ref) => promArr.push(ref.get()));

    try {
      const responses = await Promise.all(promArr);

      const members = {};
      responses.forEach((doc) => {
        members[doc.id] = doc.data();
      });
      data.members = members;
    } catch (err) {
      data.members = undefined;
      console.error(err);
    }

    return data;
  }

  updateMeetingNote(meetingId, newNote) {
    this.db.collection("Meeting").doc(meetingId).update({
      notes: newNote
    });
  }

  /**
   * Create the meeting and the host.
   * this.createMeeting('newMeeting', 'dumbMeetingName', [new Date()],
   *  600, 1200, 'newH12312321ost', null, 'dumbNotes', 20, 'hostame', 
   * null);
   * 
   * @param {string} id 
   * @param {string} name 
   * @param {[Date]} dates 
   * @param {number} startTime
   * @param {number} endTime
   * @param {string} hostId 
   * @param {string} passCode 
   * @param {string} notes 
   * @param {number} rowNum
   * @param {string} hostName
   * @param {string} email
   */
  createMeeting(id, name, dates, startTime, endTime, hostId, passCode, notes, rowNum, hostName, email) {
    const hostRef = this.db.collection("Member").doc(hostId);
    const data = {
      finalTime: null,
      host: hostRef,
      members: [hostRef],
      name,
      notes,
      rowNum,
      timeWindow: [startTime, endTime]
    };

    // process dates
    data.dates = dates.map(
      date => firebase.firestore.Timestamp.fromDate(date));

    this.db.collection("Meeting").doc(id).set(data);
    this.memberDB.createMember(hostId, id, hostName, email, passCode);
  }
}