const cards = document.getElementById('cards');
const plantilla = document.getElementById('template-card').content
const templateFooter = document.getElementById('template-footer').content
const templateCarrito = document.getElementById('template-carrito').content
const footer = document.getElementById('footer')
const fragment = document.createDocumentFragment()
let carrito = {};




document.addEventListener('DOMContentLoaded', () => {
    fetchData()
    if (localStorage.getItem('carrito')) {
        carrito = JSON.parse(localStorage.getItem('carrito'))
        llenarCarrito()
    }
})

cards.addEventListener('click', e => {
    addCarrito(e)
})

items.addEventListener('click', e => {
    btnAumentoResta(e)
})

const fetchData = async() => {
    try {
        const respuesta = await fetch('api.json');
        const data = await respuesta.json()

        llenarCards(data)
    } catch (error) {
        console.log(error);
    }
}

const llenarCards = data => {
    data.forEach(producto => {
        plantilla.querySelector('h5').textContent = producto.title
        plantilla.querySelector('p').textContent = producto.precio
        plantilla.querySelector('img').setAttribute("src", producto.thumbnailUrl)
        plantilla.querySelector('.btn-dark').dataset.id = producto.id
        const clone = plantilla.cloneNode(true)
        fragment.appendChild(clone)
    })
    cards.appendChild(fragment)
}

const addCarrito = e => {
    if (e.target.classList.contains('btn-dark')) {
        setCarrito(e.target.parentElement)

    }
    e.stopPropagation()
}

const setCarrito = objeto => {
    console.log(objeto);
    const producto = {
        id: objeto.querySelector('.btn-dark').dataset.id,
        title: objeto.querySelector('h5').textContent,
        precio: objeto.querySelector('p').textContent,
        cantidad: 1
    }
    if (carrito.hasOwnProperty(producto.id)) {
        producto.cantidad = carrito[producto.id].cantidad + 1

    }

    carrito[producto.id] = {...producto }
    llenarCarrito()
    Toastify({

        text: "se ha se ha agregado producto",

        duration: 3000,
        style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)",
        }

    }).showToast();

}

llenarCarrito = () => {
    items.innerHTML = ''
    Object.values(carrito).forEach(producto => {
        templateCarrito.querySelector('th').textContent = producto.id
        templateCarrito.querySelectorAll('td')[0].textContent = producto.title
        templateCarrito.querySelectorAll('td')[1].textContent = producto.cantidad
        templateCarrito.querySelector('.btn-info').dataset.id = producto.id
        templateCarrito.querySelector('.btn-danger').dataset.id = producto.id
        templateCarrito.querySelector('span').textContent = producto.cantidad * producto.precio

        const clone = templateCarrito.cloneNode(true)
        fragment.appendChild(clone)
    })
    items.appendChild(fragment)

    llenarFooter()


    localStorage.setItem('carrito', JSON.stringify(carrito))
}

const llenarFooter = () => {
    footer.innerHTML = ''
    if (Object.keys(carrito).length === 0) {
        footer.innerHTML = `
        <th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>
        `
        return

    }
    const nCantidad = Object.values(carrito).reduce((acumulador, { cantidad }) => acumulador + cantidad, 0)
    const nPrecio = Object.values(carrito).reduce((acumulador, { cantidad, precio }) => acumulador + cantidad * precio, 0)

    templateFooter.querySelectorAll('td')[0].textContent = nCantidad
    templateFooter.querySelector('span').textContent = nPrecio

    const clone = templateFooter.cloneNode(true)
    fragment.appendChild(clone)
    footer.appendChild(fragment)

    const btnVaciar = document.querySelector('#vaciar-carrito')
    btnVaciar.addEventListener('click', () => {
        carrito = {}
        llenarCarrito()
        Toastify({

            text: "se ha se ha vaciado el carrito",

            duration: 3000

        }).showToast();
    })

}

const btnAumentoResta = e => {
    if (e.target.classList.contains('btn-info')) {
        const producto = carrito[e.target.dataset.id]
        producto.cantidad++
            carrito[e.target.dataset.id] = {...producto }
        llenarCarrito()
        Toastify({

            text: "se ha se ha sumado producto",

            duration: 3000

        }).showToast();

    }
    if (e.target.classList.contains('btn-danger')) {
        const producto = carrito[e.target.dataset.id]
        producto.cantidad--

            if (producto.cantidad === 0) {
                delete carrito[e.target.dataset.id]
            } else {
                carrito[e.target.dataset.id] = {...producto }
            }
        llenarCarrito()
        Toastify({

            text: "se ha se ha quitado producto",

            duration: 3000

        }).showToast();
    }
    e.stopPropagation()
}