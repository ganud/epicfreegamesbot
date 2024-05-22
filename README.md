A discord that gets free games from the Epic Games Store and posts them to a channel.

![alt text](https://i.imgur.com/TvhueSd.png)
![alt text](https://i.imgur.com/pOF15qZ.png)

Commentary:\
I half made this in a weekend to curb my regrets with my current knowledge and due to feeling inconvenienced by the other Epic Free Games bot coaxing me to vote on some site to set notifications.

EDIT: Promoted this into an above-effort weekend project, now most of the features are practical to be hosted on multiple servers.

## Features:

- Get free games this week -> /free

Configuring notifications requires manage server permissions

- Set channel to post games every week -> /setchannel
- Set role to be pinged along with the channel notification -> /setrole
- /removerole and /removechannel to undo the above
- /test to check channel and role notifications

## Setup:

- Clone this repo
- Add a config.json to root direcrtory with the bot token
  ![alt text](https://i.imgur.com/FmXVOVS.png)
- Run with /node .
