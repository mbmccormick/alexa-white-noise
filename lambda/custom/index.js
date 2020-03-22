const alexa = require("ask-sdk-core");

var AUDIO_URL = "https://raw.githubusercontent.com/mbmccormick/alexa-white-noise/master/assets/ab-f-031616-38571606_tv-static-white-noise-07.mp3";
var AUDIO_NAME = "White Noise";

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === "LaunchRequest";
    },
    async handle(handlerInput) {
        console.log("Handling LaunchRequest");

        return handlerInput.responseBuilder
            .addAudioPlayerPlayDirective("REPLACE_ALL", AUDIO_URL, AUDIO_NAME, null, 0)
            .getResponse();
    }
};

const PlaybackNearlyFinishedHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === "AudioPlayer.PlaybackNearlyFinished";
    },
    async handle(handlerInput) {
        console.log("Handling AudioPlayer.PlaybackNearlyFinished");

        return handlerInput.responseBuilder
            .addAudioPlayerPlayDirective("ENQUEUE", AUDIO_URL, AUDIO_NAME, 0, AUDIO_NAME)
            .getResponse();
    }
};

const PlaybackFinishedHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === "AudioPlayer.PlaybackFinished";
    },
    async handle(handlerInput) {
        console.log("Handling AudioPlayer.PlaybackFinished");

        return handlerInput.responseBuilder
            .getResponse();
    }
};

const PlaybackFailedHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === "AudioPlayer.PlaybackFailed";
    },
    async handle(handlerInput) {
        console.log("Handling AudioPlayer.PlaybackFailed");

        var message = "Oops! Something went wrong during audio playback. Please try again later.";

        message = alexa.escapeXmlCharacters(message);
        
        return handlerInput.responseBuilder
            .speak(message)
            .getResponse();
    }
};

const ResumeRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === "IntentRequest" &&
            handlerInput.requestEnvelope.request.intent.name === "AMAZON.ResumeIntent";
    },
    async handle(handlerInput) {
        console.log("Handling " + handlerInput.requestEnvelope.request.intent.name);

        return handlerInput.responseBuilder
            .addAudioPlayerPlayDirective("REPLACE_ALL", AUDIO_URL, AUDIO_NAME, null, 0)
            .getResponse();
    }
};

const StopRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === "IntentRequest" &&
            (handlerInput.requestEnvelope.request.intent.name === "AMAZON.StopIntent" ||
                handlerInput.requestEnvelope.request.intent.name === "AMAZON.CancelIntent" ||
                handlerInput.requestEnvelope.request.intent.name === "AMAZON.PauseIntent");
    },
    async handle(handlerInput) {
        console.log("Handling " + handlerInput.requestEnvelope.request.intent.name);

        return handlerInput.responseBuilder
            .addAudioPlayerStopDirective()
            .getResponse();
    }
};

const HelpRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === "IntentRequest" &&
            handlerInput.requestEnvelope.request.intent.name === "AMAZON.HelpIntent";
    },
    async handle(handlerInput) {
        console.log("Handling " + handlerInput.requestEnvelope.request.intent.name);

        var message = "White Noise is a simple, no-frills white noise skill for Alexa. Just say 'Alexa, play White Noise' to get started.";

        message = alexa.escapeXmlCharacters(message);
        
        return handlerInput.responseBuilder
            .speak(message)
            .getResponse();
    }
};

const ErrorHandler = {
    canHandle() {
        return true;
    },
    async handle(handlerInput, error) {
        console.error(error.message);
        console.error(handlerInput);

        var message = "Oops! An error has occurred. Please try again later.";

        message = alexa.escapeXmlCharacters(message);
        
        return handlerInput.responseBuilder
            .speak(message)
            .getResponse();
    }
};

const skillBuilder = alexa.SkillBuilders.custom();

exports.handler = skillBuilder
    .addRequestHandlers(
        LaunchRequestHandler,
        PlaybackNearlyFinishedHandler,
        PlaybackFinishedHandler,
        PlaybackFailedHandler,
        ResumeRequestHandler,
        StopRequestHandler,
        HelpRequestHandler
    )
    .addErrorHandlers(
        ErrorHandler
    )
    .lambda();
