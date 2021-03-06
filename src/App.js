import React, { useState } from 'react';

//material-ui icons to make the buttons prettier
import sortIcon from './images/sortIcon.svg';
import sortAlgMenu from './images/sortAlgMenu.svg';
import genNewArrIcon from './images/genNewArrIcon.svg';

import bubbleSortAlg from './sort-algorithms/bubble-sort';
import gnomeSortAlg from './sort-algorithms/gnome-sort';
import quickSortAlg from './sort-algorithms/quick-sort';
import mergeSortAlg from './sort-algorithms/merge-sort';
import heapSortAlg from './sort-algorithms/heap-sort';
import oddEvenSortAlg from './sort-algorithms/odd-even-sort';

function randomArray(size) { //array of random numbers of size size
  var array = [];
  for(let i=0;i<size;i++) {
    array.push(Math.floor(Math.random() * 3000) + 10);
  }

  return array;
}

function App() {
  //all states
  const [sortAlg, setSortAlg] = useState('Gnome sort'); //sorting alg to be used

  const [size, setSize] = useState(50); //size of array
  const [array, setArray] = useState(randomArray(50)); //array that is to be sorted
  const [sortSpeed, setSortSpeed] = useState(Math.floor(5000/(size**1.2)));

  const [currSorting, setCurrSorting] = useState(false); //flag to disable the controls during sorting
  const [isSorted, setIsSorted] = useState(false); //flag to disable sort button when the array is sorted

  const [hoveredSize, setHoveredSize] = useState(false); //true if dropdown menu for alg selection is hovered
  const [hoveredAlg, setHoveredAlg] = useState(false); //true if dropdown menu for alg selection is hovered

  //colours for the bars
  const defaultBarColor = '#555555';
  const compareBarColor = '#f2301b';
  const correctBarColor = '#aba500';
  const sortedBarColor = '#a6ff96';

  //animation function that receives an array of animations by one of the funcs in sorting-algs.js and animates the bars based on it
  const animate = (animations, sortedArray) => {
    const arrayBars = document.getElementsByClassName('arrayBar'); //get elements to change css for animations
    for(let i=0;i<animations.length;i++) {
      setTimeout(() => { //set them to red at start of comparison
        arrayBars[animations[i].toCompareFirst].style.backgroundColor = compareBarColor;
        arrayBars[animations[i].toCompareSecond].style.backgroundColor = compareBarColor;
      }, (i+0.5)*sortSpeed);
      if(animations[i].toSwap) { //if they are to be swapped
        setTimeout(() => { //swap their heights
          const tmp = arrayBars[animations[i].toCompareFirst].style.height;
          arrayBars[animations[i].toCompareFirst].style.height = arrayBars[animations[i].toCompareSecond].style.height;
          arrayBars[animations[i].toCompareSecond].style.height = tmp;
        }, (i+1)*sortSpeed);
        setTimeout(() => { //set colour to green to indicate that they are now in the correct position
          arrayBars[animations[i].toCompareFirst].style.backgroundColor = correctBarColor;
          arrayBars[animations[i].toCompareSecond].style.backgroundColor = correctBarColor;
        }, (i+1)*sortSpeed);
      } else { //if they are not to be swapped
        setTimeout(() => { //only set colour to green
          arrayBars[animations[i].toCompareFirst].style.backgroundColor = correctBarColor;
          arrayBars[animations[i].toCompareSecond].style.backgroundColor = correctBarColor;
        }, (i+1)*sortSpeed);
      }
      setTimeout(() => { //checks if the length of the bar matches the corresponding number in the sorted array and colours it the sorted colour if yes, the default colour if no 
          if(arrayBars[animations[i].toCompareFirst].style.height === `${sortedArray[animations[i].toCompareFirst]/40}vh`) {
            arrayBars[animations[i].toCompareFirst].style.backgroundColor = sortedBarColor;
          } else {
            arrayBars[animations[i].toCompareFirst].style.backgroundColor = defaultBarColor;
          }
          if(arrayBars[animations[i].toCompareSecond].style.height === `${sortedArray[animations[i].toCompareSecond]/40}vh`) {
            arrayBars[animations[i].toCompareSecond].style.backgroundColor = sortedBarColor;
          } else {
            arrayBars[animations[i].toCompareSecond].style.backgroundColor = defaultBarColor;
          }
      }, (i+2)*sortSpeed);
      setTimeout(() => { //sets all bars back to default colour at the end
          arrayBars[animations[i].toCompareFirst].style.backgroundColor = defaultBarColor;
          arrayBars[animations[i].toCompareSecond].style.backgroundColor = defaultBarColor;
      }, animations.length*(sortSpeed)+1000);
    }
    setTimeout(() => {
      setCurrSorting(false);
      setIsSorted(true);
    }, animations.length*(sortSpeed)+20);
  };

  const handleSortPress = () => {
    if(isSorted) {
      alert("The array is sorted.");
    }
    else {
      setCurrSorting(true);
      if(sortAlg==="Bubble sort") {
        let result = bubbleSortAlg(array);
        animate(result.toAnimate, result.arr);
      } else if(sortAlg==="Heap sort") {
        let result = heapSortAlg(array);
        animate(result.toAnimate, result.arr);
      } else if(sortAlg==="Quick sort") {
        let result = quickSortAlg(array);
        animate(result.toAnimate, result.arr);
      } else if(sortAlg==="Gnome sort") {
        let result = gnomeSortAlg(array);
        animate(result.toAnimate, result.arr);
      } else if(sortAlg==="Odd-Even sort") {
        let result = oddEvenSortAlg(array);
        animate(result.toAnimate, result.arr);
      } else if(sortAlg==="Merge sort") {
        let result = mergeSortAlg(array);
        animate(result.toAnimate, result.arr);
      }
    }
  }

  const sliderSize = (event) => {
    let sizeValue = event.target.value;

    setIsSorted(false);

    setSize(sizeValue);
    setArray(randomArray(sizeValue));

    setSortSpeed(Math.floor(5000/(sizeValue**1.2)));
  }

  const generateNewArray = () => {
    setIsSorted(false);

    setSize(size);
    setArray(randomArray(size));
  }

    return (
    <div className="h-screen w-screen items-center">
      <div className="flex flex-row w-full justify-around select-none" style={{ height: '8%', backgroundColor: currSorting ? '#CCCCCC' : '#EEEEEE', pointerEvents: currSorting ? 'none' : 'all' }} >

        <a href="/simple-sort-visualizer" className="w-48 font-bold text-xl self-center text-blue-500 hover:text-blue-700">
          {!isSorted && !currSorting && "Sorting vizualizer"}
          {isSorted && "Sorted"}
          {currSorting && "Sorting..."}
        </a>
        <div className="flex flex-row w-3/4 h-12 px-2 bg-blue-100 self-center items-center justify-around shadow-lg rounded-full">
          <div onMouseEnter={() => setHoveredSize(true)} onMouseLeave={() => setHoveredSize(false)} className="cursor-pointer">
            <div className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 rounded-lg select-none w-24 text-center" >Size: {size}</div>
              {hoveredSize && 
              <div className="flex absolute px-2 py-4 items-center bg-white rounded-lg">
                <input
                  type="range"
                  onChange={sliderSize}
                  min={5}
                  max={250}
                  value={size}
                />
              </div>
              }
          </div>
          <div onMouseEnter={() => setHoveredAlg(true)} onMouseLeave={() => setHoveredAlg(false)} className="py-1 px-4 rounded-lg bg-blue-500 hover:bg-blue-700 font-bold text-white cursor-pointer">
            <div className="flex flex-row">
              <img src={sortAlgMenu} alt="" />
              <p className="ml-1">{sortAlg}</p>
            </div>
            {hoveredAlg &&
              <div className="absolute flex flex-col text-black bg-white cursor-pointer py-2 px-2 mt-1 rounded-lg" onClick={() => {setHoveredAlg(false)}}>
                <div onClick={() => {setSortAlg('Bubble sort')}} className="hover:underline">Bubble sort</div>
                <div onClick={() => {setSortAlg('Heap sort')}} className="hover:underline">Heap sort</div>
                <div onClick={() => {setSortAlg('Merge sort')}} className="hover:underline">Merge sort</div>
                <div onClick={() => {setSortAlg('Quick sort')}} className="hover:underline">Quick sort</div>
                <div onClick={() => {setSortAlg('Gnome sort')}} className="hover:underline">Gnome sort</div>
                <div onClick={() => {setSortAlg('Odd-Even sort')}} className="hover:underline">Odd-Even sort</div>
              </div>}
          </div>
          <button onClick={() => handleSortPress()} className="flex flex-row bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded-lg" > 
            <img src={sortIcon} alt="" />
            <p className="ml-1 select-none">Sort</p>
          </button>
        </div>
      </div>
      <div className="w-full bg-white" style={{ height: '92%' }}>
        <div className="flex flex-row justify-evenly" >
            {array.map((number, index) => <div key={index} className="arrayBar" style={{
                                            height: `${number/40}vh`,
                                            width: `${1000/size}px`,
                                            backgroundColor: defaultBarColor,
                                          }}
                                          />
                      )
            }
        </div>
        <div className="absolute left-0 bottom-0 pt-4 pr-4 rounded-t-lg" style={{ backgroundColor: currSorting ? '#CCCCCC' : '#EEEEEE', pointerEvents: currSorting ? 'none' : 'all' }}>
          <button onClick={() => generateNewArray()} className="flex flex-row bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 ml-4 mb-4 rounded-lg" > 
            <img src={genNewArrIcon} alt="" />
            <p className="ml-1 select-none">Generate New Array</p>
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;