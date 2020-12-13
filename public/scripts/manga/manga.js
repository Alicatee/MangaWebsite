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
    const maxSize = 10 * 1024 * 1024 // 10mb
    filesInput.forEach(file => {
        if (file.files[0].size > maxSize){
            alert('File is too big')
            return event.preventDefault()
        }
    })
}

function getMangaName(str) {
    str = str.split(' ').filter( i => i ).join(' ').replace(/ /g, '-')   
    return str
 }