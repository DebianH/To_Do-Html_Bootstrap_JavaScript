const formulario = document.getElementById('formulario');
const listaTarea = document.getElementById('lista-tareas');
const template = document.getElementById('template').content  //Siempre acceder al conten cada vez que usamos templane
const fragment = document.createDocumentFragment();
let tareas = {}
//Otra forma de capturar lo ingresado en el input
//const input = document.getElementById('input')

document.addEventListener('DOMContentLoaded', () => {
	if(localStorage.getItem('tareas')) { //Leemos el localStorage
		tareas = JSON.parse(localStorage.getItem('tareas'))
	}
	recorrerTareas()
});

listaTarea.addEventListener('click', e => {
	btnAccion(e)
})

formulario.addEventListener('submit', e => {
	e.preventDefault()
	
	//Otra forma de tomar lo ingresado
	//console.log(input.value) pero definimos antes la constante ARRIBA
	//console.log(e.target.querySelector('input').value) //tomamos la informacion del input
	setTarea(e)
})

const setTarea = e => {
	if (e.target.querySelector('input').value.trim() === ''){
		console.log('texto Vacio')

	}

	const tarea = {
		id: Date.now(), //Id sacado de la fecha 
		texto: e.target.querySelector('input').value,
		estado: false
	}
	
	tareas[tarea.id] = tarea
	

	formulario.reset() //Luego del agregar reseteamos
	e.target.querySelector('input').focus() //Luego enviar los datos vuelva el curso 
	recorrerTareas()
}

const recorrerTareas = () => {

	localStorage.setItem('tareas', JSON.stringify(tareas))  //Guardamos en el localStorage

	if(Object.values(tareas).length === 0) {  //Para ver la tarea vacia de html
		listaTarea.innerHTML = ` 
		<div class="alert alert-info text-center rounded-pill p-2">
			<h5>No hay tareas pendientes<i class="m-2 far fa-flag"></i></h5>
		</div>
		
		`
		return
	}

	listaTarea.innerHTML = ''
	Object.values(tareas).forEach(tarea => {
		const clone = template.cloneNode(true) //para que no ocupe el mismo espacio
		
		if(tarea.estado) {
			clone.querySelector('.alert').classList.replace('alert-warning', 'border-white')
			clone.querySelectorAll('.fas')[0].classList.replace('fa-thumbs-up','fa-check-double')
			clone.querySelector('p').style.textDecoration = 'line-through'
		}

		clone.querySelector('p').textContent = tarea.texto
		clone.querySelectorAll('.fas')[0].dataset.id = tarea.id //capturar numero de id
		clone.querySelectorAll('.fas')[1].dataset.id = tarea.id
		fragment.appendChild(clone)
	})
	listaTarea.appendChild(fragment)
}

const btnAccion = e => {
	//console.log(e.target.classList.contains('fa-thumbs-up'))
	if (e.target.classList.contains('fa-thumbs-up')) {
		//console.log(e.target.dataset.id)
		tareas[e.target.dataset.id].estado = true
		recorrerTareas()
	}

	if (e.target.classList.contains('fa-times-circle')) {
		delete tareas[e.target.dataset.id]
		recorrerTareas()
	}

	if (e.target.classList.contains('fa-check-double')) {
		tareas[e.target.dataset.id].estado = false
		recorrerTareas()
	}

	e.stopPropagation() //Para que No capture otros eventos
}

