const BASE_URL = "https://lighthouse-user-api.herokuapp.com/api/v1/users/";
const dataPanel = document.querySelector("#data-panel");
const users = JSON.parse(localStorage.getItem('favoriteUsers')) //收藏好友;

console.log(users)
function renderUserList(data) {
  //渲覽陣列內的使用者到dataPanel
  let rawHTML = "";
  data.forEach((item) => {
    rawHTML += `<div class="col-sm-3">
    <div class="mb-2">
      <div class="card">
        <img src="${item.avatar}" class="card-img-top" alt="user Poster">
        <div class="card-body">
          <h5 class="card-title">${item.name} ${item.surname}</h5>
        </div>
        <div class="card-footer">
          <button class="btn btn-primary btn-show-info" data-bs-toggle="modal" data-bs-target="#user-modal" data-id="${item.id}">More</button>
          <button 
            class="btn btn-danger btn-remove-favorite" 
            data-id="${item.id}">X</button>
        </div>
      </div>
    </div>
  </div>`;
  });
  dataPanel.innerHTML = rawHTML;
}

function removeFromFavorite(id) {
  if (!users) return

  const userIndex = users.findIndex((user) => user.id === id)
  if (userIndex === -1) return

  users.splice(userIndex, 1)
  localStorage.setItem('favoriteUsers', JSON.stringify(users))
  renderUserList(users)
}

function showUserModal(id) {
  const modalTitle = document.querySelector("#user-modal-title");
  const modalImage = document.querySelector("#user-modal-image");
  const modalinfoDetial = document.querySelector("#user-modal-infoDetial");
  axios
    .get(BASE_URL + id)
    .then((response) => {
      const data = response.data;
      modalTitle.innerText = `${data.name} ${data.surname}`;
      modalImage.src = data.avatar;
      modalinfoDetial.innerHTML = `
                                <p>Region: ${data.region}</p>
                                <p>Gender: ${data.gender}</p>
                                <p>Birthday: ${data.birthday}</p>
                                <p>Age: ${data.age}</p>
                                <p>Email: ${data.email}</p>`;
      //console.log(data);
    })
    .catch((error) => console.log(error));
}

dataPanel.addEventListener("click", function onPanelClicked(event) {
  if (event.target.matches(".btn-show-info")) {
    showUserModal(event.target.dataset.id);
  } else if (event.target.matches('.btn-remove-favorite')) {
    removeFromFavorite(Number(event.target.dataset.id))
  }
});
renderUserList(users)