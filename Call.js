import React, { Component } from "react";

export default class Call extends Component {
  constructor() {
    var pusher = new Pusher("451fab013a7e18ea0008", {
      cluster: "us3",
      encrypted: true,
      authEndpoint: "pusher/auth"
    });

    this.state = {
        usersOnline: "",
        id: "",
        users = [],
        sessionDesc,
        currentcaller: "",
        room: "",
        caller: "",
        localUserMedia: ""
    } 

    const channel = pusher.subscribe("presence-videocall");
    channel.bind("pusher:subscription_succeeded", members => {
      //set the member count
      this.usersOnline = members.count;
      this.id = channel.members.me.id;

      this.setState({myId: " My caller id is : " + this.id });



      members.each(member => {
        if (member.id != channel.members.me.id) {
          users.push(member.id);
        }
      });

      this.rendering();
    });


    channel.bind("pusher:member_added", member => {
      this.users.push(member.id);
      this.rendering();
    });


    channel.bind("pusher:member_removed", member => {
      // for remove member from list:
      var index = this.users.indexOf(member.id);
      this.users.splice(index, 1);
      if (member.id == this.room) {
        this.endCall();
      }
      this.rendering();
    });
  }

  rendering() {
    var list = "";
    users.forEach(function(user) {
      list +=
        `<li>` +
        user +
        ` <input type="button" style="float:right;"  value="Call" onclick="callUser('` +
        user +
        `')" id="makeCall" /></li>`;
    });
    document.getElementById("users").innerHTML = list;
  }

  render() {
    return (
      <div>
        <body>
          <div id="app">
            <span id="myid"> </span>
            <video id="selfview" autoplay />
            <video id="remoteview" autoplay />
            <button
              id="endCall"
              style="display: none;"
              onclick={() => {
                this.endCurrentCall();
              }}
            >
              End Call
            </button>
            <div id="list">
              <ul id="users" />
            </div>
          </div>
        </body>
      </div>
    );
  }
}
