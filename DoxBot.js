//You have been given a second chance my son. Make your father proud...

//Packages
const discord = require('discord.js');
const config = require('./config/config.json');
const quotes = require('./config/quotes.json');
const members = require('./config/members.json')
const fs = require('fs');
const bot = new discord.Client();

//Settings
const version = '1.0.0'
const TOKEN = config.TOKEN
const PREFIX = config.PREFIX
const statusQuote = "Reconstructing... Please hold."
const altDetection = true;
const welcoming = true;
const newQuoteNum = 3 //update as needed
const returnQuoteNum = 3 //update as needed
const leaveQuoteNum = 3 //update as needed

//IDs
const welcomeID = '788838476551946250'
const botzID = '788858746612875285'
const rulechannelID = '788838183962017824'
const autoRoles = ['788837840138141717', '789191768368349205']
const ownerRoleID = '788825654287532032'
const adminRoleID = '788826590259183636'
const modRoleID = '788827154347589632'
const welcomerRoleID = '815763946736582726'

//It's time to shine!
bot.login(TOKEN)
bot.on('ready', () => {
    console.log("DoxBot has logged in.")
    bot.user.setPresence({activity: { name: statusQuote }, status: 'dnd' })
})

//Message Event (message was sent)
bot.on('message', message =>{
    
    //Refinement (so the bot listens only to what we want him to.)
    if(message.author.bot || !message.guild) return;
    var args = message.content.substr(PREFIX.length).toLocaleLowerCase().split(" ")
    let userID = message.author.id
    //Checks if the message was sent by me, a mod, or admin, if not, checks if the message was sent in #botz and return whether or not to continue
    function checkWarns(userID){
        if(message.member.roles.cache.has(ownerRoleID) || message.member.roles.cache.has(modRoleID) || message.member.roles.cache.has(adminRoleID) || message.channel.id == botzID){
            return true
        }
        //checks to see if the member has a file
        else if(!members[userID]){
            let membersJSON = JSON.parse(fs.readFileSync('./config/members.json'))
            membersJSON[userID] = {
                name: message.author.tag,
                id: userID,
                permWarn: 1
            }
            message.reply('sorry but you can\'t use commands outside of <#' + botzID +"> unless you're a mod or admin\n\nGo to that channel and type +help for a list of commands I can do for you!")
            setTimeout(() => {
                fs.writeFileSync('./config/members.json', JSON.stringify(membersJSON, null, 2))
            }, 3000);
            return false
        }        
        //member has a permWarn of 0
        else if(members[userID].permWarn == 0){
            let membersJSON = JSON.parse(fs.readFileSync('./config/members.json'))
            membersJSON[userID].permWarn = 1
            message.reply('sorry but you can\'t use commands outside of <#' + botzID +"> unless you're a mod or admin\n\nGo to that channel and type +help for a list of commands I can do for you!")
            setTimeout(() => {
                fs.writeFileSync('./config/members.json', JSON.stringify(membersJSON, null, 2))
            }, 3000);
            return false
        }
        //member has folder but no permWarn
        else if(!members[userID].permWarn){
            let membersJSON = JSON.parse(fs.readFileSync('./config/members.json'))
            membersJSON[userID].permWarn = 1
            message.reply('sorry but you can\'t use commands outside of <#' + botzID +"> unless you're a mod or admin\n\nGo to that channel and type +help for a list of commands I can do for you!")
            setTimeout(() => {
                fs.writeFileSync('./config/members.json', JSON.stringify(membersJSON, null, 2))
            }, 3000);
            return false
        }
        //member has a permWarn of 1
        else if(members[userID].permWarn >= 1){
            return false
        }
    }

    //Commands!
    if(args[0] == "hello" && checkWarns(userID)){
        message.reply("Hello!")
    }
    if(args[0] == "userinfo" && checkWarns(userID)){
        message.reply(members[userID])
    }
})


//Join Event (someone joined the server)

bot.on('guildMemberAdd', member => {
    //Definitions
    let airport = member.guild.channels.cache.get(welcomeID)
    let serverName = member.guild.name
    let userID = member.user.id

    //Alt Detection
    var threshold = (Date.now() - 4838400000) //2 months in milliseconds
    //this is an alt
    if(threshold < member.user.createdTimestamp && altDetection){
        console.log(member.user.tag + " has been banned for being an alt on " + member.joinedAt)
        if(welcoming){
            airport.send("**SOMEONE TRIED JOINING BUT GOT REKT LOL\n‏‏‎ ‏‏‎ ‏‏‎ **")
        }
        setTimeout(() => {
            member.ban()
        }, 3000);
    }
    //account is probably not an alt
    else{
        //Tracking System (gets everyone, alts and people around before DoxBot came back!)
        let membersJSON = JSON.parse(fs.readFileSync('./config/members.json'))
        //does this member have a file?
        if(!membersJSON[userID]){
            membersJSON[userID] = {
                name: member.user.tag,
                id: userID
            }
            if(welcoming){
                let RNG = (Math.floor(Math.random() * newQuoteNum) + 1)
                airport.send(quotes.WELCOMING.NEW.PRE[RNG] + " <@" + userID + "> " + quotes.WELCOMING.NEW.POST[RNG] + "\n\nWelcome to the " + serverName + "! Since you are new to the server, I highly suggest you take a look at the <#" + rulechannelID + "> channel to know what you're getting yourself into. <@&" + welcomerRoleID + ">\n‏‏‎ ‏‏‎ ‏‏‎ ")
            }
            console.log(member.user.tag + " has joined the server on " + member.joinedAt)
            console.log(member.user.tag + "\'s file has been created")
            member.roles.add(autoRoles, 'default roles')
            setTimeout(() => {
                fs.writeFileSync('./config/members.json', JSON.stringify(membersJSON, null, 2))
            }, 3000);
        }
        //member has been on the server before
        else if(membersJSON[userID]){
            if(!membersJSON[userID].roles){
                if(welcoming){
                    let RNG = (Math.floor(Math.random() * returnQuoteNum) + 1)
                    airport.send(quotes.WELCOMING.RETURNING.PRE[RNG] + " <@" + userID + "> " + quotes.WELCOMING.RETURNING.POST[RNG] + "\n‏‏‎ ‏‏‎ ‏‏‎ ")
                }
                console.log(member.user.tag + " has returned to the server on " + member.joinedAt)
                member.roles.add(autoRoles, 'default roles')
            }
            else{
                if(welcoming){
                    let RNG = (Math.floor(Math.random() * returnQuoteNum) + 1)
                    airport.send(quotes.WELCOMING.RETURNING.PRE[RNG] + " <@" + userID + "> " + quotes.WELCOMING.RETURNING.POST[RNG] + "\n‏‏‎ ‏‏‎ ‏‏‎ ")
                }
                console.log(member.user.tag + " has returned to the server on " + member.joinedAt)
                member.roles.add(membersJSON[userID].roles, 'returning member\'s roles')
            }
        }
    }
})

//Leave Event (someone left the server)
bot.on('guildMemberRemove', member => {
    //Definitions
    let airport = member.guild.channels.cache.get(welcomeID)
    let userID = member.user.id

    //Tracking System
    let membersJSON = JSON.parse(fs.readFileSync('./config/members.json'))
    //send leaving message regardless if they have a file or not
    if(welcoming){
        let RNG = (Math.floor(Math.random() * leaveQuoteNum) + 1)
        airport.send(quotes.WELCOMING.LEAVING.PRE[RNG] + " \`" + member.user.tag + "\` " + quotes.WELCOMING.LEAVING.POST[RNG] + "\n‏‏‎ ‏‏‎ ‏‏‎ ")
    }
    //does this member have a file?
    if(!membersJSON[userID]){
        membersJSON[userID] = {
            name: member.user.tag,
            id: userID,
            roles: member.roles.cache.map(role => role.id),
            permWarn: 0
        }
        setTimeout(() => {
            fs.writeFileSync('./config/members.json', JSON.stringify(membersJSON, null, 2))
        }, 3000);
    }
    //this person has been here before, lets update his newest roles
    else if(membersJSON[userID]){
        //updates roles from when you left the server
        membersJSON[userID].roles = member.roles.cache.map(role => role.id)
        console.log(member.user.tag + '\'s roles have been updated and saved')
        setTimeout(() => {
            fs.writeFileSync('./config/members.json', JSON.stringify(membersJSON, null, 2))
        }, 3000);
    }
})

//Ban Event



//Console Stuff
if(altDetection){
    console.log("ALT DETECTION IS ONLINE")
}
else{
    console.log("ALT DETECTION IS OFFLINE")
}
if(welcoming){
    console.log("WELCOMING IS ONLINE")
}
else{
    console.log("WELCOMING IS OFFLINE")
}