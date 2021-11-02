const form = document.getElementById("formulario");
const url = "http://localhost:4000/usuarios";
const btnCorreo = document.getElementById("btnCorreo");
const btnEditar = document.getElementById("btnEditar");
const btnEliminar = document.getElementById("btnEliminar");
const templateDetails = document.getElementById("template-details").content;


//Guardar (POST)
form.addEventListener('submit', async(e) => {
    e.preventDefault();
    let nombre = document.getElementById("name").value;
    let apellido = document.getElementById("lastName").value;
    let correo = document.getElementById("email").value;

    await fetch(url, {
        method: 'POST',
        body: JSON.stringify({
            nombre,
            apellido,
            correo
        }),
        headers: {
            "Content-Type": "application/json; charset=UTF-8"
        }
    })
})

//Busqueda (GET)
btnCorreo.addEventListener('click', async() =>{
    let res = await fetch(url);
    let data = await res.json();
    
    let email = document.getElementById("email").value;
    const search = data.find(user => user.correo.toLowerCase() == email.toLowerCase())
    document.getElementById("email").setAttribute("readonly", true);
    const {id, nombre, apellido, correo} = search;
    document.getElementById("name").value = nombre;
    document.getElementById("lastName").value = apellido;
    document.getElementById("id").value = id;
})

//Editar (PUT)
btnEditar.addEventListener('click', async() => {
    let nombre = document.getElementById("name").value;
    let apellido = document.getElementById("lastName").value;
    let correo = document.getElementById("email").value;
    let id = document.getElementById("id").value;

    await fetch(`${url}/${id}`, {
        method: "PUT",
        body: JSON.stringify({
            nombre,
            apellido,
            correo
        }),
        headers: {
            "Content-Type": "application/json; charset=UTF-8"
        }
    })
})

btnEliminar.addEventListener("click", async () => {
  let id = document.getElementById("id").value;
  await fetch(`${url}/${id}`, {
    method: "DELETE",
  });
});

