let repInput = document.querySelector('.input');
let autocomplList = document.querySelector('.repository_autocomplite')
let repList = document.querySelector('.repository_list');
let timerId;
repInput.addEventListener('input', function() {
    debounceFn(1000, fetchData);
})
function fetchData() {
    let repName = repInput.value.trim();
    if(repName === '') {
        autocomplList.innerHTML = "";
        return;
    }
    fetch(`https://api.github.com/search/repositories?q=${repName}`)
        .then(response => {
            return response.json();
        })
        .then(data => {
            let reps = data.items.slice(0, 5);
            autocomplList.innerHTML = "";
            for(let {name, owner: {login}, stargazers_count} of reps) {
                //console.log(name, login, stargazers_count)
                let autocomplDiv = document.createElement('div');
                autocomplDiv.classList.add('autocomplite__option');
                autocomplDiv.innerHTML = `${name}`;
                autocomplList.append(autocomplDiv);
                autocomplDiv.addEventListener('click', () => {
                    addRepository(name, login, stargazers_count);
                })
            }
        })
        .catch(error => console.error(error))
}

function addRepository(name, user, stars) {
    repInput.value = '';
    autocomplList.innerHTML = "";
    let repDiv = document.createElement('div');
    repDiv.classList.add('repository_list__option')
    repDiv.innerHTML = `<p>name: ${name} <br> user: ${user} <br> stars: ${stars}</p>`;
    repList.append(repDiv);
    let deleteBtn = document.createElement('button');
    deleteBtn.classList.add('delete', 'button')
    repDiv.append(deleteBtn)
    deleteBtn.innerHTML = '<div class="left-half"></div> <div class="right-half"></div>'
    deleteBtn.addEventListener('click', () => {
        repDiv.remove()
    })
}

function debounceFn(delay, fn) {
    clearTimeout(timerId);
    timerId = setTimeout(fn, delay);
}