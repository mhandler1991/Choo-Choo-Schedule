// *******************
// Initialize Firebase
// *******************
var firebaseConfig = {
    apiKey: "AIzaSyCKvxCX-_5T4tK0UqktOpa-j0uK2AhusXg",
    authDomain: "timesheet-f44cf.firebaseapp.com",
    databaseURL: "https://timesheet-f44cf.firebaseio.com",
    projectId: "timesheet-f44cf",
    storageBucket: "",
    messagingSenderId: "151373391594",
    appId: "1:151373391594:web:516ac6285c89b12f"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// Create a variable to reference the database.
var database = firebase.database();
// *******************
// Global Variables
// *******************
var nameU;
var roleU;
var startDateU;
var rateU;
var monthsWorkedU;
var totalBilledU;


// *******************
// look into firebase to see if there is any current data
// *******************
//  display the data onto the page
// *******************
// input new record on Submit
// *******************
$("#submit").on("click", function () {
    // Prevent Default Submit button action
    event.preventDefault();
    // *******************
    // Send to Firebase
    // *******************
    // Grab Variables from Table
    nameU = $('#input-name').val().trim();
    roleU = $('#input-role').val().trim();
    startDateU = $('#input-start').val().trim();
    rateU = $('#input-rate').val().trim();
    // Console Log variables
    console.log(nameU);
    console.log(roleU);
    console.log(startDateU);
    console.log(rateU);
    // Calculate the months worked
    console.log("startDateU "+ startDateU);
    // monthsWorkedU = moment(startDateU, "DD/MM/YY").fromNow().replace(/[^\d.]/g, '');
    monthsWorkedU = moment().diff(moment(startDateU,"DD/MM/YY"),"months");
    console.log("monthsWorkedU: " + monthsWorkedU);
    // Calculate the Total Billed
    totalBilledU = rateU * monthsWorkedU;
    database.ref().push({
        name: nameU,
        role: roleU,
        startDate: startDateU,
        monthsWorked: monthsWorkedU,
        rate: rateU,
        totalBilled: totalBilledU,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
    });
    $('#input-name').val('');
    $('#input-role').val('');
    $('#input-start').val('');
    $('#input-rate').val('');
});
// *******************
// Wait for firebase to print to page
// *******************
database.ref().on("child_added", function (childSnapshot) {
    // Log everything that's coming out of snapshot
    console.log(childSnapshot.val().name);
    console.log(childSnapshot.val().role);
    console.log(childSnapshot.val().startDate);
    console.log(childSnapshot.val().monthsWorked);
    console.log(childSnapshot.val().rate);
    console.log(childSnapshot.val().totalBilled);
    console.log(childSnapshot.val().dateAdded);
    // Create row with columns
    var table = $('#currentEmployees');
    var row = $("<tr>");
    var cell1 = $("<td>");
    var cell2 = $("<td>");
    var cell3 = $("<td>");
    var cell4 = $("<td>");
    var cell5 = $("<td>");
    var cell6 = $("<td>");

    // Print Row w/ Columns to Table
    $(cell1).text(childSnapshot.val().name);
    $(cell2).text(childSnapshot.val().role);
    $(cell3).text(childSnapshot.val().startDate);
    $(cell4).text(childSnapshot.val().monthsWorked);
    $(cell5).text(childSnapshot.val().rate);
    $(cell6).text(childSnapshot.val().totalBilled);

    $(row).append(cell1);
    $(row).append(cell2);
    $(row).append(cell3);
    $(row).append(cell4);
    $(row).append(cell5);
    $(row).append(cell6);
    $("#currentEmployees").append(row);
    // Handle the errors
}, function (errorObject) {
    console.log("Errors handled: " + errorObject.code);
});