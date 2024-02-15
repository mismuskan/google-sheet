let activeCellId = null;
const activeCellElement =document.getElementById("active-cell");
const form = document.querySelector(".form");

const state ={};


const defaultStyles ={
    //Todo: change it later
    fontFamily: "poppins-regular",
    fontSize: 16,
    isBold: false,
    isItalic: false,
    isUnderline: false,
    align: "left",
    textColor: "#00000",
    bgColor: "#ffffff",
    text: ""
}


////////////////////////////////////////////////////////////


// cell zoom and zoom out

const zoomingTarget = document.querySelector('.root-zoom'); // Updated selector
const zoomInTool = document.getElementById('zoom-in');
const zoomOutTool = document.getElementById('zoom-out');


var zoomIndex = 1;

function zoomInFun(e) {
    zoomIndex += 0.005;
    zoomingTarget.style.transform = `scale(${zoomIndex})`;
    e.preventDefault();
}

function zoomOutFn(e){
   if(zoomIndex > 1)
   {
    zoomIndex -= 0.005;
    zoomingTarget.style.transform = `scale(${zoomIndex})`;
   
   }
   e.preventDefault();
    
} 

zoomOutTool.addEventListener("click",zoomOutFn)
zoomInTool.addEventListener("click",zoomInFun)





// search and replace

{/* <div class="search-replace">
<input type="text" id="searchInput" placeholder="Search">
<input type="text" id="replaceInput" placeholder="Replace">
<button id="fnrBtn">Submit</button>
</div> */}


    const fnrBtn = document.getElementById("fnrBtn");
    
   

    function searchAndReplace(event) {
        event.preventDefault(); // Prevent the default form submission behavior
      // value only get when user clicked on submit
        const searchInput = document.getElementById("searchInput").value;
        const replaceInput = document.getElementById("replaceInput").value;

        // we are storing on text include cell in array

        const cells = document.querySelectorAll('[contenteditable="true"]');
        
        cells.forEach((cell)=> {
            const text = cell.innerText;

            if (text === searchInput) {
                cell.innerText =  replaceInput;
            }
           
        });
    }

    fnrBtn.addEventListener("click", searchAndReplace);





// ///////////////////////////////////////////////////////

// Add an event listener for your merge button
const mergeButton = document.getElementById('merge');
mergeButton.addEventListener('click', mergeSelectedCells);

form.addEventListener("change", onChangeFormData)

 
function performMerge(selectedCells) {
    // Assume selectedCells is an array of cell IDs
    const firstCell = document.getElementById(selectedCells[0]);
    const colspan = calculateColSpan(selectedCells); // Implement this function
    const rowspan = calculateRowSpan(selectedCells); // Implement this function
 
    firstCell.setAttribute('colspan', colspan);
    firstCell.setAttribute('rowspan', rowspan);
 
    // Hide or remove other cells
    selectedCells.slice(1).forEach(cellId => {
        const cell = document.getElementById(cellId);
        cell.style.display = 'none'; // or cell.remove();
    });
}
 
function mergeSelectedCells() {
    // Get the selected cells
    const selectedCells = getSelectedCells(); // Implement this function
 
    // Validate the selection
    if (!isValidMerge(selectedCells)) {
        alert("Invalid selection for merge");
        return;
    }
 
    // Merge the cells
    performMerge(selectedCells);
 
    // Update state
    updateStateForMergedCells(selectedCells);
}

///////////////////////////////////////////////
//////////////////////////////////////////////

function onChangeCellText(event){
    let changedText = event.target.innerText;
    if(state[activeCellId]){
        // the current cell is already added to state object
        state[activeCellId].text = changedText;
    }
    else{
        state[activeCellId] = {...defaultStyles, text: changedText};
    }
}

function onChangeFormData(){
    const options = {
        fontFamily: form["fontFamily"].value,
        fontSize: form["fontSize"].value,
        isBold: form["isBold"].checked,
        isItalic: form["isItalic"].checked,
        // isUnderLine: form["isUnderline"].checked,
        isUnderline: form.isUnderline.checked,
        align: form.align.value,  // "left" | "center" | "right"
        textColor: form["textColor"].value,
        bgColor: form["bgColor"].value,


    };
    applyStyles(options);
}

function applyStyles(styles){
    // it will apply the styles to th active cell
    if(!activeCellId){

        form.reset();
        alert("Please select cell to apply");
        return;
    }
  

    // if some cell is selected than apply styles to that cell
    const activeCell = document.getElementById(activeCellId);
    activeCell.style.color = styles.textColor;
    activeCell.style.backgroundColor = styles.bgColor;
    activeCell.style.textAlign = styles.align;
    activeCell.style.fontWeight = styles.isBold ? "600" : "400";
    activeCell.style.fontFamily = styles.fontFamily;
    activeCell.style.fontSize = styles.fontSize + "px";
    activeCell.style.textDecoration = styles.isUnderline ? "underline" : "none";
    activeCell.style.fontStyle = styles.isItalic ? "italic" : "normal";

    // whenever there's an update in a cell style, update these style with the state object.
    state[activeCellId] = {...styles, text:activeCell.innerText};
}

function onFocusCell(event){
    if(activeCellId == event.target.id) return;
    activeCellId = event.target.id;
    activeCellElement.innerText = activeCellId;


    // reset the form with it actual style
    if(state[activeCellId]){
        // already touched cell
        resetForm(state[activeCellId]);
    }
    else{
        resetForm(defaultStyles);
    }

} 

function resetForm(styles){
/** 
    styles  = {
        fontFamily: form["fontFamily"].value,
        fontSize: form["fontSize"].value + "px",
        isBold: form["isBold"].checked,
        isItalic: form["isItalic"].checked,
        // isUnderLine: form["isUnderline"].checked,
        isUnderline: form.isUnderline.checked,
        align: form.align.value,  // "left" | "center" | "right"
        textColor: form["textColor"].value,
        bgColor: form["bgColor"].value
    };
    */

    console.log(styles);

    form.fontSize.value = styles.fontSize;
    form.fontFamily.value = styles.fontFamily;
    form.isBold.checked = styles.isBold;
    form.isItalic.checked = styles.isItalic;
    form.isUnderline.checked = styles.isUnderline;
    form.align.value = styles.align;
    form.textColor.value = styles.textColor;
    form.bgColor.value = styles.bgColor;
}


function exportData(){
    // Todo: export the file data and download it
    //{a:10, b:20} => '{"a": 10, "b":20}'  //stringfy method reference
   const jsonData = JSON.stringify(state);
   console.log(jsonData);
   const blob = new Blob([jsonData], {type: "text/plain"});

   const url = URL.createObjectURL(blob);
   const link = document.createElement("a");
   link.download = "data.json";
   link.href = url;
   link.click();
}