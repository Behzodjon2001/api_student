let teachersRow = document.getElementById("teachers");
const firstName = document.getElementById("firstName");
const lastName = document.getElementById("lastName");
const avatar = document.getElementById("avatar");
const teacherForm = document.getElementById("teacherForm");
const groups = document.getElementById("groups");
const isMarried = document.getElementById("isMarried");
const phoneNumber = document.getElementById("phoneNumber");
const email = document.getElementById("email");
const teacherModal = document.getElementById("teacher-modal");
const teacherBtn = document.getElementById("teacher-add-btn");
const modalOpenBtn = document.getElementById("modal-open-btn");
let pagination = document.querySelector(".pagination");
const teacherSearch = document.getElementById("teacher_search");
const filterManzil = document.getElementById("filterManzil");

let selected = null;
let page = 1;
let limit = 10;
let pagination_items;

const getTeacherCard = ({
  groups,
  isMarried,
  phoneNumber,
  email,
  avatar,
  lastName,
  firstName,
  id,
}) => {
  return `<div class="col-md-6 col-lg-3 my-3">
    <div class="card h-100">
      <img height="200px" style={objectFit: 'cover'} src="${avatar}" class="card-img-top" alt="${avatar}" />
      <div class="card-body d-flex flex-column justify-content-between">
        <div>
          <h5 class="card-title">firstname: ${firstName}</h5>
          <h5 class="card-title">lastname: ${lastName}</h5>
          <h5 class="card-title">groups:  ${groups}</h5>
          <h5 class="card-title">isMarried: ${isMarried}</h5>
          
          <h5 class="card-title">phone:  ${phoneNumber}</h5>
          <h5 class="card-title">email: ${email}</h5>
        </div>
        <div class="d-flex-xxl-column gap-5 justify-content-between flex-lg-column">
          <button class="btn btn-danger "onclick="deleteteacher(${id})" >Del</button>
          <button class="btn btn-primary" onclick="editteacher(${id})" data-bs-toggle="modal" data-bs-target="#teacher-modal">Edit</button>
          <a href="../student.html" onclick="saveId(${id})" class="btn btn-primary mt-xl-0 mt-lg-2"> See students ${id}</a>
        </div>
      </div>
    </div>
  </div>`;
};

async function getTeachers() {
  teachersRow.innerHTML = "...loading";
  let res = await fetch(ENDPOINT + `teacher?page=${page}&limit=${limit}`, {
    method: "GET",
  });
  let teachers = await res.json();
  teachersRow.innerHTML = "";
  teachers.forEach((teacher) => {
    console.log(teacher);
    teachersRow.innerHTML += getTeacherCard(teacher);
  });
}

getTeachers();

teacherForm.addEventListener("submit", function (e) {
  e.preventDefault();
  let check = this.checkValidity();
  this.classList.add("was-validated");
  if (check) {
    bootstrap.Modal.getInstance(teacherModal).hide();
    let data = {
      firstName: firstName.value,
      avatar: avatar.value,
      lastName: lastName.value,
      groups: groups.value,
      isMarried: isMarried.checked,
      phoneNumber: phoneNumber.value,
      email: email.value,
    };
    if (selected) {
      data.groups = data.groups.split(",");
      fetch(ENDPOINT + `teacher/${selected}`, {
        method: "PUT",

        body: JSON.stringify(data),
        headers: { "content-type": "application/json" },
      }).then(() => {
        alert("teacher is edited");
        getTeachers();
        emptyForm();
      });
    } else {
      data.groups = data.groups.split(",");
      if (checkPhone(data.phoneNumber)) {
        data.phoneNumber = "+998" + data.phoneNumber;
        fetch(ENDPOINT + "teacher", {
          method: "POST",
          body: JSON.stringify(data),
          headers: { "content-type": "application/json" },
        }).then(() => {
          alert("teacher is added");
          getTeachers();
          emptyForm();
        });
      } else {
        alert("Phone number invalid");
      }
    }
  }
});

function checkPhone(phone) {
  var phoneRe =
    /^(\+{0,})(\d{0,})([(]{1}\d{1,3}[)]{0,}){0,}(\s?\d+|\+\d{2,3}\s{1}\d+|\d+){1}[\s|-]?\d+([\s|-]?\d+){1,2}(\s){0,}$/gm;
  var digits = phone.replace(/\D/g, "");
  return phoneRe.test(digits);
}

async function getTeachers2() {
  teachersRow.innerHTML = "...loading";
  let res = await fetch(ENDPOINT + `teacher`, {
    method: "GET",
  });
  let teachers = await res.json();
  console.log("sdsdsdsdssdsds");
  console.log(teachers + "sssqqqqqqq");
  return teachers;
}

async function getTeachers3(filterPupils) {
  // teachersRow.innerHTML = "...loading";
  // let res = await fetch(ENDPOINT + `teacher?page=${page}&limit=${limit}`, {
  //   method: "GET",
  // });
  // let teachers = await res.json();
  // teachersRow.innerHTML = "";
  // teachers.forEach((teacher) => {
  //   console.log(teacher);
  //   teachersRow.innerHTML += getTeacherCard(teacher);
  // });
}

teacherSearch.addEventListener("input", function (evt) {
  evt.preventDefault();
  let search = this.value.toLowerCase();
  let search2 = [];
  search2 = [getTeachers2()];
  console.log(search2 + "eeeeeee");
  filterPupils = search2.filter((teacher) =>
    teacher.firstName.toLowerCase().includes(search)
  );
  getTeachers(filterPupils);
});

let manzils = ["ascending", "descending"];

["All", ...manzils].forEach((manzil) => {
  filterManzil.innerHTML += `<option value="${manzil}">${manzil}</option>`;
});

filterManzil.addEventListener("change", function (evt) {
  evt.preventDefault();
  if (this.value == "All") {
    getTeachers();
  } else {
    let getTeacher = [getTeachers2()];
    filterPupils = getTeacher.sort((firstName) => firstName);
    getTeachers(filterPupils);
  }
});

function editteacher(id) {
  selected = id;
  teacherBtn.innerHTML = "Save teacher";
  fetch(ENDPOINT + `teacher/${id}`)
    .then((res) => {
      return res.json();
    })
    .then((res) => {
      firstName.value = res.firstName;
      avatar.value = res.avatar;
      lastName.value = res.lastName;
      groups.value = res.groups;
      isMarried.checked = res.isMarried;
      phoneNumber.value = res.phoneNumber;
      email.value = res.email;
    });
}

function deleteteacher(id) {
  let check = confirm("Rostanam o'chirishni xohlaysizmi ?");
  if (check) {
    fetch(ENDPOINT + `teacher/${id}`, { method: "DELETE" }).then(() => {
      getTeachers();
    });
  }
}

function saveId(id) {
  localStorage.setItem("teacher", id);
}

function emptyForm() {
  firstName.value = "";
  lastName.value = "";
  avatar.value = "";
  isMarried.checked = false;
  phoneNumber.value = "";
  email.value = "";
  groups.value = "";
}

modalOpenBtn.addEventListener("click", () => {
  selected = null;
});

async function getPagination() {
  let pagination_numbers = "";
  let res = await fetch(ENDPOINT + `teacher`);
  let teachers = await res.json();
  products_number = teachers.length;
  pagination_items = Math.ceil(products_number / limit);
  Array(pagination_items)
    .fill(1)
    .forEach((item, index) => {
      pagination_numbers += `<li class="page-item ${
        page == index + 1 ? "active" : ""
      }" onclick="getPage(${index + 1})">
        <span class="page-link">
          ${index + 1}
        </span>
      </li>`;
    });

  pagination.innerHTML = `
    <li onclick="getPage('-')" class="page-item ${
      page == 1 ? "disabled" : ""
    }"><button class="page-link" href="#">Previous</button></li>
    ${pagination_numbers}
    <li onclick="getPage('+')" class="page-item ${
      page == pagination_items ? "disabled" : ""
    }"><button class="page-link" href="#">Next</button></li>
  `;
}

getPagination();

function getPage(p) {
  if (p == "+") {
    page++;
  } else if (p == "-") {
    page--;
  } else {
    page = p;
  }
  if (page <= pagination_items) {
    getTeachers();
    getPagination();
  }
}
