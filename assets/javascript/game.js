$("document").ready(function() {

    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyCej58sMXsmikJSG1a5ZILMRKFUVoSOmZA",
        authDomain: "schoolproject-e34b4.firebaseapp.com",
        databaseURL: "https://schoolproject-e34b4.firebaseio.com",
        projectId: "schoolproject-e34b4",
        storageBucket: "schoolproject-e34b4.appspot.com",
        messagingSenderId: "832650070512"
    };
    firebase.initializeApp(config);

    // GLOBAL 
    var i = 0;
    var getKey = "";
    var newtrainName = "";
    var newdestination = "";
    var newtrainTime = "";
    var newfrequency = "";
    var newTrain = "";
    // refresh page every minute to show updated schedule
    setInterval(function() {
        location.reload(true);
    }, 60000);

    //current time for updating page and all calculations
    var currentTime = moment();

    function updateCurrentTime() {
        currentTime = moment().format("HH:mm:ss");

        $("#currentTime").html("" + currentTime);
    };

    var database = firebase.database();

    updateCurrentTime();
    setInterval(updateCurrentTime, 1000);

    /// remove train from page and firebase
    $(document).on("click", ".delete", function(event) {
        event.preventDefault();
        $(this).closest('tr').remove();
        console.log("this from delet button" + this);

        getKey = $(this).attr('id');

        database.ref().child(getKey).remove();

    });

    //submit button
    $("#add-train-btn").on("click", function(event) {
        event.preventDefault();

        //grab the user input

        var newi = i;
        newtrainName = $("#train-name-input").val().trim();
        newdestination = $("#destination-input").val().trim();
        newtrainTime = $("#train-time-input").val().trim();
        newfrequency = $("#frequency-input").val().trim();

        //create a local temporary object for holding form data
        newTrain = {
            idata: newi,
            trainName: newtrainName,
            destination: newdestination,
            trainTime: newtrainTime,
            frequency: newfrequency
        };
        // upload train info into the database

        database.ref().push(newTrain);

        console.log(newTrain.newi);
        console.log(newTrain.newtrainName);
        console.log(newTrain.newdestination);
        console.log(newTrain.newtrainTime);
        console.log(newTrain.newfrequency);

        //clear all input fields
        $("#train-name-input").val("");
        $("#destination-input").val("");
        $("#train-time-input").val("");
        $("#frequency-input").val("");
    });

    //create a firebase event for adding train to database and a row in the HTML table

    database.ref().on("child_added", function(childSnapshot, childKey) {
        // i++;

        console.log("childKey   " + childKey);
        console.log("childSnapshot -- " + childSnapshot.val());

        var newi = childSnapshot.val().idata;
        var newtrainName = childSnapshot.val().trainName;
        var newdestination = childSnapshot.val().destination;
        var newtrainTime = childSnapshot.val().trainTime;
        var newfrequency = childSnapshot.val().frequency;

        // console.log(newdeleteBtn);
        console.log(newi);
        console.log(newtrainName);
        console.log(newdestination);
        console.log(newtrainTime);
        console.log(newfrequency);

        //calculations..

        // to make sure first train time before the current time
        var firstTimeConverted = moment(newtrainTime, "HH:mm").subtract(1, "years");
        console.log(firstTimeConverted);

        //  // Difference between the times
        var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
        console.log("DIFFERENCE IN TIME: " + diffTime);
        // Time apart (remainder)
        var tRemainder = diffTime % newfrequency;
        console.log(tRemainder);

        // Minute Until Train calculation
        var tMinutesTillTrain = newfrequency - tRemainder;
        console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

        // Next Train time calculation
        var nextTrain = moment().add(tMinutesTillTrain, "minutes");
        newtrainTime = moment(nextTrain).format("HH:mm:ss");
        console.log("ARRIVAL TIME: " + moment(nextTrain).format("HH:mm:ss"));

        var btn = $("<button id=" + "'" + childKey + "'" + " class = 'delete btn btn-raised btn-sm'>" + "x" + "</button>");
        console.log("childKey after delete button line   " + childKey + "train number" + i);

        var tr = $("<tr id=" + "'" + childKey + "'" + "  >");

        tr.append(btn);
        tr.append("<td>" + newtrainName +
            "</td><td>" + newdestination +
            "</td><td>" + newfrequency +
            "</td><td>" + newtrainTime +
            "</td><td>" + tMinutesTillTrain +
            "</td>"
        )
        $("#new-train").append(tr);
        i++;

    });

});