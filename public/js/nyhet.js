timeDifference()
function timeDifference(){

  // Produktens publiceringsdatum
  const publishedDate = new Date('2024-11-09'); // Sätt produktspecifikt publiceringsdatum
  
  // Aktuellt datum
  const currentDate = new Date();
  
  // Antal dagar mellan publiceringsdatumet och idag
  const timeDifference = currentDate - publishedDate;
  const daysDifference = timeDifference / (1000 * 3600 * 24); // Omvandla millisekunder till dagar
  
  console.log("publication date : "+ publishedDate)
  console.log("current date : " + currentDate)
  console.log("timeDifference : " + timeDifference)
  console.log("daysDifference : " + daysDifference)
  // Kontrollera om det är mindre än 7 dagar sedan
  if (daysDifference < 7) {
      // Visa bilden
     document.getElementsByClassName('.nyhet-p').style.display= 'block';;
      
  } else {
      // Göm bilden
      var elems = document.getElementsByClassName('nyhet-p');
        elems.style.display = 'none';
      
    }}