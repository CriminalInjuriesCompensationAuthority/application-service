'use strict';

const {
    SQSClient,
    ReceiveMessageCommand,
    SendMessageCommand,
    DeleteMessageCommand
} = require('@aws-sdk/client-sqs');
const logger = require('../logging/logger');

/** Returns SQS Service object with functions to send, delete and receive messages from a SQS queue */
function createSqsService() {
    const client = new SQSClient({region: 'eu-west-2', endpoint: 'http://localhost:4566'});

    /**
     * Sends a given message to a given SQS queue
     * @param {object} input - The queue details
     * @param {string} message - The message to send to the queue
     * @returns SendMessageCommandOutput equal to the output given by the queue for the send command
     */
    async function sendSQS(input, message) {
        logger.info('SQS Message Sending');
        input.MessageBody = message;
        const command = new SendMessageCommand(input);
        const response = await client.send(command);
        return response;
    }
    /**
     * Deletes a given message from a given SQS queue
     * @param {object} input - Contains the details of the queue and message to delete
     */
    async function deleteSQS(input) {
        const command = new DeleteMessageCommand(input);
        const response = await client.send(command);
        logger.info('SQS Message Deleted');
        logger.info(response);
    }

    /**
     * Receives the next message from a given queue
     * @param {object} input - The details of the queue to receive from
     * @returns Message received from the queue
     */
    async function receiveSQS(input) {
        while (true) {
            const command = new ReceiveMessageCommand(input);
            const response = client.send(command); // await
            if (response.Messages) {
                logger.info('SQS Message Received:');
                logger.info(response);
                return response.Messages[0];
            }
        }
    }

    return Object.freeze({
        sendSQS,
        deleteSQS,
        receiveSQS
    });
}

module.exports = createSqsService;
