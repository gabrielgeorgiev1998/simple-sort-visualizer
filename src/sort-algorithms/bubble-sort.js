export default function bubbleSortAlg(array) {
    var arr = array.slice();
    var toAnimate = [];
    for(let i=0;i<arr.length-1;i++) {
        for(let j=0;j<arr.length-i-1;j++) {
            var animation = {toCompareFirst: j, toCompareSecond: j+1, toSwap: false}
            if(arr[j] > arr[j+1]) {
                const tmp = arr[j];
                arr[j] = arr[j+1];
                arr[j+1] = tmp;
                animation.toSwap = true;
            }
            toAnimate.push(animation);
        }
    }

    return toAnimate;
};
