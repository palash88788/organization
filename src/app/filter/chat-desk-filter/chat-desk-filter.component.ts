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
  selector: 'app-chat-desk-filter',
  templateUrl: './chat-desk-filter.component.html',
  styleUrls: ['./chat-desk-filter.component.css']
})
export class ChatdeskFilterComponent implements OnInit {
  public filter_id: any;

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
  public conversation_type = true
  public image_previews: any;
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

    console.log();



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

      let data = await this.apiService.get("organization/organization-filter/" + this.job_id)
      this.job = data.response
      if (this.job && this.job.search_response.conversations && this.job.search_response.conversations.length > 0) {
        for (let z = 0; z < this.job.search_response.conversations.length; z++) {
          this.job.search_response.conversations[z].updatedAt = UtilityService.getTimeDifference(this.job.search_response.conversations[z].updatedAt)
        }

        this.chatGroupDetail(this.job.search_response.conversations[0], 0)
      }
     
      if (this.job.search_response.filter_applications && this.job.search_response.filter_applications.length > 0) {
        for (let l = 0; l < this.job.search_response.filter_applications.length; l++) {
          const element = this.job.search_response.filter_applications[l];
          if (element.status == 3) {
            this.job.search_response.filter_applications.splice(l, 1)
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
  public closeChatUi(){
    var active = document.getElementById("chat_id");
  
    active.classList.remove("open");
  }

  async  chatGroupDetail(conversation,index) {
    this.messages = []
    for (let z = 0; z < this.job.search_response.conversations.length; z++) {
      this.job.search_response.conversations[z].isSelected = false
    }
    this.job.search_response.conversations[index].isSelected = true
    if(document.getElementById("chat_id"))
    document.getElementById("chat_id").className+= " open"
    this.conversation_type = conversation.type == 1 ? false : true
    this.groupInfo = conversation
    this.groupData = conversation
    console.log(this.groupData)
    this.message.conversation_id = conversation.conversation_id
    if (conversation.conversation_image)
      this.parentDocSubject.next(conversation.conversation_image)
    for (let i = 0; i < this.job.search_response.filter_applications.length; i++) {
      const element = this.job.search_response.filter_applications[i];
      console.log(element,conversation.members,conversation.members.findIndex(y => y.user_id == element.user_id))
      if (conversation.members.findIndex(y => y.user_id == element.user_id) != -1) {
        this.job.search_response.filter_applications[i].isSelected = true
      }
    }

    try {
      let res = await this.apiService.get("/messenger/message/" + conversation.conversation_id)
      this.messages = res.response
      console.log(this.messages);

      this.parentDocSubject.next(this.message.image_url)
      for (let l = 0; l < this.messages.length; l++) {
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

        if(this.messages[a].type==2){
          const b = this.messages[a].image_url.split(".");
          console.log(this.messages[a].text,b)
          if(b){
            this.messages[a].imageTag = b[b.length-1]
               
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
      if(this.messages.findIndex(t=>t.message_id==res.message_id)==-1){
        if (res.type == 2) {
          const b = res.image_url.split(".");
          console.log(res.text, b)
          if (b) {
            res.imageTag = b[b.length - 1]
  
          }
        }
        this.messages.push(res)

      }
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

    if (this.message.image_url != null && this.message.image_url != undefined && this.message.image_url != "") {
      this.message.type = 2
    }
    try {
      let data = await this.apiService.post("/messenger/message", this.message)
      data.response.socket_uuid = this.groupInfo.socket_uuid
      data.response.sender = this.user
      this.socketService.send(data.response)
      this.message.text = ""
      this.message.image_url=""
      this.parentDocSubject.next(null)

    } catch (error) {

    }

  }

  toggle() {
    this.show_dialog = !this.show_dialog;

  }

  showChat() {
    // this.show_chat = !this.show_chat;
    console.log("dfgdfhdhgghfbd");

  }

  resetModal() {
    this.groupData = {}
    for (let i = 0; i < this.job.search_response.filter_applications.length; i++) {
      this.job.search_response.filter_applications[i].isSelected = false
    }
  }
  changeGroupImage($event) {
    if ($event && $event.thumbnail && $event.thumbnail.length > 0) {
      if ($event.thumbnail[0].data)
        this.groupData.conversation_image = $event.thumbnail[0].data.secure_url
    }
    console.log(this.groupData.conversation_image)
  }
public remove(){
  this.groupData.conversation_image =null
}
  async createGroup() {
    let users = []
    for (let i = 0; i < this.job.search_response.filter_applications.length; i++) {
      const element = this.job.search_response.filter_applications[i];
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
      conversation_name: this.groupData.conversation_image,
      conversation_image: this.groupData.conversation_image,
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
console.log(this.groupData)
    for (let i = 0; i < this.job.search_response.filter_applications.length; i++) {
      const element = this.job.search_response.filter_applications[i];
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
      conversation_image: this.groupData.conversation_image,
      conversation_id: this.groupData.conversation_id,
      addMember: addMembers,
      deleteMembers: deleteMembers
    }
    try {
      let data = await this.apiService.post("group/update-group", req)

      console.log(data)
      // location.reload()
    } catch (error) {
      console.log(error);

    }

  }
  async twoWayMessanger(id) {
    console.log(id);




    if (id) {
      this.groupInfo.type = 2
    }
    else {
      this.groupInfo.type = 1
    }
    let messanger = {
      conversation_id: this.groupInfo.conversation_id,
      type: this.groupInfo.type

    }
    try {
      let data = await this.apiService.post("group/change-type", messanger)



    } catch (error) {
      console.log(error);

    }
  }
}
