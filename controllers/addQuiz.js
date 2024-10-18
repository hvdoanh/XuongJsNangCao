import { addQuiz } from "../services/api.js";

const app = {
  handleAdd: function () {
    // 1. bắt đầu submit

    const form = document.getElementById("addForm");

    form.addEventListener("submit", async (e) => {
      // ngăn chặn hay vi load trang
      e.preventDefault();

      // 2. lấy input
      const inputTitle = document.getElementById("title");
      const inputIsActive = document.getElementById("isActive");
      const inputTime = document.getElementById("time");
      const inputDescription = document.getElementById("description");

      // 3. validate
      if (!inputTitle.value.trim()) {
        alert("Cần nhập thông tin tên quizz");
        inputTitle.focus();
        return; // ngăn chăn thực thi tác vụ tiếp theo
      }

      if (!inputTime.value.trim()) {
        alert("Cần nhập thời gian ");
        inputTime.focus();
        return;
      }
      if (!inputDescription.value.trim()) {
        alert("Cần nhập thông tin mô tả");
        inputDescription.focus();
        return;
      }

      //4. lấy dữ liệu
      const data = {
        title: inputTitle.value,
        isActive: inputIsActive.value,
        time: inputTime.value,
        description: inputDescription.value || "",
      };
      console.log(data);

      // 5 . thêm mới database

      const res = await addQuiz(data);
      console.log(res);
      window.location = `addQuestion.html?id=${res.id}`;
      alert("Thêm thành công");
    });
  },
  start: function () {
    this.handleAdd();
  },
};

app.start();
