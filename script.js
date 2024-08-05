let title = document.getElementById("title");
let price = document.getElementById("price");
let taxes = document.getElementById("taxes");
let ads = document.getElementById("ads");
let discount = document.getElementById("discount");
let total = document.querySelector("#total span");
let count = document.getElementById("count");
let category = document.getElementById("category");
let createBtn = document.querySelector(".create");
let allInput = document.querySelectorAll(".inputs input");
let searchInput = document.querySelector(".searchMethods input");
let byTitle = document.querySelector("#byTitle");
let byCategory = document.querySelector("#byCategory");
let dataProd;
let mood = "create";
let tmp;
let searchMood = "title";

function getTotal() {
  if (price.value > 0) {
    total.innerHTML =
      Number(price.value) +
      Number(taxes.value) +
      Number(ads.value) -
      Number(discount.value);
    total.parentElement.style.padding = "10px";
    total.parentElement.style.backgroundColor = "#040";
  } else {
    total.innerHTML = "";
    total.parentElement.style.backgroundColor = "#af0b0b";
    total.parentElement.style.padding = "10px";
  }
}

if (localStorage.product != null || localStorage.product != undefined) {
  dataProd = JSON.parse(localStorage.product);
} else {
  dataProd = [];
}

createBtn.onclick = function () {
  let newData = {
    title: title.value.toLowerCase(),
    price: price.value,
    taxes: taxes.value,
    ads: ads.value,
    discount: discount.value,
    total: total.innerHTML,
    count: count.value,
    category: category.value.toLowerCase(),
  };
  if (title.value !== "" && price.value !== "" && count.value !== "" && category.value !== "") {
    if(count.value < 100) {
      if (mood === "create") {
        if (newData.count > 1) {
          for (let i = 0; i < newData.count; i++) {
            dataProd.push(newData);
          }
        } else {
          dataProd.push(newData);
        }
      } else {
        dataProd[tmp] = newData;
        createBtn.innerHTML = "Create";
        count.disabled = false;
        mood = "create";
      }
      localStorage.setItem("product", JSON.stringify(dataProd));
      allInput.forEach((input) => {
        input.value = "";
      });
      total.innerHTML = "";
      total.parentElement.style.backgroundColor = "#af0b0b";
      document.querySelectorAll(".tbody tr").forEach((tr) => {
        tr.remove();
      });
      showData();
      if (dataProd.length !== 0) {
        deleteBtn.style.display = "block";
      }
    }else {
      alert("Count Must Be Less Than 100");
      count.focus()
    }
    
  } else {
    alert("Please Fill All Inputs");
    title.focus();
  }
};

function showData() {
  let newRow = "";
  for (i = 0; i < dataProd.length; i++) {
    newRow += `<tr class="Row-${i + 1}">
  <td>${i + 1}</td>
  <td>${dataProd[i].title}</td>
  <td>${dataProd[i].price}</td>
  <td>${dataProd[i].taxes}</td>
  <td>${dataProd[i].ads}</td>
  <td>${dataProd[i].discount}</td>
  <td>${dataProd[i].total}</td>
  <td>${dataProd[i].category}</td>
  <td><button onclick="updateProduct(${i})" id="update">Update</button></td>
  <td><button onclick="deleteProduct(${i})" id="delete">Delete</button></td>
  </tr>`;
  }
  document.querySelector(".tbody").innerHTML += newRow;
}

let deleteBtn = document.createElement("button");
deleteBtn.textContent = "Delete All Data";
document.getElementById("outputs").appendChild(deleteBtn);
deleteBtn.style.display = "none";
deleteBtn.classList.add("deleteBtn");
function deleteData() {
  if (dataProd.length !== 0) {
    deleteBtn.style.display = "block";
  }
  deleteBtn.onclick = function () {
    localStorage.clear();
    dataProd = [];
    document.querySelectorAll(".tbody tr").forEach((tr) => {
      tr.remove();
    });
    deleteBtn.style.display = "none";
  };
}

function deleteProduct(i) {
  dataProd.splice(i, 1);
  localStorage.setItem("product", JSON.stringify(dataProd));
  document.querySelectorAll(".tbody tr").forEach((tr) => {
    tr.remove();
  });
  showData();
  if (dataProd.length === 0) {
    deleteBtn.style.display = "none";
  }
  deleteData();
}

function updateProduct(i) {
  title.value = dataProd[i].title;
  price.value = dataProd[i].price;
  taxes.value = dataProd[i].taxes;
  ads.value = dataProd[i].ads;
  discount.value = dataProd[i].discount;
  getTotal();
  count.disabled = true;
  category.value = dataProd[i].category;
  mood = "update";
  tmp = i;
  createBtn.innerHTML = "Update";
  scroll({
    top: 0,
    behavior: "smooth",
  });
}

function getSearchMood() {
  if (searchMood === "title") {
    searchInput.placeholder = "Search By Title";
  } else {
    searchInput.placeholder = "Search By Category";
  }
  searchInput.focus();
  searchInput.value = "";
}

function searchProduct(value) {
  if (searchMood === "title") {
    for (let i = 0; i < dataProd.length; i++) {
      if (dataProd[i].title.includes(value.toLowerCase())) {
        document.querySelector(`.Row-${i + 1}`).style.display = "table-row";
      } else {
        document.querySelector(`.Row-${i + 1}`).style.display = "none";
      }
    }
  } else if (searchMood === "category") {
    for (let i = 0; i < dataProd.length; i++) {
      if (dataProd[i].category.includes(value.toLowerCase())) {
        document.querySelector(`.Row-${i + 1}`).style.display = "table-row";
      } else {
        document.querySelector(`.Row-${i + 1}`).style.display = "none";
      }
    }
  }
}

window.onload = function () {
  total.parentElement.style.backgroundColor = "#af0b0b";
  total.parentElement.style.padding = "10px";
  deleteData();
  showData();
};
