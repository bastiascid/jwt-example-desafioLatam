let numero_pagina = 1;
let JWT;
let iterador = 0;

// 1. Obtener el JWT a través del formulario de login entregado.

$('#js-form').submit(async (event) => {
  event.preventDefault();
  let email = document.getElementById('js-input-email').value;
  let password = document.getElementById('js-input-password').value;

  JWT = await postData(email, password);

  if ((await getMorePosts(JWT))) {
    toggleFormAndTable('js-formulario', 'imagenes');
  };
});

async function cargar() {
  let data = await getMorePosts(JWT);
  fillTable(data);
}

const postData = async (email, password) => {
  try {
    console.log('postData json: ' + JSON.stringify({ email: email, password: password }));
    const response = await fetch('http://localhost:3000/api/login',
      {
        method: 'POST',
        body: JSON.stringify({ email: email, password: password })
      });
    const { token } = await response.json();
    if (response.status == 422) {
      throw new Error('Datos incorrectos');
    }else{
      localStorage.setItem('jwt-token', token);
      console.log('postData token: ' + token);
      return token;      
    }
    
  } catch (err) {
    alert("Datos Incorrectos");
    console.error(`Error: ${err} `);
  }
};

const getMorePosts = async (jwt) => {
  try {

// 4. Con el JWT consumir la API http://localhost:3000/api/photos.

    const response = await fetch('http://localhost:3000/api/photos?page=' + numero_pagina,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${jwt} `
        }
      });
    const { data } = await response.json();
    if (response.status == 401) {
      throw new Error('Servicio no autorizado');
    }

    // 6. Cargar el feed de fotos cuando exista el JWT.

    if (data) {
      fillTable(data);
      crearBoton();
      numero_pagina = numero_pagina + 1;
    }

    return data;
  } catch (err) {
    localStorage.clear();
    console.error(`Error: ${err} `);
  }
};

const fillTable = async (data) => {
  let html = '';

  // 5. Manipular el JSON de respuesta de la API anterior y manipular el DOM con JavaScript para mostrar las imágenes.

  data.forEach(element => {
    html += `<div class="col-3">
                  <img style="max-width: 15rem" src="${element.download_url}" alt="">
                  <p>${element.author}</p>
              </div>
      `;
  });

  div = document.createElement("div");
  div.className = "row";
  div.innerHTML = html;
  document.getElementById("photos").appendChild(div);

};
// 3. Al momento de recibir el JWT ocultar el formulario y mostrar el feed principal con las fotos.

const toggleFormAndTable = (form, imagenes) => {
  $(`#${form}`).toggle();
  $(`#${imagenes}`).toggle();
};

// 2. Persistir el token utilizando localStorage.

const init = async () => {
  const token = localStorage.getItem('jwt-token');
  JWT = token;
  if (token) {
    await getMorePosts(token);
    toggleFormAndTable('js-formulario', 'imagenes');
  }
};

init();

// 8. Crear botón de logout que elimine el JWT almacenado y vuelva la aplicación a su estado inicial.

let btn = document.getElementById('btn_logout');
btn.addEventListener('click', () => {
  localStorage.clear();
  location.reload();
});

// 7. En la parte inferior de la página, crear un botón que al presionarlo traiga más fotos (http://localhost:3000/api/photos?page=x), que deben ser añadidas al listado existente.

const crearBoton = () => {
  if (!document.getElementById("btn_cargar")) {
      divbtn = document.createElement("div");
      divbtn.className = "row";
      divbtn.innerHTML = `<div class="col-12 text-center">
                              <button id="btn_cargar" type="button" class="btn btn-primary">cargar más</button>
                          </div>
                              `;
      document.getElementById("btn").appendChild(divbtn);
      document.getElementById("btn_cargar").addEventListener("click", () => {
          cargar();
      });
  }
};