import * as firebase from "firebase";

export class Meeting {
    constructor() {
        this.db = firebase.firestore();
    }

    async fetchMeetingData(meetingId) {
        let docRef = this.db.collection("Meeting").doc(meetingId);

        let doc = undefined;
        try {
            doc = await docRef.get();
        } catch (e) {
            // error
            console.error(e);
            return "ERR";
        }

        // not exist
        if (!doc.exists) {
            return "NON_EXIST";
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

    async updateMemberSelection(id, newTimeSlots) {
        const memberRef = this.db.collection("Member").doc(id);

        memberRef.update({
            timeSlots: newTimeSlots,
        }).catch((err) => console.error(err));
    }
}