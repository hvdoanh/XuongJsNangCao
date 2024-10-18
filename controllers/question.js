import { getQuizById, getQuestionsByQuiz } from "../services/api.js";

let listQuestion = [];
let listAnswersSubmit = [];
let btnSubmit = document.getElementById("btn_submit");
let isSubmit = false;

const app = {
  getQuizAndQuestion: async function () {
    //1 lấy id   trên url
    const searchParam = new URLSearchParams(window.location.search);

    if (searchParam.has("id")) {
      const id = searchParam.get("id");
      // Phần 1 :  thông tin quizz
      // 2 . lấy dữ liệu Quiz theo id quizz
      const dataQuiz = await getQuizById(id);
      //2.1 Đếm ngược thời gian
      this.countDown(dataQuiz.time);
      // 3.. hiện thị thông tin quiz theo giao diện
      this.renderQuizInfo(dataQuiz);

      // Phần 2 : Thông tin question
      listQuestion = await getQuestionsByQuiz(id);

      this.renderListQuestion(listQuestion);
    }
  },

  renderQuizInfo: function (data) {
    document.getElementById("quiz_heading").innerHTML = data.title;
    document.getElementById("quiz_description").innerHTML = data.description;
  },

  renderListQuestion: function (list) {
    // 1.tráo câu hỏi
    console.log(list);

    list = this.random(list);

    // 2.duyệt qua mảng câu hỏi
    const questionItem = list
      ?.map((item, index) => {
        //render các câu hỏi
        const listAnswers = this.renderAnswers(
          item.answers,
          item.type,
          item.id
        );

        // 3. thay đổi nội dung câu hỏi
        return ` <div class="question_item border border-2 rounded p-4 mb-2">
          <h4 class="question_number" id="${item.id}">Câu hỏi: ${index + 1}</h4>
          <h5 class="question_title">
           ${item.questionTiltle}
          </h5>
          <div class="answer_items mt-3">
            ${listAnswers}
          </div>
        </div>`;
      })
      .join("");

    document.getElementById("question_container").innerHTML = questionItem;
  },

  random: function (array) {
    return array.sort(() => Math.random() - Math.random());
  },

  renderAnswers: function (listAnswers, type, idQuestion, idAnswers) {
    // cháo câu trả lời

    listAnswers = this.random(listAnswers);

    //listAnswers : danh sách câu hỏi
    // type : kiểu câu hỏi 1: radio , 2: checkbox
    //idQuestion : id của câu hỏi

    return listAnswers
      ?.map((ans, index) => {
        return `
            <div class="form-check fs-5 mb-3">
              <input
                class="form-check-input border border-2 border-primary"
                role="button"
                type="${type == 1 ? "radio" : "checkbox"}"
                name="question_${idQuestion}"
                id="answer_${idQuestion}_${ans.id}"
                data-idquestion="${idQuestion}"
                data-idanswer="${idAnswers}"
              />
              <label class="form-check-label" 
                    role="button" 
                    for="answer_${idQuestion}_${ans.id}">
               ${ans.answerTitle}
              </label>
            </div>
        `;
      })
      .join("");
  },

  handeSubmit: function () {
    btnSubmit.addEventListener("click", () => {
      if (window.confirm("bạn có chắc chắc nộp bài kh?")) {
        isSubmit = true;
        this.handleSubmitForm();
      }
    });
  },

  handleSubmitForm: function () {
    // I. lựa chọn đáp án mà người dùng lựa chọn
    //0.disable nút input

    const inputAll = document.querySelectorAll("input");
    inputAll.forEach((item) => {
      item.addEventListener("click", (e) => {
        e.preventDefault();
      });
    });

    // 1 lấy tất cả câu tl theo từng câu hỏi
    const listAnswersUser = document.querySelectorAll(".answer_items");
    // 2 . duyệt qua từng nhóm câu trả lời

    listAnswersUser?.forEach((answers) => {
      //   console.log(answers);
      const data = {
        idQuestion: "",
        idAnswers: [],
      };
      const inputs = answers.querySelectorAll("input");

      // 3 .duyệt mảng các câu tl
      inputs?.forEach((ans) => {
        if (ans.checked) {
          data.idQuestion = ans.dataset.idquestion;
          data.idAnswers.push(ans.dataset.idanswer);
        }
      });

      if (data.idAnswers && data.idAnswers.length) {
        listAnswersSubmit.push(data);
      }
    });
    // kiểm tra đáp án

    this.checkAnswers(listAnswersSubmit);
  },

  checkAnswers: function (listAnswersSubmit) {
    //1. lưu trữ kết quả kiểm tra
    const checkResult = [];

    const listStatus = [];
    let countRight = 0;

    //2. duyệt qua các đáp án mà người dùng lựa chọn
    listAnswersSubmit.forEach((ansUser) => {
      //2.1 đi tìm câu hỏi có đáp án trong mảng
      const findQuestion = listQuestion.find((ques) => {
        return ques.id == ansUser.idQuestion;
      });
      //2.2 so sánh giá trị của 2 mảng
      const isCheck = this.checkEqual(
        ansUser.idAnswers,
        findQuestion.correctAnser
      );

      //2.3 lưu trữ trạng thái đúng sai của câu hỏi đã tl
      listStatus.push({
        idQuestion: findQuestion.id,
        status: isCheck,
      });
      if (isCheck) {
        // nếu đúng tăng count lên 1
        countRight++;
      }
    });
    this.renderStatus(listStatus);
    alert(`Bạn trả lời đúng ${countRight}/${listQuestion.length}`);
  },

  checkEqual: function (arr1, arr2) {
    // kiểm tra xem 2 mảng có = nhau kh
    //1 . kiểm tra độ dài của 2 mảng
    // if (arr1.length != arr2.length) {
    //   return false;
    // }

    //2. kiểm tra giá trị
    //2.1 sắp xếp thứ tự 2 mảng tăng hoặc giảm dần
    arr1 = arr1.sort();
    arr2 = arr2.sort();
    //2.2 check đáp án
    for (var i = 0; i <= arr1.length; i++) {
      if (arr1[i] != arr2[i]) {
        return false;
      }
    }
    return true;
  },

  renderStatus: function (listStatus) {
    listStatus.forEach((item) => {
      const title = document.getElementById(item.idQuestion);
      title.innerHTML = `${title.textContent} ${
        item.status
          ? ` <span class="badge text-bg-success">Đúng</span>`
          : ` <span class="badge text-bg-danger">Đúng</span>`
      }`;
    });
  },

  countDown: function (time) {
    const that = this;

    function handleTime() {
      const minute = Math.floor(time / 60);

      const second = time % 60;

      // 2. lấy id theo "timer"

      const timeElement = document.getElementById("timer");

      timeElement.innerHTML = `
      ${minute < 10 ? "0" : ""}${minute}:${second < 10 ? "0" : ""}${second}`;

      // giảm 1 giây
      time--;

      if (isSubmit) {
        clearInterval(timeInter);
      }

      if (time < 0) {
        // submit bài làm
        that.handleSubmitForm();
        clearInterval(timeInter);
        timeElement.innerHTML = `Hết thời gian`;
      }
    }

    const timeInter = setInterval(handleTime, 1000);
  },

  reset: function () {
    const btnReset = document.getElementById("btn_reset");
    btnReset.addEventListener("click", () => {
      if (window.confirm("Bạn có muốn làm lại không ?")) {
        window.location.reload();
      }
    });
  },

  start: function () {
    this.getQuizAndQuestion();
    this.handeSubmit();
    this.renderStatus();
  },
};

app.start();
