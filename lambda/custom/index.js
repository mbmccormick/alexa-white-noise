const alexa = require("ask-sdk-core");

var AUDIO_URL = "";
var AUDIO_NAME = "";

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === "LaunchRequest";
    },
    async handle(handlerInput) {
        console.log("INFO: Handling LaunchRequest");

        var offsetInMilliseconds = this.attributes["offsetInMilliseconds"];

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
        console.log("INFO: Handling AudioPlayer.PlaybackNearlyFinished");

        return handlerInput.responseBuilder
            .addAudioPlayerPlayDirective("ENQUEUE", AUDIO_URL, AUDIO_NAME, AUDIO_NAME, 0)
            .getResponse();
    }
};

const PlaybackFinishedHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === "AudioPlayer.PlaybackFinished";
    },
    async handle(handlerInput) {
        console.log("INFO: Handling AudioPlayer.PlaybackFinished");

        return handlerInput.responseBuilder
            .getResponse();
    }
};

const PlaybackFailedHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === "AudioPlayer.PlaybackFailed";
    },
    async handle(handlerInput) {
        console.log("INFO: Handling AudioPlayer.PlaybackFailed");

        var message = "TODO: Implement PlaybackFailed handler.";

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
        console.log("INFO: Handling " + handlerInput.requestEnvelope.request.intent.name);

        var offsetInMilliseconds = this.attributes["offsetInMilliseconds"];

        return handlerInput.responseBuilder
            .addAudioPlayerPlayDirective("REPLACE_ALL", AUDIO_URL, AUDIO_NAME, null, offsetInMilliseconds)
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
    handle(handlerInput) {
        console.log("INFO: Handling " + handlerInput.requestEnvelope.request.intent.name);

        this.attributes["offsetInMilliseconds"] = this.event.request.offsetInMilliseconds;

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
    handle(handlerInput) {
        console.log("INFO: Handling " + handlerInput.requestEnvelope.request.intent.name);

        var message = "TODO: Implement HelpIntent handler.";

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
    handle(handlerInput, error) {
        console.log("ERROR: " + error.message);

        var message = "TODO: Implement Error handler.";

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
