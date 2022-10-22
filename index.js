const BASE_URL = "https://lighthouse-user-api.herokuapp.com/api/v1/users/";
const dataPanel = document.querySelector("#data-panel");
const users = [];
let filteredUsers = []

const USERS_PER_PAGE = 12  //分頁數量

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
            class="btn btn-info btn-add-favorite" 
            data-id="${item.id}">+</button>
        </div>
      </div>
    </div>
  </div>`;
  });
  dataPanel.innerHTML = rawHTML;
}
axios
  .get(`${BASE_URL}`) //取得所有朋友列表
  .then((response) => {
    users.push(...response.data.results); //將列表pust到users陣列內暫放
    renderPaginator(users.length)
    renderUserList(getUsersByPage(1)); //users//呼叫副程式將users渲覽到dataPanel
  })
  .catch((error) => console.log(error));

function renderPaginator(amount) {
  //計算總頁數
  const numberOfPages = Math.ceil(amount / USERS_PER_PAGE)
  //製作 template 
  let rawHTML = ''

  for (let page = 1; page <= numberOfPages; page++) {
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`
  }
  //放回 HTML
  paginator.innerHTML = rawHTML
}

function getUsersByPage(page) {
  const data = filteredUsers.length ? filteredUsers : users
  //計算起始 index 
  const startIndex = (page - 1) * USERS_PER_PAGE
  //回傳切割後的新陣列
  return data.slice(startIndex, startIndex + USERS_PER_PAGE)
}

dataPanel.addEventListener("click", function onPanelClicked(event) {
  if (event.target.matches(".btn-show-info")) {
    showUserModal(event.target.dataset.id);
  } else if (event.target.matches('.btn-add-favorite')) {
    addToFavorite(Number(event.target.dataset.id))
  }
});

paginator.addEventListener('click', function onPaginatorClicked(event) {
  //如果被點擊的不是 a 標籤，結束
  if (event.target.tagName !== 'A') return

  //透過 dataset 取得被點擊的頁數
  const page = Number(event.target.dataset.page)
  //更新畫面
  renderUserList(getUsersByPage(page))
})

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

const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input') //新增這裡
searchForm.addEventListener('submit', function onSearchFormSubmitted(event) {
  //取消預設事件
  event.preventDefault()
  //取得搜尋關鍵字
  const keyword = searchInput.value.trim().toLowerCase()
  //儲存符合篩選條件的項目

  //錯誤處理：輸入無效字串
  if (!keyword.length) {
    return alert('請輸入有效字串！')
  }
  //條件篩選
  filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(keyword)
  )
  //錯誤處理：無符合條件的結果
  if (filteredUsers.length === 0) {
    return alert(`您輸入的關鍵字：${keyword} 沒有符合條件的人`)
  }
  //重新輸出至畫面
  //重製分頁器
  renderPaginator(filteredUsers.length)
  //預設顯示第 1 頁的搜尋結果
  renderUserList(getUsersByPage(1))
})

function addToFavorite(id) {
  const list = JSON.parse(localStorage.getItem('favoriteUsers')) || []
  const user = users.find((user) => user.id === id)
  if (list.some((user) => user.id === id)) {
    return alert('此人已經在收藏清單中！')
  }
  list.push(user)
  localStorage.setItem('favoriteUsers', JSON.stringify(list))
}

