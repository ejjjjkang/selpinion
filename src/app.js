// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
import * as firebase from "firebase/app";

// Add the Firebase services that you want to use
import "firebase/auth";
import "firebase/firestore";
import "firebase/database";

import { postData } from "./card_response";
import "./styles/style.css";
import "./styles/commentList.css";
// import `.scss` files
import "./scss/progress.scss";
import "./scss/comment.scss";

// Your web app's Firebase configuration
//firebase에서 자동으로 생성
var firebaseConfig = {
  apiKey: "AIzaSyDH_5pwm-hQVNRYETAXju74ePfygYI1hb4",
  authDomain: "crowdiscussion.firebaseapp.com",
  databaseURL: "https://crowdiscussion.firebaseio.com",
  projectId: "crowdiscussion",
  storageBucket: "crowdiscussion.appspot.com",
  messagingSenderId: "788351811351",
  appId: "1:788351811351:web:2b4e3c062ada9b73e94152",
  measurementId: "G-1KZVVT3X6N"
};

import { library, dom } from "@fortawesome/fontawesome-svg-core";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";

library.add(faExclamationCircle);
dom.watch();

// const apiURL = "http://0.0.0.0:80/process";

const apiURL = "https://eunxkang.me/process";

const persuadeStep = {
  concept: "개념",
  reason: "근거",
  furtherReason: "사실/기사",
  conclusion: "결론"
};

const message = {
  "not-plausible":
    "의견은 일방적인 관점을 담고 있을 확률이 높게 나타나고 있습니다.",
  general: "의견은 적지만 설득적인 주장과 근거를 담고자 합니다.",
  plausible: "의견은 설득적인 근거와 주장을 담고자 합니다."
};

const POPUPMESSAGE = {
  "not-plausible":
    "의견은 일방적인 관점을 담고 있을 확률이 높게 나타나고 있습니다.",
  general: "의견은 적지만 설득적인 주장과 근거를 담고자 합니다.",
  plausible: "의견은 설득적인 근거와 주장을 담고자 합니다."
};

var maxOpinion = [];

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// https://developers.google.com/youtube/iframe_api_reference#playVideo

// Youtube channel setting
var tag = document.createElement("script");
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName("script")[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

window.onYouTubeIframeAPIReady = function() {
  player = new YT.Player("player", {
    height: "360",
    width: "640",
    videoId: "9DibM23azTc",
    events: {
      onReady: onPlayerReady
    }
  });
};

function onPlayerReady(event) {
  M.toast({ html: "이제 토론이 시작됩니다.." });
  event.target.playVideo();
}

var done = false;
var stage;
var result = {
  result: ""
};

//========================================================================================

var card = document.getElementsByClassName("card_board")[0];

//first
card.innerHTML += `<div class="row">
<div class="col s12">
<div class="card grey darken-1 form_1">
<div class="card-content black-text">
<br>
<form id="formal_1">
<div class="input-field col s3">
<i class="material-icons prefix">account_circle</i>
<input id="id_input" type="text" class="validate">
<label for="id_input">ID / 닉네임</label>
<span class="helper-text" data-error="영어,숫자만 가능합니다" data-success="right"></span>
</div>
<div class="input-field col s9 last_name__1">
<textarea id="last_name_1" class="materialize-textarea"></textarea>
<label for="last_name_1">공개 댓글 추가..</label>
</div>\
<br>
<br>
<a class="waves-effect waves-light btn dismiss  grey darken-1">취소</a>
<a class="waves-effect waves-light btn modal-trigger submit grey" id="myBtn">댓글</a>

</form>

<!-- Modal Structure -->
<div id="myModal" class="modal">
  <div class="modal-content">   
    <p id="modalContent"></p>
    <span class="close">&times;</span>
  </div>
</div>

</div></div></div>

`;

let modal = document.getElementById("myModal");
let span = document.getElementsByClassName("close")[0];
var editbtn;

var input_name;
var popFlag = false;

document.getElementsByClassName("submit")[0].onclick = function(e) {
  let id_input = document.getElementById("id_input");

  //id 썼는지 확인
  if (id_input.value) {
    console.log("comment is submitted");
    e.preventDefault();

    var opinion = document.querySelector("#last_name_1").value;
    postData(apiURL, { words: opinion }).then(json => {
      let modalEle = document.getElementById("modalContent");
      window.onload = opinion;
      var percentage = json[1] * 100;
      if (percentage > 50) {
        modalEle.innerHTML += `
        
        <p>${id_input.value}님의 의견은 편향적이지 않나요?</p>
        <div>${id_input.value}님과 다른 생각을 가진 사람의 의견입니다.</div>
        <div class="otherComment">${
          negative_content[Math.floor(Math.random() * negative_content.length)][
            "Opinion"
          ]
        }</div>
        <div>${id_input.value}님의 생각은 어떠신가요?</div>
        <div>${
          id_input.value
        }님의 의견이 확실하지 않다면! 아래와 같이 정리해보는 건 어떨까요?</div>
        <li><div class="chip">주장</div>내 의견은 무엇인가요?</li>
        <li><div class="chip">근거</div>왜 그렇게 생각하나요?</li>
        <li><div class="chip">사실</div>근거가 믿을만한가요?</li>
        <li><div class="chip">결론</div>한 마디로 정리하면?</li>
        <div class="row">
        <div class="input-field col s12">
       
        <input id="OpinionEdit_1" type="text" class="validate chips chips-initial">
      
        <label class="active" for="OpinionEdit_1">의견 수정하기</label>
        <button class="chip chip_concept">주장</button>
        <button class="chip chip_reason">근거</button>
        <button class="chip chip_furtherReason">사실</button>
        <button class="chip chip_conclusion">결론</button>
        <a class="waves-effect waves-light btn editbtn" >수정하기</a>
        </div>
        </div>
        `;

        var inputOpinion = document.getElementById("OpinionEdit_1");
        var inputOpinionAttr = document.createAttribute("value");
        inputOpinionAttr.value = opinion;
        inputOpinion.setAttributeNode(inputOpinionAttr);
        if (maxOpinion == "negative") {
          modalEle.innerHTML += `전체 의견의 경향을 봤을 때 다른 의견에 동조되었을 가능성이 있습니다.`;
        } else {
          modalEle.innerHTML += `의견이 설득적이지 않다면 일방적인 의견으로 여겨질 수 있습니다`;
        }
      } else if (percentage < 50) {
        modalEle.innerHTML += `
        
        <p>${id_input.value}님의 의견은 편향적이지 않나요?</p>
        <div>${id_input.value}님과 다른 생각을 가진 사람의 의견입니다.</div>
        <div class="otherComment">${
          positive_content[Math.floor(Math.random() * positive_content.length)][
            "Opinion"
          ]
        }</div>
        <div>${id_input.value}님의 생각은 어떠신가요?</div>
        <div>${
          id_input.value
        }님의 의견이 확실하지 않다면! 아래와 같이 정리해보는 건 어떨까요?</div>
        <li><div class="chip">주장</div>내 의견은 무엇인가요?</li>
        <li><div class="chip">근거</div>왜 그렇게 생각하나요?</li>
        <li><div class="chip">사실</div>근거가 믿을만한가요?</li>
        <li><div class="chip">결론</div>한 마디로 정리하면?</li>
        <div class="row">
        <div class="input-field col s12">
       
        <input id="OpinionEdit_1" type="text" class="validate chips chips-initial">
      
        <label class="active" for="OpinionEdit_1">의견 수정하기</label>
        <button class="chip chip_concept">주장</button>
        <button class="chip chip_reason">근거</button>
        <button class="chip chip_furtherReason">사실</button>
        <button class="chip chip_conclusion">결론</button>
        <a class="waves-effect waves-light btn editbtn" >수정하기</a>
        </div>
        </div>
        `;

        var inputOpinion = document.getElementById("OpinionEdit_1");
        var inputOpinionAttr = document.createAttribute("value");
        inputOpinionAttr.value = opinion;
        inputOpinion.setAttributeNode(inputOpinionAttr);

        if (maxOpinion == "positive") {
          modalEle.innerHTML += `전체 의견의 경향을 봤을 때 다른 의견에 동조되었을 가능성이 있습니다.`;
        } else {
          modalEle.innerHTML += `의견이 설득적이지 않다면 일방적인 의견으로 여겨질 수 있습니다`;
        }
      }
      modal.style.display = "block";
      json = json;
      input_name = id_input.value;

      popFlag = true;

      editBtn(input_name, json);
    });
    //disabled

    document.getElementsByClassName("form_1")[0].className =
      "card grey lighten-2";
    document.getElementsByClassName("submit")[0].className =
      "waves-effect waves-light btn submit disabled";
    document.getElementsByClassName("dismiss")[0].className =
      "waves-effect waves-light btn dismiss disabled";
    // document.getElementById("last_name_1").id = "disabled";
  } else {
    console.log("please fill in your id");
    M.toast({ html: "아이디를 넣어주세요!" });
  }
};

function editBtn(input_name, json) {
  editbtn = document.getElementsByClassName("editbtn")[0];
  var editopinion = document.querySelector("#OpinionEdit_1").value;
  editbtn.addEventListener(
    "click",
    function() {
      if (popFlag) {
        console.log(editopinion);
        writeOpinion(input_name, editopinion, json);
      }
    },
    false
  );

  // When the user clicks on <span> (x), close the modal
  span.onclick = function() {
    modal.style.display = "none";
    writeOpinion(input_name, editopinion, json);
    window.location.reload(true);
  };

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };
}

let formMessage = firebase.database().ref("opinion_users");

function writeOpinion(name, opinion, api_result) {
  let newMessage = formMessage.push();
  newMessage.set(
    {
      Name: name,
      Opinion: opinion,
      Result: api_result,
      OtherOpinion: [],
      Sub: []
    },
    function(error) {
      if (error) {
        ("error");
      } else {
        ("Data saved successfully");
      }
    }
  );
}

//=============================================================================================

var container = document.getElementsByClassName("comment_container")[0];
var container_box = document.getElementsByClassName("comment_container_box")[0];
var container_overview = document.getElementsByClassName(
  "comment_container_overview_result"
)[0];

var positive_content = [];
var negative_content = [];

//https://www.geeksforgeeks.org/how-to-convert-an-object-to-an-array-of-key-value-pairs-in-javascript/

async function readOpinion() {
  formMessage.once("value").then(snapShot => {
    const id_list = Object.keys(snapShot.val());
    const commentList = id_list.map(key => {
      return snapShot.val()[key];
    });
    var positive_sum = [];
    var negative_sum = [];

    var positive_persuasive = [];
    var negative_persuasive = [];
    console.log(commentList);

    //post
    for (let i = 0; i < id_list.length; i++) {
      if (commentList[i]["Result"][0] == "positive") {
        positive_content.push(commentList[i]);
        positive_sum.push(commentList[i]["Result"][0]);
      } else {
        negative_content.push(commentList[i]);
        negative_sum.push(commentList[i]["Result"][0]);
      }
    }

    var a_ = positive_sum.length / id_list.length;
    // var b = negative_sum.length / id_list.length;
    console.log(positive_content);

    container_overview.innerHTML = `
    찬반 빈도
    <progress max="100" value="${a_ * 100}"></progress>`;

    //comment list 구성
    for (let i = 0; i < id_list.length; i++) {
      if (i === 0) {
        container.innerHTML += `<div class="commentList active_" id="${
          id_list[i]
        }">\
        <span class="marker ${
          commentList[i]["Result"][0] == "positive"
            ? "positive"
            : commentList[i]["Result"][0] == "negative"
            ? "negative"
            : "neutral"
        }"></span>\
        <span class="commentList_text">
        ${reduceString(commentList[i]["Opinion"])}\
        </span>
        <span class="new badge grey-text text-darken-2 grey lighten-1" data-badge-caption="">Re: ${
          typeof commentList[i]["OtherOpinion"] === "undefined"
            ? 0
            : Object.keys(commentList[i]["OtherOpinion"]).length
        }</span>
        </div>`;
      } else {
        container.innerHTML += `<div class="commentList" id="${id_list[i]}">\
        <span class="marker ${
          commentList[i]["Result"][0] == "positive"
            ? "positive"
            : commentList[i]["Result"][0] == "negative"
            ? "negative"
            : "neutral"
        }"></span>\
        <span class="commentList_text">
        ${reduceString(commentList[i]["Opinion"])}\
        </span>
        <span class="new badge grey-text text-darken-2 grey lighten-1" data-badge-caption="">Re: ${
          typeof commentList[i]["OtherOpinion"] === "undefined"
            ? 0
            : Object.keys(commentList[i]["OtherOpinion"]).length
        }</span>
        </div>
        `;
      }
      if (typeof commentList[i]["Sub"] === "undefined") {
      } else {
        if (Object.keys(commentList[i]["Sub"]).length > 3) {
          addPlausibleComment(`${id_list[i]}`);
          if (commentList[i]["Result"][0] == "negative")
            negative_persuasive.push(id_list[i]);
          else if (commentList[i]["Result"][0] == "positive") {
            positive_persuasive.push(id_list[i]);
          }
        }
      }
    }

    var container_overview_persuasive = document.getElementsByClassName(
      "comment_container_overview_result_persuasive"
    )[0];

    container_overview_persuasive.innerHTML += `<div>설득적 의견 빈도 <li>찬성</li>
<progress max="100" value="${(positive_persuasive.length / id_list.length) *
      100}"></progress> <li>반대</li> <progress max="100" value="${(negative_persuasive.length /
      id_list.length) *
      100}"></progress> 
      `;

    maxOpinion =
      1 - positive_persuasive.length / id_list.length >
      1 - negative_persuasive.length / id_list.length
        ? "negative"
        : "positive";

    console.log(maxOpinion);
    //click components

    const clickcomments = document.querySelectorAll("div.commentList");

    for (const clickcomment of clickcomments) {
      clickcomment.addEventListener("click", function(event) {
        //activation when pressed
        var current = document.getElementsByClassName("active_");
        current[0].className = current[0].className.replace(" active_", "");
        this.className += " active_";

        var dropdown = document.createElement("div");
        dropdown.classList.add(`dropdown_${clickcomment.id}`);

        current[0].appendChild(dropdown);

        for (let elem of document.querySelectorAll("div.commentList_box")) {
          elem.style.display = "none";
        }

        //comment board
        if (document.getElementById(`show box_${clickcomment.id}`)) {
          document.getElementById(`show box_${clickcomment.id}`).style.display =
            "inline-block";
        } else {
          container_box.innerHTML += `<div class="commentList_box" id="show box_${
            clickcomment.id
          }">

          <div class="comment_box_container">
  
          <div class="comment_box_overview" id="overview_${clickcomment.id}">
          <div class="comment-track"></div>
            <div class="level_1">
            <div class="_author">
            ${snapShot.val()[clickcomment.id]["Name"]}<br>
            </div>
            ${snapShot.val()[clickcomment.id]["Opinion"]}
            </div>
                   <div class="progress_container">
        
                   <div class="step_progressbar step_progressbar_text_${
                     clickcomment.id
                   }">
                   </div>  
                  
          <div class="progress_">
  
          <div class="progress-track"></div>
            
          <div id="step1" class="concept_${
            clickcomment.id
          } progress-step" data-tooltip="I’m the tooltip text.">
            개념
           
          </div>
            
          <div id="step2" class="reason_${clickcomment.id} progress-step">
            근거
          </div>
            
          <div id="step3" class="furtherReason_${
            clickcomment.id
          } progress-step">
           사실, 기사
          </div>
            
          <div id="step4" class="conclusion_${clickcomment.id} progress-step">
           결론
          </div>
        </div> 
   
        
        </div>       
       
            <div class="comment_box_level_2" id="level_2_${clickcomment.id}">
            </div>
           
          </div>
          <div class="comment_box_reply" id="reply_${clickcomment.id}">
          </div>

<div class="row">
<div class="col s12">
  <ul class="tabs tabs-fixed-width tab-demo z-depth-1">
    <li class="tab col s3"><a class="active" href="#test1_${
      clickcomment.id
    }">원 댓글러</a></li>
    <li class="tab col s3"><a href="#test2_${
      clickcomment.id
    }">타 댓글러</a></li>
  </ul>
</div>
<div id="test1_${clickcomment.id}" class="col s12">

<div class="card blue-grey darken-1">
<div class="card-content black-text txt1">
<form>
<div class="input-field col s3">
</div>
<div class="input-field col s9">
<textarea id="sub_comment_field_${
            clickcomment.id
          }" class="materialize-textarea"></textarea>
<label for="sub_comment_field_${
            clickcomment.id
          }">댓글을 뒷받침할 수 있는 근거가 있을까요?</label>

<form action="#">
<p>
<label>
<input class="concept" id="concept_${
            clickcomment.id
          }" name="group1" type="radio" checked />
<span class="concept">개념</span>
</label>
</p>
<p>
<label>
<input class="reason" id="reason_${
            clickcomment.id
          }" name="group1" type="radio" />
<span class="reason"> 그렇게 생각하는 이유</span>
</label>
</p>
<p>
<label>
<input class="furtherReason" id="furtherReason_${
            clickcomment.id
          }"name="group1" type="radio" />
<span class="furtherReason"> 검증할 수 있는 사례/수치</span>
</label>
</p>
<p>
<label>
<input class="conclusion" id="conclusion_${
            clickcomment.id
          }" name="group1" type="radio" />
<span class="conclusion"> 결론</span>
</label>
</p>
</form>

</div>
<a class="waves-effect waves-light btn sub_submit" id="sub_submit_${
            clickcomment.id
          }">제출</a>
<a class="waves-effect waves-light btn sub_submit" id="sub_cancel_${
            clickcomment.id
          }">취소</a>
</form>
</div>
</div>
</div>
</div>
<div id="test2_${clickcomment.id}" class="col s12">

<div class="card blue-grey darken-1">
<div class="card-content black-text txt1">
<form>
<div class="input-field col s3">
<i class="material-icons prefix">account_circle</i>
<input id="sub_comment_id_input_${
            clickcomment.id
          }" type="text" class="validate">
<label for="sub_comment_id_input_${clickcomment.id}">ID / 닉네임</label>

</div>
<div class="input-field col s9">
<textarea id="reply_field_${
            clickcomment.id
          }" class="materialize-textarea"></textarea>
<label for="reply_field_${
            clickcomment.id
          }">댓글을 뒷받침할 수 있는 근거가 있을까요?</label>


</div>
<a class="waves-effect waves-light btn reply_submit" id="reply_submit_${
            clickcomment.id
          }">제출</a>
<a class="waves-effect waves-light btn reply_submit" id="reply_submit_${
            clickcomment.id
          }">취소</a>
</form>
</div>
</div>
</div>
</div>
</div>    
          `;

          addComment(snapShot.val()[clickcomment.id], clickcomment.id);
        }
      });
    }
  });
}

//reduce String in 10 characters
function reduceString(string_) {
  var string = string_;
  if (string.length > 10) {
    string = string.substring(0, 25) + "...";
  }

  return string;
}

window.addEventListener("DOMContentLoaded", () => readOpinion(), false);

//comment ====================================================//

function addComment(user, id) {
  var comment_button = document.getElementById(`sub_submit_${id}`);
  var reply_button = document.getElementById(`reply_submit_${id}`);

  var board_overview = document.getElementById(`overview_${id}`);
  var level2_overview = document.getElementById(`level_2_${id}`);
  var reply_overview = document.getElementById(`reply_${id}`);

  var reply_textArea = document.querySelector(`#reply_field_${id}`);

  var comment_textArea = document.querySelector(`#sub_comment_field_${id}`);
  var comment_nickname = document.getElementById(`sub_comment_id_input_${id}`);

  var instance = M.Tabs.init(document.querySelectorAll(".tabs"));

  //persuasive opinion
  let sub_key;

  if (typeof user["Sub"] === "undefined") {
    var li = document.createElement("div");
    level2_overview.appendChild(li);
    li.classList.add("level_2");
    li.innerHTML += `아직 의견이 없습니다. 의견을 추가해주세요!`;
    sub_key = 0;
  } else {
    sub_key = Object.keys(user["Sub"]);

    for (let i = 0; i < sub_key.length; i++) {
      var sub_key_num = sub_key[i];
      var li = document.createElement("div");
      level2_overview.appendChild(li);
      li.classList.add("level_2");
      li.innerHTML += user["Sub"][sub_key_num]["Opinion"];
      li.innerHTML += `<span class="new badge" data-badge-caption="">${
        persuadeStep[user["Sub"][sub_key_num]["Type"]]
      }</span>`;
    }
  }

  testFunction(user["Sub"], sub_key, id);
  let reply_key;
  //other opinion
  if (typeof user["OtherOpinion"] === "undefined") {
    reply_key = 0;
    var li = document.createElement("div");
    reply_overview.appendChild(li);
    li.classList.add("reply");
    li.innerHTML += `아직 댓글이 없습니다. 댓글을 추가해주세요!`;
  } else {
    reply_key = Object.keys(user["OtherOpinion"]);
    for (let i = 0; i < reply_key.length; i++) {
      var reply_key_num = reply_key[i];
      var li = document.createElement("div");
      reply_overview.appendChild(li);
      li.classList.add("reply");
      li.innerHTML += `<div class="_author">${
        user["OtherOpinion"][reply_key_num]["Name"]
      }</div> ${user["OtherOpinion"][reply_key_num]["Opinion"]}`;

      var li_add = document.createElement("div");
      reply_overview.appendChild(li_add);
      li_add.classList.add("reply_status");
      li_add.innerHTML +=
        user["OtherOpinion"][reply_key_num]["Result"][0] == "positive"
          ? "이 의견은 찬성의 경향을 나타내고 있습니다."
          : "이 의견은 반대의 경향을 나타내고 있습니다.";
    }
  }

  reply_button.addEventListener(
    "click",
    function() {
      var li = document.createElement("div");
      const checkboxed_id = this.id.split("t_")[1];

      reply_overview.appendChild(li);
      li.classList.add("reply");
      li.innerHTML += `<div class="_author">${comment_nickname.value}</div> ${reply_textArea.value}`;

      addOtherComment(
        comment_nickname.value,
        checkboxed_id,
        reply_textArea.value
      );
    },
    false
  );

  comment_button.addEventListener(
    "click",
    function() {
      const checkboxed = document.querySelectorAll(
        `input[name="group1"]:checked`
      );

      const checkboxed_type = checkboxed[checkboxed.length - 1].className;
      const checkboxed_id = this.id.split("t_")[1];

      addSubComment(checkboxed_id, checkboxed_type, comment_textArea.value);
      if (user["Name"] == comment_nickname.value) {
        var li = document.createElement("div");
        board_overview.appendChild(li);
        li.classList.add("level_1");
        li.innerHTML += comment_nickname.value;
        li.innerHTML += comment_textArea.value;
      } else {
        var li = document.createElement("div");
        board_overview.appendChild(li);
        li.classList.add("level_2");
        li.innerHTML += comment_nickname.value;
        li.innerHTML += comment_textArea.value;
        li.innerHTML += `<span class="new badge" data-badge-caption="">${persuadeStep[checkboxed_type]}</span>`;
      }
    },
    false
  );
}

function addPlausibleComment(id) {
  //만약 댓글이 일정 수준 이상 올라오면 blink할 수 있도록
  let plau_com = document.getElementById(id);
  plau_com.childNodes[1].classList.add("plausible");
}

function testFunction(subcontent, sub_key, id) {
  var b = [];

  //post
  for (let i = 0; i < sub_key.length; i++) {
    let sub_type = sub_key[i];
    b.push(subcontent[sub_type]["Type"]);
  }
  for (let i in b) {
    document
      .getElementsByClassName(b[i] + "_" + id)[0]
      .classList.add("is-complete");
  }

  let difference = Object.keys(persuadeStep).filter(x => !b.includes(x));

  for (let i in difference) {
    document
      .getElementsByClassName(difference[i] + "_" + id)[0]
      .classList.add("is-active");
  }

  switch (b.length) {
    case 4:
      document.getElementsByClassName(
        "step_progressbar_text_" + id
      )[0].innerHTML = message["plausible"];
      break;
    case 3:
      document.getElementsByClassName(
        "step_progressbar_text_" + id
      )[0].innerHTML = message["general"];
      break;
    case 2:
      document.getElementsByClassName(
        "step_progressbar_text_" + id
      )[0].innerHTML = message["general"];
      break;
    case 1:
      document.getElementsByClassName(
        "step_progressbar_text_" + id
      )[0].innerHTML = message["general"];
      break;
    case 0:
      document.getElementsByClassName(
        "step_progressbar_text_" + id
      )[0].innerHTML = message["not-plausible"];
      break;
  }
}

function addSubComment(checkboxed_id, checkboxed_type, subcomment) {
  let subOpinion = subcomment;
  postData(apiURL, { words: subOpinion }).then(json => {
    let data = {
      Type: checkboxed_type,
      Opinion: subOpinion,
      Result: json
    };

    var newPostKey = formMessage.child(checkboxed_id).push().key;

    var updates = {};
    updates[checkboxed_id + "/Sub" + "/" + newPostKey] = data;
    formMessage.update(updates);
    window.location.reload(true);
  });
}

function addOtherComment(reply_nickname, checkboxed_id, reply_comment) {
  console.log(checkboxed_id);
  postData(apiURL, { words: reply_comment }).then(json => {
    let data = {
      Name: reply_nickname,
      Opinion: reply_comment,
      Result: json
    };
    var newPostKey = formMessage.child(checkboxed_id).push().key;
    var updates = {};
    updates[checkboxed_id + "/OtherOpinion" + "/" + newPostKey] = data;
    formMessage.update(updates);
    window.location.reload(true);
  });
}
