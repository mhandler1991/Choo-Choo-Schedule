//****************************************************************
//
//                        ---                                     
//                     -        --                             
//                 --( /     \ )XXXXXXXXXXXXX                   
//             --XXX(   O   O  )XXXXXXXXXXXXXXX-              
//            /XXX(       U     )        XXXXXXX\               
//          /XXXXX(              )--   XXXXXXXXXXX\             
//         /XXXXX/ (      O     )   XXXXXX   \XXXXX\
//         XXXXX/   /            XXXXXX   \   \XXXXX----        
//         XXXXXX  /          XXXXXX         \  ----  -         
// ---     XXX  /          XXXXXX      \           ---        
//   --  --  /      /\  XXXXXX            /     ---=         
//     -        /    XXXXXX              '--- XXXXXX         
//       --\/XXX\ XXXXXX                      /XXXXX         
//         \XXXXXXXXX                        /XXXXX/
//          \XXXXXX                         /XXXXX/         
//            \XXXXX--  /                -- XXXX/       
//             --XXXXXXX---------------  XXXXX--         
//                \XXXXXXXXXXXXXXXXXXXXXXXX-            
//                  --XXXXXXXXXXXXXXXXXX-
//
//
//****************************************************************

// Run when Document is Ready
$(document).ready(function () {

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
    var destinationU;
    var trainStartU;
    var frequencyU;
    var nextArrivalU;
    var minutesAwayU;


    // *******************
    // look into firebase to see if there is any current data
    // Display the data onto the page
    // Input new record on Submit
    // *******************

    $("#submit").on("click", function () {

        // Prevent Default Submit button action
        event.preventDefault();

        // *******************
        // Send to Firebase
        // *******************

        // Grab Variables from Table
        nameU = $('#input-name').val().trim();
        destinationU = $('#input-destination').val().trim();
        trainStartU = $('#input-firsttime').val().trim();
        frequencyU = $('#input-frequency').val().trim();

        // Console Log variables
        console.log(nameU);
        console.log(destinationU);
        console.log(trainStartU);
        console.log(frequencyU);
        console.log("trainStartU " + trainStartU);
        trainStartU = moment(trainStartU, 'HH:mm').format('HH:mm a');

        // Function variables
        // a = trainStartU
        // b = frequencyU

        function timeschedule(a, b) {

            // log variables
            console.log("TrainStart: ", a);
            console.log("Freq: ", b)

            // Parse b (Frequency) to Integer
            b = parseInt(b);

            // Add frequency minutes to next arrival variables
            nextArrivalU = moment(a, 'HH:mm').add(b, 'm').format('HH:mm a');

            // Define now
            var now = moment().format('HH:mm a');
            // log now
            console.log('now:', moment().format('HH:mm a'));

            // log calculations and result
            console.log("calculation:", moment(a, 'HH:mm').add(b, 'm').format('HH:mm a'));
            console.log("Next Arrival: ", nextArrivalU);

            // log calulation
            console.log('IF:', moment(nextArrivalU, 'HH:mm a').isBefore(moment(now, 'HH:mm a'), 'HH:mm a'));

            // is next arrival greater or less than now?
            if (moment(nextArrivalU, 'HH:mm a').isBefore(moment(now, 'HH:mm a'), 'HH:mm a')) {
                // run this function, once agian
                timeschedule(nextArrivalU, b);
                console.log("NOPE");
            } else {
                // woot, let's return
                console.log("YEP -- We have the future time -- YEP");
                return;
            }

            // calculate minutes away
            minutesAwayU = moment(nextArrivalU, 'h').fromNow(true);
            // Log that motha
            console.log('NextArrival: ',nextArrivalU);

        };

        // Function variables
        // a = trainStartU
        // b = frequencyU

        timeschedule(trainStartU, frequencyU);

        console.log("NextArrival: ", nextArrivalU);
        console.log("MinutesAway: ", minutesAwayU);

        database.ref().push({
            name: nameU,
            destination: destinationU,
            start: trainStartU,
            frequency: frequencyU,
            nextArrival: nextArrivalU,
            minutesAway: minutesAwayU,
            dateAdded: firebase.database.ServerValue.TIMESTAMP
        });
        $('#input-name').val('');
        $('#input-destination').val('');
        $('#input-firsttime').val('');
        $('#input-frequency').val('');
    });


    // *******************
    // Wait for firebase to print to page
    // *******************
    database.ref().on("child_added", function (childSnapshot) {

        // Log everything that's coming out of snapshot
        console.log(childSnapshot.val().name);
        console.log(childSnapshot.val().destination);
        console.log(childSnapshot.val().start);
        console.log(childSnapshot.val().frequency);
        console.log(childSnapshot.val().nextArrival);
        console.log(childSnapshot.val().minutesAway);
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
        $(cell2).text(childSnapshot.val().destination);
        $(cell3).text(childSnapshot.val().start);
        $(cell4).text(childSnapshot.val().frequency);
        $(cell5).text(childSnapshot.val().nextArrival);
        $(cell6).text(childSnapshot.val().minutesAway);

        // Lets append dem' rows 
        $(row).append(cell1);
        $(row).append(cell2);
        $(row).append(cell3);
        $(row).append(cell4);
        $(row).append(cell5);
        $(row).append(cell6);
        $("#currentEmployees").append(row);

        // Handle the errors
    }, function (errorObject) {

        // Log error
        console.log("Errors handled: " + errorObject.code);
    });

})