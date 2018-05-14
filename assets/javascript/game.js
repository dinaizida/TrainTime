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

    //  // refresh page every minute to show updated schedule
      setInterval(function() {
        location.reload(true); }, 60000);

    var currentTime;

    //current time
    var currentTime = moment();

    function updateCurrentTime() {
        currentTime = moment().format("HH:mm:ss");
        console.log("current time - " + currentTime);
        $("#currentTime").html("" + currentTime);
    }

    var database = firebase.database();

    updateCurrentTime();
    setInterval(updateCurrentTime, 1000);
    

    //submit button
    $("#add-train-btn").on("click", function(event) {
        event.preventDefault();

        //grab the user input
        var newtrainName = $("#train-name-input").val().trim();
        var newdestination = $("#destination-input").val().trim();
        var newtrainTime = $("#train-time-input").val().trim();
        var newfrequency = $("#frequency-input").val().trim();

        //create a local temporary object for holding form data
        var newTrain = {
            trainName: newtrainName,
            destination: newdestination,
            trainTime: newtrainTime,
            frequency: newfrequency
        };
        // upload train info into the database

        database.ref().push(newTrain);
        console.log(newTrain.trainName);
        console.log(newTrain.destination);
        console.log(newTrain.trainTime);
        console.log(newTrain.frequency);

        alert("Train successfully added");

        //clear all input fields
        $("#train-name-input").val("");
        $("#destination-input").val("");
        $("#train-time-input").val("");
        $("#frequency-input").val("");
    });
    //create a firebase event for adding train to database and a row in the HTML table

    database.ref().on("child_added", function(childSnapshot, prevChildKey) {

        console.log(childSnapshot.val());
        var newtrainName = childSnapshot.val().trainName;
        var newdestination = childSnapshot.val().destination;
        var newtrainTime = childSnapshot.val().trainTime;
        var newfrequency = childSnapshot.val().frequency;

        console.log(newtrainName);
        console.log(newdestination);
        console.log(newtrainTime);
        console.log(newfrequency);

        //calculations..
        // var newfrequency = newfrequency;
        // var firstTime = newtrainTime;
        // to make sure first train time before the current time
        var firstTimeConverted = moment(newtrainTime, "HH:mm").subtract(1, "years");
        console.log(firstTimeConverted);

        //  // Difference between the times
        var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
        console.log("DIFFERENCE IN TIME: " + diffTime);
        // Time apart (remainder)
        var tRemainder = diffTime % newfrequency;
        console.log(tRemainder);

        // Minute Until Train
        var tMinutesTillTrain = newfrequency - tRemainder;
        console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

        // Next Train
        var nextTrain = moment().add(tMinutesTillTrain, "minutes");
        newtrainTime = moment(nextTrain).format("HH:mm:ss");
        console.log("ARRIVAL TIME: " + moment(nextTrain).format("HH:mm:ss"));

        // add train data to the HTML table 

        $("#new-train").append("<tr><td>" + newtrainName +
            "</td><td>" + newdestination +
            "</td><td>" + newfrequency +
            "</td><td>" + newtrainTime +
            "</td><td>" + tMinutesTillTrain +
            "</td><tr>"
        )

    });
   
});