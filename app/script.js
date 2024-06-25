import { formatDate } from "./dateFormatter.js";

document.addEventListener("DOMContentLoaded", function () {
  fetchNews();
});

const tableBody = document.querySelector(".table-body");
const loadingBox = document.querySelector(".news-loading");
const createBtn = document.querySelector(".create");

createBtn.addEventListener("click", function () {
  window.location.href = "../pages/create.html";
});

async function fetchNews() {
  loadingBox.classList.remove("hidden");
  try {
    const response = await fetch(
      "https://btu-exam-cb6c3fdf3b9d.herokuapp.com/news"
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    console.log(data);
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

  tr.classList.add("fade-out");
  const response = await fetch(
    `https://btu-exam-cb6c3fdf3b9d.herokuapp.com/news/${id}`,
    {
      method: "DELETE",
    }
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  await new Promise((resolve) => setTimeout(resolve, 500));
  const data = await response.json();
  console.log(data);
}

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

function insterDataIntoTable(newsData) {
  newsData.forEach(
    ({ id, title, category, likes, dateUpdated, dateCreated }) => {
      const formattedDateUpdated = formatDate(dateUpdated);
      const formattedDateCreated = formatDate(dateCreated);

      const rowHtml = `
           <tr data-id="${id}">
            <td class="table-header-cell text-zinc-700">${id}</td>
            <td class="table-header-cell text-zinc-700">
              ${title}
            </td>
            <td class="table-header-cell text-zinc-700">${category}</td>
            <td class="table-header-cell text-zinc-700">${likes}</td>
        <td class="table-header-cell text-zinc-700">${formattedDateUpdated}</td>
        <td class="table-header-cell text-zinc-700">${formattedDateCreated}</td>
            <td class="table-header-cell text-zinc-700 action-td">
              <button class="action-buttons delete-btn">Delete</button>
              <button class="action-buttons">Update</button>
            </td>
          </tr>
    `;
      tableBody.insertAdjacentHTML("beforeend", rowHtml);
    }
  );
}
