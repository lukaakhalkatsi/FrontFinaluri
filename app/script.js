import { formatDate } from "./dateFormatter.js";

document.addEventListener("DOMContentLoaded", function () {
  fetchNews();
});

const tableBody = document.querySelector(".table-body");
const loadingBox = document.querySelector(".news-loading");
const createBtn = document.querySelector(".create");
const updatePopup = document.querySelector(".update-popup");
const overlay = document.querySelector(".overlay");
const closeBtn = document.querySelector(".close");
const confirmUpdateBtn = document.querySelector(".confirm-update");

const updateTitle = document.querySelector(".update-title");
const updateDesc = document.querySelector(".update-desc");
const updateCategory = document.querySelector(".update-category");
const updateEditorFirstName = document.querySelector(".editor-firstname");
const updateEditorLastName = document.querySelector(".editor-lastname");
let updateID = null;
let crDate = null;

closeBtn.addEventListener("click", function () {
  overlay.classList.add("hidden");
  updatePopup.classList.add("hidden");
});

overlay.addEventListener("click", function () {
  overlay.classList.add("hidden");
  updatePopup.classList.add("hidden");
});

createBtn.addEventListener("click", function () {
  window.location.href = "../pages/create.html";
});

tableBody.addEventListener("click", async (event) => {
  if (event.target.classList.contains("delete-btn")) {
    const tr = event.target.closest("tr");
    const id = tr.getAttribute("data-id");

    try {
      await deleteNews(id);
      tr.remove();
    } catch (error) {
      console.error("Error deleting news item:", error);
    }
  }
});

tableBody.addEventListener("click", async (event) => {
  if (event.target.classList.contains("update-btn")) {
    const tr = event.target.closest("tr");
    const id = tr.getAttribute("data-id");
    overlay.classList.remove("hidden");
    updatePopup.classList.remove("hidden");
    try {
      const response = await fetch(
        `https://btu-ex-2025-0bf797fecbae.herokuapp.com/news/${id}`
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      insertDataIntoPopUp(data);
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  }
});

confirmUpdateBtn.addEventListener("click", async function () {
  const currentDate = new Date().toLocaleDateString();
  const title = updateTitle.value;
  const desc = updateDesc.value;
  const category = updateCategory.value;
  const fname = updateEditorFirstName.value;
  const lname = updateEditorLastName.value;
  const postData = {
    title,
    description: desc,
    category,
    editorFirstName: fname,
    editorLastName: lname,
    dateUpdated: currentDate,
    currentDate: crDate,
  };

  if (!title || !desc || !category || !fname || !lname) {
    alert("All fields are required!");
    return;
  }

  try {
    const response = await fetch(
      `https://btu-ex-2025-0bf797fecbae.herokuapp.com/news/${updateID}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    } else {
      location.reload();
    }
    const data = await response.json();
  } catch (error) {
    console.error("Error:", error);
  }
});

async function fetchNews() {
  loadingBox.classList.remove("hidden");
  try {
    const response = await fetch(
      "https://btu-ex-2025-0bf797fecbae.herokuapp.com/news"
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    for (let i = 0; i < data.length; i++) {
      if (data[i].likes == undefined) {
        data[i].likes = 0;
      }
    }
    insterDataIntoTable(data);
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
  } finally {
    loadingBox.classList.add("hidden");
  }
}

async function deleteNews(id) {
  const tr = tableBody.querySelector(`tr[data-id="${id}"]`);
  if (!tr) return;

  tr.classList.add("slide-out");
  const response = await fetch(
    `https://btu-ex-2025-0bf797fecbae.herokuapp.com/news/${id}`,
    {
      method: "DELETE",
    }
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  await new Promise((resolve) => setTimeout(resolve, 500));
  const data = await response.json();
}

function insterDataIntoTable(newsData) {
  newsData?.forEach(
    ({ id, title, category, likes, currentDate, dateUpdated }) => {
      const rowHtml = `
           <tr data-id="${id}">
            <td class="table-header-cell text-zinc-700">${id}</td>
            <td class="table-header-cell text-zinc-700">
              ${title}
            </td>
            <td class="table-header-cell text-zinc-700">${category}</td>
            <td class="table-header-cell text-zinc-700">${likes}</td>
        <td class="table-header-cell text-zinc-700">${formatDate(
          dateUpdated
        )}</td>
        <td class="table-header-cell text-zinc-700">${formatDate(
          currentDate
        )}</td>
            <td class="table-header-cell text-zinc-700 action-td">
              <button class="action-buttons delete-btn">Delete</button>
              <button class="action-buttons update-btn">Update</button>
            </td>
          </tr>
    `;
      tableBody.insertAdjacentHTML("beforeend", rowHtml);
    }
  );
}

function insertDataIntoPopUp({
  id,
  title,
  description,
  category,
  editorFirstName,
  editorLastName,
  currentDate,
}) {
  updateID = id;
  updateTitle.value = title;
  updateDesc.value = description;
  updateCategory.value = category;
  updateEditorFirstName.value = editorFirstName;
  updateEditorLastName.value = editorLastName;
  crDate = currentDate;
}
