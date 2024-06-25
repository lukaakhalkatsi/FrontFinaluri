import { formatDate } from "./dateFormatter.js";

document.addEventListener("DOMContentLoaded", function () {
  fetchNews();
});

const tableBody = document.querySelector(".table-body");
const loadingBox = document.querySelector(".news-loading");

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

function insterDataIntoTable(newsData) {
  newsData.forEach(
    ({ id, title, category, likes, dateUpdated, dateCreated }, index) => {
      const formattedDateUpdated = formatDate(dateUpdated);
      const formattedDateCreated = formatDate(dateCreated);

      const rowHtml = `
           <tr>
            <td class="table-header-cell text-zinc-700">${id}</td>
            <td class="table-header-cell text-zinc-700">
              ${title}
            </td>
            <td class="table-header-cell text-zinc-700">${category}</td>
            <td class="table-header-cell text-zinc-700">${likes}</td>
        <td class="table-header-cell text-zinc-700">${formattedDateUpdated}</td>
        <td class="table-header-cell text-zinc-700">${formattedDateCreated}</td>
            <td class="table-header-cell text-zinc-700 action-td">
              <button class="action-buttons">Delete</button>
              <button class="action-buttons">Update</button>
            </td>
          </tr>
    `;
      tableBody.insertAdjacentHTML("beforeend", rowHtml);
    }
  );
}
