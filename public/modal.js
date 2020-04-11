const modal = document.getElementsByClassName('modal');

document.getElementById('close-modal').addEventListener('click',closeEditModal);
document.getElementById('close-delete-modal-no').addEventListener('click',closeDeleteModal);

function openModal (modalType){
    if (modalType==="edit"){
        modal[0].style.display='flex'; 
    }
    if (modalType==="delete"){
        modal[1].style.display='flex'; 
    }
}

function closeEditModal (){
        modal[0].style.display='none';
}

function closeDeleteModal (){
        modal[1].style.display='none';
}