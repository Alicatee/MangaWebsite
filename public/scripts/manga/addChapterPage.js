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