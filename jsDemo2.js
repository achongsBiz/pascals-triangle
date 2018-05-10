/*******************************************
Module: jsDemo2.js
Project: jsDemo2
Log:
20180506 - Initial revision.
********************************************/

/**********
Function controls script flow.
**********/
function submitAction() {

   var validationCheck = validateInput();
   if (validationCheck)
   {
      renderPascal();
      expandPoly();
   }
}

/**********
Function renders Pascal's triangle into HTML.
**********/
function renderPascal() {

   var updateArea = document.getElementById("triangleArea");
   var pascal = buildPascal();
   var lastRow = pascal.length - 1;
   var tableHTML = "<strong>Pascal's Triangle based on input:</strong><br><table>";
   var rowFormatBegin = "";
   var rowFormatEnd = "";

   for (var i=0; i < pascal.length; i++) {

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
   updateArea.innerHTML = tableHTML;
}

/**********
Function contains algorithm to build Pascal's triangle.
**********/
function buildPascal(){

   var triangle = new Array();
   var exponent = document.getElementById("exponent").value;
   var triangleLength = parseInt(exponent) + 1;

   // Initialize second layer of arrays.
   for (var i=0; i < triangleLength; i++) {
      triangle[i] = new Array();
   }

   for (var i=0; i< triangle.length; i++) {

      // Build first two rows.  [0]: 1 > [1]: 1,1
      if (i==0) {
         triangle[i]= new Array(1);
      }
      if (i==1) {
         triangle[i]= new Array(1, 1);
      }

      // Build remaining rows. [2]: 1,2,1 > [3]: 1,3,3,1 > [n]: etc.
      else {
         var rowLength = i + 1;
         var newRow = new Array();
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

/**********
Function contains algorithm to expand the polynomial.

1.The power of the first operand decreases from the original exponent
until it reaches zero on the last term.

2.The power of the second operand increases until it is equal to the power of the
original exponent.

3.The coefficient is derived from Pascal's triangle.
Alternatively, you could use the binomial theorem to derive the coefficient.
**********/

function expandPoly() {

   var operand1 = document.getElementById("operand1").value;
   var operand2 = document.getElementById("operand2").value;
   var symbol = document.getElementById("operator").value;
   var exponent = document.getElementById("exponent").value;
   var terms = new Array("");
   var numOfTerms = parseInt(exponent) + 1;
   var operand1Power = exponent;
   var operand2Power = 0;
   var pascalTriangle = buildPascal();

   // Create an array to hold all the terms of the expansion.
   for (var i=0; i < numOfTerms; i++) {
      terms[i] =  pascalTriangle[exponent][i]  + "*"  + operand1 + "^" + operand1Power + "*" + operand2 + "^" + operand2Power ;
      operand1Power--;
      operand2Power++;
   }

   renderPrelim(terms);
   renderSimplified(terms);

}

/**********
Function will render a preliminary, unsimplified formula and
format it in HTML.
**********/
function renderPrelim(terms) {

   var PrelimOutput = "";
   var prelimFormula = "";
   var prelimSection = document.getElementById("prelim");
   var coefficient = "";
   var firstTerm = "";
   var secondTerm = "";
   var symbol = document.getElementById("operator").value;

   for (var i =0; i < terms.length; i++) {

      // Decompose the term.
      var termSplit = terms[i].split("*");
      var Term = "";

      coefficient = "(" + "<span id=\"coefficient\" style=\"color\:red\">" +  termSplit[0] + "</span>" + ")";

      // If the exponent is 1, don't display the exponent.
      // If the exponent is 0, don't display anything (as the output is 1).
      if (termSplit[1].substring(2,3) == "1"){
         var firstTerm = "(" + termSplit[1].substring(0,1) + ")";
      }
      else if (termSplit[1].substring(2,3) == "0") {
         var firstTerm= "";
      }
      else {
         var firstTerm = "(" + termSplit[1].substring(0,1) + "<sup>" + termSplit[1].substring(2,3) + "</sup>" + ")";
      }

      // If the exponent is 1, don't display the exponent.
      // If the exponent is 0, don't display anything (as the output is 1).
      if (termSplit[2].substring(2,3) == "1"){
         var secondTerm = "(" + termSplit[2].substring(0,1) + ")";
      }
      else if (termSplit[2].substring(2,3) == "0") {
         var secondTerm = "";
      }
      else {
         var secondTerm = "(" + termSplit[2].substring(0,1) + "<sup>" + termSplit[2].substring(2,3) + "</sup>" + ")";
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
           var signCheck = i%2;
           var sign = (signCheck != 0) ? " - " : " + ";
           prelimFormula = prelimFormula + sign + Term;
        }
      }
   }

   // Send formula to HTML.
   prelimSection.innerHTML = "<strong>Preliminary formula:</strong><br>" + prelimFormula;
}

/**********
Function will render the simplified formula and
format it in HTML.
**********/
function renderSimplified(terms) {

   var PrelimOutput = "";
   var simplifiedFormula = "";
   var simplifiedSection = document.getElementById("simplified");
   var symbol = document.getElementById("operator").value;

   // First pass: evaluate exponents, if possible.
   for (var i =0; i < terms.length; i++) {
      // Decompose:
      var termSplit = terms[i].split("*");

      if ( regexMatch("[0-9]\\^",termSplit[1]) ) {
         var base = parseInt(termSplit[1].substring(0,1));
         var expo = parseInt(termSplit[1].substring(2));
         var baseToExpo = Math.pow(base,expo);
         termSplit[1] = baseToExpo.toString();
      }

      if ( regexMatch("[0-9]\\^",termSplit[2]) ) {
         var base = parseInt(termSplit[2].substring(0,1));
         var expo = parseInt(termSplit[2].substring(2));
         var baseToExpo = Math.pow(base,expo);
         termSplit[2] = baseToExpo.toString();
      }
      //Recombine:
      terms[i] = termSplit[0] + "*" + termSplit[1] + "*" + termSplit[2];
   }

   // Second pass: Simplify components of each term if possible.
   for (var j=0; j< terms.length; j++) {

      var product = 1;
      var unResolved = "";
      var productString = "";
      var termSplit = terms[j].split("*");

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

   for (var k =0; k < terms.length; k++) {

      var Term = "";
      var termSplit = terms[k].split("*");
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

      simplifiedSection.innerHTML = "<strong>Further simplified:</strong><br>" + simplifiedFormula;
   }
}

/**********
Function validates user input.
**********/
function validateInput() {

   var operand1 = document.getElementById("operand1");
   var operand2 = document.getElementById("operand2");
   var symbol = document.getElementById("operator");
   var exponent = document.getElementById("exponent");
   var operandCheck = "^[a-zA-Z0-9]+$";
   var exponentCheck = "^[1-9]+$";
   var validationPass = true;
   var errorMessages = ["","","","", ""];
   var errorMessagetxt = "";
   var statusBox = document.getElementById("validationResults");

   // Reset all formatting.
   symbol.style.backgroundColor = "white";
   operand1.style.backgroundColor = "white";
   operand2.style.backgroundColor = "white";
   exponent.style.backgroundColor = "white";

   if (!(symbol.value == "+" || symbol.value == "-")) {
      symbol.style.backgroundColor = "orange";
      validationPass = false;
      errorMessages[0] = "Please enter a + or - for the operation."
   }

   if (!regexMatch(operandCheck, operand1.value)) {
      operand1.style.backgroundColor = "orange";
      validationPass = false;
      errorMessages[1] = "Please enter a letter or number for the 1st operand."
   }

   if (!regexMatch(operandCheck, operand2.value)) {
      operand2.style.backgroundColor = "orange";
      validationPass = false;
      errorMessages[2] = "Please enter a letter or number for the 2nd operand."
   }

   if (!regexMatch(exponentCheck, exponent.value)) {
      exponent.style.backgroundColor = "orange";
      validationPass = false;
      errorMessages[3] = "Please enter a number between 1 and 9 for the exponent."
   }

   if (operand1.value == operand2.value) {
      operand1.style.backgroundColor = "orange";
      operand2.style.backgroundColor = "orange";
      validationPass = false;
      errorMessages[4] = "Please enter different values for the operands.";
   }

   if (validationPass == false) {
      errorMessagetxt += "<ul>"
      for (var i=0; i < 5; i++) {
         if (errorMessages[i].length > 0) {
            errorMessagetxt = errorMessagetxt + "<li>" + errorMessages[i] + "</li>";
         }
      }
      errorMessagetxt += "</ul>"
   }

   statusBox.innerHTML = errorMessagetxt;

   return validationPass;
}

/**********
Function will evaluate a regular expression against a string.
**********/
function regexMatch(pattern, target) {
   var re = new RegExp(pattern);
   return re.test(target);
}

/**********
Function invoked during event handler for each input field.
**********/
function nextField(selection) {

   var operand2 = document.getElementById("operand2");
   var exponent = document.getElementById("exponent");

   if (selection.id == "operand1") {
      operand2.focus();
   }

   if (selection.id == "operand2") {
      exponent.focus();
   }
}
