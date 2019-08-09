import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { CookieService } from 'ngx-cookie-service';
import { ApiService } from '../../services/api';
import { SocketService } from "../../services/socket.service";
import { retry } from 'rxjs/internal/operators/retry';
import * as $ from 'jquery';
import { Subject } from 'rxjs/internal/Subject';

import { FileUploader } from "ng2-file-upload";
import { async } from 'rxjs/internal/scheduler/async';
import { UtilityService } from "./../../services/utility";
@Component({
  selector: 'app-chat-desk',
  templateUrl: './chat-desk.component.html',
  styleUrls: ['./chat-desk.component.css']
})
export class ChatdeskComponent implements OnInit {
  public uploader: FileUploader = new FileUploader({
    isHTML5: true
  });

  title: string = 'Angular File Upload';
  public show_dialog: boolean = false;
  public show_chat: boolean = false;

  public job_id: any;
  public job: any
  public groupInfo: any
  public messages: Array<any>
  public message: any;
  public user: any
  public parentDocSubject = new Subject()
  public groupData: any
  public image;
  public image_previews: any;
  public conversation_type = true

  constructor(private cookieService: CookieService, private socketService: SocketService, private apiService: ApiService, private route: ActivatedRoute, ) {
    this.job_id = this.route.snapshot.params['id'];
    this.user = JSON.parse(this.cookieService.get("loginData"))
    this.message = {
      text: '',
      sender_id: this.user.user_id,
      type: 1
    }
    this.groupData = {}
    this.socketService.initSocket()
  }

  async ngOnInit() {





    $(window).resize(function () {
      if ($(window).width() <= 575) {

        $(document).ready(function () {
          $("#hide").click(function () {
            $("#show").css("display", "block");
            $("#hide").css("display", "none");
            $(".back").css("display", "block");
          });
          $("#back").click(function () {
            $("#show").css("display", "none");
            $("#hide").css("display", "block");
            $(".back").css("display", "none");
          });
        });

      }
    });


    try {

      let data = await this.apiService.get("organization/job/" + this.job_id)
      this.job = data.response
      if (this.job && this.job.conversations && this.job.conversations.length > 0) {
        for (let z = 0; z < this.job.conversations.length; z++) {
          this.job.conversations[z].updatedAt = UtilityService.getTimeDifference(this.job.conversations[z].updatedAt)
        }

        this.chatGroupDetail(this.job.conversations[0], 0)
      }
      if (this.job.job_applications && this.job.job_applications.length > 0) {
        for (let l = 0; l < this.job.job_applications.length; l++) {
          const element = this.job.job_applications[l];
          if (element.status == 1 || element.status == 3) {
            this.job.job_applications.splice(l, 1)
          }

        }
      }
    } catch (error) {
      console.log(error)
    }



  }
  async changeResumeListener($event) {
    for (let l = 0; l < $event.thumbnail.length; l++) {
      const element = $event.thumbnail[l];
      this.message.image = element.data.secure_url;
      this.image_previews = element.data.secure_url;
    }

  }
  public closeChatUi() {
    var active = document.getElementById("chat_id");

    active.classList.remove("open");
  }

  async  chatGroupDetail(conversation, index) {
    this.messages = []
    for (let z = 0; z < this.job.conversations.length; z++) {
      const element = this.job.conversations[z];
      this.job.conversations[z].isSelected = false
    }
    this.job.conversations[index].isSelected = true
    this.conversation_type = conversation.type == 1 ? false : true
    this.groupInfo = conversation
    document.getElementById("chat_id").className += " open"
    this.groupData = conversation
    for (let i = 0; i < this.job.job_applications.length; i++) {
      this.job.job_applications[i].isSelected = false

    }
    this.message.conversation_id = conversation.conversation_id
    if (conversation.conversation_image)
      this.parentDocSubject.next(conversation.conversation_image)
    for (let i = 0; i < this.job.job_applications.length; i++) {
      const element = this.job.job_applications[i];
      if (conversation.members.findIndex(y => y.user_id == element.user_id) != -1) {
        this.job.job_applications[i].isSelected = true
      }
    }

    try {
      let res = await this.apiService.get("/messenger/message/" + conversation.conversation_id)
      this.messages = res.response

      this.parentDocSubject.next(this.message.image_url)
      for (let l = 0; l < this.messages.length; l++) {
        this.messages[l].sender = await this.getMessageDetail(this.messages[l])
        const dateModified = new Date(this.messages[l].createdAt);
        const dateString = dateModified.getFullYear() + "-" + ((dateModified.getMonth() + 1) < 10 ? "0" +
          (dateModified.getMonth() + 1) : (dateModified.getMonth() + 1)) + "-" + (dateModified.getDay() < 10 ? ("0" +
            dateModified.getDay()) : dateModified.getDay())
        this.messages[l].date = dateString
      }
      this.sortChat()
      $('#scroll').animate({
        scrollTop: 9999999999999999999999999999
      });


      for (let a = 0; a < this.messages.length; a++) {

        if (this.messages[a].type == 2) {
          const b = this.messages[a].image_url.split(".");
          console.log(this.messages[a].text, b)
          if (b) {
            this.messages[a].imageTag = b[b.length - 1]

          }
        }

        // console.log(b);

      }

    } catch (error) {

    }

    this.socketService.onMessage(conversation.socket_uuid).subscribe((res) => {
      // res.sender = this.getMessageDetail(res)
      if (!this.messages && this.messages.length == 0) {
        this.messages = []

      }
      if (res.type == 2) {
        const b = res.image_url.split(".");
        console.log(res.text, b)
        if (b) {
          res.imageTag = b[b.length - 1]

        }
      }
      this.messages.push(res)
      $('#scroll').animate({
        scrollTop: 9999999999999999999999999999
      });

      this.sortChat();
    })
  }
  public sortChat() {
    if (this.messages && this.messages.length > 0) {
      this.messages.sort(($0, $1) => {
        return new Date($0.createdAt).getTime() - new Date($1.createdAt).getTime()
      })
    }
  }
  getMessageDetail(msg) {
    let sender = this.groupInfo.members.find(x => x.user_id == msg.sender_id)
    sender = sender != undefined ? sender.user_info : this.user
    return sender
  }
  public changeAttachment($event) {
    if ($event && $event.thumbnail && $event.thumbnail.length > 0) {
      if ($event.thumbnail[0].data)
        this.message.image_url = $event.thumbnail[0].data.secure_url
    }
    console.log(this.message.image_url)
  }
  async sendMsg() {

  
    if (this.message.type == 2) {
      if (this.message.image_url == null || this.message.image_url == undefined || this.message.image_url == "") {
        return
      }
    }
    try {
      let data = await this.apiService.post("/messenger/message", this.message)
      data.response.socket_uuid = this.groupInfo.socket_uuid
      data.response.sender = this.user
      this.socketService.send(data.response)
      this.message.text = ""
      this.message.image_url = ""
      this.parentDocSubject.next(null)

    } catch (error) {

    }

  }

  toggle() {
    this.show_dialog = !this.show_dialog;

  }

  showChat() {
    this.show_chat = !this.show_chat;
    console.log("dfgdfhdhgghfbd");

  }

  resetModal() {
    this.groupData = {}
    for (let i = 0; i < this.job.job_applications.length; i++) {
      this.job.job_applications[i].isSelected = false
    }
  }
  changeGroupImage($event) {
    if ($event && $event.thumbnail && $event.thumbnail.length > 0) {
      if ($event.thumbnail[0].data)
        this.groupData.image_url = $event.thumbnail[0].data.secure_url
    }
    console.log(this.groupData.image_url)
  }

  async createGroup() {
    let users = []
    for (let i = 0; i < this.job.job_applications.length; i++) {
      const element = this.job.job_applications[i];
      if (element.isSelected) {
        users.push({ user_id: element.user_id })
      }
    }
    if (users.length == 0) {
      alert("select at least one adhoc!")
      return
    }
    let req = {
      job_id: this.job.job_id,
      type: 1,
      conversation_name: this.groupData.conversation_name,
      conversation_image: this.groupData.image_url,
      member: users

    }
    try {
      let data = await this.apiService.post("group/create-group", req)

      console.log(data)
      location.reload()
    } catch (error) {
      console.log(error);

    }

  }

  async editGroup() {
    let users = []
    let deleteMembers = []
    let addMembers = []

    for (let i = 0; i < this.job.job_applications.length; i++) {
      const element = this.job.job_applications[i];
      if (element.isSelected) {
        users.push({ user_id: element.user_id })
        if (this.groupData.members.findIndex(t => t.user_id == element.user_id) == -1) {
          addMembers.push({ user_id: element.user_id })
        }

      } else {
        let index = this.groupData.members.findIndex(t => t.user_id == element.user_id)
        if (index != -1) {

          deleteMembers.push({ conversation_member_id: this.groupData.members[index].conversation_member_id })
        }
      }
    }

    if (users.length == 0) {
      alert("select at least one adhoc!")
      return
    }
    let req = {
      job_id: this.job.job_id,
      type: 1,
      conversation_name: this.groupData.conversation_name,
      conversation_image: this.groupData.image_url,
      conversation_id: this.groupData.conversation_id,
      addMember: addMembers,
      deleteMembers: deleteMembers
    }
    try {
      let data = await this.apiService.post("group/update-group", req)

      console.log(data)
      location.reload()
    } catch (error) {
      console.log(error);

    }

  }
  // setValue(i , e){
  //   if(e.checked){
  //     this.job.conversations[i].type = '1'
  //   }else{
  //     this.job.conversations[i].type = '2'
  //   }
  // }
  async twoWayMessanger(id) {
    console.log(this.groupData.type);




    if (this.groupData.type == 1) {
      this.groupData.type = 2
      // this.type.disable = true
    }
    else if (this.groupData.type == 2) {
      this.groupData.type = 1
      // this.type.enable = true
    }
    let messanger = {
      conversation_id: this.groupData.conversation_id,
      type: this.groupData.type

    }
    try {
      let data = await this.apiService.post("group/change-type", messanger)



    } catch (error) {
      console.log(error);

    }
  }


}

