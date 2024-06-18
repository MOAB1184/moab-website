const getRandomInteger = (min, max) => {
    min = Math.ceil(min)
    max = Math.floor(max)
  
    return Math.floor(Math.random() * (max - min)) + min
  }
  
  // Random integer between 5 and 9
  
  function onRandoClick() {
    const randomInteger = getRandomInteger(1, 2)
    document.getElementById("randomInteger").innerHTML = randomInteger;
  }
  
  // Random integer between 0 and 99
  const randomInteger2 = getRandomInteger(0, 100)
  
  console.log(randomInteger2)








  function onRandomClick() {
    let test = prompt('Send "run" to get your random challenge!').toLowerCase();
    if (test === "run") {
      let rand = Math.floor(Math.random() * 2) + 1;
      if (rand === 1) {
        console.log(randomLine('D:/dadas/he true randomizer/lockout.txt'));
      } else if (rand === 2) {
        let r1 = randomLine('D:/dadas/he true randomizer/kxcountries.txt');
        let r2 = randomLine('D:/dadas/he true randomizer/ideologies.txt');
        let r3 = randomLine('D:/dadas/he true randomizer/kxcountries2.txt');
        let r4 = randomLine('D:/dadas/he true randomizer/kxcountries2.txt');
        if (r1 === r3) {
          r3 = randomLine('D:/dadas/he true randomizer/kxcountries2.txt');
          console.log(`${r1}, ${r2}, conquer ${r3}, puppet ${r4}`);
          document.getElementById("rand").innerHTML = rand;
        }
        if (r1 === r4) {
          r4 = randomLine('D:/dadas/he true randomizer/kxcountries2.txt');
          console.log(`${r1}, ${r2}, conquer ${r3}, puppet ${r4}`);
          document.getElementById("rand").innerHTML = rand;
        }
        if (r3 === r4) {
          r3 = randomLine('D:/dadas/he true randomizer/kxcountries2.txt');
          console.log(`${r1}, ${r2}, conquer ${r3}, puppet ${r4}`);
          document.getElementById("rand").innerHTML = rand;
        } else {
          console.log(`${r1}, ${r2}, conquer ${r3}, puppet ${r4}`);
          document.getElementById("rand").innerHTML = rand;
        }
      }
    } 
  }
  
  function randomLine(filePath) {
    // Implement the randomLine function to read a random line from the specified file
    // You may need to use the appropriate JavaScript file I/O functions
  }
document.getElementById("randomButton").addEventListener("click", onRandomClick);
