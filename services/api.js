export const getAllQuizz = async () => {
    try {
      // call api lấy danh sách quizz
      const res = await fetch("http://localhost:3000/quizs");
      const data = await res.json();
      // console.log(data);
      return data;
    } catch (error) {
      alert("lỗi");
    }
  };
  
  export const getQuestionsByQuiz = async (idQuiz) => {
    try {
      // call api lấy danh sách question theo id của quizz
      const res = await fetch(`http://localhost:3000/questions?quizId=${idQuiz}`);
      const data = await res.json();
      // console.log(data);
      return data;
    } catch (error) {
      alert("lỗi");
    }
  };
  
  export const getQuizById = async (id) => {
    try {
      // trả về 1 ojbect chứa id theo điều kiện
      const res = await fetch(`http://localhost:3000/quizs/${id}`);
      const data = await res.json();
      return data;
    } catch (error) {
      alert("Lỗi");
    }
  };
  
  export const addQuiz = async (data) => {
    try {
      // trả về 1 ojbect chứa id theo điều kiện
      const res = await fetch(`http://localhost:3000/quizs`, {
        method: "post", // phương thức thêm mới
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data), // chuyển dữ liệu từ object -> JSON
      }); // res là res trả về nếu thêm thành công
  
      const dataRes = await res.json();
      return dataRes;
    } catch (error) {
      alert("Thêm  Lỗi");
    }
  };
  
  export const addQuestions = async (datas) => {
    try {
      datas.forEach(async (item) => {
        // trả về 1 ojbect chứa id theo điều kiện
        await fetch(`http://localhost:3000/questions`, {
          method: "post", // phương thức thêm mới
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(datas), // chuyển dữ liệu từ object -> JSON
        }); // res là res trả về nếu thêm thành công
      });
    } catch (error) {
      alert("Thêm  Lỗi");
    }
  };
  