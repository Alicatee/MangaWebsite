


function addPageField(){
    const container = document.querySelector("#upload-container")
    const fieldsContainer = document.querySelectorAll(".upload-file")
    
    const newFieldContainer = fieldsContainer[fieldsContainer.length - 1].cloneNode(true)
    const input = newFieldContainer.children[0]
    input.value = ""
    container.appendChild(newFieldContainer)
}

function deletePageField(event){
    const input = event.currentTarget
    const fieldsContainer = document.querySelectorAll(".upload-file")

    if(fieldsContainer.length <= 1){
       return input.parentNode.children[0].value = ""
    }
    input.parentNode.remove()
}

function validateSize(event){
    const filesInput = document.querySelectorAll('.images')
    const maxSize = 5 * 1024 * 1024 // 10mb
    filesInput.forEach(file => {
        if (file.files[0].size > maxSize){
            console.log('oi')
            alert('File is too big')
            return event.preventDefault()
        }
    })
}

 function getSmallString(str,len) {
    //  str = str.replace(/<(?:.|\n)*?>/gm,'') // strip tags
          if (str.length > len  && str.length > 0) {
            let new_str = str + ' '
            new_str = str.substr(0, len)
            return new_str + '...'
          }
          return str
   }



 function addMangaImagePreview(event){
    const file = event.target.files[0]
    const output = document.getElementById('imageOutput')
  //  output.removeAttribute('class')
    if(file.type !== "image/png" &&
    file.type !== "image/jpg" &&
    file.type !== "image/jpeg"){
        return output.classList.add('failed')
    }
    output.classList.add('loading')
    output.src = URL.createObjectURL(file);
    output.onload = function(){
        output.classList.remove('loading')
        output.classList.add('loaded')
        URL.revokeObjectURL(output.src)
    }
 }

 function loadMore(){
     const xhr = new XMLHttpRequest()
     xhr.responseType = "json"
     const mangaGrid = document.querySelector('.manga-grid')
     const mangasNumb = mangaGrid.childElementCount;
     const loadMoreButton = document.getElementById('load-more-btn')

     xhr.onload = function(){
         if(this.status === 200){
            if(xhr.response.length <= 0){
                 return loadMoreButton.innerText = "All Loaded!"
            }
            const mangas = xhr.response
             mangas.forEach(manga => {
                mangaGrid.innerHTML += `
                <div class="manga-container">
                <div class="manga-info">
                    <div class="manga-info-image">
                        <a href="/mangas/${manga._id}">
                            <img  class="manga-cover" src="data:image/${manga.image.contentType};base64,
                            ${manga.image.data.toString('base64')}">
                        </a>
                    </div>
                    <div class="manga-info-title">
                        <a href="/mangas/${manga._id}">${getSmallString(manga.title,40)}</a>
                    </div>
                </div>
            </div>  
                ` 
            })
            loadMoreButton.classList.remove('disabled')
        }else{
             console.warn('Something Went Wrong')
         }
     }
     xhr.open('get',`/mangas/loadMore?skip=${mangasNumb}&q=${getParam('q')}`)
     xhr.send()
     loadMoreButton.classList.add('disabled')
 }

 const searchResultsContainer = document.querySelector('.search-result-container')
 const searchInput = document.getElementById('search-input')
 const searchButton = document.querySelector('.search-button')

searchButton.addEventListener('click',() => {
    console.log('fired')
    if(searchInput.classList.contains('active')){
        searchInput.classList.remove('active')
        searchResultsContainer.classList.remove('active')
        searchInput.value = ''
    }else{
        searchInput.classList.add('active')
    }
})

 searchInput.addEventListener('input',(event) => {
    const xhr = new XMLHttpRequest()
    xhr.responseType = "json"
    
    xhr.onload = function(){
        if (this.status !== 200) return console.warn('Something Went Wrong')
        if(xhr.response.length <= 0 || searchInput.value == '') return searchResultsContainer.classList.remove('active')
        searchResultsContainer.innerHTML = ''
        searchResultsContainer.classList.add('active')
        const mangas = xhr.response

        mangas.forEach(manga => {
            searchResultsContainer.innerHTML += `
             <div class="search-result">
                   <div class="search-result-image">
                      <a href="/mangas/${manga._id}"><img src="data:image/${manga.image.contentType};base64,
                      ${manga.image.data.toString('base64')}" alt=""></a>
                   </div>
                    <div class="search-result-info">
                    <a href="/mangas/${manga._id}"><h2>${manga.title}</h2></a>
                     <p>${getSmallString(manga.desc,90)} </p>
                    </div>  
            </div>
            `
        })
    }

    xhr.open('get',`/mangas/searchManga?q=${searchInput.value}`)
    xhr.send()
 })


 function getParam(param){
     const value =  new URLSearchParams(window.location.search).get(param)
    if(value){
        return value
    }
    return 'none'
 }