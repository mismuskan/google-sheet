const content = "Lorem ipsuexpliporis sapiente! cusantium voluptas numquam sunt."

function downloadContent(){
    // download a file with the name as temp.txt => with content being the 'content' variable.
   // blob objects
   const blob = new  Blob([content], { type: "text/plain"});
   console.log(blob);
   const url = URL.createObjectURL(blob);
   console.log(url);

   const link = document.createElement("a");
   link.href = url;
   link.download = "temp.txt";
//    link.innerText = "Click to download";

   // <a href="url" download="temp.txt">Click to Download</a> 

   link.click();  //clicking with the javascript
//    document.body.appendChild(link)
}