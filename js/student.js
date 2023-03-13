let studentsRow = document.getElementById("students");
const firstName = document.getElementById("firstName");
const lastName = document.getElementById("lastName");
const avatar = document.getElementById("avatar");
const studentForm = document.getElementById("studentForm");
const isWork = document.getElementById("isWork");
const phoneNumber = document.getElementById("phoneNumber");
const email = document.getElementById("email");
const studentModal = document.getElementById("student-modal");
const studentBtn = document.getElementById("student-add-btn");
const modalOpenBtn = document.getElementById("modal-open-btn");
let pagination = document.querySelector(".pagination");
const studentSearch = document.getElementById("student_search");
const filterManzil = document.getElementById("filterManzil");
const birthday = document.getElementById("birthday");
const teacherId = localStorage.getItem("teacher");
const field = document.getElementById("field");

let selected = null;
let page = 1;
let limit = 10;
let pagination_items;

const getTeacherCard = ({
  birthday,
  isWork,
  field,
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
          <h5 class="card-title">birthday:  ${birthday}</h5>
          <h5 class="card-title">isWork: ${isWork}</h5>
          <h5 class="card-title">field: ${field}</h5>
          
          <h5 class="card-title">phone:  ${phoneNumber}</h5>
          <h5 class="card-title">email: ${email}</h5>
        </div>
        <div class="d-flex justify-content-between">
          <button class="btn btn-danger"onclick="deletestudent(${id})" >Del</button>
          <button class="btn btn-primary" onclick="editstudent(${id})" data-bs-toggle="modal" data-bs-target="#student-modal">Edit</button>
        </div>
      </div>
    </div>
  </div>`;
};

async function getTeachers() {
  studentsRow.innerHTML = "...loading";
  let res = await fetch(
    ENDPOINT + `teacher/${teacherId}/student?page=${page}&limit=${limit}`,
    {
      method: "GET",
    }
  );
  let students = await res.json();
  studentsRow.innerHTML = "";
  students.forEach((student) => {
    console.log(student);
    studentsRow.innerHTML += getTeacherCard(student);
  });
}

getTeachers();

studentForm.addEventListener("submit", function (e) {
  e.preventDefault();
  let check = this.checkValidity();
  this.classList.add("was-validated");
  if (check) {
    bootstrap.Modal.getInstance(studentModal).hide();
    let data = {
      firstName: firstName.value,
      avatar: avatar.value,
      lastName: lastName.value,
      birthday: birthday.value,
      isWork: isWork.checked,
      phoneNumber: phoneNumber.value,
      email: email.value,
      field: field.value,
    };
    if (selected) {
      fetch(ENDPOINT + `teacher/${teacherId}/student/${selected}`, {
        method: "PUT",

        body: JSON.stringify(data),
        headers: { "content-type": "application/json" },
      }).then(() => {
        alert("student is edited");
        getTeachers();
        emptyForm();
      });
    } else {
      if (checkPhone(data.phoneNumber)) {
        data.phoneNumber = "+998" + data.phoneNumber;
        fetch(ENDPOINT + `teacher/${teacherId}/student`, {
          method: "POST",
          body: JSON.stringify(data),
          headers: { "content-type": "application/json" },
        }).then(() => {
          alert("student is added");
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
  studentsRow.innerHTML = "...loading";
  let res = await fetch(ENDPOINT + `student`, {
    method: "GET",
  });
  let students = await res.json();
  console.log("sdsdsdsdssdsds");
  console.log(students + "sssqqqqqqq");
  return students;
}

async function getTeachers3(filterPupils) {
  // studentsRow.innerHTML = "...loading";
  // let res = await fetch(ENDPOINT + `student?page=${page}&limit=${limit}`, {
  //   method: "GET",
  // });
  // let students = await res.json();
  // studentsRow.innerHTML = "";
  // students.forEach((student) => {
  //   console.log(student);
  //   studentsRow.innerHTML += getTeacherCard(student);
  // });
}

studentSearch.addEventListener("input", function (evt) {
  evt.preventDefault();
  let search = this.value.toLowerCase();
  let search2 = [];
  search2 = [getTeachers2()];
  console.log(search2 + "eeeeeee");
  filterPupils = search2.filter((student) =>
    student.firstName.toLowerCase().includes(search)
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

function editstudent(id) {
  selected = id;
  studentBtn.innerHTML = "Save student";
  fetch(ENDPOINT + `teacher/${teacherId}/student/${id}`)
    .then((res) => {
      return res.json();
    })
    .then((res) => {
      firstName.value = res.firstName;
      avatar.value = res.avatar;
      lastName.value = res.lastName;
      birthday.value = res.birthday;
      isWork.checked = res.isWork;
      phoneNumber.value = res.phoneNumber;
      email.value = res.email;
      field.value = res.field;
    });
}

function deletestudent(id) {
  let check = confirm("Rostanam o'chirishni xohlaysizmi ?");
  if (check) {
    fetch(ENDPOINT + `teacher/${teacherId}/student/${id}`, {
      method: "DELETE",
    }).then(() => {
      getTeachers();
    });
  }
}

function saveId(id) {
  localStorage.setItem("student", id);
}

function emptyForm() {
  firstName.value = "";
  lastName.value = "";
  avatar.value = "";
  isWork.checked = false;
  phoneNumber.value = "";
  email.value = "";
  birthday.value = "";
  field.value = "";
}

modalOpenBtn.addEventListener("click", () => {
  selected = null;
});

async function getPagination() {
  let pagination_numbers = "";
  let res = await fetch(ENDPOINT + `student`);
  let students = await res.json();
  products_number = students.length;
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
