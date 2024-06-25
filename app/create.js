const createBtn = document.querySelector(".create-news");
const cancelBtn = document.querySelector(".cancel-btn");

cancelBtn.addEventListener("click", function (e) {
  e.preventDefault();
  window.location.href = "../index.html";
});

createBtn.addEventListener("click", async function (e) {
  e.preventDefault();
  const title = document.querySelector(".title").value;
  const desc = document.querySelector(".desc").value;
  const category = document.querySelector(".category").value;
  const fname = document.querySelector(".fname").value;
  const lname = document.querySelector(".lname").value;
  const postData = {
    title,
    description: desc,
    category,
    editorFirstName: fname,
    editorLastName: lname,
  };
  console.log(postData);

  if (!title || !desc || !category || !fname || !lname) {
    alert("All fields are required!");
    return;
  }

  try {
    const response = await fetch(
      "https://btu-exam-cb6c3fdf3b9d.herokuapp.com/news",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    } else {
      window.location.href = "../index.html";
    }

    const data = await response.json();
    console.log("Success:", data);
  } catch (error) {
    console.error("Error:", error);
  }
});
