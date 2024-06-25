document.addEventListener("DOMContentLoaded", function () {
  fetchNews();
});

async function fetchNews() {
  try {
    const response = await fetch(
      "https://btu-exam-cb6c3fdf3b9d.herokuapp.com/news"
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
  }
}
