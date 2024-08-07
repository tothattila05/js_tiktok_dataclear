const rawScrollButtonSelector = '';  // Raw scroll button selector. LT: css-1s9jpf8-ButtonBasicButtonContainer-StyledVideoSwitch e11s2kul11
const rawUnFavoriteButtonSelector = '';  // Raw un-favorite button selector. LT: css-15e07yc-ButtonActionItem e1hk3hf90
const favoriteIconHref = '#favorite';  // Href to check the favorite state.
const pauseTimerInterval = 5;  // Pause timer interval in minutes.
const pauseDuration = 1;  // Duration to pause the script in minutes.
const scrollVideoIntervalMS = 3500;  // Scroll video interval in milliseconds.
const unFavoriteIntervalMS = 4500;  // Unfavorite video interval in milliseconds.
const enablePauseTimer = true;  // Enable or disable the pause timer.
const enableLogs = true;  // Enable or disable regular logs.
const includeTimestamp = true;  // Include timestamp in log messages.
const includeVideoCountInLog = true;  // Include video count in log messages.
const scriptName = 'TikTok Unfavoriter';  // Name of the script.

let scrollVideoInterval, unFavoriteInterval, pauseInterval, pauseTimer;
let isPaused = true;
let videoCount = 0;

function transformSelector(rawSelector) {
    return '.' + rawSelector.split(' ').join('.');
}

const scrollButtonSelector = transformSelector(rawScrollButtonSelector);
const unFavoriteButtonSelector = transformSelector(rawUnFavoriteButtonSelector);

function log(message) {
    if (enableLogs) {
        const timestamp = includeTimestamp ? `[${new Date().toLocaleTimeString()}]` : '';
        const count = includeVideoCountInLog ? ` Count: ${videoCount}` : '';
        console.log(`${timestamp} [${scriptName}] ${message}${count}`);
    }
}

function logError(message) {
    const timestamp = includeTimestamp ? `[${new Date().toLocaleTimeString()}]` : '';
    const count = includeVideoCountInLog ? ` Count: ${videoCount}` : '';
    console.error(`${timestamp} [${scriptName}] ${message}${count}`);
}

function scrollVideo() {
    try {
        let scrollButton = document.querySelector(scrollButtonSelector);
        if (scrollButton) {
            scrollButton.click();
            videoCount++;
            log(`Video scrolled.`);
        } else {
            logError('Scroll button not found.');
        }
    } catch (error) {
        logError(`Error in scrollVideo: ${error}`);
    }
}

function clickUnFavorite() {
    try {
        let buttons = document.querySelectorAll(unFavoriteButtonSelector);
        if (buttons && buttons[2]) {
            let isFavorite = buttons[2].querySelector('svg use').getAttribute('xlink:href').startsWith(favoriteIconHref);
            if (isFavorite) {
                buttons[2].click();
                log(`Video removed from favorites.`);
            } else {
                log(`Video was already removed from favorites.`);
            }
        } else {
            logError('Un-favorite button not found.');
        }
    } catch (error) {
        logError(`Error in clickUnFavorite: ${error}`);
    }
}

function startScript() {
    if (isPaused) {
        isPaused = false;
        log(`Script started.`);
        if (enablePauseTimer) {
            pauseTimer = setTimeout(() => {
                stopScript();
                log(`${pauseTimerInterval}-minute period expired.`);
                pauseScript();
            }, pauseTimerInterval * 1000 * 60);
        }
    }

    scrollVideoInterval = setInterval(scrollVideo, scrollVideoIntervalMS);
    unFavoriteInterval = setInterval(clickUnFavorite, unFavoriteIntervalMS);
    log(`Intervals initiated.`);
}

function stopScript() {
    clearInterval(scrollVideoInterval);
    clearInterval(unFavoriteInterval);
    if (enablePauseTimer) {
        clearTimeout(pauseTimer);
    }
    isPaused = true;
    log(`Script stopped.`);
}

function pauseScript() {
    if (!isPaused) {
        log(`Script paused for ${pauseDuration} minutes.`);
        stopScript();
        setTimeout(() => {
            log(`${pauseDuration}-minute pause expired. Resuming script.`);
            startScript();
        }, pauseDuration * 1000 * 60);
    }
}

function restartScript() {
    log(`Script restarting.`);
    stopScript();
    startScript();
}

if (enablePauseTimer) {
    pauseInterval = setInterval(() => {
        if (!isPaused) {
            pauseScript();
        }
    }, pauseTimerInterval * 1000 * 60);
}

startScript();
