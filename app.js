const cafeList = document.querySelector("#cafe-list");
const addForm = document.querySelector("#add-cafe-form");

const renderCafe = (doc) => {
  let li = document.createElement("li");
  let name = document.createElement("span");
  let city = document.createElement("span");
  let cross = document.createElement("div");

  li.setAttribute("data-id", doc.id);
  name.textContent = doc.data().name;
  city.textContent = doc.data().city;
  cross.textContent = "x";

  li.appendChild(name);
  li.appendChild(city);
  li.appendChild(cross);

  cafeList.appendChild(li);
  // deleting data from database
  cross.addEventListener("click", (e) => {
    let id = e.target.parentElement.getAttribute("data-id");
    db.collection("cafes").doc(id).delete();
  });
};

//getting data from database
// db.collection("cafes")
//   .get()
//   .then((snapshot) => {
//     snapshot.docs.forEach((doc) => {
//       renderCafe(doc);
//     });
//   });

// saving data in the database
addForm.addEventListener("submit", (e) => {
  e.preventDefault();
  db.collection("cafes").add({
    name: addForm.name.value,
    city: addForm.city.value,
  });
  addForm.reset();
});

//real-time listener
db.collection("cafes").onSnapshot((snapshot) => {
  let changes = snapshot.docChanges();
  changes.forEach((change) => {
    if (change.type === "added") {
      renderCafe(change.doc);
    } else if (change.type == "removed") {
      let li = cafeList.querySelector("[data-id=" + change.doc.id + "]");
      cafeList.removeChild(li);
    }
  });
});
