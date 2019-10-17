/** Meetup API integration in vanilla JavaScript **/

function WTMMeetup() {
  this.events;
  this.callback;
  this.script;
}

WTMMeetup.prototype.loadAllEvents = function (callback) {
  this.callback = callback;

  // Use JSONP request to escape the CORS
  this.script = document.createElement('script');
  this.script.src = 'https://api.meetup.com/womentechmakershamburg/events?callback=wtmMeetup.setEvents';

  document.querySelector('head').appendChild(this.script);
};

WTMMeetup.prototype.setEvents = function (response) {
  this.events = response.data;
  this.script.parentNode.removeChild(this.script);
  this.callback();
};

WTMMeetup.prototype.getNextEvent = function () {
  return this.events ? this.events[0] : null;
};

var wtmMeetup = new WTMMeetup();


/** Counter implementation in vanilla JavaScript & ES6 - ECMAScript 6 **/

// Let's define our variables first:
// A global variable, for accessing the interval
// The two HTML DOM nodes for the countdown text and the countdown time
/* let countdown; */
/* let eventName; */
var countdown;
var eventName;
var eventDate;

/*
const $countdownName = document.querySelector('.countdown__name');
const $countdownTime = document.querySelector('.countdown__time');
*/
var $countdownName = document.querySelector('.countdown__name');
var $countdownTime = document.querySelector('.countdown__time');

var $nextEventDate = document.querySelector('.next-event-date');
var $nextEventDescription = document.querySelector('.next-event-description');
const $nextEventLink = document.querySelector('#next-event-link');

/**
 * Get the date for the upcoming event and the current date,
 * calculate the date difference and pass this difference
 * for creating the text strings for the HTML.
 */
function renderCountdown(nextEventDate) {
  getCountdownTimeString(getTimeRemaining(nextEventDate));
}

// Reference: https://www.sitepoint.com/build-javascript-countdown-timer-no-dependencies/
function getTimeRemaining(endtime) {
  var t = Date.parse(endtime) - Date.parse(new Date());
  var seconds = Math.floor((t / 1000) % 60);
  var minutes = Math.floor((t / 1000 / 60) % 60);
  var hours = Math.floor((t / (1000 * 60 * 60)) % 24);
  var days = Math.floor(t / (1000 * 60 * 60 * 24));
  return {
    'total': t,
    'days': days,
    'hours': hours,
    'minutes': minutes,
    'seconds': seconds
  };
}

/**
 * Get the text strings for the countdown text and time.
 * @param {Date} date
 *    The date difference between the current date
 *    and the date of the upcoming event
 */
function getCountdownTimeString(countdownData) {
  /*
    let days = date.getDate();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();

    let countdownText, countdownName, countdownTime;
  */
  var days = countdownData.days;
  var hours = countdownData.hours;
  var minutes = countdownData.minutes;
  var seconds = countdownData.seconds;

  var countdownText, countdownName, countdownTime;

  if (countdownData.total >= 0) {
    days = days < 2 ? `${days} day, ` : `${days} days, `;
    hours = hours < 2 ? `${hours} hour and ` : `${hours} hrs, `;
    minutes = minutes < 2 ? `${minutes} minute and ` : `${minutes} min and `;
    seconds = seconds < 2 ? `${seconds} second` : `${seconds} sec`;
    countdownText = `Next Event:`;
    countdownName = eventName;
    countdownTime = `${days}${hours}${minutes}${seconds}`;
  } else if (countdownData.total >= -10800000 && countdownData.total < 0) {
    countdownText = `The Event:`;
    countdownName = eventName;
    countdownTime = `is happening right now!`
  } else {
    countdownText = `The Event:`;
    countdownName = eventName;
    countdownTime = `is already over.`;
    clearInterval(countdown);
  }

  setCountdownInfo(countdownText, countdownName, countdownTime);
}

/**
 * sets the text in the page with the next Date information
 * @param countdownText
 * @param countdownName
 * @param countdownTime
 */
function setCountdownInfo(countdownText, countdownName, countdownTime) {
  // Finally write the respective text strings to the HTML
  $countdownName.textContent = countdownName;
  $countdownTime.textContent = countdownTime;
}

/** Get the next event's date and display it **/
var $monthsGerman = ["Januar", "Februar", "März", "April", "Mai", "Juni",
  "Juli", "August", "September", "Oktober", "November", "Dezember"
];
var $monthsEnglish = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

function setNextEventDateInfo(nextEventDateInfo) {
  $nextEventDate.textContent = nextEventDateInfo;
}

function getNextEventDateString(day, month, year, timeHours, timeMinutes) {
  var monthName = "";
  var oClock = "";
  if (window.location.href.indexOf("/en/") != -1) {
    monthName = $monthsEnglish[month];
    oClock = timeHours > 12 ? "p.m." : "a.m.";
    timeHours = timeHours % 12;
    timeHours = timeHours ? timeHours : 12; // the time '0' should be '12' in English/American format
    timeMinutes = timeMinutes < 10 ? '0' + timeMinutes : timeMinutes;
  } else {
    monthName = $monthsGerman[month];
    oClock = "Uhr";
  }
  return day + ". " + monthName + " " + year + ", " + timeHours + ":" + timeMinutes + " " + oClock;
}

function initializeNextEventDate(eventDate) {
  setNextEventDateInfo(
    getNextEventDateString(
      eventDate.getDate(),
      eventDate.getUTCMonth(),
      eventDate.getFullYear(),
      eventDate.getHours(),
      eventDate.getMinutes()));
}

// Let's start building our functions:
/**
 * Initialize the countdown, which should be updated in a one second interval
 */
function initializeCountdown(eventDate) {
  // Get the next event's date(timestamp)
  countdown = setInterval(renderCountdown, 1000, eventDate);
}

// As soon as the scripts is fully loaded by the browser,
// this function should be immediately called for starting the countdown

function initializeEventDescription(eventDescriptionHTML) {
  $nextEventDescription.innerHTML = eventDescriptionHTML;
}

/**
 * Initialize the event link
 * @param eventLink the event link
 */

function initializeEventLink(eventLink) {
 $nextEventLink.setAttribute("href", eventLink)
}
function initialize() {
  wtmMeetup.loadAllEvents(function (e) {
    var nextEvent = wtmMeetup.getNextEvent();
    if (nextEvent) {
      // Get the next event's name
      eventName = nextEvent.name;
      eventDate = new Date(nextEvent.time);

      var eventDescriptionHTML = nextEvent.description;
      initializeEventDescription(eventDescriptionHTML);

      // Uncomment the next line if you want to display the event date and time as well
      // initializeNextEventDate(eventDate);
      initializeCountdown(eventDate);
      initializeEventLink(nextEvent.link  )
    } else {
      setCountdownInfo('No Events available', '');
    }
  });
}

initialize();
