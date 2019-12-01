import * as firebase from "firebase";
import { functionTypeAnnotation } from "@babel/types";

export class Member {
  constructor() {
    this.db = firebase.firestore();
    this.deleteMember('fsadfasfd', 'MrlY6JSG8uNlLJbU7HFv');
  }

  async updateMemberSelection(id, newTimeSlots) {
    const memberRef = this.db.collection("Member").doc(id);

    memberRef.update({
      timeSlots: newTimeSlots,
    }).catch((err) => console.error(err));
  }

  async getMemberTimeSlot(id) {
    const memberRef = this.db.collection("Member").doc(id);

    return JSON.parse((await memberRef.get()).data().timeSlots);
  }

  /**
   * this.createMember(
   *   'fsadfasfd',
   *   'MrlY6JSG8uNlLJbU7HFv',
   *   'testAddName',
   *   'testAddEmail',
   *   null
   * );
   */
  createMember(memberId, meetingId, name, email, passcode) {
    const memberRef = this.db.collection("Member").doc(memberId);
    memberRef.set({
      name,
      email,
      passcode,
      timeSlots: null
    }).then(() => {
      this.db.collection("Meeting").doc(meetingId).update({
        members: firebase.firestore.FieldValue.arrayUnion(memberRef)
      });
    });
  }

  /**
   * 
   * this.deleteMember('fsadfasfd', 'MrlY6JSG8uNlLJbU7HFv');} memberId
   */
  deleteMember(memberId, meetingId) {
    const memberRef = this.db.collection("Member").doc(memberId);

    memberRef.delete().then(() => {
      this.db.collection("Meeting").doc(meetingId).update({
        members: firebase.firestore.FieldValue.arrayRemove(memberRef)
      });
    })
  }
}