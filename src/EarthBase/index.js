/**
 * All interaction with firebase happens here.
 * All components are exported
 */
export * from './Meeting';
export * from './Member';

/**
  * this.updateMeetingNote('MrlY6JSG8uNlLJbU7HFv', 'newNotes');
  */
export function getRandomId() {
  var dt = new Date().getTime();
  var uuid = 'xxxxxxxx-xxxx-xxxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (dt + Math.random() * 16) % 16 | 0;
    dt = Math.floor(dt / 16);
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
  return uuid;
}