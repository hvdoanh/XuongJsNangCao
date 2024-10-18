import { getAllQuizz } from "../services/api.js";

const app = {
  renderListQuiz: async function () {
    const data = await getAllQuizz();
    console.log(data);

    document.querySelector("tbody").innerHTML = data
      ?.map((item, index) => {
        return `
            <tr>
            <th scope="row">${index + 1}</th>
            <td>${item.title}</td>
            <td>${
              item.isActive
                ? `<span class="badge text-bg-success"> Kích hoạt</span>`
                : `<span class="badge text-bg-danger">Chưa kích hoạt</span>`
            }</td>
            <td>${item.time}</td>
            <td>${item.description}</td>
            <td></td>
          </tr>
        `;
      })
      .join("");
  },

  start: function () {
    this.renderListQuiz();
  },
};

app.start();
