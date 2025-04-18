const listItem = document.querySelectorAll('.list');
const visiblity_list=document.querySelectorAll('.invisible');
const visiblity_list2=document.querySelectorAll('.inbisible');

visiblity_list[0].classList.add('visible');
visiblity_list2[0].classList.add('visible');

function activateLink() {
	listItem.forEach( item => {
		item.classList.remove('active');
	});
	this.classList.add('active');
	visiblity_list.forEach( item => {
		item.classList.remove('visible');
	});
	visiblity_list[[...this.parentElement.children].indexOf(this)].classList.add('visible');
	visiblity_list2.forEach( item => {
		item.classList.remove('visible');
	});
	visiblity_list2[[...this.parentElement.children].indexOf(this)].classList.add('visible');
}

listItem.forEach( item => {
	item.addEventListener('click', activateLink);
});