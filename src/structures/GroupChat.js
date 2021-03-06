'use strict';

const Chat = require('./Chat');

/**
 * Represents a Group Chat on WhatsApp
 * @extends {Chat}
 */
class GroupChat extends Chat {
    _patch(data) {
        this.groupMetadata = data.groupMetadata;

        return super._patch(data);
    }

    /**
     * Gets the group owner
     */
    get owner() {
        return this.groupMetadata.owner;
    }

    /**
     * Gets the date at which the group was created
     */
    get createdAt() {
        return new Date(this.groupMetadata.creation * 1000);
    }

    /** 
     * Gets the group description
     */
    get description() {
        return this.groupMetadata.desc;
    }
    /**
     * Gets the group participants
     */
    get participants() {
        return this.groupMetadata.participants;
    }

    /**
     * Adds a list of participants by ID to the group
     * @param {Array[string]} participantIds 
     */
    async addParticipants(participantIds) {
        return await this.client.pupPage.evaluate((chatId, participantIds) => {
            return Store.Wap.addParticipants(chatId, participantIds);
        }, this.id._serialized, participantIds);
    }

    /**
     * Removes a list of participants by ID to the group
     * @param {Array[string]} participantIds 
     */
    async removeParticipants(participantIds) {
        return await this.client.pupPage.evaluate((chatId, participantIds) => {
            return Store.Wap.removeParticipants(chatId, participantIds);
        }, this.id._serialized, participantIds);
    }

    /**
     * Promotes participants by IDs to admins
     * @param {Array[string]} participantIds 
     */
    async promoteParticipants(participantIds) {
        return await this.client.pupPage.evaluate((chatId, participantIds) => {
            return Store.Wap.promoteParticipants(chatId, participantIds);
        }, this.id._serialized, participantIds);
    }

    /**
     * Demotes participants by IDs to regular users
     * @param {Array[string]} participantIds 
     */
    async demoteParticipants(participantIds) {
        return await this.client.pupPage.evaluate((chatId, participantIds) => {
            return Store.Wap.demoteParticipants(chatId, participantIds);
        }, this.id._serialized, participantIds);
    }

    /**
     * Updates the group subject
     * @param {string} subject 
     */
    async setSubject(subject) {
        let res = await this.client.pupPage.evaluate((chatId, subject) => {
            return Store.Chat.get(chatId).setSubject(subject);
        }, this.id._serialized, subject);

        if (res.status == 200) {
            this.name = subject;
        }
    }

    /**
     * Updates the group description
     * @param {string} description 
     */
    async setDescription(description) {
        let res = await this.client.pupPage.evaluate((chatId, description) => {
            return Store.Chat.get(chatId).setGroupDesc(description);
        }, this.id._serialized, description);

        if (res.status == 200) {
            this.groupMetadata.desc = description;
        }
    }

    /**
     * Gets the invite code for a specific group
     */
    async getInviteCode() {
        let res = await this.client.pupPage.evaluate(chatId => {
            return Store.Wap.groupInviteCode(chatId);
        }, this.id._serialized);

        if (res.status == 200) {
            return res.code;
        }

        throw new Error('Not authorized')
    }

    /**
     * Invalidates the current group invite code and generates a new one
     */
    async revokeInvite() {
        return await this.client.pupPage.evaluate(chatId => {
            return Store.Wap.revokeGroupInvite(chatId);
        }, chatId);
    }

    /**
     * Returns an object with information about the invite code's group
     * @param {string} inviteCode 
     */
    static async getInviteInfo(inviteCode) {
        return await this.client.pupPage.evaluate(inviteCode => {
            return Store.Wap.groupInviteInfo(inviteCode);
        }, inviteCode);
    }

    /**
     * Joins a group with an invite code
     * @param {string} inviteCode 
     */
    static async join(inviteCode) {
        return await this.client.pupPage.evaluate(inviteCode => {
            return Store.Wap.acceptGroupInvite(inviteCode);
        }, inviteCode);
    }

    /**
     * Makes the bot leave the group
     */
    async leave() {
        return await this.client.pupPage.evaluate(chatId => {
            return Store.Wap.leaveGroup(chatId);
        }, this.id._serialized);
    }

}

module.exports = GroupChat;