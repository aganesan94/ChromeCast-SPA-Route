/**
 * Created by AGanesan on 3/8/16.
 */

/**
 * Cast initialization timer delay
 **/
var CAST_API_INITIALIZATION_DELAY = 1000;

//Register the application id
var CAST_APPLICATION_ID = 'A092081C';

var session = null;
/**
 * Call initialization
 */
if (!chrome.cast || !chrome.cast.isAvailable) {
    setTimeout(initializeCastApi, CAST_API_INITIALIZATION_DELAY);
}

/**
 * initialization
 */
function initializeCastApi() {
    // default app ID to the default media receiver app
    // optional: you may change it to your own app ID/receiver
    /*  var applicationIDs = [x``
     chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID
     ];*/

    var applicationIDs = [CAST_APPLICATION_ID];


    // auto join policy can be one of the following three
    // 1) no auto join
    // 2) same appID, same URL, same tab
    // 3) same appID and same origin URL
    var autoJoinPolicyArray = [
        chrome.cast.AutoJoinPolicy.PAGE_SCOPED,
        chrome.cast.AutoJoinPolicy.TAB_AND_ORIGIN_SCOPED,
        chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED
    ];

    // request session
    var sessionRequest = new chrome.cast.SessionRequest(applicationIDs[0]);
    var apiConfig = new chrome.cast.ApiConfig(sessionRequest,
        sessionListener,
        receiverListener,
        autoJoinPolicyArray[1]);

    chrome.cast.initialize(apiConfig, onInitSuccess, onError);
}

/**
 * session listener during initialization
 * @param {Object} e session object
 * @this sessionListener
 */
function sessionListener(e) {
    console.log('sessionListener(): Registering a new session ID: ' + e.sessionId);
    session = e;
}

/**
 * receiver listener during initialization
 * @param {string} e status string from callback
 */
function receiverListener(e) {
    if ( e === chrome.cast.ReceiverAvailability.AVAILABLE) {
        console.log('receiverListener(): Receiver found with: ' + CAST_APPLICATION_ID);

    }
    else {
        console.log('receiverListener(): Receiver was not found with: ' + CAST_APPLICATION_ID);
    }
}

/**
 * initialization success callback
 */
function onInitSuccess() {
    console.log('onInitSuccess(): Initialization successful');

}

/**
 * launch app and request session
 */
function launchApp() {
    console.log('launchApp(): Trying to launch Application. Requesting session connection with receiver.');
    chrome.cast.requestSession(onLaunchAppSuccess, onLaunchError);
}

/**
 * callback on success for requestSession call
 * @param {Object} e A non-null new session.
 * @this onLaunchAppSuccess
 */
function onLaunchAppSuccess(e) {
    console.log('onRequestSessionSuccess() : Session establishment, was successful, received session id:  ' + e.sessionId);
    session = e;
    $("#launchApp").hide();
    $("#stopApp").show();
}

/**
 * callback on launch error
 */
function onLaunchError() {
    console.log('onLaunchError() : Session establishment failure');
}

/**
 * generic error callback
 * @param {Object} e A chrome.cast.Error object.
 */
function onError(e) {
    console.log('onError(): Error' + e);
}


/**
 * stop app/session
 */
function stopApp() {
    console.log("stopApp(): Trying to stop session.")
    session.stop(onStopAppSuccess, onError);
    $("#launchApp").show();
    $("#stopApp").hide();
}

/**
 * callback on success for stopping app
 */
function onStopAppSuccess() {
    console.log("session stopped successfully.");
}

function hideLaunchAppAndShowStopApp() {
    $("#launchApp").hide();
}

$(document).ready(function () {
    console.log("All call backs have been initialized");
    $("#stopApp").hide();
});