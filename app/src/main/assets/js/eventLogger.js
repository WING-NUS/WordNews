var currentEvent = "";

var eventLogCont = {};

//This function will create a event log
function createEventLog (id, userid, activity, eventName) {    
    eventLogCont[id] = {    user_id: userid, 
                            activity: activity, 
                            time_elapsed: 0,
                            currentEvent: eventName, 
                            currentStartTime: performance.now(),                              
                            detail: {
                                pattern: []
                            } 
                    };    
}

//A generic function which can be used for 
function newEvent (id, eventName) {
    console.log("New event: " + eventName);
    //Cache the event log
    var eventLog = eventLogCont[id];        
    //Create a new event 
    var newEventDetail = {};
    //Cache new start time
    var newCurrentStartTime = performance.now();
    //Compute the time elapsed 
    newEventDetail[eventLog.currentEvent] = newCurrentStartTime - eventLog.currentStartTime;
    //Set the new start time
    eventLog.currentStartTime = newCurrentStartTime;
    eventLog.currentEvent = eventName;
    eventLog.detail.pattern.push(newEventDetail);         
}

function addDetail (id, detailTitle, detail) {
    eventLogCont[id].detail[detailTitle] = detail;
}

function getEventLog(id) {
    var eventLog = eventLogCont[id]; 
    var newEventDetail = {};
    var newCurrentStartTime = performance.now();
    //Compute the time elapsed 
    newEventDetail[eventLog.currentEvent] = newCurrentStartTime - eventLog.currentStartTime;
    eventLog.detail.pattern.push(newEventDetail); 
    
    //Remove the unnecessary properties 
    delete eventLog["currentEvent"];
    delete eventLog["currentStartTime"];
    //Compute the total time elapsed    
    for (var i = 0; i < eventLog.detail.pattern.length; ++i) {
        for (var key in eventLog.detail.pattern[i]) {
            eventLog.time_elapsed += eventLog.detail.pattern[i][key];
        }    
    }
    return eventLog;
}