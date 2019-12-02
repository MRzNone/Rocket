// expect to receive an array of meetings
function rankings(Meetings) {
    let rankings = {};
    const obj = extractTime(Meetings);
    const sortedArr = Object.keys(obj).reduce((arr, key) => {
        arr.push({key: key, value: obj[key]});

        return arr;
    }, [])
        .sort((a, b) => a.value.length - b.value.length);

    console.log(sortedArr);
    rankings = obj;
    return rankings;
}

function extractTime(Meetings) {
    var arr = [];
    for (let x = 0; x < Meetings.length; x++) {
        arr[Meetings[x].id] = rankingConfidence(Meetings[x].startTime, Meetings[x].endTime);
    }
    return arr;
}


function rankingConfidence(startTime, endTime) {
    if (endTime - startTime === 0) {
        return 0;
    } else {
        var average = (endTime + startTime) / 2;
        var n = endTime - startTime;

        var z = 1.25;
        var p = (endTime - average) / n;
        var left = p + 1 / (2 * n) * z * z;
        var right = z * Math.sqrt(p * (1 - p) / n + z * z / (4 * n * n));
        var under = 1 + 1 / n * z * z;

        return (left - right) / under;
    }
}


function quickSort(array) {

    if (array.length <= 1) return array;
    let swapIndex = Math.floor((array.length - 1) / 2), lessArray = [], moreArray = [];
    let swapValue = array[swapIndex];
    array.splice(swapIndex, 1);
    for (let i = 0; i < array.length; i++) {
        if (array[i] < swapValue) {
            lessArray.push(array[i]);
        } else {
            moreArray.push(array[i]);
        }
    }
    return (quickSort(lessArray).concat([swapValue], quickSort(moreArray)));
}
