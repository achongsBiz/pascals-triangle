document.addEventListener( 'DOMContentLoaded',
    () => {
        const caclBtn = document.getElementById('calculate');
        caclBtn.addEventListener('click', submitAction);

         let opElements = document.querySelectorAll('.opElement');

         opElements.forEach(
            (el) => {
               el.addEventListener('input', ()=>{nextField(event.target)});
            }
         )

    }
)


function submitAction() {

   var validationCheck = validateInput();
   if (validationCheck)
   {
      renderPascal();
      renderPoly();
   }
}

/**
Function renders Pascal's triangle into HTML.
*/
function renderPascal() {

   let exponent = document.getElementById("exponent").value;
   let pascal = buildPascal(exponent);
   let lastRow = pascal.length - 1;
   let tableHTML = "<strong>Pascal's Triangle based on input:</strong><br><table>";
   let rowFormatBegin = "";
   let rowFormatEnd = "";

   for (let i=0; i < pascal.length; i++) {

      tableHTML += "<tr>";

         for (var j=0; j < pascal[i].length; j++) {

            if (i == lastRow) {
               rowFormatBegin = "<span id=\"coefficient\" style=\"color\:red\">";
               rowFormatEnd = "</span>";
            }
            tableHTML = tableHTML + "<td>" + rowFormatBegin + pascal[i][j] + rowFormatEnd + "</td>";
      }
      tableHTML += "</tr>";
   }

   tableHTML += "</table>";

   updateElement("triangleArea", tableHTML);
}

/**
Function contains algorithm to build Pascal's triangle.
@param {Number} exponent Exponent input.
@return {Array} Pascal's triangle in array form.
*/
function buildPascal(exponent){

   let triangle = new Array();
   let triangleLength = parseInt(exponent) + 1;

   // Initialize second layer of arrays.
   for (let i=0; i < triangleLength; i++) {
      triangle[i] = new Array();
   }

   for (let i=0; i< triangle.length; i++) {

      // Build first two rows.  [0]: 1 > [1]: 1,1
      if (i==0) {
         triangle[i]= new Array(1);
      }
      if (i==1) {
         triangle[i]= new Array(1, 1);
      }

      // Build remaining rows. [2]: 1,2,1 > [3]: 1,3,3,1 > [n]: etc.
      else {
         let rowLength = i + 1;
         let newRow = new Array();
         for (var j =0; j < rowLength; j++){
            // First and last element of the row is always equal to 1.
            if (j == 0 || j == i) {
               newRow[j] = 1;
            }
            else {
               newRow[j] = triangle[i-1][j] + triangle[i-1][j-1];
            }
         }
         triangle[i] = newRow;
      }
   }

   return triangle;
}

/**
Function contains algorithm to expand the polynomial.

1.The power of the first operand decreases from the original exponent
until it reaches zero on the last term.

2.The power of the second operand increases until it is equal to the power of the
original exponent.

3.The coefficient is derived from Pascal's triangle.
Alternatively, you could use the binomial theorem to derive the coefficient.
*/
function renderPoly() {

   let operand1 = document.getElementById("operand1").value;
   let operand2 = document.getElementById("operand2").value;
   let exponent = document.getElementById("exponent").value;
   let symbol = document.getElementById("operator").value;

   let terms = buildTermsList(operand1, operand2, exponent);

   let prelimFormula = obtainPrelim(terms, symbol);
   updateElement("prelim", prelimFormula);

   let simplifiedFormula = obtainSimplified(terms, symbol);
   updateElement("simplified", simplifiedFormula);

}

function buildTermsList(operand1, operand2, exponent) {

   let terms = [];
   let numOfTerms = parseInt(exponent) + 1;
   let operand1Power = exponent;
   let operand2Power = 0;
   let pascalTriangle = buildPascal(exponent);

   // Create an array to hold all the terms of the expansion.
   for (let i=0; i < numOfTerms; i++) {
      terms[i] =  pascalTriangle[exponent][i]  + "*"  + operand1 + "^" + operand1Power + "*" + operand2 + "^" + operand2Power ;
      operand1Power--;
      operand2Power++;
   }

   return terms;
}


/**
Function will render a preliminary, unsimplified formula and format it in HTML.
@param {Array} terms All the terms for the expansion.
@param {String} symbol The math operation (+, -).
@return {String} Preliminary formula.
*/
function obtainPrelim(terms, symbol) {

   let prelimFormula = "";
   let coefficient = "";
   let firstTerm = "";
   let secondTerm = "";

   for (var i =0; i < terms.length; i++) {

      // Decompose the term.
      let termSplit = terms[i].split("*");
      let Term = "";

      coefficient = "(" + "<span id=\"coefficient\" style=\"color\:red\">" +  termSplit[0] + "</span>" + ")";

      // If the exponent is 1, don't display the exponent.
      // If the exponent is 0, don't display anything (as the output is 1).
      if (termSplit[1].substring(2,3) == "1"){
         firstTerm = "(" + termSplit[1].substring(0,1) + ")";
      }
      else if (termSplit[1].substring(2,3) == "0") {
         firstTerm= "";
      }
      else {
         firstTerm = "(" + termSplit[1].substring(0,1) + "<sup>" + termSplit[1].substring(2,3) + "</sup>" + ")";
      }

      // If the exponent is 1, don't display the exponent.
      // If the exponent is 0, don't display anything (as the output is 1).
      if (termSplit[2].substring(2,3) == "1"){
         secondTerm = "(" + termSplit[2].substring(0,1) + ")";
      }
      else if (termSplit[2].substring(2,3) == "0") {
         secondTerm = "";
      }
      else {
         secondTerm = "(" + termSplit[2].substring(0,1) + "<sup>" + termSplit[2].substring(2,3) + "</sup>" + ")";
      }

      // Recombine the coefficient and 2 terms.
      Term = coefficient + firstTerm + secondTerm;

      // Construct completed formula. No sign for first term.
      // If the operator is a minus, then alternating terms must be negative.
      if (i == 0) {
         prelimFormula = Term;
      }
      else {
         if (symbol == "+") {
            prelimFormula = prelimFormula + " + " + Term;
        }
        else {
           let signCheck = i%2;
           let sign = (signCheck != 0) ? " - " : " + ";
           prelimFormula = prelimFormula + sign + Term;
        }
      }
   }

   return "<strong>Preliminary formula:</strong><br>" + prelimFormula;
}

/**
Function will render the simplified formula and format it in HTML.
@param {Array} terms All the terms for the expansion.
@param {String} symbol The math operation (+, -).
@return {String} Preliminary formula.
*/
function obtainSimplified(terms, symbol) {

   let simplifiedFormula = "";

   // First pass: evaluate exponents, if possible.
   for (let i =0; i < terms.length; i++) {
      // Decompose:
      let termSplit = terms[i].split("*");

      if ( regexMatch("[0-9]\\^",termSplit[1]) ) {
         let base = parseInt(termSplit[1].substring(0,1));
         let expo = parseInt(termSplit[1].substring(2));
         let baseToExpo = Math.pow(base,expo);
         termSplit[1] = baseToExpo.toString();
      }

      if ( regexMatch("[0-9]\\^",termSplit[2]) ) {
         let base = parseInt(termSplit[2].substring(0,1));
         let expo = parseInt(termSplit[2].substring(2));
         let baseToExpo = Math.pow(base,expo);
         termSplit[2] = baseToExpo.toString();
      }
      //Recombine:
      terms[i] = termSplit[0] + "*" + termSplit[1] + "*" + termSplit[2];
   }

   // Second pass: Simplify components of each term if possible.
   for (var j=0; j< terms.length; j++) {

      let product = 1;
      let unResolved = "";
      let termSplit = terms[j].split("*");

      if (!regexMatch("\\^",termSplit[0])) {
         product = product * parseInt(termSplit[0]);
      }
      else {
         unResolved = unResolved + "*" + termSplit[0];
      }

      if (!regexMatch("\\^",termSplit[1])) {
         product = product * parseInt(termSplit[1]);
      }
      else {
         unResolved = unResolved + "*" + termSplit[1];
      }

      if (!regexMatch("\\^",termSplit[2])) {
         product = product * parseInt(termSplit[2]);
      }
      else {
         unResolved = unResolved + "*" + termSplit[2];
      }

      terms[j] = product + unResolved;
   }

   for (let k =0; k < terms.length; k++) {

      let Term = "";
      let termSplit = terms[k].split("*");
      for (var l=0; l < termSplit.length; l++) {

         if (regexMatch("\\^", termSplit[l])) {

            if (termSplit[l].substring(2,3) != "0") {

               if (termSplit[l].substring(2,3) != "1") {
                  Term = Term + termSplit[l].substring(0,1) + "<sup>" + termSplit[l].substring(2,3) + "</sup>";
               }
               else {
                  Term = Term + termSplit[l].substring(0,1);
               }
            }
         }
         else {

            if (termSplit[l] != 1) {
               Term = Term + termSplit[l];
            }
         }
      }

      // Construct completed formula. No sign for first term.
      // If the operator is a minus, then alternating terms must be negative.
      if (k == 0) {
         simplifiedFormula = Term;
      }
      else {
         if (symbol == "+") {
            simplifiedFormula = simplifiedFormula + " + " + Term;
         }
         else {
            var signCheck = k%2;
            var sign = (signCheck != 0) ? " - " : " + ";
            simplifiedFormula = simplifiedFormula + sign + Term;
         }
      }
   }

   return "<strong>Further simplified:</strong><br>" + simplifiedFormula;
}

/**
Function validates user input.
*/
function validateInput() {

   let operand1 = document.getElementById("operand1");
   let operand2 = document.getElementById("operand2");
   let symbol = document.getElementById("operator");
   let exponent = document.getElementById("exponent");
   let operandCheck = "^[a-zA-Z0-9]+$";
   let exponentCheck = "^[1-9]+$";
   let validationPass = true;
   let errorMessages = ["","","","", ""];
   let errorMessagetxt = "";
   let statusBox = document.getElementById("validationResults");

   if (symbol.classList.contains('inputsInvalid')) {
      symbol.classList.remove('inputsInvalid');
      symbol.classList.add('inputsValid');
   }
   if (operand1.classList.contains('inputsInvalid')) {
      operand1.classList.remove('inputsInvalid');
      operand1.classList.add('inputsValid');
   }
   if (operand2.classList.contains('inputsInvalid')) {
      operand2.classList.remove('inputsInvalid');
      operand2.classList.add('inputsValid');
   }
   if (exponent.classList.contains('inputsInvalid')) {
      exponent.classList.remove('inputsInvalid');
      exponent.classList.add('inputsValid');
   }

   if (!(symbol.value == "+" || symbol.value == "-")) {
      symbol.classList.add('inputsInvalid');
      validationPass = false;
      errorMessages[0] = "Please enter a + or - for the operation.";
   }

   if (!regexMatch(operandCheck, operand1.value)) {
      operand1.classList.add('inputsInvalid');
      validationPass = false;
      errorMessages[1] = "Please enter a letter or number for the 1st operand.";
   }

   if (!regexMatch(operandCheck, operand2.value)) {
      operand2.classList.add('inputsInvalid');
      validationPass = false;
      errorMessages[2] = "Please enter a letter or number for the 2nd operand.";
   }

   if (!regexMatch(exponentCheck, exponent.value)) {
      exponent.classList.add('inputsInvalid');
      validationPass = false;
      errorMessages[3] = "Please enter a number between 1 and 9 for the exponent.";
   }

   if (operand1.value == operand2.value) {
      operand1.classList.add('inputsInvalid');
      operand2.classList.add('inputsInvalid');
      validationPass = false;
      errorMessages[4] = "Please enter different values for the operands.";
   }

   if (validationPass == false) {
      errorMessagetxt += "<ul>";
      for (var i=0; i < 5; i++) {
         if (errorMessages[i].length > 0) {
            errorMessagetxt = errorMessagetxt + "<li>" + errorMessages[i] + "</li>";
         }
      }
      errorMessagetxt += "</ul>";
   }

   statusBox.innerHTML = errorMessagetxt;

   return validationPass;
}

function updateElement(element, value) {

   let targetElement = document.getElementById(element);
   targetElement.innerHTML = value;
}


/**
Function will evaluate a regular expression against a string.
@param {String} pattern Regex test pattern.
@param {String} target String to be tested.
@return {Boolean} Whether or not the target conforms to the pattern.
*/
function regexMatch(pattern, target) {
   let re = new RegExp(pattern);
   return re.test(target);
}

/**********
Function invoked during event handler for each input field.
**********/
function nextField(selection) {

   let operand2 = document.getElementById("operand2");
   let exponent = document.getElementById("exponent");

   if (selection.id == "operand1") {
      operand2.focus();
   }

   if (selection.id == "operand2") {
      exponent.focus();
   }
}
