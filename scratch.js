//import ...

/* rank all meeting time slots and display the best result(s)
* members: an array of the members of the meeting
* times slots represented by a 2-D array that represents the available time slots for all members
*               in the form of: {[0,0,0,1,1,0], [0,0,0,0,1,0]...}
*
*/



function rankResults(members){

    // copy over the titles inside time slot table
    const arr = [];
    const rowNum = this.state.tableParams.rowNum;
    const colNum = this.state.tableParams.colNum;
    for(let x = 0; x < rowNum; x++){
        arr[x] = [];
        for(let y = 0; y < colNum; y++){
            arr[x][y] = this.state.tableParams.rowTitles[x]*this.state.tableParams.rowTitles[y];
        }
    }
    const countArray =  Array(rowNum).fill().map(() => Array(colNum).fill(0));

    for(let x = 0; x <  members.length; x++){
        const tempArray = members[x];
        for(let y = 0; y < rowNum; y++){
            for(let z = 0; z < colNum; z++){
                if(tempArray[y][z] === 1){
                    countArray[y][z]++;
                }
            }
        }
    }

    const max =  Math.max(...countArray.map(e => Array.isArray(e) ? getMax(e) : e));
    const index = getIndexOfK(countArray, max);
    return arr[index[0]][index[1]];

}

//helper method
function getMax(a){
    return Math.max(...a.map(e => Array.isArray(e) ? getMax(e) : e));
}

/**
 * Index of Multidimensional Array
 * @param arr {!Array} - the input array
 * @param k {object} - the value to search
 * @return {Array}
 */
function getIndexOfK(arr, k) {
    for (let i = 0; i < arr.length; i++) {
        let index = arr[i].indexOf(k);
        if (index > -1) {
            return [i, index];
        }
    }
}
