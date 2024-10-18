import { getAllQuizz } from "../services/api.js";
const app = {
  //hiện thi danh sách các câu hỏi
  rederListQuizz: async function () {
    //1 lấy danh sách các câu hỏi
    const data = await getAllQuizz();
    // console.log(data);

    // 2 đổ dữ liệu ra danh sách

    const listQuizz = data
      ?.map((item, index) => {
        //2.1 nếu trạng thái true thì mới hiển thị
        if (item.isActive == true) {
          return `
            <a href="#" data-id=${item.id}
              class="quiz-items list-group-item list-group-item-action list-group-item-primary"
            >
              ${item.title}: ${item.description}
            </a>
            `;
        }
      })
      .join(""); // join chuyển 1 mảng thành 1 chuỗi
    // console.log(listQuizz);

    const listQuizzElement = document.getElementById("list_quiz");
    listQuizzElement.innerHTML = listQuizz;

    this.handleClickQuiz();
  },
  handleClickQuiz: function () {
    // 1. lấy danh sách (mảng)
    const quizItems = document.querySelectorAll(".quiz-items");
    console.log(quizItems);
    quizItems.forEach((item) => {
      //2 khai báo sự kiện
      item.addEventListener("click", () => {
        // 3.xác nhận
        const title = item.textContent;
        if (window.confirm(`Bạn có chắc chắn làm quiz: ${title}`)) {
          // lấy id :
          //c1 :
          //   const id = item.dataset.id;

          // c2:
          const id = item.getAttribute("data-id");
          //   console.log(id);
          // 4. chuyển trang
          window.location = `question.html?id=${id}`;
        }
      });
    });
  },

  start: function () {
    this.rederListQuizz();
  },
};
app.start();
